const mongoose=require('mongoose');
const bookingSchema=new mongoose.Schema({
 user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},
 name:{type:String,required:true,trim:true,maxlength:80},
 email:{type:String,required:true,trim:true,lowercase:true,maxlength:254},
 phone:{type:String,required:true,trim:true},
 destination:{type:String,required:true,trim:true},
 bookingType:{type:String,enum:['trip','package','hotel'],required:true},
 packageName:{type:String,default:''},hotel:{type:String,default:''},hotelId:{type:String,default:''},duration:{type:String,default:''},
 checkIn:{type:Date,required:true},checkOut:{type:Date,required:true},
 rooms:{type:Number,required:true,min:1,max:5},adults:{type:Number,required:true,min:1,max:8},children:{type:Number,default:0,min:0,max:6},
 payment:{type:String,enum:['UPI','Credit/Debit Card','Net Banking','Cash on Arrival'],required:true},
 coupon:{type:String,default:''},reference:{type:String,required:true,unique:true},nights:{type:Number,required:true,min:1},
 subtotal:{type:Number,required:true,min:0},discount:{type:Number,default:0,min:0},taxes:{type:Number,required:true,min:0},total:{type:Number,required:true,min:0},
 status:{type:String,enum:['pending','confirmed','cancelled'],default:'pending'},
 paymentStatus:{type:String,enum:['unpaid','pending','paid','failed','refunded','partially_refunded'],default:'unpaid',index:true},
 razorpayOrderId:{type:String,default:''},razorpayPaymentId:{type:String,default:''},paidAt:{type:Date,default:null},cancelledAt:{type:Date,default:null},
 pricingVerified:{type:Boolean,default:false},verifiedAmountPaise:{type:Number,default:null,min:100},
 cancellationStatus:{type:String,enum:['none','processing','completed','review_required'],default:'none',index:true},
 cancellationStartedAt:{type:Date,default:null},cancellationPolicyVersion:{type:String,default:''},refundPercentage:{type:Number,default:null},refundAmountPaise:{type:Number,default:0},
 refundStatus:{type:String,enum:['not_applicable','not_started','pending','processed','failed','review_required'],default:'not_applicable'},
 razorpayRefundId:{type:String,default:''},refundProcessedAt:{type:Date,default:null},refundError:{type:String,default:''}
},{timestamps:true});
module.exports=mongoose.model('Booking',bookingSchema);
