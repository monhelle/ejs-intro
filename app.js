const express = require("express");
const argon2 = require("argon2");
const mongodb = require("mongoose");

const User = require("./models/User");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongodb.connect("mongodb://localhost:27017/ejs"); //notat

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/registrer", (req, res) => {
  res.render("registrer");
});
app.post("/", (req, res) => {
  const { email, passord } = req.body;
  console.log(req.body);

  res.send("OK");
});
app.post("/registrer", async (req, res) => {
  const { email, passord, gjentaPassord } = req.body;
  console.log(req.body);
  if (passord === gjentaPassord) {
    const hash = await argon2.hash(passord);
    console.log(hash);

    const user = new User({ 
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
app.listen(4000);
