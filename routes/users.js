var express = require('express');
var router = express.Router();
const { getCollection } = require('../models/db');

const crypto = require("crypto");

const {
  GoogleGenerativeAI
} = require("@google/generative-ai");

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );
router.post("/signup/submit", async (req, res) => {
  try {
    let conn = getCollection("users");
    
     
    let password = req.body.password;
    
    const salt = crypto.randomBytes(11).toString("hex"); 
    const keyLength = 11; 
    let cryptoPassword = crypto.scryptSync(password, salt, keyLength).toString("hex");

    let newUser = req.body;
    newUser.password = cryptoPassword;
    newUser.salt = salt;

    await conn.insertOne(newUser);
    res.redirect("/signin");
  } 
  catch(e) {
    console.error(e);
    res.redirect("/signup");
  }
});

router.post("/signin/submit", async (req, res) => {
  try {
    let conn = getCollection("users");
    let email = req.body.email;
    let password = req.body.password;
    
    let dbuser = await conn.findOne({email: email});
    
    if(!dbuser) {  
      return res.redirect("/signin");
      
    } 

    const keyLength = 11;
    const salt = dbuser.salt; 
    let cryptoPassword = crypto.scryptSync(password, salt, keyLength);
    if(cryptoPassword.toString("hex") === dbuser.password) {
      
      res.render("dashboard", {name: dbuser.name, quiz: null});
    } else {

      res.redirect("/signin");
    }
  } catch(e) {
    console.error(e);
  }
});
router.post("/quiz/generate", async (req, res) => {

  try {
    const topic = req.body.topic;
    const model = genAI.getGenerativeModel({
		model: "gemini-2.5-flash"
});

    const result = await model.generateContent(
      "Generate 5 Easy Quiz questions about " +
      topic +
      ". Only return numbered questions."
    );
    const quiz = result.response.text();
	
    res.render("dashboard", {
      name: req.body.name,
      quiz: quiz
    });

  }
  catch(e) {
    console.error(e);
    res.send("Quiz failed");
  }
  
});
router.post("/quiz/submit", async (req, res) => {
  try {
    const questions = req.body.questions;
    const answers = req.body.answers;
    const name = req.body.name;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = "A student was given these quiz questions:\n" + questions +
      "\n\nTheir answers were:\n" + answers +
      "\n\nPlease grade each answer briefly and tell them if they got it right or wrong. Be encouraging.";

    const result = await model.generateContent(prompt);
    const feedback = result.response.text();

    res.render("dashboard", {
      name: name,
      quiz: questions,
      feedback: feedback
    });

  } catch(e) {
    console.error(e);
    res.render("dashboard", {
      name: req.body.name || "User",
      quiz: req.body.questions,
      feedback: "Could not grade answers at this time."
    });
  }
});
router.get("/test-ai", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Say hello in one word.");
    const text = result.response.text();
    res.send(text);
  } catch(e) {
    res.send("ERROR: " + e.message);
  }
});
module.exports = router;
