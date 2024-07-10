import React from "react";

export default function SecondSection(){
    return (
        <div className="bg-main-cream flex justify-center items-center px-2">
            <img 
                src={require('../../../assets/landingAssets/woman-jogging.png')}
                className="w-80 mt-6 mb-5"
                alt="woman jogging outside"
            />
        </div>
    )
}