import React, { useState } from "react"
import CoachService from "../../components/general/coach-preview/CoachService"
import ReviewRatings from "../../components/general/coach-preview/ReviewRatings"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faHeart as hollowfaHeart} from "@fortawesome/free-regular-svg-icons"
import { faArrowLeftLong, faCirclePlus, faHeart, faStar } from "@fortawesome/free-solid-svg-icons"

export default function Coach(){
    const [isFavourite, setIsFavourite] = useState<boolean>(false)
    const [viewRatings, setViewRatings] = useState<boolean>(false)
    const dummyData = [{
        rating: 4.2,
        title: "good coach",
        description: "this is great stuff!"
    },
    {
        rating: 1.0,
        title: "good coach",
        description: "this is great stuff!"
    },
    {
        rating: 2.0,
        title: "good coach",
        description: "this is great stuff!"
    },
    {
        rating: 3.8,
        title: "good coach",
        description: "this is great stuff!"
    },
    {
        rating: 3.2,
        title: "good coach",
        description: "this is great stuff!"
    },
    {
        rating: 5.0,
        title: "good coach",
        description: "this is great stuff!"
    },
    {
        rating: 4.0,
        title: "good coach",
        description: "this is great stuff!"
    },
    {
        rating: 4.4,
        title: "good coach",
        description: "this is great stuff!"
    },
    {
        rating: 4.4,
        title: "good coach",
        description: "this is great stuff!"
    },
    {
         
        rating: 4.4,
        title: "good coach",
        description: "this is great stuff!"
    },
    
    {
        rating: 5.0,
        title: "good coach",
        description: "this is great stuff!"
    },
    
    ]
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    return (
        <div className="py-2 px-5 lg:px-20 text-main-green-900">
            <div className="flex justify-center mt-16">
                <Link to={'/auth/home-feed'} className="text-2xl mr-auto my-auto pl-2 hover:text-main-green-500">
                    <FontAwesomeIcon icon={faArrowLeftLong}/>
                </Link>
                <h1 className="font-source text-main-green-900 text-3xl m-auto">Tom Chant</h1>
                <FontAwesomeIcon 
                    icon={faArrowLeftLong} 
                    role="presentation" 
                    className="opacity-0 text-2xl ml-auto pr-2" 
                />
            </div>
            <div className="flex justify-center flex-wrap mt-14"> 
                <div className="relative">
                    <img src={require('../../assets/FB-logo.png')} className="w-32 lg:w-44 rounded-2xl"/>
                    {isFavourite ? 
                        <FontAwesomeIcon 
                            icon={faHeart} 
                            className="text-red-600 absolute top-3 right-4 text-2xl hover:cursor-pointer" 
                            onClick={()=>setIsFavourite(!isFavourite)} 
                        />
                    :
                        <FontAwesomeIcon 
                            icon={hollowfaHeart} 
                            className="text-white absolute top-3 right-4 text-2xl hover:cursor-pointer" 
                            onClick={()=>setIsFavourite(!isFavourite)} 
                        />
                    }
                </div>
                <div className="flex flex-col ml-8 font-kulim max-w-44 font-semibold truncate overflow-ellipsis leading-tight">
                    <p className="mt-0 mb-auto lg:mb-4 mr-auto text-lg max-w-44 font-semibold truncate overflow-ellipsis">Toronto, ON</p>
                    <p className="my-auto mr-auto text-lg max-w-44 font-semibold truncate overflow-ellipsis">5K, 10K, Running Programs</p>
                    <div 
                        className="flex justify-center mt-auto lg:mb-3 mb-0 mr-auto px-3 py-1 bg-main-green-500 rounded-full text-main-white w-fit hover:bg-main-green-800 hover:cursor-pointer"
                        onClick={()=>setViewRatings(!viewRatings)}
                    >
                        {viewRatings ?
                            <p>View Services</p>
                        :
                            <>
                                <FontAwesomeIcon icon={faStar} className="text-amber-300 text-base my-auto mr-2" />
                                <p>4.8 Ratings</p>
                            </>
                        }  
                    </div>
                    
                </div>
                <div className="border-b-4 border-main-green-900 text-lg pb-7 mt-10">
                    <p>Hi! I'm Tom and I love running! With over 10+ years of coaching experience I can help you 
                        out with your next big race.
                    </p>
                </div>
                <div className="w-full mt-10">
                    {viewRatings ?
                        <ReviewRatings reviews={dummyData} />
                    :
                    <>
                        <h2 className="underline text-2xl font-source mx-auto text-center font-medium mb-6">Services</h2>
                        <div className="flex py-4 px-6 bg-main-white shadow-lg border border-main-green-900 w-full rounded-xl hover:border-main-green-500 hover:cursor-pointer" onClick={()=>setIsModalOpen(true)}>
                            <div className="w-52 my-auto">
                                <h3 className="truncate overflow-ellipsis text-lg font-medium">Training Plan (5K, 10K, Marathons)</h3>
                                <p>See Price and More</p>
                            </div>
                            <FontAwesomeIcon icon={faCirclePlus} className="my-auto ml-auto text-main-green-500 text-2xl"/>
                        </div>
                    </>
                    }
                </div>
            </div>
            {isModalOpen? <CoachService exitView={setIsModalOpen}/> : <></>}
        </div>
    )
}