const express = require("express");
const argon2 = require("argon2");
const mongodb = require("mongoose");
const nodemailer = require("nodemailer"); //importer nodemailer
const User = require("./models/User");
const app = express();
require("dotenv").config() //importerte dotenv

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongodb.connect(process.env.DB_URL); //.envvariabel


//lage en transport (tunnel)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_EMAIL, //bytt user email
        pass: process.env.SMTP_PASS // bytt passord
    }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("index");
});

app.get("/registrer", (req, res) => {
  res.render("registrer");
});

app.get("/velkommen", (req, res) => {
  res.render("velkommen");
});

app.get("/glemt-passord", (req, res) => { // banenavnet
  res.render("glemtPassord"); //filnavnet
});

app.get("/reset-passord", (req, res) => { // banenavnet
  res.render("resetPassord"); //filnavnet
});


app.post("/reset-passord", async (req, res) => {
  const { passord, gjentapassord } = req.body;
  console.log(req.body);
  console.log(req.query);

  let email = req.query.email;

  if(passord === gjentapassord) {

    const hash = await argon2.hash(passord);

    const user = await User.updateOne({email}, {passord:hash})

    res.redirect("/login")

  } else {
    res.send("Passordene stemmer ikke overens")
  }
})

app.post("/glemt-passord", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({email});
  let userEmail = user.email;

  const sendEmail = await transporter.sendMail({
    to: "daisha.kerluke30@ethereal.email",
    // to: userEmail,
    from: "daisha.kerluke30@ethereal.email",
    subject:"Glemt passord",
    html: `
    <a href="http://localhost:4000/reset-passord?email=${userEmail}">
    Bytt passord her</a>`

  })

  res.send("Epost sendt!")

})



app.post("/", async (req, res) => {
  const { email, passord } = req.body;
  console.log(req.body);

    const user = await User.findOne({email})

    if(!user) {
        res.send("Bruker eller passord stemmer ikke")
    }

    console.log(user);
    console.log("verifying", user.passord, passord)
    const isMatch = await argon2.verify(user.passord, passord);
    console.log("done verifying")
    console.log(isMatch); 
    
    if(isMatch) {
        res.redirect("/velkommen")
    } else {
          res.send("Bruker eller passord stemmer ikke")
    }

//   res.send("OK");
});
app.post("/registrer", async (req, res) => {
  const { navn, email, passord, gjentaPassord } = req.body;
  console.log(req.body);
  if (passord === gjentaPassord) {
    const hash = await argon2.hash(passord);
    console.log(hash);

    const user = new User({ 
        navn:navn,
        email: email, 
        passord: hash 
    });

    await user.save();
    res.redirect("/");
    // res.send("OK " + hash);
  } else {
    res.send("Passord og gjenta passord matcher ikke");
  }
});


//ALLER SISTE APP.GET
app.get("*s", (req, res) => {
  res.render("index")
})


app.listen(process.env.PORT);
