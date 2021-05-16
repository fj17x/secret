//jshint esversion:6
const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express()

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true })

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
})

userSchema.plugin(encrypt, { secret: "thisismysecretkey", encryptedFields: ["password"] })

const User = mongoose.model("User", userSchema)

app.get("/", (req, res) => res.render("home"))

app
  .route("/login")
  .get((req, res) => res.render("login"))
  .post((req, res) => {
    const username = req.body.username
    const password = req.body.password
    User.find({}, (err, user) => {
      user.forEach((user) => {
        if (user.email === username && user.password === password) {
          res.render("secrets")
        }
      })
    })
  })

app
  .route("/register")
  .get((req, res) => res.render("register"))
  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    })
    newUser.save((err) => {
      if (err) console.log()
      else res.render("secrets")
    })
  })

app.listen(process.env.PORT || 4000, (err) => {
  if (err) console.log(err)
  else console.log("Started port 4000")
})
