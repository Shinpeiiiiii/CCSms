const verifyTurnstile = async (req, res, next) => {
    console.log('ENABLE_TURNSTILE:', process.env.ENABLE_TURNSTILE, '| NODE_ENV:', process.env.NODE_ENV)
    //Local dev escape 
    if(process.env.ENABLE_TURNSTILE === 'false' && process.env.NODE_ENV !== 'production'){
        console.log('Failed production detected')
        return next()
    }

    const {turnstileToken} = req.body

    if(!turnstileToken){
        return res.status(400).json({message: 'Verification challenge is required.'})
    }

    try{

        const formData = new URLSearchParams();
        formData.append("secret", process.env.TURNSTILE_SECRET_KEY);
        formData.append("response", turnstileToken);

        if(req.ip){
            formData.append("remoteip", req.ip);
        }

        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();

        console.log("Turnstile Status:" ,data);

        if(!data.success){
            return res.status(400).json({
                message: 'Verification failed. Please try again.',
                errors: data["error-codes"]
            })
        }
        next()
    }catch(error) {
        return res.status(500).json({
            message: 'Verification service unavailable.'
        })
    }
}
module.exports = verifyTurnstile