const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://Amrit:JejRyPaaIIPDhcpH@database.91cgx.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("connection successfull");
  })
  .catch((e) => {
    console.log("connection not successfull");
  });
