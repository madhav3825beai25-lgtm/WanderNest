const crypto=require('crypto');
const express=require('express');
const mongoose=require('mongoose');
const Booking=require('../models/Booking');
const auth=require('../middleware/authMiddleware');
const {client}=require('../services/razorpayClient');
const router=express.Router();
const fail=(res,s,m)=>res.status(s).json({success:false,message:m});
const okId=(id)=>mongoose.isValidObjectId(id);
const unlocked={$in:[null,'none']};
router.post('/:bookingId/order',auth,async(req,res,next)=>{try{
 const {bookingId}=req.params,user=req.user?.id;if(!okId(bookingId)||!okId(user))return fail(res,400,'Invalid booking or session');
 const b=await Booking.findOne({_id:bookingId,user});if(!b)return fail(res,404,'Booking not found');
 if(b.status==='cancelled'||!['none',null,undefined].includes(b.cancellationStatus))return fail(res,409,'Booking cancellation is in progress');
 if(['paid','refunded','partially_refunded'].includes(b.paymentStatus))return fail(res,409,'Already paid');
 if(b.payment==='Cash on Arrival')return fail(res,400,'Cash on Arrival needs no Razorpay order');
 const amount=b.verifiedAmountPaise;if(!b.pricingVerified||!Number.isSafeInteger(amount)||amount<100||Math.round(b.total*100)!==amount)return fail(res,400,'Price not verified');
 const rz=client();
 if(b.razorpayOrderId){const order=await rz.orders.fetch(b.razorpayOrderId);if(order.amount!==amount||order.currency!=='INR')return fail(res,409,'Order amount mismatch');return res.json({success:true,keyId:process.env.RAZORPAY_KEY_ID,order});}
 // Reserve state BEFORE network call, preventing cancellation while order creation is underway.
 const claimed=await Booking.collection.findOneAndUpdate({_id:new mongoose.Types.ObjectId(bookingId),user:new mongoose.Types.ObjectId(user),status:'pending',cancellationStatus:unlocked,razorpayOrderId:{$in:[null,'']},paymentStatus:{$in:['unpaid','failed',null]}},{$set:{paymentStatus:'pending'}},{returnDocument:'after'});
 const doc=claimed?.value||claimed;if(!doc?._id)return fail(res,409,'Booking changed. Refresh and retry.');
 // On ambiguous API failure, leave paymentStatus pending: prevents unsafe cancellation.
 const order=await rz.orders.create({amount,currency:'INR',receipt:String(b._id)});
 const saved=await Booking.collection.updateOne({_id:new mongoose.Types.ObjectId(bookingId),paymentStatus:'pending',cancellationStatus:unlocked,razorpayOrderId:{$in:[null,'']}},{$set:{razorpayOrderId:order.id}});
 if(saved.modifiedCount!==1)return fail(res,409,'Order created but save uncertain. Contact support; do not retry payment.');
 res.json({success:true,keyId:process.env.RAZORPAY_KEY_ID,order});
 }catch(e){next(e);}});
router.post('/:bookingId/verify',auth,async(req,res,next)=>{try{
 const {bookingId}=req.params,user=req.user?.id;
 if(!okId(bookingId)||!okId(user))return fail(res,400,'Invalid booking or session');
 const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body||{};
 if(![razorpay_order_id,razorpay_payment_id].every(v=>typeof v==='string'&&v.length>0)||typeof razorpay_signature!=='string'||!/^[a-f0-9]{64}$/i.test(razorpay_signature))return fail(res,400,'Invalid payment data');
 const b=await Booking.findOne({_id:bookingId,user});if(!b)return fail(res,404,'Booking not found');
 if(b.status==='cancelled'||!['none',null,undefined].includes(b.cancellationStatus))return fail(res,409,'Cancellation in progress');
 if(b.razorpayOrderId!==razorpay_order_id)return fail(res,400,'Order mismatch');
 const expected=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET||'').update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
 if(!crypto.timingSafeEqual(Buffer.from(expected,'hex'),Buffer.from(razorpay_signature,'hex')))return fail(res,400,'Invalid signature');
 const payment=await client().payments.fetch(razorpay_payment_id);
 if(payment.order_id!==b.razorpayOrderId||payment.status!=='captured'||payment.currency!=='INR'||payment.amount!==b.verifiedAmountPaise)return fail(res,409,'Captured payment mismatch');
 if(b.paymentStatus==='paid'){if(b.razorpayPaymentId===razorpay_payment_id)return res.json({success:true,message:'Already verified',booking:b});return fail(res,409,'Different payment already recorded');}
 const updated=await Booking.findOneAndUpdate({_id:bookingId,user,status:{$ne:'cancelled'},cancellationStatus:unlocked,paymentStatus:{$in:['unpaid','pending','failed',null]},razorpayOrderId:razorpay_order_id,pricingVerified:true,verifiedAmountPaise:payment.amount},{$set:{paymentStatus:'paid',razorpayPaymentId:razorpay_payment_id,paidAt:new Date(),status:'confirmed'}},{new:true});
 if(!updated)return fail(res,409,'Booking changed. Refresh My Bookings');
 res.json({success:true,message:'Payment verified successfully',booking:updated});
 }catch(e){next(e);}});
module.exports=router;
