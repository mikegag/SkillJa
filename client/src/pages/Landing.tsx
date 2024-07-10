import React, { useEffect, useState } from "react"
import data from "../data.json"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import Header from "../components/general/Header"
import GetWindowSize from "../hooks/GetWindowSize"
import CreateCSFR from "../hooks/CreateCSFR"
import HeroSection from "../components/general/landing-preview/HeroSection"
import SecondSection from "../components/general/landing-preview/SecondSection"
import ThirdSection from "../components/general/landing-preview/ThirdSection"
import FourthSection from "../components/general/landing-preview/FourthSection"
import Footer from "../components/general/Footer"


export default function Landing(){
    //creates and sets new CSFR Token in cookies
    const newToken = CreateCSFR({ name: "csrftoken" })
    const currentWindow = GetWindowSize()

    return (
        <>
            {currentWindow.width < 1024 ?
                <HeroSection view="mobile" />
            :
                <>
                    <HeroSection view="desktop" />
                    <div className="mt-44">
                        <SecondSection />
                    </div>
                    <div className="mt-44">
                        <ThirdSection />
                    </div>
                    <div className="mt-44">
                        <FourthSection />
                    </div>
                    <div className="mt-44 mb-10">
                        <Footer />
                    </div>
                </>
            }
        </>
    )
} 

