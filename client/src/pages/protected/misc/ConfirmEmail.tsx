import React, { useEffect, useState } from "react"
import axios from "axios"
import Header from "../../../components/navigation/Header"
import { useNavigate, useSearchParams } from "react-router-dom"
import GetCSFR from "../../../hooks/GetCSFR"
import LoadingAnimation from "../../../components/general/LoadingAnimation"

export default function ConfirmEmail(){
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const [queryParameters] = useSearchParams()
    const [displayMessage, setDisplayMessage] = useState("Thank you for confirming your Email!")

    useEffect(()=>{
        document.title = "Confirm Email"
        const token = queryParameters.get("token"); // Get the token from URL

        if (!token) {
            setDisplayMessage("Error! Please try again and ensure the link is valid.")
            setIsLoading(false)
            return
        }

        axios.post('https://www.skillja.ca/email/confirm_email/', {token}, { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
            .then(res => {
                if (res.status !== 200) {
                    setDisplayMessage("Error! Please try again.")
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
            .finally(()=>{
                setIsLoading(false)
            })
    },[])
    return (
        <div className="flex flex-col">
            <Header useCase="onboarding" />
            <section className="pt-40">
                {isLoading ?
                    <LoadingAnimation />
                :
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-lg font-semibold">
                            {displayMessage}
                        </p>
                        <button
                            onClick={()=>navigate('/')}
                            className="form-btn mt-10 px-6"
                            aria-label="redirects to landing page"
                        >
                            Explore Coaches
                        </button>
                    </div>
                }
            </section>
        </div>
    )
}