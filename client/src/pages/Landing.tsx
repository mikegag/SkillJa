import React from "react"
import Header from "../components/general/Header"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"


export default function Landing(){
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
            <form className="mx-auto w-72">   
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
            <Link to={'/signup'} className="mt-5 mb-9">
                <button 
                    className="form-btn w-full mx-auto"
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