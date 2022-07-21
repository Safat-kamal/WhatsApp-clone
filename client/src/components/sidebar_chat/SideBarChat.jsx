import React, { useState, useEffect } from 'react';
import './sidebarchat.css';
import Avatar from '@mui/material/Avatar';
import {Link} from 'react-router-dom';
import db from '../../firebase';
import { query,collection,orderBy, onSnapshot } from "firebase/firestore";

const SideBarChat = ({id,name}) => {
  const [messages,setMessages] = useState([]);


  useEffect(() => {
    if (id) {
      const msgColl = query(collection(db, "chats", id, "messages"), orderBy("timestamp"));
      onSnapshot(msgColl, (querySnapshot) => {
        setMessages(querySnapshot.docs.map(msg => msg.data()))
      });

    }
    // console.log(id);
  }, [id]);

  return (
    <Link to={`/${id}`}>
      <div className='sidebar_chat'>
        <Avatar/>
        <div className="sidebar_chat_info">
            <h2>{name && name}</h2>
            <p>{messages[messages.length-1]?.message}</p>
        </div>
      </div>
    </Link>
  )
}

export default SideBarChat
