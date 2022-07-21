import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import SideBarChat from '../sidebar_chat/SideBarChat';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import db from '../../firebase';
import { collection,addDoc, query, onSnapshot, orderBy, startAt, endAt } from "firebase/firestore";


const Sidebar = ({handleClosed}) => {
    const [open, setOpen] = useState(false);
    const [chatName, setChatName] = useState('');
    const [chats, setChats] = useState([]);
    const [photoUrl,setPhotoUrl] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const opeN = Boolean(anchorEl);
    const [search,setSearch] = useState("");

    // sidebar all chats
    useEffect(() => {
        const unsubscribe = query(collection(db, "chats"));
        onSnapshot(unsubscribe, (querySnapshot) => {
            setChats(querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            })));
        });
        if(localStorage.getItem('Auth')){
            const storage = JSON.parse(localStorage.getItem('Auth'));
            setPhotoUrl({
                photoUrL:storage.photoURL,
                displayNamE:storage.displayName
            });
        }

    }, []);

    useEffect(()=>{
        let searching = search;
        if(searching !== ''){
            const msgColl = query(collection(db, "chats"), orderBy("name"), startAt(searching), endAt(searching+'\uf8ff'));
            onSnapshot(msgColl, (querySnapshot) => {
                setChats(querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                })));
            });
        }
        else{
            const unsubscribe = query(collection(db, "chats"));
            onSnapshot(unsubscribe, (querySnapshot) => {
                setChats(querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                })));
            });

        }
    },[search]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClicked = (event) => {
        setAnchorEl(event.currentTarget);
    };
    

    const create_chat = async () => {
        if (chatName !== '') {
            await addDoc(collection(db, "chats"), {
                name: chatName
            });
            setChatName("");
            setOpen(false);         
        }
        else {
            document.getElementById('chat_name').classList.add('error');
        }

    }


    return (
        <div className='sidebar'>
            <div className="sidebar__header">
                <Avatar alt={photoUrl.displayNamE} src={photoUrl.photoUrL} />
                <div className="sidebar__header__right">
                    <IconButton>
                        <DonutLargeIcon className='icon-space' />
                    </IconButton>
                    <IconButton>
                        <ChatIcon className='icon-space' />
                    </IconButton>
                    <Button
                        id="basic-button"
                        aria-controls={opeN ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={opeN ? 'true' : undefined}
                        onClick={handleClicked}
                    >
                        <MoreVertIcon className='icon-space' />
                    </Button>
                    <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={opeN}
                    onClose={handleClosed}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                    
                    <MenuItem onClick={handleClosed}>Logout</MenuItem>
                </Menu>

                </div>
            </div>
            <div className="sidebar__search">
                <div className="search__container">
                    <SearchIcon className='search-icon' />
                    <input type="search" id="sidebar_search" placeholder='Search or Start New Chat' value={search} onChange={(e)=>setSearch(e.target.value)}/> 
                </div>
            </div>
            <div className="sidebar__chats">
                <div className="add_chat_container">
                    <h3 id="add_new_chat_text" color='primary'>Add New Chat</h3>
                    <IconButton className='add_chat_icon' onClick={handleClickOpen}>
                        <AddCircleOutlineIcon color="primary" />
                    </IconButton>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Add New Chat</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To start a new conversation, you have to create new chat.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="chat_name"
                                label="Chat Name"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={chatName}
                                onChange={(e) => setChatName(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={create_chat}>Create</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <h3 id="all_chat_title">All Chats</h3>
                {chats.map((chat)=>{
                    return <SideBarChat key={chat.id} id={chat.id} name={chat.data.name}/>
                })}
            </div>
        </div>
    )
}

export default Sidebar
