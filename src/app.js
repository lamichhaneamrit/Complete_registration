const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const hbs = require("hbs");

const cookieParser = require("cookie-parser");
const formidable = require("formidable");
const fs = require("fs");

require("./db/conn");
const UserSchema = require("./models/users");
const auth = require("./middleware/auth");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

require("dotenv").config();
const jwt = require("jsonwebtoken");

const HttpError = require("./models/http-error");
const bcrypt = require("bcrypt");

const app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.use(express.json());
//cookie-parser as middelware
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/dashboard", auth, (req, res) => {
  res.render("dashboard");
});
app.get("/register", (req, res) => {
  res.render("register");
});

// app.post("/register", async(req, res) => {
//         try {

//             const password = req.body.password;
//             const cpassword = req.body.confirmpassword;

//             if (password === cpassword) {

//                 const forklift = new Register({
//                     firstname: req.body.firstname,
//                     lastname: req.body.lastname,
//                     email: req.body.email,
//                     password: req.body.password,
//                     confirmpassword: cpassword,
//                     phone: req.body.phone,
//                     upload: req.body.upload,
//                     company: req.body.company
//                 })

//                 //generate token
//                 const token = await forklift.generateAuthToken();
//                 //cookiess //
//                 res.cookie("jwt", token, {
//                     expires: new Date(Date.now() + 30000 * 60),
//                     httpOnly: true
//                 });
//                 //res.cookie(name,value ,[options])

//                 const registered = await forklift.save();

//                 res.status(201).render("login");

//             } else {
//                 res.send("password must match");
//             }
//         } catch (error) {
//             res.status(400).send(error);
//         }
//     })
//     // login validation
// app.post("/login", async(req, res) => {
//     try {

//         const email = req.body.email;
//         const password = req.body.password;

//         const useremail = await Register.findOne({ email: email });

//         const isMatch = await bcrypt.compare(password, useremail.password);

//         const token = await useremail.generateAuthToken();
//         //jwt sent via cookies also called after login
//         res.cookie("jwt", token, {
//             expires: new Date(Date.now() + 30000 * 60),
//             httpOnly: true
//                 // secure: true
//         });

//         if (isMatch) {
//             res.status(201).render("index");

//         } else {
//             res.send("Email or Password is incorrect");
//         }

//     } catch (error) {
//         res.status(400).send("Invalid Login Details")
//     }

// })

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
app.post("/signup", async (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image cannot be uploaded",
      });
    }

    const {
      firstname,
      lastname,
      email,
      password,
      confirmpassword,
      phone,
      company,
    } = fields;

    // let existingUser;
    // try {
    //   existingUser = await UserSchema.findOne({ email });
    // } catch (err) {
    //   const error = new HttpError("finding email failed, try again later", 500);
    //   return next(error);
    // }

    // if (existingUser) {
    //   const error = new HttpError(
    //     " email already exist , verify email or login",
    //     422
    //   );
    //   return next(error);
    // }
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      const error = new HttpError("hashing password failed", 500);
      return next(error);
    }

    let newUser = new UserSchema({
      ...fields,
      password: hashedPassword,
      confirmpassword: hashedPassword,
    });
    let attatchment;
    let attatchmentType;
    if (files.userFiles) {
      newUser.userFiles.data = fs.readFileSync(files.userFiles.path);
      attatchment = fs.readFileSync(files.userFiles.path);
      newUser.userFiles.contentType = files.userFiles.type;
      attatchmentType = files.userFiles.type;
    }
    // .then((data) => res.status(201).json({ newUser }))
    newUser.save().catch((err) => console.log(err));

    res.status(201).json({ newUser });
  });
});

// const signup = async (req, res, next) => {
//   const { firstName, emailID, password } = req.body;

//   let existingUser;
//   try {
//     existingUser = await User.findOne({ emailID });
//   } catch (err) {
//     const error = new HttpError("finding email failed, try again later", 500);
//     return next(error);
//   }

//   if (existingUser) {
//     const error = new HttpError(
//       " email already exist , verify email or login",
//       422
//     );
//     return next(error);
//   }

//   let emailToken;
//   try {
//     //emailId:emailId
//     emailToken = await jwt.sign({ emailID }, "shhhhared-secret", {
//       expiresIn: 12000,
//     });
//   } catch (err) {
//     throw new Error("signing jwt token failed");
//   }
//   let hashedPassword;
//   try {
//     hashedPassword = await bcrypt.hash(password, 10);
//   } catch (err) {
//     const error = new HttpError("hashing password failed", 500);
//     return next(error);
//   }

//   const newUser = new User({
//     firstName: firstName,
//     emailID: emailID,
//     password: hashedPassword,
//   });
//   //const newUser = new User(req.body)

//   try {
//     await newUser.save();
//   } catch (err) {
//     console.log(err);
//     return next(err);
//   }

//   const url = `http://localhost:5000/emailConfirmation/${emailToken}`;
//   // const url = `http://localhost:3000/emailConfirmation/${emailToken}`;

//   const msg = {
//     to: `${emailID}`, // Change to your recipient
//     from: "votingSystem.ajefunmi@gmail.com", // Change to your verified sender
//     subject: "activate your email for votingSystem",
//     text: "click verify to verify your email",
//     html: ` <a href=${url}>Verify</a>`,
//   };

//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log("Email sent");
//     })
//     .catch((error) => {
//       console.error(error);
//     });

//   res.json({
//     newUser,
//     success: true,
//     message: "User has been successfully created but not activated",
//   });
// };

app.listen(port, () => {
  console.log(`Server is running at port no ${port}`);
});
