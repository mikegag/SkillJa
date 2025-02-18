import React, { useEffect, useState } from "react"
import Header from "../../../components/navigation/Header"
import LoadingAnimation from "../../../components/general/LoadingAnimation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faBagShopping } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios"
import GetCSFR from "../../../hooks/userAuthentication/GetCSFR"
import Footer from "../../../components/navigation/Footer"

export default function OrderSuccessful(){
    const [hasLoaded, setHasLoaded] = useState(false)
    const navigate = useNavigate()
    const [queryParameters] = useSearchParams()
    const coachId = queryParameters.get('coach_id')
    let csrfToken = GetCSFR({ name: "csrftoken" })
    const sessionId =queryParameters.get('session_id')
    const serviceId =queryParameters.get('service_id')
    const dateTime = queryParameters.get('date_time')
    const [responseMessage, setResponseMessage] = useState<string>()

    useEffect(()=>{
        document.title = "Transaction Successful!"
        const timeoutId = setTimeout(() => {
            setHasLoaded(true)
        }, 1200)

        if(csrfToken){
            // Trigger API to send user a confirmation email regarding their transaction
            axios.post(`${process.env.REACT_APP_SKILLJA_URL}/email/order_confirmation/`, 
                {sessionId:sessionId, coachId:coachId, serviceId:serviceId, dateTime:dateTime}, 
            {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json'
                }, 
                withCredentials: true
            })
            .then(res => {
                if (res.status === 200) {
                    // Trigger API call to create chat transaction notification
                    createTransactionNotification()
                    // Trigger API call to create an order review email
                    createOrderReviewEmail()
                } else {
                    setResponseMessage("Error sending confirmation email. Please copy current url and email us support@skillja.com")
                }
            })
            .catch(error => {console.error(error)})
        }
        //Clean up Timeout function
        return () => clearTimeout(timeoutId)
    },[csrfToken])

    // API call to create chat notification between coach and athlete
    function createTransactionNotification(){
        axios.post(`${process.env.REACT_APP_SKILLJA_URL}/chat/create_transaction_notification/`, 
            {sessionId:sessionId, serviceId:serviceId, dateTime: dateTime },
        {
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            }, 
            withCredentials: true
        })
        .then(res => {
            if (res.status === 201) {
                setResponseMessage("An order confirmation will be sent to your email shortly.")
            } 
        })
        .catch(error => {console.error(error)})
    }

    // API call to create chat notification between coach and athlete
    function createOrderReviewEmail(){
        axios.post(`${process.env.REACT_APP_SKILLJA_URL}/review/order_review_email/`, 
            {coachId:coachId},
        {
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            }, 
            withCredentials: true
        })
        .then(res => {
            if (res.status === 200) {
                setResponseMessage("An order confirmation will be sent to your email shortly.")
            } 
        })
        .catch(error => {console.error(error)})
    }

    return (
        <div>
            <Header useCase="onboarding" />
            <section className="mt-16 mb-32 px-8 font-kulim flex flex-col justify-center items-center">
                {hasLoaded ?
                    <>
                        <FontAwesomeIcon icon={faBagShopping} className="mt-6 text-main-green-600 h-12 mx-auto"/>
                        <h1 className="text-4xl my-8 mx-auto text-center font-semibold">
                            Thank you!
                        </h1>
                        <p className="text-xl text-center mx-auto">
                            {responseMessage}
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
                                onClick={()=>navigate(`/auth/coach?coach_id=${coachId}`)}
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
            <Footer />
        </div>
    )
}