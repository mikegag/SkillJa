import React, { useEffect, useState } from "react"
import CoachService from "../../components/general/coach-preview/CoachService"
import { useNavigate, useSearchParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faLocationDot, faLongArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons"
import Header from "../../components/navigation/Header"
import Footer from "../../components/navigation/Footer"
import GetWindowSize from "../../hooks/general/GetWindowSize"
import axios from "axios"
import GetCSFR from "../../hooks/userAuthentication/GetCSFR"
import ReviewSlider from "../../components/general/coach-preview/ReviewSlider"
import SocialMediaIcons from "../../components/general/coach-preview/SocialMediaIcons"
import RetrieveImage from "../../hooks/images/RetrieveImage"
import { UserContext } from "../../hooks/images/RetrieveImageContext"
import ContactCoachForm from "../../components/general/coach-preview/ContactCoachForm"
import LoadingAnimation from "../../components/general/LoadingAnimation"

interface Review {
    id: number;
    title: string;
    description: string;
    rating: string;
    date: string;
}

interface Service {
    id: number;
    type: string;
    title: string;
    description: string;
    duration: string;
    frequency?: string;
    target_audience?: string;
    session_length?: number;
    location?: string;
    deliverable?: string;
    price: number;
} 
  
interface ProfileDetails {
    userId: string;
    fullname: string;
    profile: {
        location: string;
        biography: string;
        primarySport: string;
        picture: string | null;
        reviews: Review[];
        services: Service[];
        rating: number;
        socialMedia: {
            instagram: string,
            facebook: string,
            twitter: string,
            tiktok: string
        }
    };
    preferences: {
        experience_level: string;
        specialization: string[];
    }
}

export default function Coach(){
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [profileDetails, setProfileDetails] = useState<ProfileDetails>({
        userId: '',
        fullname: '',
        profile: {
            location: '',
            biography: '',
            primarySport: '',
            picture: '',
            reviews: [],
            services: [],
            rating: 0,
            socialMedia: {
                instagram: '',
                facebook: '',
                twitter: '',
                tiktok: ''
            }
        },
        preferences: {
            experience_level: '',
            specialization: []
        }
    })
    const [selectedService, setSelectedService] = useState<Service>()
    const windowSize = GetWindowSize()
    const navigate = useNavigate()
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const [queryParameters] = useSearchParams()
    const [userEmail, setUserEmail] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)

    // API call to get coach details and user email
    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_SKILLJA_URL}/auth/coach?coach_id=${queryParameters.get("coach_id")}`, { 
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
        .catch(error => {console.error(error)})

        axios.get(`${process.env.REACT_APP_SKILLJA_URL}/get_user_email/`, { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }) 
        .then(res => {
            if (res.status === 200) {
                setUserEmail(res.data.user_email)
            } else {
                console.error("Failed to retrieve user email")
            }
        })
        .catch(error => {console.error(error)})
        .finally(()=>setLoading(false))
    },[])

    // Update document title with Coach Profile name
    useEffect(()=>{
        document.title = `SkillJa - ${profileDetails.fullname}'s Profile`
    },[profileDetails])

    return (
        <div className="flex flex-col">
            { (userEmail) && ( 
                <UserContext.Provider value={{imageName:userEmail, cache:true}}>
                    <Header useCase="protected" /> 
                </UserContext.Provider>
            )}
            {loading ?
                <div className="mt-32 mb-44">
                    <LoadingAnimation />
                </div>
            :
                <div className={`pb-4 px-8 lg:px-32 lg:mb-32 ${loading ? 'opacity-0':'opacity-100'}`}>
                    <div className="flex justify-center items-center text-center mt-10">
                        <FontAwesomeIcon 
                            icon={faLongArrowLeft}
                            onClick={()=>navigate(-1)} 
                            className="text-3xl my-auto mr-auto ml-0 hover:text-main-green-500 cursor-pointer" 
                        />
                        <h1 className="font-source text-center text-3xl my-auto mx-auto text-main-green-900">
                            Profile
                        </h1>
                        <p className="w-6 ml-auto mr-0"></p>
                    </div>
                    <section className="flex flex-col justify-center items-center border-b-2 mt-8 lg:mt-20 border-main-grey-300 lg:pb-4 ">
                        <div className="flex flex-col justify-center items-center w-full lg:flex-row">
                            {!profileDetails.userId && (
                                <img src={require('../../assets/default-avatar.jpg')} className="w-32 h-32 lg:w-44 lg:h-44 rounded-2xl lg:mr-10 lg:ml-0" />
                            )}
                            {profileDetails.userId && (
                                <RetrieveImage id={profileDetails.userId!} styling="w-32 h-32 lg:w-44 lg:h-44 rounded-2xl lg:mr-10 lg:ml-0" />
                            )}
                            <div className="flex flex-col justify-center font-kulim text-main-green-900 items-center ">
                                <h3 className="text-2xl mt-3 lg:mt-0 lg:mb-0.5 mx-auto font-kulim lg:ml-0">
                                    {profileDetails.fullname || "Loading..."}
                                </h3>
                                <h3 className="text-lg my-1 mx-auto font-medium font-kulim text-main-grey-300 lg:ml-0">
                                    <FontAwesomeIcon icon={faLocationDot} className="text-main-grey-300 text-lg lg:text-base mr-2 lg:ml-0" />
                                    {profileDetails.profile?.location || "Location not provided"}
                                </h3>
                                <h3 className="text-lg lg:text-base my-1 mx-auto font-medium lg:ml-0">
                                    <FontAwesomeIcon icon={faStar} className="text-amber-400 text-lg lg:text-base mr-2 lg:ml-0" />
                                    {profileDetails.profile?.rating}
                                </h3>
                                <h3 className="text-lg lg:text-base my-1 lg:ml-0 font-medium">
                                    Experience: {profileDetails.preferences?.experience_level || "Not provided"}
                                </h3>
                                <h3 className="py-1.5 px-4 rounded-xl mt-2 mx-auto bg-main-white border border-main-grey-100 cursor-pointer lg:ml-0">
                                    {profileDetails.profile?.primarySport || "No Primary Sport"}
                                </h3> 
                            </div>
                            <div className="flex flex-col justify-center items-center w-96 lg:ml-28">
                                <ContactCoachForm csrftoken={csrfToken!} coachId={queryParameters.get("coach_id")!}/>
                                <SocialMediaIcons 
                                    instagram={profileDetails.profile?.socialMedia.instagram}
                                    facebook={profileDetails.profile?.socialMedia.facebook}
                                    twitter={profileDetails.profile?.socialMedia.twitter}
                                    tiktok={profileDetails.profile?.socialMedia.tiktok}
                                /> 
                            </div>
                        </div>
                        <div className="w-full lg:mt-8 lg:px-12">
                            {windowSize.width >=1024 ? 
                                <h3 className="text-lg my-1 mr-auto font-medium font-source">About Me:</h3>
                            :
                                <></>
                            }
                            <p className="my-6 lg:my-3 text-center lg:text-start font-kulim">
                                {profileDetails.profile?.biography || "Biography not provided."}
                            </p>
                        </div>
                    </section>
                    <section className="flex justify-center items-center flex-col lg:flex-row lg:items-start my-8 mx-auto lg:pt-6">
                        <div className="flex flex-col justify-center w-full lg:w-5/12 lg:mr-auto">
                            <h2 className="text-2xl font-medium font-source mx-auto mb-6 text-center">
                                Sessions and Packages
                            </h2>
                            {profileDetails.profile?.services?.length > 0 ?
                                <>
                                    {profileDetails.profile.services.map((currService, index) => (
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
                                <p className="mx-auto font-kulim">No sessions are currently available</p>
                            }
                        </div>
                        <div className="flex flex-col justify-center mt-12 lg:mt-0 w-full lg:w-5/12 lg:ml-auto">
                            <h2 className="text-2xl font-medium font-source mx-auto mb-6 text-center">
                                Reviews and Testimonials
                            </h2>
                            {profileDetails.profile?.reviews?.length > 0 ?
                                <ReviewSlider data={profileDetails.profile.reviews}/>   
                            :
                                <p className="mx-auto font-kulim">No reviews available</p>    
                            }
                        </div>
                    </section>
                </div>
            }
            {isModalOpen? <CoachService data={selectedService!} exitView={setIsModalOpen}/> : <></>}
            <Footer />
        </div>
    )
}