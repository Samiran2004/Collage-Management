const User = require('../models/userModel');
const Teacher = require('../models/teacherUserModel');
const bcrypt = require('bcrypt');
const cloudinary = require('../middleware/cloudinaryMiddleware');
const jwt = require('jsonwebtoken');

const generateUniqueId = (prefix, name) => {
    return `${Math.floor(Math.random() * (10000 + 99999 - 1)) + 10000}${prefix}${name.split(' ')[0]}`;
};

const signupStudent = async (req, res) => {
    const { name, email, password, phone, role, standerd } = req.body;

    if (!name || !email || !password || !phone || !role || !standerd) {
        return res.status(400).json({
            status: "Failed",
            message: "All fields are required."
        });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

        if (existingUser) {
            return res.status(400).json({
                status: "Failed",
                message: "User already exists."
            });
        }

        if (role !== "STUDENT") {
            return res.status(400).json({
                status: "Failed",
                message: "This is not a student account."
            });
        }

        const idcardnumber = generateUniqueId("STUDENT", name);
        const hashedpassword = await bcrypt.hash(password, 10);
        const result = await cloudinary.uploader.upload(req.file.path);

        const newUser = new User({
            name,
            email,
            phone,
            password: hashedpassword,
            role,
            profilepicture: result.url,
            idcardnumber,
            class: standerd
        });

        await newUser.save();

        res.status(201).json({
            status: "Success",
            data: {
                name,
                email,
                phone,
                role,
                class: standerd,
                profilepictureUrl: result.url
            }
        });
    } catch (error) {
        console.error("Error in signupStudent:", error);
        res.status(500).json({
            status: "Failed",
            message: "Internal server error."
        });
    }
};

const signupTeacher = async (req, res) => {
    const { name, phone, email, password, specialist } = req.body;

    if (!name || !phone || !email || !password || !specialist) {
        return res.status(400).json({
            status: "Failed",
            message: "All fields are required."
        });
    }

    try {
        const existingTeacher = await Teacher.findOne({ email });

        if (existingTeacher) {
            return res.status(400).json({
                status: "Failed",
                message: "Teacher already exists."
            });
        }

        const idnumber = generateUniqueId("TEACHER", name);
        const hashedpassword = await bcrypt.hash(password, 10);
        const result = await cloudinary.uploader.upload(req.file.path);

        const newTeacher = new Teacher({
            name,
            phone,
            email,
            password: hashedpassword,
            idcardnumber: idnumber,
            specialist,
            profilepicture: result.url
        });

        await newTeacher.save();

        res.status(201).json({
            status: "Success",
            data: {
                name,
                phone,
                email,
                idnumber,
                profilepicture: result.url
            }
        });
    } catch (error) {
        console.error("Error in signupTeacher:", error);
        res.status(500).json({
            status: "Failed",
            message: "Internal server error."
        });
    }
};

const login = async (req, res) => {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
        return res.status(400).json({
            status: "Failed",
            message: "All fields are required."
        });
    }

    try {
        const user = await User.findOne({ email, phone }) || await Teacher.findOne({ email, phone });

        if (!user) {
            return res.status(404).json({
                status: "Failed",
                message: "User not found."
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                status: "Failed",
                message: "Invalid email or password."
            });
        }

        const payload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        const expiresIn = 3600;
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });

        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + expiresIn * 1000)
        });

        res.status(200).json({
            status: "Success",
            token
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({
            status: "Failed",
            message: "Internal server error."
        });
    }
};

const getUserData = async (req, res) => {
    try {
        const userData = {
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role,
            profilepictureUrl: req.user.profilepicture,
            idcardnumber: req.user.idcardnumber,
            _id: req.user._id
        };

        res.status(200).json({ data: userData });
    } catch (error) {
        console.error("Error in getUserData:", error);
        res.status(500).json({
            status: "Failed",
            message: "Internal server error."
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ idcardnumber: id });

        if (!user) {
            return res.status(404).json({
                status: "Failed",
                message: "User not found."
            });
        }

        res.status(200).json({ data: user });
    } catch (error) {
        console.error("Error in getUserById:", error);
        res.status(500).json({
            status: "Failed",
            message: "Internal server error."
        });
    }
};

module.exports = {
    signupStudent,
    signupTeacher,
    login,
    getUserData,
    getUserById
};
