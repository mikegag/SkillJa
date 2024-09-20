import React, { useEffect, useState } from "react"
import CoachService from "../../components/general/coach-preview/CoachService"
import { useNavigate, useSearchParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faGear, faLocationDot, faLongArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons"
import Header from "../../components/navigation/Header"
import GetWindowSize from "../../hooks/GetWindowSize"
import axios from "axios"
import GetCSFR from "../../hooks/GetCSFR"
import ReviewSlider from "../../components/general/coach-preview/ReviewSlider"

interface Review {
    id: number;
    title: string;
    description: string;
    rating: string;
    date: string;
}

interface Service {
    type: string;
    title: string;
    description: string;
    duration: string;
    frequency?: string;
    target_audience?: string;
    location?: string;
    deliverable?: string;
    price: number;
}
  
interface ProfileDetails {
    fullname: string;
    location: string;
    biography: string;
    reviews: Review[];
    experience_level: string;
    specialization?: string;
    services: Service[];
    rating: number;
}

// Default values for profileDetails
const defaultProfileDetails: ProfileDetails = {
    fullname: '',
    location: '',
    biography: '',
    reviews: [],
    experience_level: '',
    specialization: '',
    services: [],
    rating: 0
}

export default function Coach(){
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [profileDetails, setProfileDetails] = useState<ProfileDetails>(defaultProfileDetails)
    const windowSize = GetWindowSize()
    const navigate = useNavigate()
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const [queryParameters] = useSearchParams()

    // API call to get coach details
    useEffect(()=>{
        document.title = "SkillJa - Coach Profile"
        axios.get(`https://www.skillja.ca/auth/coach?id=${queryParameters.get("id")}`, { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }) 
            .then(res => {
                if (res.status === 200) {
                    setProfileDetails(res.data)
                } else {
                    console.error("Failed to retrieve coach details")
                }
            })
            .catch(error => {
                if (error.response) {
                    // the server responded with a status code that falls out of the range of 2xx
                    console.error('Error response:', error.response.data)
                    console.error('Status:', error.response.status)
                    console.error('Headers:', error.response.headers)
                } else if (error.request) {
                    // no response was received
                    console.error('No response received:', error.request)
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error setting up request:', error.message)
                }
                console.error('Error config:', error.config)
            })
    },[profileDetails])

    return (
        <div className="flex flex-col">
            <Header useCase="protected" />
            <div className="pb-4 px-8 lg:px-14">
                <div className="flex justify-center items-center text-center mt-10">
                    <FontAwesomeIcon 
                        icon={faLongArrowLeft}
                        onClick={()=>navigate(-1)} 
                        className="text-2xl my-auto mr-auto ml-0 hover:text-main-green-500 cursor-pointer" 
                    />
                    <h1 className="font-source text-center text-3xl pr-4 my-auto mr-auto text-main-green-900">
                        Profile
                    </h1>
                </div>
                <section className="flex flex-col justify-center items-center border-b-2 mt-8 lg:mt-14 border-main-grey-300 lg:pb-4">
                    <div className="flex flex-col justify-center items-center lg:flex-row">
                        <img 
                            src={require('../../assets/default-avatar.jpg')} 
                            className="w-32 h-32 rounded-2xl lg:mr-10"
                        />
                        <div className="flex flex-col justify-center items-center font-kulim text-main-green-900">
                            <h2 className="text-2xl font-medium font-source mt-3 lg:mt-0 mx-auto lg:ml-0">
                                {profileDetails.fullname? profileDetails.fullname : 'Name' }
                            </h2>
                            <h3 className="text-lg my-1 mx-auto font-medium font-source text-main-grey-300 lg:ml-0">
                                <FontAwesomeIcon icon={faLocationDot} className="text-main-grey-300 text-lg lg:text-base mr-2 lg:ml-0" />
                                {profileDetails.location? profileDetails.location : 'Location' }
                            </h3>
                            <h3 className="text-lg lg:text-base my-1 mx-auto font-medium lg:ml-0">
                                <FontAwesomeIcon icon={faStar} className="text-amber-400 text-lg lg:text-base mr-2 lg:ml-0" />
                                {profileDetails.rating ? profileDetails.rating : 0 }
                            </h3>
                            <h3 className="text-lg lg:text-base mx-auto font-medium">
                                Experience: {profileDetails.experience_level? profileDetails.experience_level : 'N/A' }
                            </h3>
                        </div>
                    </div>
                    <div className="w-full lg:mt-6 lg:px-20">
                        {windowSize.width >=1024 ? 
                            <h3 className="text-lg my-1 mr-auto font-medium">About Me</h3>
                        :
                            <></>
                        }
                        <p className="my-6 lg:my-3 text-center lg:text-start">
                            {profileDetails.biography? profileDetails.biography : 'Bio goes here...' }
                        </p>
                    </div>
                </section>

                <section className="flex justify-center items-center flex-col lg:flex-row lg:items-start mt-8 mb-12 mx-auto">
                    <div className="flex flex-col justify-center w-full lg:w-5/12 lg:mx-6 lg:mr-10">
                        <h2 className="text-2xl font-medium font-source mx-auto mb-6 text-center">
                            Sessions and Packages
                        </h2>
                        {profileDetails.services.length > 0 ?
                        <>
                            {profileDetails.services.forEach((currService, index) => {
                            <div
                                className="flex rounded-2xl py-2 px-5 bg-main-white border border-main-grey-100 cursor-pointer hover:border-main-green-500 hover:shadow-md"
                                onClick={()=>setIsModalOpen(true)}
                                key={index}
                            >
                                <div className="flex flex-col justify-start items-start font-kulim">
                                    <h3 className="my-1 mr-auto">
                                        {currService.title}
                                    </h3>
                                    <p className="text-sm my-1 mr-auto">
                                        See Price and Details
                                    </p>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} className="text-main-grey-300 ml-auto my-auto" />
                            </div>
                            })}
                        </>
                        :
                            <p className="mx-auto">No sessions are currently available</p>
                        }
                    </div>
                    <div className="flex flex-col justify-center mt-12 lg:mt-0 w-full lg:w-5/12 lg:mx-6 lg:mr-10">
                        <h2 className="text-2xl font-medium font-source mx-auto mb-6 text-center">
                            Reviews and Testimonials
                        </h2>
                        {profileDetails.reviews?.length > 0 ?
                            <ReviewSlider data={profileDetails.reviews}/>   
                        :
                            <p className="mx-auto">No reviews available</p>    
                        }
                    </div>
                </section>
            </div>
            {isModalOpen? <CoachService exitView={setIsModalOpen}/> : <></>}
        </div>
    )
}