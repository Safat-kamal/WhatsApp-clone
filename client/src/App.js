import {useEffect, useState } from 'react';
import './App.css';
import Chat from './components/chat/Chat';
import Sidebar from './components/sidebar/Sidebar';
// import Pusher from 'pusher-js';
// import axios from './axios';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login from './components/login/Login';



function App() {
//  const [messages,setMessages] = useState([]);
 const [user,setUser] = useState(false);
  // for fetching all the message initially.
  useEffect(() => {
    // axios.get('/messages/sync').then((response) => {
    //   setMessages(response.data)
    // });
    if(localStorage.getItem('Auth')){
      setUser(true); 
    }
  }, []);


  // use whenever new message add.
  // useEffect(()=>{
  //   const pusher = new Pusher('5b58d6f28bccd5a152de', {
  //     cluster: 'ap2'
  //   });

  //   const channel = pusher.subscribe('messages');
  //   channel.bind('inserted', (newMessage)=> {
  //     setMessages([...messages,newMessage]);
  //   });

  //   return()=>{
  //     channel.unbind_all();
  //     channel.unsubscribe();
  //   };

  // },[messages])



  // logout
  const handleClosed = ()=>{
    if(localStorage.getItem('Auth')){
        localStorage.removeItem('Auth');
        setUser(false);
    }
  }



  return (
    <div className="app">
      {!user? <Login/>:
      <div className="app__body">
      <Router>
        <Sidebar handleClosed={handleClosed}/>
        <Routes>
          {/* <Route exact path='/' element={<Chat messages={messages}/>}/>
          <Route exact path='/:chatId' element={<Chat messages={messages}/>}/> */}
          <Route exact path='/' element=''/>
          <Route exact path='/:chatId' element={<Chat/>}/>
          <Route exact path='/login' element={<Login/>}/>
        </Routes>
      </Router>
    </div>}
    </div>
  );
}

export default App;
