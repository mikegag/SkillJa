import React, { useEffect, useState } from "react"
import data from "../data.json"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import Header from "../components/general/Header"
import GetWindowSize from "../hooks/GetWindowSize"
import CreateCSFR from "../hooks/CreateCSFR"
import HeroSection from "../components/general/landing-preview/HeroSection"


export default function Landing(){
    //creates and sets new CSFR Token in cookies
    const newToken = CreateCSFR({ name: "csrftoken" })
    const currentWindow = GetWindowSize()

    return (
        <>
            {currentWindow.width < 1024 ?
                <HeroSection view="mobile" />
            :
                <HeroSection view="desktop" />
            }
        </>
    )
} 

