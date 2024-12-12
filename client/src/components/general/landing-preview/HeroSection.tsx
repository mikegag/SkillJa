import React, { useEffect, useState } from "react"
import data from "../../../data.json"
import { Link } from "react-router-dom"
import Header from "../../navigation/Header"
import SliderPreview from "./SliderPreview"
import SearchBar from "../../navigation/SearchBar"
import axios from "axios"
import GetCSFR from "../../../hooks/GetCSFR"

interface ViewProps {
    view: 'mobile' | 'desktop'
}

export default function HeroSection({view}:ViewProps){
    const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const csrfToken = GetCSFR({ name: "csrftoken" })
    
    useEffect(()=>{
        const timer = setTimeout(() => {
            if(document.readyState === "complete"){
                setIsPageLoaded(true)
            }
        }, 700)

        // checks if user is currently logged in, determines if viewing coach profiles is allowed or not
        axios.get('/auth_status/', {
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            if (res.status === 200) {
                setIsLoggedIn(res.data.is_logged_in)
            } else {
                console.error("Failed to verify authentication")
            }
        })
        .catch(error => {
            console.error("Error checking authentication", error)
        })
        return () => clearTimeout(timer)
    },[])

    return (
        <>
        {view === 'mobile' ?
            <div className={`h-dvh bg-main-cream flex flex-col justify-start items-center px-2 transition-opacity duration-1000 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {isLoggedIn === false ? <Header useCase="default"/> : <Header useCase="protected"/>}
                <h1 className="text-center text-main-green-900 font-medium text-4xl px-4 font-source">
                    {data.landing.hero.title}
                </h1>
                <img 
                    src={require('../../../assets/landingAssets/main-landing-racers.png')} 
                    className="w-64 mt-6 mb-5 lg:w-80"
                    alt="two runners kneeling down ready to race each other"
                />
                <SearchBar mobileView={true} />
                <Link 
                    to={'/signup'} 
                    className="flex flex-col justify-center mx-auto w-80 md:w-6/12 mt-5 mb-9"
                >
                    <button 
                        className="form-btn"
                        aria-label="create an account button that redirects to sign up page"
                        >
                            Create an Account
                    </button>
                </Link>
                <p className="text-main-grey-300 font-source">
                    Already have an account? 
                    <Link to={'/login'}>
                        <span className="underline text-main-green-700 ml-2">Login Here</span>
                    </Link>
                </p>
            </div>
        :
            <div className={`bg-main-cream flex flex-col justify-start items-center px-2 transition-opacity duration-1000 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {isLoggedIn === false ? <Header useCase="default"/> : <Header useCase="protected"/>}
                <h1 className="text-center text-main-green-900 font-medium text-4xl px-4 font-source mb-1">
                    {data.landing.hero.title.slice(0,-1)},
                </h1>
                <h1 className="text-center text-main-green-900 font-medium text-4xl px-4 font-source">
                    Anytime, Anywhere.
                </h1>
                <SearchBar mobileView={false} />
                <img 
                    src={require('../../../assets/landingAssets/main-landing-racers.png')} 
                    className="w-80 mt-6 mb-5"
                    alt="two runners kneeling down ready to race each other"
                />
                <SliderPreview />
            </div>
        }
        </> 
    )
} 

