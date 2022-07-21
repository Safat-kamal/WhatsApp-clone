import React from 'react';
import { Button } from '@mui/material';
import './login.css';
import {auth,provider} from '../../firebase';
import { signInWithPopup } from "firebase/auth";


const Login = () => {

    const signIn = () => {
        signInWithPopup(auth, provider).then((response)=>{
            localStorage.setItem('Auth',JSON.stringify(response.user));
            window.location.href='/';
        }).catch((error)=>{
            console.log(error.message);
        });

    }
    return (
        <div className='login'>
            <div className="login__container">
                <img src="https://www.freepnglogos.com/uploads/whatsapp-logo-png-transparent-33.png" alt="" />
                <div className="login__text">
                    <h2>Sign in to WhatsApp</h2>
                </div>
                <Button onClick={signIn}>Sign in with Google</Button>
            </div>
        </div>
    )
}

export default Login
