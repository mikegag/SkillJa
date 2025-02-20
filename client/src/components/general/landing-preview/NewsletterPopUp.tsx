import React, { useEffect, useState } from "react"
import GetWindowSize from '../../../hooks/general/GetWindowSize'
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import GetCSFR from "../../../hooks/userAuthentication/GetCSFR"

interface Props {
    handleExit: (val:boolean)=>void;
}

export default function NewsletterPopUp({handleExit}:Props){
    const navigate = useNavigate()
    const windowSize = GetWindowSize()
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [userEmail, setUserEmail] = useState<string>("")
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false)
    const [imageLoaded, setImageLoaded] = useState<boolean>(false)
    const [showPopup, setShowPopup] = useState<boolean>(true);

    // Function to get a cookie value
    function getCookie(name: string): string | null {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) return cookieValue;
        }
        return null;
    }

    // Function to set a cookie
    function setCookie(name: string, value: string, days: number) {
        const expires = new Date();
        expires.setDate(expires.getDate() + days);
        document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
    }

    // Check if the user has visited the landing page before
    useEffect(() => {
        if (getCookie("newsletter_shown")) {
            // Hide popup if the cookie exists
            setShowPopup(false)
            return
        }
        // Set cookie for 30 days
        setCookie("newsletter_shown", "true", 1)
    }, [])

    // Check if the image is already cached
    useEffect(() => {
        const img = new Image()
        img.src = require('../../../assets/landingAssets/newsletter-image.jpg')
        // Image already cached
        if (img.complete) {
            setImageLoaded(true)
        } else {
            img.onload = () => setImageLoaded(true)
        }
    }, [])

    // API call to sign up user for newsletter
    function submitEmail(){
        if (!userEmail.trim()) {
            setErrorMessage("Please enter a valid email address.")
            return;
        }

        axios.post(`${process.env.REACT_APP_SKILLJA_URL}/newsletter/signup/`, { email: userEmail.trim() }, {
            headers: {
                "X-CSRFToken": csrfToken,
                "Content-Type": "application/json",
            },
            withCredentials: true,
        })
        .then((res) => {
            if (res.status === 201) {
                setSubmissionSuccess(true)
                setErrorMessage("")
            }
        })
        .catch((error) => {
            if (error.response) {
                if (error.response.status === 403) {
                    setErrorMessage("This email is already subscribed.")
                } else {
                    setErrorMessage("Something went wrong! Try again later.")
                }
            } else {
                setErrorMessage("Network error. Please try again later.")
            }
        })
    }
    // Do not render pop-up if the user has already seen it or image hasn't loaded
    if (!showPopup || !imageLoaded) return null

    return (
        <div className="pop-up-background">
            <div className="pop-up-container h-4/6 w-5/6 lg:w-4/6 p-0 flex flex-row">
                {windowSize.width >= 1024 &&
                    <img 
                        src={require('../../../assets/landingAssets/newsletter-image.jpg')} 
                        className={`${windowSize.width >= 1300 ? 'max-w-lg' : 'max-w-sm'} h-full object-cover`}
                        alt="athlete holding a tennis racket"
                    />
                }
                <section className="flex flex-col justify-center items-center p-5 font-kulim bg-main-cream">
                    <div className="flex w-full pt-2">
                        <img 
                            src={require('../../../assets/new-skillja-logo.png')} 
                            className="w-16 mr-auto my-auto"
                        />
                        <FontAwesomeIcon 
                            icon={faX} 
                            // set to false in order to hide newsletter
                            onClick={()=>handleExit(false)}
                            className="ml-auto text-main-grey-200 hover:text-main-green-500 cursor-pointer"
                            aria-label="exit newsletter"
                        />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-medium font-source mt-11 mb-2">Free Merchandise!</h3>
                    <p className="my-3 md:my-6 text-center px-1 text-sm md:text-lg">
                        Sign up for our newsletter and be entered to win official SkillJa merchandise to celebrate our launch on April 27, 2025!
                    </p>
                    {submissionSuccess ?
                        <p className="my-5 mx-auto text-center">Thanks for signing up!</p>
                    :
                    <>  
                        <input 
                            type="email" 
                            size={35} 
                            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                            className="form-input p-2.5 my-3 max-w-96 border-main-grey-100"
                            placeholder="Enter Email..."
                            onChange={(e)=>setUserEmail(e.target.value)}
                        />
                        {errorMessage && <p className="text-red-500 text-sm mx-auto text-center mb-4">{errorMessage}</p>}
                        <button 
                            className="form-btn px-6 py-2 mt-2 mb-4" 
                            aria-label="newsletter sign up submission"
                            onClick={()=>submitEmail()}
                        >
                                Continue
                        </button>
                    </>
                    }
                    <p className="text-main-grey-200 text-sm mt-auto mb-2 text-center">By signing up you agree to our 
                        <span onClick={()=>navigate('/terms-conditions')} className="underline hover:text-main-green-500 ml-1 cursor-pointer">
                            Privacy Policy
                        </span> & 
                        <span onClick={()=>navigate('/terms-conditions')} className="underline hover:text-main-green-500 ml-1 cursor-pointer">
                            Terms
                        </span>
                    </p>
                </section>
            </div>
        </div>
    )
}