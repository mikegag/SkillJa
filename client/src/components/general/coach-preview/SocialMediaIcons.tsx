import React from "react";

export default function SocialMediaIcons(){
    return (
        <div className="flex justify-evenly">
            <img 
                    src={require('../../../assets/icons/instagram-icon.png')}
                    className="w-7 h-7 text-main-green-900 mx-1 cursor-pointer hover:text-main-green-500" 
            />
            <img 
                src={require('../../../assets/icons/facebook-icon.png')}
                className="w-7 h-7 text-main-green-900 mx-1 cursor-pointer hover:text-main-green-500 " 
            />
            <img 
                src={require('../../../assets/icons/twitter-icon.png')}
                className="w-7 h-7 text-main-green-900 mx-1 cursor-pointer hover:text-main-green-500" 
            />
            <img 
                src={require('../../../assets/icons/tiktok-icon.png')}
                className="w-7 h-7 text-main-green-900 mx-1 cursor-pointer hover:text-main-green-500" 
            />
        </div>
    )
}