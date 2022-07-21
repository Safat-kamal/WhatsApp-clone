import React, { useEffect, useState } from 'react';
import './Chat.css';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoodOutlinedIcon from '@mui/icons-material/MoodOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Avatar, IconButton } from '@mui/material';
import ChatMessage from '../chat_message/ChatMessage';
// import axios from '../../axios';
import db from '../../firebase';
import { query,collection,orderBy,doc, addDoc,getDoc,onSnapshot, serverTimestamp } from "firebase/firestore";
import { useParams } from 'react-router-dom';


const Chat = () => {
  const [input, setInput] = useState("");
  const [chatName, setChatName] = useState("");
  const [msgs,setMsgs] = useState([]);
  const { chatId } = useParams();

  useEffect(() => {
    if (chatId) {
      const getChat = async () => {
        // eslint-disable-next-line
        const docSnap = await getDoc(doc(db, "chats", chatId));
        if (docSnap.exists()) {
          setChatName(docSnap.data().name);
        }

      }
      getChat();

      const msgColl = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp"));
      onSnapshot(msgColl, (querySnapshot) => {
        setMsgs(querySnapshot.docs.map(msg => msg.data()))
      });

    }
  }, [chatId]);

  
  // send message
  const sendMessage = async (e) => {
    e.preventDefault();
    setInput("");
    if(localStorage.getItem('Auth')){
      const storage = JSON.parse(localStorage.getItem('Auth'));
      await addDoc(collection(db, "chats", chatId, "messages"), {
        message: input,
        name: storage.displayName,
        timestamp: serverTimestamp()
      });
    }
    // await axios.post('/messages/new', {
    //   message: input,
    //   "name": "ashar",
    //   "timestamp": new Date().toUTCString(),
    //   "received": false
    // });
  }

  return (
    <div className='chat'>
      <div className="chat__header">
        <div className="chat__header__left">
          <Avatar />
          <div className="chat__header__info">
            <h2>{chatName}</h2>
            <p>{`last seen ${msgs[msgs.length - 1]?.timestamp? new Date(msgs[msgs.length - 1]?.timestamp?.toDate()).toString():'Not Available...'}`}</p>
          </div>
        </div>
        <div className="chat__header__right">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {
          msgs.map((msG, index) => {
            return <ChatMessage msG={msG} key={index} />
          })
        }
      </div>
      <div className="chat__footer">
        <MoodOutlinedIcon />
        <form>
          <input type="text" name="message_typer" id="message_typer" placeholder='Type a message' value={input} onChange={(e) => setInput(e.target.value)} />
          <button onClick={sendMessage}><SendOutlinedIcon /></button>
        </form>
      </div>
    </div>
  )
}



export default Chat;