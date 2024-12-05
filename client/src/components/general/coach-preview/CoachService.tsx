import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios";
import React, { useState } from "react"
import GetCSFR from "../../../hooks/GetCSFR";

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

export default function CoachService({exitView, data}:ServiceProps){
    const [insideModal, setInsideModal] = useState<boolean>(false)
    const csrfToken = GetCSFR({ name: "csrftoken" })

    function handleExit(value:boolean){
        if(insideModal === false){
            exitView(value)
        }
    }

    function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        axios.post('https://www.skillja.ca/stripe/create_stripe_checkout/', data, {
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
            })
            .then(res => {
                if (res.status === 200) {
                    window.location.reload()
                } else {
                    console.error("transaction failed")
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
    }

    return (
        <div className="pop-up-background" onClick={()=>handleExit(false)}>
            <div className="pop-up-container p-4 lg:p-6 text-main-green-900" onMouseEnter={()=>setInsideModal(true)} onMouseLeave={()=>setInsideModal(false)}>
                <div className="flex pb-3 border-b border-gray-400">
                    <h1 className="font-medium font-source text-xl my-auto">
                        Sessions & Packages
                    </h1>
                    <FontAwesomeIcon 
                        icon={faX} 
                        className="text-main-green-900 hover:text-main-green-500 text-lg my-auto ml-auto cursor-pointer" 
                        onClick={()=> {handleExit(false)}} onMouseEnter={()=>setInsideModal(false)}
                    />
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
                    <p className="font-kulim mt-3">
                        <span className="font-semibold">Location: </span>{data.location}
                    </p> 
                : 
                    <></>
                }
                <p className="font-kulim font-light mt-3">
                    <span className="font-semibold">
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