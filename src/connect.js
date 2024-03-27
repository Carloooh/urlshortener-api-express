const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

async function connectToMongoDB() {
  const uri = "mongodb+srv://urlshortener:C40ORUFvLQlafg5G@shorturlexpress.cldtiat.mongodb.net/?retryWrites=true&w=majority&appName=shorturlexpress";
  return mongoose.connect(uri);
}

module.exports = {
  connectToMongoDB,
};