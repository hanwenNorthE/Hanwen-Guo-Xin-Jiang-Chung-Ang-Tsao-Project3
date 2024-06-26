const express = require('express');
const mongoose = require("mongoose");
const session = require('express-session');
// const MongoStore = require('connect-mongo');
const cors = require('cors');
const usersRouter = require("./db/router/userRouter.cjs");
const passwordsRouter = require("./db/router/passwordsRouter.cjs"); 
const shareRequestRouter  = require("./db/router/shareRequestRouter.cjs"); 
const sharePasswordRouter  = require("./db/router/sharePasswordRouter.cjs"); 
const path = require('path');


const app = express();
app.use(cors());


const port = process.env.PORT || 5000;

app.use(express.json());

app.use(session({
  secret: 'secret-key',
  // store:MongoStore.create({ mongoUrl: 'mongodb://localhost/password-manager-app' }),
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 300 * 60 * 1000 
  }
}));

app.use("/api/users", usersRouter);
app.use("/api/passwords", passwordsRouter);
app.use("/api/shareRequest", shareRequestRouter);
app.use("/api/sharePassword", sharePasswordRouter);

let frontend_dir = path.join(__dirname, '..', 'frontend', 'dist')

app.use(express.static(frontend_dir));
app.get('*', function (req, res) {
    console.log("received request");
    res.sendFile(path.join(frontend_dir, "index.html"));
});


// const mongoDBEndpoint = process.env.MONGODB_URI || 'mongodb://127.0.0.1/PasswordManager';
mongoose
  .connect(
     `mongodb+srv://stevenjiangx:banana1@passwordmanager.p01aspa.mongodb.net/?retryWrites=true&w=majority&appName=PasswordManager`
    // mongoDBEndpoint
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



