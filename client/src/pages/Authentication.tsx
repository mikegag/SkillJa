import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import GetCSFR from "../hooks/GetCSFR";

export default function Authentication(){
    const navigate = useNavigate()
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

    useEffect(()=> {
        axios.get('https://www.skillja.ca/auth_status/', { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }) 
            .then(res => {
                if (res.data.is_logged_in === true) {
                    setIsAuthenticated(true)
                } else {
                    console.error("Failed to retrieve services")
                }
            })
            .catch(error => {
                if (error.response) {
                    // the server responded with a status code that falls out of the range of 2xx
                    console.error('Error response:', error.response.data)
                    console.error('Status:', error.response.status)
                    console.error('Headers:', error.response.headers)
                } else if (error.request) {
                    // no response was received
                    console.error('No response received:', error.request)
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error setting up request:', error.message)
                }
                console.error('Error config:', error.config)
            })
    },[csrfToken])

    return (
        <>
            {isAuthenticated ? <Outlet /> : navigate('/login') } 
        </>
    )
}