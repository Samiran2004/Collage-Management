const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
require('dotenv').config();

mongoose.connect(process.env.DB_URI).then(() => console.log("Database connected.")).catch(() => console.log("Database connection error."));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', require('./router/userRouter'));
app.use('/api/teacher', require('./router/teacherRouter'));
app.use('/api/attandence', require('./router/attandenceRouter'));

app.use('/api/library', require('./router/bookRouter'));

app.listen(process.env.PORT, () => {
    console.log(`Server connected on port: ${process.env.PORT}`);
});