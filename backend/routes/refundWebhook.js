const crypto=require('crypto');
const express=require('express');
const Booking=require('../models/Booking');
const router=express.Router();
router.post('/',async(req,res,next)=>{try{
 const secret=process.env.RAZORPAY_WEBHOOK_SECRET;
 if(!secret||!Buffer.isBuffer(req.body))return res.status(503).send('Webhook not configured');
 const sig=req.get('x-razorpay-signature')||'';
 if(!/^[a-f0-9]{64}$/i.test(sig))return res.status(400).send('Invalid signature');
 const expected=crypto.createHmac('sha256',secret).update(req.body).digest('hex');
 if(!crypto.timingSafeEqual(Buffer.from(sig,'hex'),Buffer.from(expected,'hex')))return res.status(400).send('Invalid signature');
 const data=JSON.parse(req.body.toString('utf8'));
 const refund=data.payload?.refund?.entity;
 if(!refund?.id)return res.status(200).json({success:true});
 const b=await Booking.findOne({razorpayRefundId:refund.id,cancellationStatus:'completed'});
 if(!b)return res.status(200).json({success:true});
 if(refund.payment_id!==b.razorpayPaymentId||refund.amount!==b.refundAmountPaise)return res.status(200).json({success:true});
 if(data.event==='refund.processed'){
  await Booking.updateOne({_id:b._id,razorpayRefundId:refund.id,refundStatus:{$ne:'processed'}},{$set:{refundStatus:'processed',refundProcessedAt:new Date(),paymentStatus:refund.amount===b.verifiedAmountPaise?'refunded':'partially_refunded'}});
 }else if(data.event==='refund.failed'){
  await Booking.updateOne({_id:b._id,razorpayRefundId:refund.id,refundStatus:{$ne:'processed'}},{$set:{refundStatus:'failed',refundError:'Razorpay reported refund failed. Manual review required.'}});
 }
 res.json({success:true});
 }catch(e){next(e);}});
module.exports=router;
