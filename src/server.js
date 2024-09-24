import express from "express";
import cors from 'cors';
import session from 'express-session';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'node:path';
import bcrypt, { genSalt } from 'bcrypt';
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import { UserModel, Expenses } from "./userdata.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.DB_URL)
         .then(() => console.log('connected'))
         .catch((err) => console.log('didnt connect', err))

const app = express();

app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    cookie :{
        httpOnly: true,
        sameSite: "strict",
        // secure: true,
        maxAge: 1000 * 60 * 20 // 20 minute
    },
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
)
app.use(cookieParser());
app.use(cors({
  origin: process.env.URL
}));
app.use(express.json());

app.post('/login', async (req, res) => {
  try{
    const test = (req.body.user === process.env.ADMIN_NAME && await bcrypt.compare(req.body.password, process.env.ADMIN_PASSWORd))
    console.log(test)
    if(!test) {
      console.log('not the admin')
      res.status(401).json({message: 'try again later'})
    }
    else {
      req.session.logged = true;
      req.session.save();
      console.log('user authenticated')
      res.status(200).json({message: "authenticated"});
    }

  }catch(err) {
    console.log('failed to log the user', err)
  }
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({message: "succesful login"})
})


app.post('/validateUser', async (req, res) => {
    console.log(req.session.logged)
    console.log('validating')
  if(req.session.logged === true) {
    console.log('validated')
    res.status(200).json({message: "user already authenticated"})
  }
  else {
    console.log('unvalidated')
    res.status(401).json({message: "user isnt authenticated"})
  }
})

app.post('/storeExpense', async (req, res) => {
   try {
    console.log('storing')
    console.log(req.body)
      // const user = req.body ;
      const user = new Expenses({
        date: req.body.date,
        qty:req.body.qty ,
        name: req.body.name,
        uniquePrice:req.body.uniquePrice ,
        imputation:req.body.imputation ,
        numero: req.body.numero,
        price:req.body.price ,
        id: req.body.id,
      });
      await user.save();
      console.log(user)
   }catch(err) {
    console.log(err)
   }
})

app.get('/getExpenses', async (req, res) => {
  try {
    const expenses = await Expenses.find().exec();
    res.status(200).json(expenses);
  } catch(err) {
    console.log(err);
    res.status(403).json({message: "couldnt get expenses"})
  }
})

app.delete('/removeExpense', async (req, res) => {
  try {
    console.log('deleting')
    const test = await Expenses.findOne(req.body);
    console.log(test)
    await Expenses.findOneAndDelete(req.body);
  }catch(err) {
    console.log(err);
    console.log('failed to delete')
  }
})

app.post('/getExpenses', async (req, res) => {
  try {
    // console.log(req.body);
    const expenses = await Expenses.find({imputation: req.body.roomName}).exec();
    // console.log(expenses)
    res.status(200).json(expenses)
  } catch(err) {
    console.log(err);
    res.status(403).json({message: "couldnt get expenses"})
  }
})

app.use(express.static(path.join(__dirname, '..', 'src')));
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist/index.html'))
})


app.listen(3000, () => {
  console.log("app listening on 3000")
})

