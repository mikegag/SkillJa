import React, { useEffect, useState } from "react"
import Header from "../../../components/navigation/Header"
import LoadingAnimation from "../../../components/general/LoadingAnimation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faBagShopping } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios"
import GetCSFR from "../../../hooks/GetCSFR"

export default function OrderSuccessful(){
    const [hasLoaded, setHasLoaded] = useState(false)
    const navigate = useNavigate()
    const [queryParameters] = useSearchParams()
    // const csrfToken = GetCSFR({ name: "csrftoken" })
    // const coachId = queryParameters.get('coach_id')
    // const sessionId =queryParameters.get('session_id')
    // const [responseMessage, setResponseMessage] = useState("-")

    useEffect(()=>{
        document.title = "Transaction Successful!"
        const timeoutId = setTimeout(() => {
            setHasLoaded(true)
        }, 1200)

        // Trigger API to send user a confirmation email regarding their transaction + need to add endpoint in backed
        // axios.post(`${process.env.REACT_APP_SKILLJA_URL}/order_confirmation/`, {session_id:sessionId, coach_id:coachId}, {
        //     headers: {
        //         'X-CSRFToken': csrfToken,
        //         'Content-Type': 'application/json'
        //     }, 
        //     withCredentials: true
        // })
        //     .then(res => {
        //         if (res.status === 200) {
        //             setResponseMessage("An order confirmation will be sent to your email shortly.")
        //         } else {
        //             setResponseMessage("Error sending confirmation email. Please email us support@skillja.com")
        //         }
        //     })
        //     .catch(error => {
        //         console.error(error)
        //     })
        // Clean up Timeout function
        return () => clearTimeout(timeoutId)
    },[])

    return (
        <div>
            <Header useCase="onboarding" />
            <section className="mt-16 px-8 font-kulim flex flex-col justify-center items-center">
                {hasLoaded ?
                    <>
                        <FontAwesomeIcon icon={faBagShopping} className="mt-6 text-main-green-600 h-12 mx-auto"/>
                        <h1 className="text-4xl my-8 mx-auto text-center font-semibold">
                            Thank you!
                        </h1>
                        <p className="text-xl text-center mx-auto">
                            {/* {responseMessage} */}
                            An order confirmation will be sent to your email shortly.
                        </p>
                        <div className="flex my-16">
                            <button
                                className="mx-1.5 py-2 px-5 bg-main-green-500 hover:bg-main-green-900 text-white rounded-xl cursor-pointer"
                                aria-label="redirects to home page"
                                onClick={()=>navigate('/')}
                            >
                                Home
                            </button>
                            <button
                                className="mx-1.5 py-2 px-5 bg-main-green-500 hover:bg-main-green-900 text-white rounded-xl cursor-pointer"
                                aria-label="redirects to back to coach profile page"
                                onClick={()=>navigate('/auth/coach?coach_id=')}
                            >
                                Back to Coach Profile
                                <FontAwesomeIcon icon={faArrowRight} className="ml-2 my-auto"/>
                            </button>
                        </div>
                    </>
                :
                    <div className="mt-32">
                        <LoadingAnimation />
                    </div>
                }
            </section>
        </div>
    )
}