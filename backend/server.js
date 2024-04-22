const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const usersRouter = require("./db/router/userRouter.cjs");
// const passwordsRouter = require("./routers/passwordsRouter");

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());


app.use("/api/users", usersRouter);
// app.use("/api/passwords", passwordsRouter);

mongoose
  .connect(
    `mongodb+srv://stevenjiangx:banana1@passwordmanager.p01aspa.mongodb.net/?retryWrites=true&w=majority&appName=PasswordManager`
  )
  .then(() => {
    // Removed app.listen from here and moved it outside
    console.log(`Connected to MongoDB...`);
  })
  .catch((error) => {
    console.log(error);
  });

// Moved app.listen here
app.listen(port, () => {
  console.log(`Server is listening on ${port}...`);
});
