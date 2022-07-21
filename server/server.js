import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import Message from './DbModel.js';
import Pusher from "pusher";
import cors from  'cors';

const app = express();
const port = process.env.PORT || 9000;


// middleware
app.use(express.json());
app.use(cors());



// DB COnfig 
const Db_connection_url = process.env.DATABASE_URL;
mongoose.connect(Db_connection_url,{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
}).then((response)=>console.log("Database Connected")).catch((error)=>console.log(error));



// Pusher : to get real-time data from database
const pusher = new Pusher({
    appId: "1418764",
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "ap2",
    useTLS: true
});

const db = mongoose.connection;

db.once("open",()=>{
    console.log("Pusher : DB Connected");
    const msgCollection = db.collection("messagecontents");
    const changeStrem = msgCollection.watch();
    changeStrem.on('change', (change)=>{
       
        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',
                {
                    name: messageDetails.name,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    received: messageDetails.received
                }
            );
        }
        else{
            console.log('Error triggering pusher');
        }
    })
});

  




// API ENDPOINTS
app.get('/messages/sync',(req,res)=>{
    Message.find((err,data)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(data);
        }
    });
    
});

app.post("/messages/new",(req,res)=>{
    Message.create(req.body,(err,data)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(201).send(`New Message Created : \n ${data}`);
        }
    })
})



// listener
app.listen(port,()=>{
    console.log(`App is running on port ${port}...`);
})

