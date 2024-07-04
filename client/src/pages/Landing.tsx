import React, { useEffect, useState } from "react"
import Header from "../components/general/Header"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import axios from "axios"
import GetCSFR from '../hooks/GetCSFR'


export default function Landing(){
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    const csrftoken = GetCSFR({ name: "csrftoken" });
    useEffect(() => {
        if (!csrftoken) {
            fetchCsrfToken();
        } else {
            setCsrfToken(csrftoken);
        }
    }, [csrftoken]);

    const fetchCsrfToken = () => {
        axios.get('http://localhost:8000/csrf_token/')
            .then(res => {
                const token = res.data.csrfToken;
                if (token) {
                    setCsrfToken(token);
                    document.cookie = `csrftoken=${token}; path=/`;
                }
            })
            .catch(error => {
                console.error('Error fetching CSRF token:', error);
            });
    }

    return (
        <div className="h-dvh bg-main-color-white flex flex-col justify-start items-center px-2">
            <Header  useCase="default" />
            <h1 className="text-center text-main-green-700 font-medium text-4xl px-4 font-source">
                Athletic Performance Unleashed
                <span className="text-main-green-200 ml-1">.</span>
            </h1>
            <img 
                src={require('../assets/main-landing-racers.png')} 
                className="w-72 mt-6 mb-5 lg:w-80"
                alt="two runners kneeling down ready to race each other"
            />
            <form className="flex flex-col justify-center w-full mx-auto px-4 md:w-7/12 lg:w-4/12">   
                <div className="relative w-full">
                    <input
                        type="search"
                        id="default-search"
                        className="form-input before:outline-none active:outline-none"
                        placeholder="Find coaches near me..."
                    />
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="absolute inset-y-4 left-0 flex items-center pl-4 text-main-grey-500"
                    />
                </div>
            </form>
            <Link to={'/signup'} className="flex flex-col justify-center w-full mx-auto px-4 md:w-7/12 lg:w-4/12 mt-5 mb-9">
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
    )
} 

