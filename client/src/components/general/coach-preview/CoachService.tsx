import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios";
import React, { useState } from "react"
import GetCSFR from "../../../hooks/GetCSFR";
import { useLocation } from "react-router-dom";

interface Service {
    id?: number;
    type: string;
    title: string;
    description: string;
    duration: string;
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
}

export default function CoachService({exitView, data}:ServiceProps){
    const [insideModal, setInsideModal] = useState<boolean>(false)
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const location = useLocation()
    // Extract query parameters
    const queryParams = new URLSearchParams(location.search)
    // Retrieve coachId param for API request
    const coachId = queryParams.get("coach_id")

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

    function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        // initialize Stripe instance
        axios.get('https://www.skillja.ca/stripe/config/', {
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
                }

                // Send request to create checkout session
                axios.post(`https://www.skillja.ca/stripe/create_stripe_checkout/${coachId}/`, dataToSend, {
                    headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
                )
                .then((res) => {
                    const successUrl = res.data.success_url
                    const cancelUrl = res.data.cancel_url   
                    // Redirect to Stripe checkout 
                    if (res.status === 200) {
                        window.location.href = successUrl
                    } 
                    // Redirect to cancelled page
                    else {
                        window.location.href = cancelUrl
                    }
                })
                .catch(handleError)
            } 
            else {
                console.error('Stripe initialization failed')
            }
        })
        .catch(handleError)
    }


    return (
        <div className="pop-up-background" onClick={()=>handleExit(false)}>
            <div className="pop-up-container p-4 lg:p-6 text-main-green-900" onMouseEnter={()=>setInsideModal(true)} onMouseLeave={()=>setInsideModal(false)}>
                <div className="flex pb-3 border-b border-gray-400">
                    <FontAwesomeIcon 
                        icon={faX} 
                        className="text-main-green-900 hover:text-main-green-500 my-auto mr-auto cursor-pointer" 
                        onClick={()=> {handleExit(false)}} onMouseEnter={()=>setInsideModal(false)}
                    />
                    <h1 className="font-medium font-source text-lg m-auto">
                        Sessions & Packages
                    </h1>
                    <p className="opacity-0 ml-auto">-</p>
                </div>
                <h3 className="font-kulim font-semibold mr-auto text-center mt-6 mb-2">
                    {data.title}
                </h3>
                <p className="font-kulim font-light">
                    {data.description}
                </p>
                <p className="font-kulim mt-4 font-light">
                    <span className="font-semibold">Duration:</span> {data.duration}
                </p>
                {data.frequency ?
                    <p className="font-kulim mt-4 font-light">
                        <span className="font-semibold">Frequency:</span> {data.frequency}
                    </p>
                :
                    <></>
                }
                {data.deliverable ? 
                    <>
                    <p className="mr-auto mt-4 mb-2 font-semibold font-kulim">
                        Includes:
                    </p>
                    <ul className="ml-10">
                        <li className="font-kulim list-disc font-light text-base">{data.deliverable}</li> 
                    </ul>
                    </>
                :
                    <></>
                }
                {data.location ? 
                    <p className="font-kulim mt-4">
                        <span className="font-semibold">Location: </span>{data.location}
                    </p> 
                : 
                    <></>
                }
                <p className="font-kulim font-light mt-4">
                    <span className="font-semibold mr-2">
                        Price: 
                    </span>
                        ${data.price}
                    <span className="ml-2">
                        / {data.type.includes('program')? 'Program': 'Session'}
                    </span>
                </p>
                <button 
                    className="form-btn mt-9 mb-3 py-2 lg:w-72 mx-auto"
                    onClick={(e)=>handleSubmit(e)}
                >
                    Purchase Now
                </button>
            </div>
        </div>
    )
}