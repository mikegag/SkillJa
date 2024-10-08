import React, { useEffect } from "react"
import GetWindowSize from "../hooks/GetWindowSize"
import CreateCSFR from "../hooks/CreateCSFR"
import HeroSection from "../components/general/landing-preview/HeroSection"
import SecondSection from "../components/general/landing-preview/SecondSection"
import ThirdSection from "../components/general/landing-preview/ThirdSection"
import FourthSection from "../components/general/landing-preview/FourthSection"
import Footer from "../components/navigation/Footer"

export default function Landing(){
    //creates and sets new CSFR Token in cookies
    const newToken = CreateCSFR({ name: "csrftoken" })
    const currentWindow = GetWindowSize()

    useEffect(() => {
        document.title = "SkillJa | Find Sport Coaches and Instructors"
    }, [])

    return (
        <>
            {currentWindow.width < 1024 ?
                <>
                    <HeroSection view="mobile" />
                    <div className="mt-16 mb-12">
                        <Footer />
                    </div>
                </>
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

