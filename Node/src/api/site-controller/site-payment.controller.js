
const stripe = require('stripe')('sk_test_51KEBJqLmuMhZJPFDO6LL3mCMFYaopGlV1MS42VzGknbk4jQ6FpV4ZHL0VpbkugYFyng95Q5CasfvuFXVMFgE6FcB00l0D4RA5G');

exports.createIntent = async (req, res) => {
    //user sends price along with request
    const userPrice = parseInt(req.body.price)*100;
    //create a payment intent
    const intent = await stripe.paymentIntents.create({ 
      //use the specified price
      amount: userPrice,
      currency: 'usd'
    });
    //respond with the client secret and id of the new paymentintent
    res.json({client_secret: intent.client_secret, intent_id:intent.id});
}
exports.confirmPayment = async (req, res) => {
    //extract payment type from the client request
    const paymentType = String(req.body.payment_type);
    //handle confirmed stripe transaction
    if (paymentType === "stripe") {
      //get payment id for stripe
      const clientid = String(req.body.payment_id);
      //get the transaction based on the provided id
      stripe.paymentIntents.retrieve(
        clientid,
        function(err, paymentIntent) {
          //handle errors
          if (err){
            console.log(err);
          }
          //respond to the client that the server confirmed the transaction
          if (paymentIntent.status === 'succeeded') {
            /*YOUR CODE HERE*/   
            console.log("confirmed stripe payment: " + clientid);
            res.json({success: true});
          } else {
            res.json({success: false});
          }
        }
      );
    }   
}