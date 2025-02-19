import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { loadStripe } from "@stripe/stripe-js"
import React, { useEffect, useState } from "react"
import GetCSFR from "../../../hooks/userAuthentication/GetCSFR"
import { useLocation } from "react-router-dom"
import ServiceDateTimePicker from "./form-components/ServiceDateTimePicker"

interface Service {
    id?: number;
    type: string;
    title: string;
    description: string;
    duration?: string;
    session_length?: number;
    frequency?: string;
    target_audience?: string;
    location?: string;
    deliverable?: string;
    price: number;
}

interface ServiceProps {
    exitView: (value:boolean) => void;
    data: Service;
}

interface Checkout {
    serviceId: number;
    publicKey: string;
    coachId: string;
    dateTime?: string;
}

export default function CoachService({exitView, data}:ServiceProps){
    const [insideModal, setInsideModal] = useState<boolean>(false)
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const location = useLocation()
    // Extract query parameters
    const queryParams = new URLSearchParams(location.search)
    // Retrieve coachId param for API request
    const coachId = queryParams.get("coach_id")
    // Date and Time data if a user selects an individual session
    const [dateTime, setDateTime] = useState<string|null>(null)
    // Used to activate purchase button once dateTime value has been acknowledged and a value has been by user
    const [acknowledgeDateTime, setAcknowledgeDateTime] = useState<boolean>(false)
    const [activatePurchaseButton, setActivatePurchase] = useState<boolean>(false)
    const [preventSubmit, setPreventSubmit] = useState<boolean>(false)

    useEffect(()=>{
        if(dateTime && acknowledgeDateTime){
            setActivatePurchase(true)
        }
    },[dateTime])

    // callback function to let parent know user wants to exit focus view
    function handleExit(value:boolean){
        if(insideModal === false){
            exitView(value)
        }
    }

    // Helper function log axios errors
    function handleError(error: any) {
        if (error.response) {
          console.error('Error response:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
    } 

    // Handles Stripe checkout functionality
    function handleSubmit(e:React.FormEvent){
        // Prevent reclicks on purchase button
        setPreventSubmit(true)
        e.preventDefault()
        // initialize Stripe instance
        axios.get(`${process.env.REACT_APP_SKILLJA_URL}/stripe/config/`, {
            headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
            },
            withCredentials: true,
        })
        .then((res) => {
            if (res.status === 200) {
                // Create checkoutData with the service and publicKey
                const dataToSend: Checkout = {
                    serviceId: data.id!,
                    publicKey: res.data.publicKey, 
                    coachId: coachId!,
                    dateTime: dateTime!
                }
                // initialize Stripe object
                const stripePromise = loadStripe(res.data.publicKey)

                // Send request to create checkout session
                axios.post(`${process.env.REACT_APP_SKILLJA_URL}/stripe/create_stripe_checkout/`, dataToSend, {
                    headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
                )
                .then(async (res) => {
                    if (res.status === 200) {
                        const stripe = await stripePromise;
                        if (stripe) {
                            // Proceed only if Stripe object is successfully initialized
                            stripe.redirectToCheckout({ sessionId: res.data.checkout_session_id })
                            .then((result) => {
                                if (result.error) {
                                    console.error("Stripe checkout error:", result.error.message)
                                }
                                else {
                                    // Redirect user to success or cancelled page, deemed by stripe
                                    window.location.href = res.data.checkout_session_url
                                }
                            })
                        } else {
                            console.error("Stripe.js failed to load")
                        }
                    }
                })
                .catch(handleError)
            } 
            else {
                console.error('Failed to get Public Stripe Key')
            }
        })
        .catch(handleError)
    }

    return (
        <div className="pop-up-background" onClick={()=>handleExit(false)}>
            <div className="pop-up-container p-4 lg:p-6 text-main-green-900" onMouseEnter={()=>setInsideModal(true)} onMouseLeave={()=>setInsideModal(false)}>
                <div className="flex">
                    <FontAwesomeIcon 
                        icon={faX} 
                        className="text-main-green-900 hover:text-main-green-500 my-auto mr-auto cursor-pointer" 
                        onClick={()=> {handleExit(false)}} onMouseEnter={()=>setInsideModal(false)}
                    />
                    <h1 className="font-semibold underline font-kulim text-lg m-auto">
                        Sessions & Packages
                    </h1>
                    <p className="opacity-0 ml-auto">-</p>
                </div>
                <h3 className="font-kulim font-semibold mr-auto text-center mt-8 mb-2">
                    {data.title}
                </h3>
                <p className="font-kulim font-light">
                    {data.description}
                </p>
                {data.duration && (
                    <p className="font-kulim mt-4 font-light">
                        <span className="font-semibold">Duration:</span> {data.duration}
                    </p>
                )}
                {typeof data.session_length === "number" && data.session_length > 1 && (
                    <p className="font-kulim mt-4 font-light">
                        <span className="font-semibold">Session Length: </span> {data.session_length} min
                    </p>
                )}
                {data.frequency && (
                    <p className="font-kulim mt-4 font-light">
                        <span className="font-semibold">Frequency:</span> {data.frequency}
                    </p>
                )}
                {data.deliverable && (
                    <>
                        <p className="mr-auto mt-4 mb-2 font-semibold font-kulim">
                            Includes:
                        </p>
                        <ul className="ml-10">
                            <li className="font-kulim list-disc font-light text-base">{data.deliverable}</li> 
                        </ul>
                    </>
                )}
                {data.location && (
                    <p className="font-kulim mt-4">
                        <span className="font-semibold">Location: </span>{data.location}
                    </p> 
                )}
                <p className="font-kulim font-light mt-4">
                    <span className="font-semibold mr-2">
                        Price: 
                    </span>
                        ${data.price}
                    <span className="ml-2">
                        / {data.type.includes('program')? 'Resource': 'Session'}
                    </span>
                </p>
                {data.type==='individual-session' && 
                    <div onClick={()=>setAcknowledgeDateTime(true)}>
                        <ServiceDateTimePicker csrftoken={csrfToken!} coachId={coachId!} dateTime={setDateTime}/>
                    </div>
                }
                <button 
                    className={`form-btn mt-9 mb-3 py-2 lg:w-72 mx-auto 
                        ${(data.type === 'individual-session' && activatePurchaseButton && coachId) || (coachId && data.type !== 'individual-session') ? 
                            'cursor-pointer' : 'bg-main-grey-200 cursor-not-allowed hover:bg-main-grey-200'}`
                        }
                    onClick={(e)=>{handleSubmit(e)}}
                    disabled={preventSubmit}
                >
                    Purchase Now
                </button>
            </div>
        </div>
    )
}