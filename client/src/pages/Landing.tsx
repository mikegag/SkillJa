import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Link } from "react-router-dom"


export default function Landing(){
    return (
        <div className="h-dvh bg-main-color-white flex flex-col justify-center items-center p-2">
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
                <div className="relative w-max">
                    <input
                        type="search"
                        id="default-search"
                        className="rounded-2xl w-72 py-3 px-10 pl-12 bg-white text-main-grey-300 font-kulim border-main-grey-400 border-solid border"
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
                    className="bg-main-green-500 text-lg font-semibold text-main-cream font-kulim px-16 py-3 rounded-2xl w-72"
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