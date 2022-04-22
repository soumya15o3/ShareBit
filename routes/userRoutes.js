const express=require('express');
const router=express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const passport=require('passport');

router.get('/register',(req,res)=>{
    res.render('users/register');
})

router.post('/register',catchAsync(async(req,res,next)=>{
   
    try{
       // const {email,username,password}=req.body;
       
       
       // edited-->start
       const {email,username,password,mobile_num,room_num,hostel_num}=req.body;
       
       //edited-->end

        //creating new user
       // const user=new User({email,username});
       
       //edited-->start
       res.send(req.body);
       const user=new User({email,username,mobile_num,room_num,hostel_num});
       //edited-->end
        
       
       //registering user
        const registeredUser=await User.register(user,password);
       
        // logging in the registered user 
        req.login(registeredUser,err=>{
            
            if(err){
                return next(err);
            }
            req.flash('success','Welcome to Yelp Camp!')
            res.redirect('/campgrounds');
           })
       
    }
    catch(e)
    {          console.log(e.message);
             req.flash('error',e.message);
             res.redirect('/register');
    }
}))

router.get('/login',(req,res)=>{
   res.render('users/login');
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{

    req.flash('success','Welcome back!');
   
    //returning user to the page where user requesting
    const redirectUrl=req.session.returnTo || '/campgrounds';
   
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout',(req,res)=>{
    req.logOut();
   
    req.flash('success','Goodbye!');
    res.redirect('/campgrounds');
})

module.exports=router;