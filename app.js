//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const saltRound = 10

app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

//register user
app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRound, function (err, hash){
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });
  
    newUser.save(function (error) {
      if (error) {
        console.log(error);
      } else {
        res.render("secrets");
      }
    });
  })
});

//login user
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password

  User.findOne({ email: username }, function (error, foundUser) {
    if (error) {
      console.log(error);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(error, result){
           if(result == true){
             res.render("secrets")
           }
        })
      }
    }
  });
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
