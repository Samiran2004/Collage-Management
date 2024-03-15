const Studentattandence = require('../models/studentAttandenceModel');

const studentAttandence = async (req, res) => {
    try {
        const { studentId, isPresent } = req.body;
        const attandence = new Studentattandence({
            studentId: studentId,
            isPresent: isPresent
        });
        const result = await attandence.save();
        return res.status(201).send({
            status: "Success",
            result
        });
    } catch (error) {
        return res.status(500).send({
            status: "Failed",
            message: "Internal server error."
        });
    }
}

const getStudentAttandence = async (req,res)=>{
    const {studentId} = req.params
    try {
        const attandence = await Studentattandence.find({studentId}).populate('studentId');
        res.status(200).send({
            status:"Success",
            data: attandence
        })
    } catch (error) {
        res.status(500).send({
            status:"Failed",
            message:"Internal server error"
        })
    }
}

module.exports = {
    studentAttandence,
    getStudentAttandence
}