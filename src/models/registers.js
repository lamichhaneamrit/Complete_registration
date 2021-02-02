const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// schema storage
const forkliftSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    upload: {
        data: Buffer,
        contentType: String


    },
    company: {
        type: String,
        required: true
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})

//genertaing Tokens defining token
forkliftSchema.methods.generateAuthToken = async function() {
    try {

        console.log(this._id);
        const token = jwt.sign({ _id: this._id.toString() }, "process.env.SECRET_KEY");
        this.tokens = this.tokens.concat({ token: token })
        console.log(token);
        await this.save();
        return token;

    } catch (error) {
        res.send("the error part is " + error);
        console.log("the error part is " + error);


    }
}

//middelware and converting password into hash
forkliftSchema.pre("save", async function(next) {

    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);

    }

    next();

})

//need to create a collections
const Register = new mongoose.model("Register", forkliftSchema);
module.exports = Register;