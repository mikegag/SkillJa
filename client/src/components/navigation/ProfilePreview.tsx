import { faChevronRight, faDollarSign, faLocationDot, faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

interface ProfilePreviewProps {
    name: string;
    specializations: string[];
    location: string;
    rating: number;
    biography: string;
    experience: string;
    price: number;
}

export default function ProfilePreview(props:ProfilePreviewProps){
    const greenPriceSymbols = props.price
    const greyPriceSymbols = 4 - props.price

    return (
        <div className="flex mx-auto w-full lg:w-10/12 justify-center items-center rounded-2xl bg-main-white border-2 border-main-grey-100 px-2 py-4 hover:border-main-green-500 cursor-pointer">
            <img 
                src={require('../../assets/default-avatar.jpg')} 
                className="w-28 h-28 my-2 mx-5 rounded-full border"
            />
            <div className="flex justify-start flex-wrap my-auto ml-2 mr-auto">
                <h3 className="w-full text-2xl pb-2 font-source">{props.name}</h3>
                <div className="flex justify-center items-center text-sm my-0.5">
                    <FontAwesomeIcon icon={faLocationDot}/>
                    <p className="text-main-grey-300 ml-2">{props.location}</p>
                    <p className="text-main-grey-300 mx-3">|</p>
                    <p className="text-main-grey-300">{props.experience}</p>
                </div>
                <p className="w-full text-sm font-kulim my-2.5">{props.biography}</p>
                <FontAwesomeIcon 
                    icon={faStar} 
                    className="text-amber-300 w-4 my-auto"
                    aria-label="star icon associated with the reviews for this profile"
                />
                <p className="mx-1">{props.rating}</p>
                <div className="mx-1 flex">
                    {Array.from({ length: greenPriceSymbols }, (_, i) => (
                        <FontAwesomeIcon
                        key={`green-${i}`}
                        icon={faDollarSign}
                        className="text-main-green-900 w-2 my-auto"
                        aria-label="dollar icon indicating price"
                        />
                    ))}
                    {Array.from({ length: greyPriceSymbols }, (_, i) => (
                        <FontAwesomeIcon
                        key={`grey-${i}`}
                        icon={faDollarSign}
                        className="text-main-grey-200 w-2 my-auto"
                        aria-label="dollar icon indicating price"
                        />
                    ))}
                </div>
                {props.specializations.map((currSport:string, index:number)=>(
                    <div key={index} className="bg-main-green-500 px-2 my-auto rounded-full mx-1">
                        <p className="text-sm text-main-white">{currSport}</p>
                    </div>
                ))}
            </div>
            <div className="ml-auto mr-4 flex w-fit text-main-grey-300 hover:text-main-green-500">
                <p className=" text-base ml-auto font-kulim mr-0 w-24">View Profile</p>
                <FontAwesomeIcon icon={faChevronRight} className="text-base my-auto mx-2"/>
            </div>
        </div>
    )
}