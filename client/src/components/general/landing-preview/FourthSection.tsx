import React from "react"
import data from '../../../data.json'
import { Link } from "react-router-dom"

export default function FourthSection(){
    const landingInfo = data.landing.fourthSection

    return (
        <div className="bg-main-cream flex justify-center items-center px-2 mx-auto">
            <div className="flex flex-col justify-center items-center mr-8">
                <h3 className="w-fit text-3xl font-source font-medium text-main-green-700">
                    {landingInfo.title[0]}
                </h3>
                <p className="my-7 max-w-lg text-center font-kulim pr-6">
                    {landingInfo.subtitle[0]}
                </p>
                <img 
                src={require('../../../assets/landingAssets/woman-kneeling.png')}
                className="w-72 mx-auto"
                alt="woman jogging outside"
                />
            </div>
            <div className="flex flex-col justify-center items-center ml-8">
                <img 
                src={require('../../../assets/landingAssets/sports-equipment.png')}
                className="w-72 mx-auto"
                alt="woman jogging outside"
                />
                <h3 className="w-fit my-7 text-3xl font-source font-medium text-main-green-700">
                    {landingInfo.title[1]}
                </h3>
                <p className=" max-w-lg text-center font-kulim pr-6">
                    {landingInfo.subtitle[1]}
                </p>
            </div>
            
        </div>
    )
}