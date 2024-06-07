import React from "react";

export default function SignInPartners(){
    return (
        <div className="flex justify-center">
            <div className="bg-main-black mr-5 sign-in-partner-btn">
                <img 
                    src={require('../../assets/Apple-logo.png')} 
                    className="w-10 cursor-pointer ml-5 my-auto" 
                    alt="apple logo which redirects user to sign in through their apple account"
                />
                <p className="text-main-white my-auto mr-9 font-kulim">Apple</p>
            </div>
            <div className="bg-main-white border-main-black outline-1 outline sign-in-partner-btn">
                <img 
                    src={require('../../assets/google-logo.png')} 
                    className="w-7 ml-5 my-auto rounded-full" 
                    alt="google logo which redirects user to sign in through their google account"
                />
                <p className="text-main-black my-auto ml-2 mr-9 font-kulim">Google</p>
            </div>
        </div>
    )
}