const asyncHandler = require('express-async-handler');
const User = require('../Models/user.js')
const generateToken = require('../dbConnect/generateToken.js');
const registerUser = asyncHandler(async(req,res) => {
    console.log("yha")

    const { name, email, password, pic } = req.body
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('please enter all the fields')
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await User.create({ name: name, email: email, password: password, pic: pic });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token:generateToken(user._id)

        });
    } else {
        res.status(400);
        throw new Error("Failed to create the user");
    }
});
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user&&(await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
            
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password")
    }
});


const allUsers = asyncHandler(async (req,res) => {
    // Here we are not going to use directly the api we are going to use the querries
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            {email:{$regex:req.query.search,$options:"i"}},
        ]
    }
        : {}
    const users= await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
    // console.log(keyword)
});


module.exports = { registerUser,authUser,allUsers };