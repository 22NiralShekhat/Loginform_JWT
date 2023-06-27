const express=require('express')
const router=express.Router();
const jwt=require('jsonwebtoken')
const con=require('./db')
const bcrypt=require('bcrypt')

router.get('/',(req,res)=>{
    res.sendFile('/NODE/JWT/signup.html');
})
router.get('/signin',(req,res)=>{
    res.sendFile('/NODE/JWT/signin.html');
})

router.post('/sign-up',(req,res)=>{
    let{email,password,username}=req.body

    const user={
        email,password,username
    }

    if(!username){
         res.send('username should not be empty')
    }

    if(!password || password.length<6){
     res.send('Password should be more than 6 char')
    }
    con.query(`SELECT * FROM login WHERE email="${email}"`,(err,data)=>{
        //if(err) return res.status(400).send({msg:err})

        if(data.length!==0){
             res.send('This email is already in use')
        }

        bcrypt.hash(password,8).then((hash)=>{
            user.password=hash
        }).then(()=>{
            con.query("INSERT INTO login SET ?",user,(err,data)=>{
                if(err){
                    throw err;
                }
            con.query('SELECT * FROM login WHERE email=?',email,(err,data)=>{
                if(err){
                    throw err;
                }
                //userdata:user;
                 res.send('successfully registered')
                })
            })
        })
    })

})
router.post('/sign-in',(req,res)=>{
    const {email,password}=req.body

    if(req.body.email.trim()===''||req.body.password.trim()===''){
        return res.status(400).send({msg:"Email or password must filled"})
    }

    con.query("SELECT * FROM login WHERE email=?",email,(err,data)=>{
        if(err){
            return res.status(400).send({
                msg:err
            })
        }

        if(data.length===0){
            return res.status(401).send({
                msg:'email or password is incorrect'
            })
        }
        

        const token = jwt.sign({id:data[0].id.toString()},'secret')
      
        console.log({
            data: { userId: data[0].id,
            email: data[0].email, token: token }})
            //res.redirect('/home')
            // return res.status(200).send({
            //     msg:"logged in successfully",
            //     user:data[0],
            //     token
            //  })
             res.header('auth-token',token).send('Signed in!!')
            //res.redirect('/home')
    })
})

const auth = async(req,res,next)=>{
    try {
        const idToken= await req.header('auth-token')
        const decoded= jwt.verify(idToken,'secret')
        console.log({idToken,decoded})
        req.id=decoded
        sql="SELECT * FROM login WHERE id=?"
        con.query(sql,decoded.id,(err,data)=>{
            if(err){
                return res.status(400).send({msg:err})
            }
            return next()
        })
        
    } catch (err) {
        res.status(401).send({err:'Please authenticate!'})
    }
}

router.get('/home',auth,(req,res,next)=>{
    return res.render("resp")
})

module.exports=router;
