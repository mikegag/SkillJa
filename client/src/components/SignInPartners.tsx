import React from "react";

export default function SignInPartners(){
    return (
        <div className="flex justify-center">
            <img 
                src={require('../assets/Apple-logo.png')} 
                className="w-12 cursor-pointer" 
                alt="apple logo which redirects user to sign in through their apple account"
            />
            <img 
                src={require('../assets/Google-logo.png')} 
                className="w-12 ml-10 mr-10 cursor-pointer" 
                alt="google logo which redirects user to sign in through their google account"
            />
            <img 
                src={require('../assets/FB-logo.png')} 
                className="w-12 cursor-pointer" 
                alt="facebook logo which redirects user to sign in through their facebook account"
            />
        </div>
    )
}