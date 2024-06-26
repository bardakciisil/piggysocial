const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//register
router.post("/register", async (req,res)=>{
    try {
        //generate secured password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);

        //create new user
        const newUser = await new User({
            username:req.body.username,
            from:req.body.from,
            city:req.body.city,
            email:req.body.email,
            password:hashedPassword,
        });
        //save user and return response
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(err);
    }
});

//login
router.post("/login", async (req,res)=>{

try {
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).json("user cannot found");
        const validPassword = await bcrypt.compare(req.body.password,user.password);
        !validPassword && res.status(400).json("wrong password");
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    
    }
});
module.exports = router