const express = require('express');
const UserRoutes = require('./routes/user.routes');

const app = express();

console.log("INFO: Setting the pre-defined middlewares...");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());
app.use(express.text());
app.use('/uploads', express.static('uploads'));


app.use('/user',UserRoutes);




module.exports = app;