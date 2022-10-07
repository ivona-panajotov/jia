const { response } = require('express')
const express=require('express')
const ejs=require('ejs')
const app=express()
// const lightbox=require('lightbox2')
const port=3000
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const dotenv=require('dotenv')
const OAuth2 = google.auth.OAuth2;
app.use(bodyParser.json());
require('dotenv').config({path:__dirname+'/.env'})
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.get('/',(req,res)=>{
  res.render('index')
})
/*

///////////      sifra za gmail: testic123             ///////////

*/
  const myOAuth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    )
    myOAuth2Client.setCredentials({
      refresh_token:process.env.REFRESH_TOKEN
      })
      const myAccessToken = myOAuth2Client.getAccessToken()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
       type: "OAuth2",
       user: process.env.GMAIL_USER, 
       clientId: process.env.CLIENT_ID,
       clientSecret: process.env.CLIENT_SECRET,
       refreshToken: process.env.REFRESH_TOKEN,
       accessToken: myAccessToken
  }});

app.post("/", async (req, res, next) => {
  res.redirect('/')
  let data = {};
  console.log(req.body)
    const mail = {
      from: req.body.email,
      to: 'testingjianode@gmail.com',
      subject: req.body.name,
      text: `${req.body.name}, <${req.body.email}> vam salje poruku: \n${req.body.subject}`,
    };
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Email successfully sent to recipient!");
      }
    });
});
app.listen(port,()=>{
  console.log('Listening at port 3000')
})