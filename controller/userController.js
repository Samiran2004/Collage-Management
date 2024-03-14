const User = require('../models/userModel');
const Teacher = require('../models/teacherUserModel')
const bcrypt = require('bcrypt');
const cloudinary = require('../middleware/cloudinaryMiddleware');
const jwt = require('jsonwebtoken');

//Signup for students...
const signupStudent = async (req, res) => {
    let profilepictureUrl;
    const { name, email, password, phone, role, standerd } = req.body;
    if (!name || !email || !password || !phone || !role || !standerd) {
        res.status(404).send({
            status: "Failed",
            message: "All feilds are required."
        });
    } else {
        try {
            const check = await User.findOne({ email: email, phone: phone });
            if (!check) {
                if (role == "STUDENT") {
                    const idcardnumber = `${Math.floor(Math.random() * (10000 + 99999 - 1)) + 10000}${role}${name.split(' ')[0]}`
                    const hashedpassword = await bcrypt.hash(password, 10);
                    await cloudinary.uploader.upload(req.file.path, function (err, result) {
                        if (err) {
                            res.status(400).send({
                                status: "Failed",
                                message: "File uploded failed."
                            });
                        } else {
                            profilepictureUrl = result.url;
                        }
                    });
                    const newUser = new User({
                        name: name,
                        email: email,
                        phone: phone,
                        password: hashedpassword,
                        role: role,
                        profilepicture: profilepictureUrl,
                        idcardnumber: idcardnumber,
                        class: standerd
                    });
                    await newUser.save();
                    res.status(201).send({
                        status: "Success",
                        data: {
                            name: name,
                            email: email,
                            phone: phone,
                            role: role,
                            class: standerd,
                            profilepictureUrl: profilepictureUrl
                        }
                    });
                } else {
                    res.status(400).send("This is not student")
                }
            } else {
                res.status(301).send({
                    status: "Failed",
                    message: "User already exist."
                });
            }
        } catch (error) {
            res.status(500).send({
                status: "Failed",
                message: "Internal server error."
            })
        }
    }
}

//Signup for teachers...
const signupTeacher = async (req, res) => {
    let idnumber, hashedpassword, profilepictureUrl;
    try {
        const { name, phone, email, password, specialist } = req.body;
        if (!name || !phone || !email || !password || !specialist) {
            res.status(404).send({
                status: "Failed",
                message: "All fields are required"
            });
        } else {
            const check = await Teacher.find({ email: email });
            if (!check) {
                idnumber = `${Math.floor(Math.random() * (10000 + 99999 - 1)) + 10000}TEACHER${name.split(' ')[0]}`
                hashedpassword = await bcrypt.hash(password, 10);
                await cloudinary.uploader.upload(req.file.path, function (err, result) {
                    if (err) {
                        res.status(400).send({
                            status: "Failed",
                            message: "File uploded failed."
                        });
                    } else {
                        profilepictureUrl = result.url;
                    }
                });
                const newTeacher = new Teacher({
                    name: name,
                    phone: phone,
                    email: email,
                    password: hashedpassword,
                    idnumber: idnumber,
                    specialist: specialist,
                    profilepicture: profilepictureUrl
                });
                await newTeacher.save();
                res.status(201).send({
                    status: "Success",
                    data: {
                        name: name,
                        phone: phone,
                        email: email,
                        idnumber: idnumber,
                        profilepicture: profilepictureUrl
                    }
                });
            } else {
                res.status(400).send({
                    status: "Failed",
                    message: "User already exist"
                })
            }
        }
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal server error"
        });
    }
}

//login route for both Student and Teacher...
const login = async (req, res) => {
    let token, payload, decodePassword;
    try {
        const { email, phone, password } = req.body;
        if (!email || !phone || !password) {
            res.status(401).send({
                status: "Failed",
                message: "All fields are required."
            });
            return;
        }

        const checkStudent = await User.find({ email, phone });
        const checkTeacher = await Teacher.find({ email, phone });

        if (checkStudent.length === 0 && checkTeacher.length === 0) {
            res.status(400).send({
                status: "Failed",
                message: "User not found"
            });
            return;
        }

        if (checkStudent.length > 0) {
            decodePassword = await bcrypt.compare(password, checkStudent[0].password);
            if (decodePassword) {
                payload = {
                    _id: checkStudent[0]._id,
                    name: checkStudent[0].name,
                    email: checkStudent[0].email,
                    idcardnumber: checkStudent[0].idcardnumber,
                    class: checkStudent[0].class,
                    role: checkStudent[0].role
                };
            } else {
                res.status(401).send({
                    status: "Failed",
                    message: "Email or password is not valid"
                });
                return;
            }
        }

        if (checkTeacher.length > 0) {
            decodePassword = await bcrypt.compare(password, checkTeacher[0].password);
            if (decodePassword) {
                payload = {
                    _id: checkTeacher[0]._id,
                    name: checkTeacher[0].name,
                    email: checkTeacher[0].email,
                    specialist: checkTeacher[0].specialist,
                    idnumber: checkTeacher[0].idnumber,
                    role: checkTeacher[0].role
                };
            } else {
                res.status(401).send({
                    status: "Failed",
                    message: "Email or password is not valid"
                });
                return;
            }
        }

        const expiresIn = 3600;
        token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + expiresIn * 1000)
        });
        res.status(200).send({
            status: "Success",
            token: token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({
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
            _id: req.user._id
        }
        res.status(200).send({
            data: userData
        });
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal server error"
        })
    }
}

module.exports = {
    signupStudent,
    signupTeacher,
    login,
    getUserData
}