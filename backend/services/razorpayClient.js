const Razorpay=require('razorpay');
function client(){
 const key_id=process.env.RAZORPAY_KEY_ID,key_secret=process.env.RAZORPAY_KEY_SECRET;
 if(!key_id||!key_secret||!key_id.startsWith('rzp_test_')) throw new Error('Razorpay TEST keys required');
 return new Razorpay({key_id,key_secret});
}
module.exports={client};
