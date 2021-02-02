const mongoose = require("mongoose");
module.exports = {
    MONGODB_URL: `mongodb+srv://Amrit:Amrit123@database.91cgx.mongodb.net/test1`,
  useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true

}).then(() => {
    console.log('connection successfull');
}).catch((e) => {
    console.log('connection not successfull');
});

