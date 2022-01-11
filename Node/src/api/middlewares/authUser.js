const jwt = require('jsonwebtoken')
const passport = require('passport')

exports.requireAuthrequireAuth = (req,res,next)=> {
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
        return res.json({message: "token not exist"})
    }
}

exports.checkAuthentication =(req,res)=>{
    console.log(req)

    if (req.isAuthenticated())
	{	
        //req.isAuthenticated() will return true if user is logged in
		next();	
	}
	else
	{
        // console.log(`req.isAuthenticated() : ${req.isAuthenticated()}`)
		if (req.xhr || (req.headers && req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
			res.status(403).json({message:"user cookie not found"});
		} else {
			res.redirect(req.protocol + "://" + req.get('host') + '/signin')
		}
	}
}