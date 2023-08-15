const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const { use } = require("../routes/userRoutes");


const registerUser = asyncHandler(async(req, res) => {

    const { name, email, password, pic } = req.body;
    // console.log("api hit");
    if (!name || !email || !password) {

        return res.status(400).json({ message: 'All filed are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {

        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        // res.status(400);
        //throw new Error("User not found");
        return res.status(400).json({ message: 'Failed to create user' });

    }

});


const authUser = asyncHandler(async(req, res) => {
    console.log("hello" + req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        // res.status(401);
        // throw new Error("Invalid Email or Password");
        return res.status(400).json({ message: 'Invalid Email or Password' });
    }

});

const allUsers = asyncHandler(async(req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});


module.exports = { registerUser, authUser, allUsers };