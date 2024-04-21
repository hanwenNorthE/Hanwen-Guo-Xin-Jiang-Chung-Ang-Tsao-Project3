const express = require("express");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

mongoose
  .connect(
    `mongodb+srv://stevenjiangx:banana1@passwordmanager.p01aspa.mongodb.net/?retryWrites=true&w=majority&appName=PasswordManager`
  )
  .then(
    app.listen(port, () => {
      console.log(`Server is listening on ${port}...`);
    })
  )
  .catch((error) => {
    console.log(error);
  });