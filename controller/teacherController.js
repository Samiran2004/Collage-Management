const Teacher = require('../models/teacherModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('../middleware/cloudinaryMiddleware');

const signup = async (req, res) => {
    const { name, email, phone, password, subjectSpect } = req.body;
    try {
        if (!name || !email || !phone || !password || !subjectSpect) {
            res.status(404).send({
                status: "Failed",
                message: "All fields are required."
            });
        } else {
            const check = await Teacher.findOne({ email: email, phone: phone });
            if (check) {
                res.status(400).send({
                    status: "Failed",
                    message: "User already exist"
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const idcardnumber = `${Math.floor(Math.random() * 10000)}TEACHER${name.split(" ")[0]}`;
                const result = await cloudinary.uploader.upload(req.file.path);
                const newTeacher = new Teacher({
                    name: name,
                    email: email,
                    phone: phone,
                    password: hashedPassword,
                    idcardnumber: idcardnumber,
                    subjectSpect: subjectSpect,
                    profilepicture: result.secure_url
                });
                await newTeacher.save();
                res.status(201).send({
                    status: "Success",
                    data: newTeacher
                });
            }
        }
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal server error",
        });
    }
}

const login = async (req, res) => {
    const { email, phone, password } = req.body;
    try {
        if (!email || !phone || !password) {
            res.status(404).send({
                status: "Failed",
                message: "All fields are required"
            });
        } else {
            const check = await Teacher.findOne({ email: email, phone: phone });
            if (check) {
                const checkPassword = await bcrypt.compare(password, check.password);
                if (checkPassword) {
                    const payload = {
                        name: check.name,
                        _id: check._id,
                        email: check.email,
                        phone: check.phone,
                        subjectSpect: check.subjectSpect,
                        role: check.role,
                        idcardnumber: check.idcardnumber
                    }
                    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 3600 });
                    res.cookie('token', token, {
                        httpOnly: true,
                        expires: new Date(Date.now() + 3600 * 1000)
                    });
                    res.status(200).send({
                        status: "Success",
                        token
                    });
                } else {
                    res.status(400).send({
                        status: "Failed",
                        message: "Email or password is invalid"
                    });
                }
            } else {
                res.status(400).send({
                    status: "Failed",
                    message: "User not found"
                });
            }
        }
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal server error"
        });
    }
}

const getTeacherDetials = async (req, res) => {
    const data = {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        subjectSpect: req.user.subjectSpect,
        role: req.user.role,
        idcardnumber: req.user.idcardnumber,
        profilepicture: req.user.profilepicture
    }
    res.status(200).send({
        status: "Success",
        data
    });
}

//Get user detials by idcardnumber...
const getTeacherById = async (req, res) => {
    const { idcardnumber } = req.params;
    try {
        if (!idcardnumber) {
            res.status(404).send({
                status: "Failed",
                message: "Id number is required"
            })
        } else {
            const userDets = await Teacher.findOne({ idcardnumber }).select('-password');
            if (!userDets) {
                res.status(404).send({
                    status: "Failed",
                    message: "User not found"
                });
            } else {
                res.status(200).send({
                    status: "Success",
                    data: userDets
                });
            }
        }
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal server error."
        });
    }
}

//Get user by spec...
const getAllTeacherBySpec = async (req, res) => {
    const { spec } = req.params;
    try {
        if (!spec) {
            res.status(404).send({
                status: "Failed",
                message: "Please provide spec"
            });
        } else {
            const user = await Teacher.findOne({ subjectSpect: spec }).select('-password');
            if (!user) {
                res.status(404).send({
                    status: "Failed",
                    message: "User not found"
                });
            } else {
                res.status(200).send({
                    status: "Success",
                    data: user
                });
            }
        }
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal server error"
        });
    }
}

const getAllTeacher = async (req, res) => {
    try {
        const user = await Teacher.find().select('-password');
        if (!user) {
            res.status(404).send({
                status: "Failed",
                message: "User not found"
            });
        } else {
            res.status(200).send({
                status: "Success",
                data: user
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal server error"
        })
    }
}

const deleteTeacher = async (req, res) => {
    const { idcardnumber } = req.params;
    try {
        if (req.user.idcardnumber === idcardnumber) {
            const teacher = await Teacher.findById(req.user._id);
            if (!teacher) {
                res.status(400).send({
                    status: "Failed",
                    message: "User not found"
                });
            }
            if (teacher.profilepicture) {
                const publicId = teacher.profilepicture.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
            await Teacher.findByIdAndDelete(req.user._id);
            res.status(200).send({
                status: "Success",
                message: "User deleted"
            })
        } else {
            res.status(404).send({
                status: "Failed",
                message: "Please provide a valid idcard number"
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal server error",
            error
        })
    }
}

module.exports = {
    signup,
    login,
    getTeacherDetials,
    getTeacherById,
    getAllTeacherBySpec,
    getAllTeacher,
    deleteTeacher
}