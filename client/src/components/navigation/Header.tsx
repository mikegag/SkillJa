import React, { useEffect, useState } from "react"
import HamburgerMenu from "./HamburgerMenu"
import { Link } from "react-router-dom"
import axios from "axios"
import GetCSFR from "../../hooks/GetCSFR"

interface HeaderProps {
    useCase?: "default" | "protected" | "onboarding";
    url?: string;
}

export default function Header({ useCase: initialUseCase, url}: HeaderProps) {
    const [useCase, setUseCase] = useState(initialUseCase || "default")
    const csrfToken = GetCSFR({ name: "csrftoken" })

    // Check if session cookie exists
    function checkSessionCookie() {
        return document.cookie.split("; ").some((cookie) => cookie.startsWith("sessionid="))
    }

    // Check if the current time is a multiple of 20 minutes
    function isCurrentTimeMultipleOf20Minutes() {
        const now = new Date()
        const minutes = now.getMinutes()
        return minutes % 10 === 0
    }

    useEffect(() => {
        // If no useCase is passed and session Id exists, then check authentication status every 10 minutes
        if (!initialUseCase || useCase==='default' && (checkSessionCookie() || isCurrentTimeMultipleOf20Minutes())) {
            axios.get(`${process.env.REACT_APP_SKILLJA_URL}/auth_status/`, {
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                })
                .then((res) => {
                    if (res.data.is_logged_in === true) {
                        setUseCase("protected")
                    } else {
                        setUseCase("default")
                    }
                })
                .catch((error) => {
                    console.error("Error checking authentication", error)
                })
        }
    }, [])

    return (
        <>
            {useCase && useCase === "default" ? (
                <div className="w-full flex items-center px-4 pt-6 pb-4 mb-8 lg:px-14">
                    <Link to="/" className="mr-auto ml-0 my-auto">
                        <img
                            src={require("../../assets/new-skillja-logo.png")}
                            className="w-16 lg:w-20"
                            alt="SkillJa logo"
                        />
                    </Link>
                    <HamburgerMenu useCase="public" />
                </div>
            ) : useCase && useCase === "protected" ? (
                <div className="w-full flex items-center px-4 pt-6 pb-4 mb-8 lg:px-14">
                    <Link to="/home-feed" className="mr-auto ml-0 my-auto">
                        <img
                            src={require("../../assets/new-skillja-logo.png")}
                            className="w-16 lg:w-20"
                            alt="SkillJa logo"
                        />
                    </Link>
                    <HamburgerMenu useCase="authorized" url={url} />
                </div>
            ) : (
                <div className="w-full flex items-center px-4 pt-6 pb-4 mb-8 lg:px-14">
                    <img
                        src={require("../../assets/new-skillja-logo.png")}
                        className="w-16 mr-auto cursor-not-allowed ml-0 my-auto lg:w-16"
                        alt="SkillJa logo"
                    />
                </div>
            )}
        </>
    );
}
