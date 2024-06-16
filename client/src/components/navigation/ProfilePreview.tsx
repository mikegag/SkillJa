import { faChevronRight, faDollarSign, faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

//interface for props

export default function ProfilePreview(){
    return (
        <div className="flex w-80 lg:w-5/12 justify-center rounded-2xl bg-main-white border-2 border-main-grey-100 p-3 hover:border-main-green-500 hover:cursor-pointer">
            <img 
                src={require('../../assets/google-logo.png')} 
                className="w-14 rounded-full border"
            />
            <div className="flex justify-start flex-wrap my-auto mx-3">
                <p className="w-full text-base py-0.5">Ma Buddy Fred</p>
                <FontAwesomeIcon 
                    icon={faStar} 
                    className="text-amber-400 w-3 mr-1 my-auto"
                    aria-label="star icon associated with the reviews for this profile"
                />
                <p className="mx-1">4.5</p>
                <FontAwesomeIcon 
                    icon={faDollarSign} 
                    className="text-main-green-900 w-3 ml-1 my-auto"
                    aria-label="star icon associated with the reviews for this profile"
                />
                <FontAwesomeIcon 
                    icon={faDollarSign} 
                    className="text-main-green-900 w-3 my-auto"
                    aria-label="star icon associated with the reviews for this profile"
                />
                <FontAwesomeIcon 
                    icon={faDollarSign} 
                    className="text-main-grey-200 w-3 my-auto"
                    aria-label="star icon associated with the reviews for this profile"
                />
                <FontAwesomeIcon 
                    icon={faDollarSign} 
                    className="text-main-grey-200 w-3 mr-1 my-auto"
                    aria-label="star icon associated with the reviews for this profile"
                />
                <div className="bg-main-green-500 px-2 py-0.5 rounded-full mx-1">
                    <p className="text-sm text-main-white">Marathons</p>
                </div>
                <div className="bg-main-green-500 px-2 py-0.5 rounded-full mx-1">
                    <p className="text-sm text-main-white">Ultra</p>
                </div>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-main-grey-300 text-base my-auto ml-auto pr-2"/>
        </div>
    )
}