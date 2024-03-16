const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const cloudinary = require('../middleware/cloudinaryMiddleware');
const jwt = require('jsonwebtoken');

const generateUniqueId = (prefix, name) => {
    return `${Math.floor(Math.random() * (10000 + 99999 - 1)) + 10000}${prefix}${name.split(' ')[0]}`;
};

const signupStudent = async (req, res) => {
    const { name, email, password, phone, role, standerd, department } = req.body;

    if (!name || !email || !password || !phone || !role || !standerd || !department) {
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
            class: standerd,
            department: department
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
                profilepictureUrl: result.url,
                department
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

const login = async (req, res) => {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
        return res.status(400).json({
            status: "Failed",
            message: "All fields are required."
        });
    }

    try {
        const user = await User.findOne({ email, phone });

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

const getAllStudent = async (req, res) => {
    try {
        const { sem, department } = req.params;
        const user = await User.find({ class: sem, department: department });
        res.status(200).send({
            status: "Success",
            user
        });
    } catch (error) {
        return res.status(500).send({
            status: "Failed",
            message: "Internal server error."
        });
    }
}

//Update a student by idcardnumber....
const updateStudent = async (req, res) => {
    try {
        const { idcardnumber } = req.params;
        const { name, password, sem, department } = req.body;
        if (req.user.idcardnumber === idcardnumber) {
            const student = await User.findById(req.user._id);
            if (!student) {
                res.status(404).send({
                    status: "Failed",
                    message: "User not found"
                });
            } else {
                if (name) student.name = name
                if (password) {
                    const hashedpassword = await bcrypt.hash(password, 10);
                    student.password = hashedpassword
                }
                if (sem) student.class = sem
                if (department) student.department = department

                if (req.file) {
                    const result = await cloudinary.uploader.upload(req.file.path);
                    student.profilepictureUrl = result.url;
                }
                const result = await student.save();
                res.status(201).send({
                    status: "Success",
                    data: result
                });
            }
        } else {
            res.status(404).send({
                status: "Failed",
                message: "Please provide correct idcard number"
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal server error"
        });
    }
}

//Delete a student by Idcardnumber email password
const deleteStudent = async (req, res) => {
    const { idcardnumber } = req.params;
    try {
        // Validate that idcardnumber is provided
        if (!idcardnumber) {
            return res.status(400).json({
                status: "Failed",
                message: "Id card number is required"
            });
        }

        // Verify if the requested student matches the authenticated user
        if (req.user.idcardnumber !== idcardnumber) {
            return res.status(403).json({
                status: "Failed",
                message: "Invalid id card number."
            });
        }

        // Find the student by their authenticated user ID
        const student = await User.findById(req.user._id);
        if (!student) {
            return res.status(404).json({
                status: "Failed",
                message: "User not found"
            });
        }

        // Check if profilepictureUrl is defined before attempting to split it
        if (student.profilepictureUrl) {
            const publicId = student.profilepictureUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        // Delete the student document from MongoDB
        const deletedStudent = await User.findByIdAndDelete(student._id);
        console.log(deletedStudent);
        res.status(200).json({
            status: "Success",
            message: "Student deleted successfully"
        });
    } catch (error) {
        // Handle errors
        console.error("Error deleting student:", error);
        res.status(500).json({
            status: "Failed",
            message: "Internal server error"
        });
    }
};

module.exports = {
    signupStudent,
    login,
    getUserData,
    getUserById,
    getAllStudent,
    updateStudent,
    deleteStudent
};
