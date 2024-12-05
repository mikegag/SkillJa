import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect} from "react";
import ServiceTemplate from "./ServiceTemplate";
import data from "../../../../data.json"
import axios from "axios";
import GetCSFR from "../../../../hooks/GetCSFR";

type SavedInformationType = {
    id: number;
    type: 'full-program' | 'online-program' | 'individual-session';
    title: string;
    description: string;
    duration: string;
    frequency: string;
    targetAudience?: string;
    location?: string;
    deliverable?: string;
    price: number;
}

export default function OfferedServices() {
    const [services, setServices] = useState<SavedInformationType[]>([])
    const [viewService, setViewService] = useState<boolean>(false)
    const [serviceInformation, setServiceInformation] = useState<SavedInformationType | null>(null)
    const [createService, setCreateService] = useState<boolean>(false)
    const [viewCreateService, setViewCreateService] = useState<SavedInformationType["type"]>()
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const createServiceData = data.CoachServiceForm.serviceOptions

    // API call to load saved services associated with user profile
    useEffect(() => {
        axios.get('https://www.skillja.ca/auth/profile/services/', { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }) 
            .then(res => {
                if (res.status === 200) {
                    setServices(res.data.services)
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
    },[])

    function handleServiceClick(selectedService: SavedInformationType) {
        setServiceInformation(selectedService)
        setViewService(true)
    }

    return (
        <div className="p-4">
            {createService ? (
                !viewCreateService ? (
                    <>
                        <p className="font-kulim mr-auto text-left mt-2 mb-8">
                            What would you like to create?
                        </p>
                        {createServiceData.map((currentService, index)=>(
                            <div 
                                className="flex border border-main-grey-100 text-main-green-900 rounded-xl py-2 px-4 my-2 font-kulim cursor-pointer hover:bg-main-green-500 hover:text-main-white"
                                key={index}
                                onClick={() => setViewCreateService(currentService.type as SavedInformationType['type'])}
                            >
                                <div className="flex flex-col justify-center items-start">
                                    <h4>{currentService.title}</h4>
                                    <p className="text-sm">{currentService.subtitle}</p>
                                </div>
                                <FontAwesomeIcon icon={faChevronRight} className="ml-auto my-auto"/>
                            </div>
                        ))}
                        
                    </>
                )
                :
                    <ServiceTemplate
                        useCase={viewCreateService}
                    />
            )
    
            :
                <>
                    {!viewService ? (
                        services.length > 0 ? (
                            <>
                                <p className="font-kulim mr-auto text-left mt-2 mb-4">
                                    Sessions & Packages
                                </p>
                                {services && services.length > 0 && services.map((currService, index) => (
                                    <div 
                                        className="flex border border-main-grey-100 text-main-green-900 rounded-xl py-2 px-4 my-2 font-kulim cursor-pointer hover:bg-main-green-500 hover:text-main-white"
                                        key={index}
                                        onClick={() => handleServiceClick(currService)}
                                    >
                                        <div className="flex flex-col justify-center items-start">
                                            <h4>{currService.title}</h4>
                                            <p className="text-sm">See Price and Details</p>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronRight} className="ml-auto my-auto" />
                                    </div>
                                ))}
                                <div role="presentation" className="h-0.5 bg-main-grey-200 rounded-full my-4"></div>
                            </>
                        ) : (
                            <>
                                <p className="font-kulim mr-auto text-left mt-2 mb-4">
                                    Sessions & Packages
                                </p>
                                <p className="text-sm font-kulim">
                                    No Services Saved/Available.
                                </p>
                                <div role="presentation" className="h-1 bg-main-grey-200 rounded-full my-6"></div>
                            </>
                        )
                    ) : (
                        serviceInformation && (
                            <ServiceTemplate
                                useCase={serviceInformation.type}
                                savedInformation={serviceInformation}
                            />
                        )
                    )}
                    <div 
                        className="flex border border-main-grey-100 text-main-green-900 rounded-xl py-2 px-4 my-2 font-kulim cursor-pointer hover:bg-main-green-500 hover:text-main-white"
                        onClick={() => setCreateService(true)}
                    >
                        <div className="flex flex-col justify-center items-start text-left">
                            <h4>Create New Session/Program</h4>
                            <p className="text-sm">Create a session/program for your athletes</p>
                        </div>
                        <FontAwesomeIcon icon={faChevronRight} className="ml-auto my-auto" />
                    </div>
                </>
            }
        </div>
    )
}
