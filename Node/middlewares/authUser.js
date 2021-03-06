const jwt = require('jsonwebtoken')

const requireAuth = (req,res,next)=> {
    const token = req.headers['x-access-token']
    console.log("Hello from MIDDLEWARE")
    console.log(typeof token)
    //check web token exist & is verified
    if(token){
        jwt.verify(token ,`Ticket secret key` , (err , decodedToken)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log("DecodedToke : ")
                console.log(decodedToken)
                next()
            }
        })
    }
    else{
        console.log('token is not verified')
        res.json({message: "token not exist"})
    }
}

module.exports = { requireAuth } ;