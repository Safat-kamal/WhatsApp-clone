import React, { useMemo, useState } from 'react';
import './chatmessage.css';

const ChatMessage = ({msG}) => {
  const [displayname,setDisplayName] = useState(null);

  useMemo(()=>{
    if(localStorage.getItem('Auth')){
      const storage = JSON.parse(localStorage.getItem('Auth'));
      setDisplayName(storage.displayName);
    }
  },[])
  
  return (
    <p className={`chat_message ${msG.name === displayname && 'chat_receiver'}`}> 
        <span className='chat_name'>{msG.name}</span>
        {msG.message}
        <span className='chat_timestamp'>{new Date(msG.timestamp?.toDate()).toLocaleString()}</span>
    </p>
  );
}


export default ChatMessage