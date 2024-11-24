import React, { useEffect, useState } from "react"
import Header from "../../components/navigation/Header"
import GetWindowSize from '../../hooks/GetWindowSize'
import CurrentGoal from "../../components/general/athlete-preview/CurrentGoal"
import SocialMediaIcons from "../../components/general/coach-preview/SocialMediaIcons"
import { useNavigate, Link } from 'react-router-dom'
import { faChevronRight, faGear, faLocationDot, faLongArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import GetCSFR from "../../hooks/GetCSFR"
import EditAthleteProfileForm from "../../components/general/athlete-preview/EditAthleteProfileForm"
import EditCoachProfileForm from "../../components/general/coach-preview/EditCoachProfileForm"
import EditCoachServiceForm from "../../components/general/coach-preview/EditCoachServiceForm"
import ReviewSlider from "../../components/general/coach-preview/ReviewSlider"
import CoachService from "../../components/general/coach-preview/CoachService"
import Footer from "../../components/navigation/Footer"

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
    name: string;
    email: string;
    iscoach: boolean;
    isathlete: boolean;
    profile: {
        location: string;
        biography: string;
        primary_sport: string;
        picture: string | null;
        reviews: Review[];
        rating: number;
        instagram?: string,
        facebook?: string,
        twitter?: string,
        tiktok?: string
    };
    preferences: {
        experience_level: string;
        goals?: string[];
        sport_interests?: string;
        age_groups?: string[];
        specialization?: string;
        services?: Service[];
    }
}

// Default values for Service
const defaultService: Service = {
    type: '',
    title: '',
    description: '',
    duration: '',
    frequency: '',
    target_audience: '',
    location: '',
    deliverable: '',
    price: 0
}

// Default values for profileDetails
const defaultProfileDetails: ProfileDetails = {
    name: 'Name',
    email: 'Email',
    iscoach: false,
    isathlete: false,
    profile: {
        location: 'Location',
        biography: 'Bio goes here...',
        primary_sport:'',
        picture: null,
        reviews: [],
        rating: 0,
        instagram: '',
        facebook: '',
        twitter: '',
        tiktok: ''
    },
    preferences: {
        experience_level: 'N/A',
        goals: [],
        sport_interests: '',
        age_groups: [],
        specialization: '',
        services:[],
    },
}

export default function Profile(){
    const [selectedService, setSelectedService] = useState<Service>(defaultService)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [profileDetails, setProfileDetails] = useState<ProfileDetails>(defaultProfileDetails)
    const windowSize = GetWindowSize()
    const navigate = useNavigate()
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const [readyToDisplayProfileForm, setReadyToDisplayProfileForm] = useState<boolean>(false)
    const [readyToDisplayServicesForm, setReadyToDisplayServicesForm] = useState<boolean>(false)

    // API call to get user profile details
    useEffect(()=>{
        document.title = "SkillJa - Profile"
        axios.get('https://www.skillja.ca/auth/profile/', { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }) 
            .then(res => {
                if (res.status === 200) {
                    setProfileDetails(res.data.user_profile)
                } else {
                    console.error("Failed to retrieve profile details")
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
    },[])

    return (
        <div className="flex flex-col">
            <Header useCase="protected" />
            <div className="pb-4 px-8 lg:px-14 lg:mb-32">
            {profileDetails.isathlete && readyToDisplayProfileForm? <EditAthleteProfileForm displayForm={setReadyToDisplayProfileForm} prevPrimarySport={profileDetails.profile.primary_sport} />:<></>}
            {profileDetails.iscoach && readyToDisplayProfileForm? <EditCoachProfileForm displayForm={setReadyToDisplayProfileForm} />:<></>}
            {profileDetails.iscoach && readyToDisplayServicesForm? <EditCoachServiceForm displayForm={setReadyToDisplayServicesForm}/>:<></>}
                <div className="flex justify-center text-center mt-10">
                    <FontAwesomeIcon 
                        icon={faLongArrowLeft}
                        onClick={()=>navigate(-1)} 
                        className="text-2xl my-auto mr-auto hover:text-main-green-500 cursor-pointer" 
                    />
                    <h1 className="font-source text-3xl pl-2 m-auto text-main-green-900">
                        Profile
                    </h1>
                    <Link 
                        to={'./settings'} 
                        className="text-2xl my-auto ml-auto hover:text-main-green-500 cursor-pointer"
                    >
                        <FontAwesomeIcon 
                            icon={faGear}
                        />
                    </Link>
                </div>
                <section className="flex flex-col justify-center items-center border-b-2 mt-8 lg:mt-14 border-main-grey-300 lg:pb-4">
                    <div className="flex flex-col justify-center items-center lg:flex-row">
                        <img 
                            src={require('../../assets/default-avatar.jpg')} 
                            className="w-32 h-32 lg:w-44 lg:h-44 rounded-2xl lg:mr-10"
                            alt="headshot of user demonstrating what they look like"
                        />
                        <div className="flex flex-col justify-center items-center font-kulim text-main-green-900">
                            <h2 className="text-2xl font-medium font-source mt-3 lg:mt-0 mx-auto lg:ml-0">
                                {profileDetails.name? profileDetails.name : 'Name' }
                            </h2>
                            <h3 className="text-lg my-1 mx-auto font-medium font-source text-main-grey-300 lg:ml-0">
                                <FontAwesomeIcon icon={faLocationDot} className="text-main-grey-300 text-lg lg:text-base mr-2 lg:ml-0" />
                                {profileDetails.profile.location? profileDetails.profile.location : 'Location' }
                            </h3>
                            <h3 className="text-lg lg:text-base my-1 mx-auto font-medium lg:ml-0">
                                <FontAwesomeIcon icon={faStar} className="text-amber-400 text-lg lg:text-base mr-2 lg:ml-0" />
                                {profileDetails.profile.rating ? profileDetails.profile.rating : 0 }
                            </h3>
                            <h3 className="text-lg lg:text-base my-1 lg:ml-0 font-medium">
                                Experience: {profileDetails.preferences.experience_level? profileDetails.preferences.experience_level.replace(/[\[\]\"\'']/g,'') : 'N/A' }
                            </h3>
                            <h3 className="py-2 px-4 rounded-xl mt-2 mx-auto bg-main-white border border-main-grey-100 cursor-pointer lg:ml-0">
                                {profileDetails.profile.primary_sport}
                            </h3>
                        </div>
                        {windowSize.width >= 1024 ?
                            <div className="flex flex-col justify-center items-center w-96 pl-16">
                                <button 
                                    className="py-2 px-4 mt-6 w-80 lg:w-fit lg:mt-0 bg-main-green-500 text-main-white font-kulim rounded-xl hover:bg-main-green-700"
                                    onClick={()=>setReadyToDisplayProfileForm(true)}
                                >
                                    Edit Profile
                                </button>
                                {profileDetails.iscoach? 
                                <div className="flex flex-col justify-center items-center">
                                    <button 
                                        className="py-2 px-4 mt-3 mb-3 w-full lg:w-fit bg-main-green-500 text-main-white font-kulim rounded-xl hover:bg-main-green-700"
                                        onClick={()=>setReadyToDisplayServicesForm(true)}
                                    >
                                        Edit Services
                                    </button>
                                    <SocialMediaIcons 
                                        instagram={profileDetails.profile.instagram!}
                                        facebook={profileDetails.profile.facebook!}
                                        twitter={profileDetails.profile.twitter!}
                                        tiktok={profileDetails.profile.tiktok!}
                                    />
                                </div>
                                :
                                <></>
                                }
                            </div>
                        :
                            <></>
                        }
                    </div>
                    <div className="w-full lg:mt-8 lg:px-20">
                        {windowSize.width >=1024 ? 
                            <h3 className="text-lg my-1 mr-auto font-medium">About Me</h3>
                        :
                            <></>
                        }
                        <p className="my-6 lg:my-3 text-center lg:text-start">
                            {profileDetails.profile.biography? profileDetails.profile.biography : 'Bio goes here...' }
                        </p>
                    </div>
                    {windowSize.width <= 1024 ?
                        <div className="flex flex-col mb-3">
                            <button 
                                className="py-2 px-4 w-80 lg:w-fit lg:mt-0 lg:ml-44 bg-main-green-500 text-main-white font-kulim rounded-xl hover:bg-main-green-700"
                                onClick={()=>setReadyToDisplayProfileForm(true)}
                            >
                                Edit Profile
                            </button>
                            {profileDetails.iscoach? 
                                <>
                                    <button 
                                        className="py-2 px-4 mt-3 mb-3 w-full lg:w-fit lg:ml-44 bg-main-green-500 text-main-white font-kulim rounded-xl hover:bg-main-green-700"
                                        onClick={()=>setReadyToDisplayServicesForm(true)}
                                    >
                                        Edit Services
                                    </button>
                                    <SocialMediaIcons 
                                        instagram={profileDetails.profile.instagram!}
                                        facebook={profileDetails.profile.facebook!}
                                        twitter={profileDetails.profile.twitter!}
                                        tiktok={profileDetails.profile.tiktok!}
                                    />
                                </>
                            :
                                <></>
                            }
                        </div>
                    :
                        <></>
                    }
                </section>

                <section className="flex justify-center items-center flex-col lg:flex-row lg:items-start my-8 mx-auto">
                    <div className="flex flex-col justify-center w-full lg:w-5/12 lg:mx-6 lg:mr-10">
                    {profileDetails.isathlete?
                        <>
                            <h2 className="text-2xl font-medium font-source mx-auto mb-4 text-center">
                                Current Goals
                            </h2>
                            {profileDetails.preferences.goals!.length > 0 ?
                                <>
                                    {profileDetails.preferences.goals!.map((currGoal, index) => (
                                        <CurrentGoal key={index} goal={currGoal} />
                                    ))}
                                </>
                            :
                                <p>No goals to display</p>
                            }
                        </>
                    :
                        <>
                            <h2 className="text-2xl font-medium font-source mx-auto mb-6 text-center">
                                Sessions and Packages
                            </h2>
                            {profileDetails.preferences.services!.length > 0 ?
                                <>
                                    {profileDetails.preferences.services!.map((currService, index) => (
                                    <div
                                        className="flex rounded-2xl py-2 px-5 mb-4 bg-main-white border border-main-grey-100 cursor-pointer hover:border-main-green-500 hover:shadow-md"
                                        onClick={()=>{
                                            setIsModalOpen(true)
                                            setSelectedService(currService)
                                        }}
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
                                    ))}
                                </>
                            :
                                <p className="mx-auto">No sessions are currently available</p>
                            }
                        </>
                    }
                    </div>
                    <div className="flex flex-col justify-center mt-12 lg:mt-0 w-full lg:w-5/12 lg:mx-6 lg:mr-10">
                        <h2 className="text-2xl font-medium font-source mx-auto mb-6 text-center">
                            Reviews and Testimonials
                        </h2>
                        {profileDetails.profile.reviews?.length > 0 ?
                            <ReviewSlider data={profileDetails.profile.reviews}/>   
                        :
                            <p className="mx-auto">No reviews available</p>    
                        }
                    </div>
                </section>
            </div>
            {isModalOpen? <CoachService data={selectedService} exitView={setIsModalOpen}/> : <></>}
            <Footer />
        </div>
    )
}