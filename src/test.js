// import express from "express";
// import cors from 'cors';
// import mongoose from 'mongoose';
// import { UserModel } from "./userdata.js";
// const app = express();
// const PORT = 3000;

// mongoose.connect("mongodb+srv://rajelmn:Qwertymn07@chat.ccgoj.mongodb.net/data?retryWrites=true&w=majority&appName=chat")
//          .then(() => console.log('connected'))
//          .catch((err) => console.log('didnt connect', err))


// app.use(express.json());
// app.use(cors());

// app.post('/login', async (req, res) => {
//     try {
//         console.log(req.body)
//         if(req.body.password === 'Elgpassword' && req.body.user === 'root') {
//          const userSession = new UserModel({
//             name: req.body.user,
//             password: req.body.password,
//             sessionID: crypto.randomUUID()
//          })
//          await userSession.save();
//          res.status(200).json({status: 200, id: userSession.sessionID})
//         }
//         else {
//             res.status(405).json({status: 401, errorMessage: "failed to login"})
//         }
//     } catch(err) {
//         console.log('failed to login', err)
//     }
// })

// app.post('/validateUser', async (req, res) => {
//     try {
//         const validatedUser = await UserModel.findOne({sessionID: req.body.id});
//         console.log(validatedUser)
//         if(!validatedUser) {
//             throw new Error ('user not authenticated')
//         }
//         res.status(200).json({message: "user is already authenticated"})
//     } catch(err){ 
//         console.log(err)
//         res.status(401).json({message: "please login"})
//     }
// })

// app.listen(PORT, () => {
//     console.log('server connected')
// })