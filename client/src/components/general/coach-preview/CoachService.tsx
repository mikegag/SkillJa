import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"

interface Service {
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

    function handleExit(value:boolean){
        if(insideModal === false){
            exitView(value)
        }
    }

    return (
        <div className="pop-up-background" onClick={()=>handleExit(false)}>
            <div className="pop-up-container p-4 lg:p-6 text-main-green-900" onMouseEnter={()=>setInsideModal(true)} onMouseLeave={()=>setInsideModal(false)}>
                <div className="flex">
                    <h1 className="font-medium font-source text-xl">
                        Sessions & Packages
                    </h1>
                    <FontAwesomeIcon 
                        icon={faX} 
                        className="text-main-green-900 hover:text-main-green-500 text-lg ml-auto cursor-pointer" 
                        onClick={()=> {handleExit(false)}} onMouseEnter={()=>setInsideModal(false)}
                    />
                </div>
                <h3 className="font-kulim font-semibold mr-auto text-center mt-6 mb-2">
                    {data.title}
                </h3>
                <p className="font-kulim text-sm">
                    {data.description}
                </p>
                <p className="font-kulim mt-3">
                    <span className="font-semibold">Duration:</span> {data.duration}
                </p>
                {data.frequency ?
                    <p className="font-kulim mt-3">
                        <span className="font-semibold">Frequency:</span> {data.frequency}
                    </p>
                :
                    <></>
                }
                {data.deliverable ? 
                    <>
                    <p className="mr-auto my-3 font-semibold font-kulim">
                        Includes:
                    </p>
                    <ul className="ml-10">
                        <li className="font-kulim list-disc font-light">{data.deliverable}</li> 
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
                <p className="font-kulim font-semibold mt-3">
                    Price: ${data.price}
                    <span className="ml-2">
                        / {data.type.includes('program')? 'Program': 'Session'}
                    </span>
                </p>
                <button className="form-btn mt-8 py-2">Purchase Now</button>
            </div>
        </div>
    )
}