require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require("path");
const hbs = require("hbs");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
//###########################################
//Configure database 
require("./db/conn");


const port = process.env.PORT || 3000;


const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

//app.use(express.static(static_path));


//####################################
//set view engine to handlebars

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

//#############################
// Express 
app.use(express.json());
//################################
//cookie-parser as middelware
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//######################
//getting requests from landing page 
app.get("/", (req, res) => {
    res.render("index")
});
//##########################################
//Get request from  login page
app.get("/login", (req, res) => {
    res.render("login")
});
//##########################################
//Get request from  Dashboard page 
app.get("/dashboard", auth, (req, res) => {
    res.render("dashboard")
});

//######################################
// Get request for registration page 
app.get("/register", (req, res) => {
    res.render("register");

})

//##############################Register is defined here 
const Register = require("./models/registers");


app.post("/register", async(req, res) => {
    try {

        const password = fields.password;
        const cpassword = fields.confirmpassword;


        if (password === cpassword) {

            const Register = { "firstname": "fields.firstname", "lastname": "fields.lastname", "email": "fields.email", "password": "fields.password", "confirmpassword": "fields.confirmpassword", "phone": "phone", "Gewerbeschein": "fields.fileName" };



            //generate token
            const token = await forklift.generateAuthToken();
            //cookiess //
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30000 * 60),
                httpOnly: true
            });
            //res.cookie(name,value ,[options])


            const registered = await forklift.save();

            res.status(201).render("login");

        } else {
            res.send("password must match");
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

//#############################
// Post login  page after registrtaion 
app.post("/login", async(req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email });

        const isMatch = await bcrypt.compare(password, useremail.password);

        //######################################################################
        //create token and generate authorization
        const token = await useremail.generateAuthToken();
        //jwt sent via cookies also called after login 
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30000 * 60),
            httpOnly: true
                // secure: true
        });


        if (isMatch) {
            res.status(201).render("index");

        } else {
            res.send("Email or Password is incorrect");
        }




    } catch (error) {
        res.status(400).send("Invalid Login Details")
    }



})







//securePassword("")



/*
const createToken = async() => {
    const token = await jwt.sign({ _id: "6011d7eae9ab6052ec006424" }, "mynameiskhanandiamnotaterroistyouunderstandbetterunderstand");
    console.log(token);
    // user verification using jwt
    const userVer = await jwt.verify(token, "mynameiskhanandiamnotaterroistyouunderstandbetterunderstand");
    console.log(userVer);

}



createToken();

*/






//#######################################
//listen the server

app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
})
