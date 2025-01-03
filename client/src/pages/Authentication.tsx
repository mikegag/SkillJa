import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import GetCSFR from "../hooks/GetCSFR";
import LoadingAnimation from "../components/general/LoadingAnimation";

export default function Authentication(){
    const navigate = useNavigate()
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SKILLJA_URL}/auth_status/`, { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }) 
            .then(res => {
                if (res.data.is_logged_in) {
                    setIsAuthenticated(true)
                } else {
                    console.error("User is not logged in")
                }
            })
            .catch(error => {
                console.error("Error checking authentication", error)
            })
            .finally(() => {
                // Set loading to false regardless of success or failure
                setLoading(false)
            })
    }, [])

    // Handle loading state and redirect if not authenticated
    if (loading) {
        return <div className="mt-40 lg:mt-64 flex flex-col justify-center items-center">
                <LoadingAnimation />
            </div>
    }

    if (!isAuthenticated) {
        navigate('/login')
        return null
    }

    return <Outlet />
}