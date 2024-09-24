import React from "react";

interface props {
    instagram: string;
    facebook: string;
    twitter: string;
    tiktok: string
}
export default function SocialMediaIcons({instagram, facebook, twitter, tiktok}: props){
    return (
        <div className="flex justify-evenly">
            <a href={instagram} className="mx-1">
                <img 
                        src={require('../../../assets/icons/instagram-icon.png')}
                        className="w-7 h-7 text-main-green-900 cursor-pointer hover:text-main-green-500"
                        alt="instagram social media icon" 
                />
            </a>
            <a href={facebook} className="mx-1">
                <img 
                    src={require('../../../assets/icons/facebook-icon.png')}
                    className="w-7 h-7 text-main-green-900 cursor-pointer hover:text-main-green-500"
                    alt="facebook social media icon" 
                />
            </a>
            <a href={twitter} className="mx-1">
                <img 
                    src={require('../../../assets/icons/twitter-icon.png')}
                    className="w-7 h-7 text-main-green-900 cursor-pointer hover:text-main-green-500" 
                    alt="twitter/X social media icon"
                />
            </a>
            <a href={tiktok} className="mx-1">
                <img 
                    src={require('../../../assets/icons/tiktok-icon.png')}
                    className="w-7 h-7 text-main-green-900 cursor-pointer hover:text-main-green-500" 
                    alt="tiktok social media icon"
                />
            </a>
        </div>
    )
}