import React from "react"
import { Link } from "react-router-dom"

export default function Landing(){
    return (
        <div className="h-dvh bg-main-color-white flex flex-col justify-center items-center">
            <h1 className="text-center text-main-color-darkgreen font-medium text-4xl px-4 font-source">
                Athletic Performance Unleashed
                <span className="text-main-color-gold ml-1">.</span>
            </h1>
            <img 
                src={require('../assets/dudes-ready-to-race.png')} 
                className="w-72 pl-2 mt-6 mb-5"
                alt="two men kneeling down ready to race each other"
            />
            <form className="mx-auto">   
                <input 
                    type="search" 
                    id="default-search" 
                    className="rounded-3xl py-3 px-12 bg-white text-slate-500 font-kulim border-main-color-darkgreen border-solid border" 
                    placeholder="Find coaches near me..."
                    size={21} 
                />
            </form>
            <Link to={'/signup'}>
                <button 
                    className="bg-main-color-darkgreen text-lg font-medium text-main-color-white font-kulim px-16 py-3 rounded-3xl mt-5 mb-9"
                    aria-label="create an account button that redirects to sign up page"
                    >
                        Create an Account
                </button>
            </Link>
            <p className="text-gray-400 font-source">Already have an account? <span className="underline text-main-color-darkgreen">Login Here</span></p>
        </div>
    )
} 