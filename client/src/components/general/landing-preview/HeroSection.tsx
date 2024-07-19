import React, { useEffect, useState } from "react"
import data from "../../../data.json"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import Header from "../../navigation/Header"
import SliderPreview from "./SliderPreview"

interface ViewProps {
    view: 'mobile' | 'desktop'
}

export default function HeroSection({view}:ViewProps){
    return (
        <>
        {view === 'mobile' ?
            <div className="h-dvh bg-main-cream flex flex-col justify-start items-center px-2">
                <Header useCase="default" />
                <h1 className="text-center text-main-green-700 font-medium text-4xl px-4 font-source">
                    {data.landing.hero.title} (under construction..)
                </h1>
                <img 
                    src={require('../../../assets/landingAssets/main-landing-racers.png')} 
                    className="w-64 mt-6 mb-5 lg:w-80"
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
                <Link 
                    to={'/signup'} 
                    className="flex flex-col justify-center w-full mx-auto px-4 md:w-7/12 lg:w-4/12 mt-5 mb-9"
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
            <div className="bg-main-cream flex flex-col justify-start items-center px-2">
                <Header useCase="default" />
                <h1 className="text-center text-main-green-700 font-medium text-4xl px-4 font-source">
                    {data.landing.hero.title}
                </h1>
                <form className="flex flex-col justify-center w-full mx-auto mt-8 px-4 md:w-7/12 lg:w-4/12">   
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

