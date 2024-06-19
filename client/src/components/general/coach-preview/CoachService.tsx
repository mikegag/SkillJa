import { faCircleXmark, faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"

interface ServiceProps {
    exitView: (value:boolean) => void
}

export default function CoachService({exitView}:ServiceProps){
    const [insideModal, setInsideModal] = useState<boolean>(false)

    function handleExit(value:boolean){
        if(insideModal === false){
            exitView(value)
        }
    }

    return (
        <div className="pop-up-background" onClick={()=>handleExit(false)}>
            <div className="pop-up-container p-4 lg:p-6 text-main-green-900" onMouseEnter={()=>setInsideModal(true)} onMouseLeave={()=>setInsideModal(false)}>
                <FontAwesomeIcon 
                    icon={faX} 
                    className="text-main-green-900 hover:text-main-green-500 text-lg ml-auto cursor-pointer" 
                    onClick={()=> {handleExit(false)}} onMouseEnter={()=>setInsideModal(false)}
                />
                <h3 className="text-2xl font-source font-medium mx-auto text-center mt-4">
                    Training Plan (5K, 10K, & Half Marathon)
                </h3>
                <div className="h-1 w-28 lg:w-52 mx-auto my-2 bg-main-green-500 rounded-full" role="presentation"> </div>
                <h4 className="text-xl text-main-green-500 mr-auto my-5 font-semibold font-kulim">
                    $49 
                    <span className="ml-2 text-base font-medium">/ Per Plan</span>
                </h4>
                <p className="font-kulim">
                    I will work with you to build a customized training plan based on your goals. 
                    The plan will consist of weekly goals and tips to help you succeed. The final 
                    plan will be sent in PDF format.
                </p>
                <h4 className="text-xl mr-auto mt-6 mb-3 font-medium font-source">
                    Includes:
                </h4>
                <ul className="ml-6">
                    <li className="font-kulim list-disc font-light">Training plan</li> 
                    <li className="font-kulim list-disc font-light">Weekly Contact (Available in Chat)</li>
                </ul>
                <button className="form-btn mt-8 lg:mt-auto">Buy Now</button>
            </div>
        </div>
    )
}