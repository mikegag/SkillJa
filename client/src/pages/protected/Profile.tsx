import React, { useState } from "react"
import Header from "../../components/navigation/Header"
import GetWindowSize from '../../hooks/GetWindowSize'
import CurrentGoal from "../../components/general/athlete-preview/CurrentGoal"
import ReviewRatings from "../../components/general/coach-preview/ReviewRatings"
import { useNavigate, Link } from 'react-router-dom';
import { faGear, faLongArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Profile(){
    const [updateDetails, setUpdateDetails] = useState<boolean>(false)
    const windowSize = GetWindowSize()
    const navigate = useNavigate()

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <div className="flex flex-col">
            <Header useCase="protected" />
            <div className="pb-4 px-8 lg:px-14">
                <div className="flex justify-center text-center mt-10">
                    <FontAwesomeIcon 
                        icon={faLongArrowLeft}
                        onClick={()=>handleBack()} 
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
                            src={require('../../assets/google-logo.png')} 
                            className="w-32 h-32 rounded-2xl lg:mr-10"
                        />
                        <div className="flex flex-col justify-center items-center font-kulim text-main-green-900">
                            <h2 className="text-2xl font-medium font-source mt-3 lg:mt-0 mx-auto lg:ml-0">Tom Chant</h2>
                            <h3 className="text-lg my-1 mx-auto font-medium text-main-grey-300 lg:ml-0">Toronto, ON</h3>
                            <h3 className="text-lg my-1 mx-auto font-medium lg:ml-0">
                                <FontAwesomeIcon icon={faStar} className="text-amber-400 text-lg mr-2 lg:ml-0" />
                                4.9 Reviews
                            </h3>
                            <h3 className="text-lg mx-auto font-medium">Experience: Intermediate</h3>
                        </div>
                        <button className="py-2 px-4 lg:ml-32 bg-main-green-500 text-main-white font-kulim rounded-2xl hover:bg-main-green-700">
                            Edit Profile
                        </button>
                    </div>
                    <div className="w-full lg:mt-6 lg:px-20">
                        {windowSize.width >=1024 ? 
                            <h3 className="text-lg my-1 mr-auto font-medium">About Me</h3>
                        :
                            <></>
                        }
                        <p className="my-6 lg:my-3 text-center lg:text-start">
                            Hi! I'm Tom and I love running! With over 10+ years of coaching experience I can help you 
                            out with your next big race. Join me on my journey and let's get better together!
                        </p>
                    </div>
                </section>
                <section className="flex justify-center items-center flex-col lg:flex-row mt-8 mx-auto">
                    <div className="w-full lg:w-4/12 lg:mx-6 lg:mr-10">
                        <h2 className="text-2xl font-medium font-source mx-auto mb-4 text-center">
                            Current Goals
                        </h2>
                        <CurrentGoal goal="Run a 4 hour marathon!" />
                        <CurrentGoal goal="Improve my 5k time as my PB is currently 32 minutes" />
                    </div>
                    <div className="mt-12 lg:mt-0 w-full lg:w-4/12 lg:mx-6 lg:mr-10">
                        <h2 className="text-2xl font-medium font-source mx-auto mb-4 text-center">
                            Reviews and Testimonials
                        </h2>
                    </div>
                </section>
            </div>
        </div>
    )
}