import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import GetWindowSize from '../../../hooks/general/GetWindowSize'
import OfferedServices from "./form-components/OfferedServices";

interface FormProps {
    displayForm: (value:boolean) => void
}

export default function EditCoachServiceForm({displayForm}:FormProps){
    const [insideForm, setInsideForm] = useState<boolean>(false)
    const windowSize = GetWindowSize()

    function handleExit(value:boolean){
        if(!insideForm){
            displayForm(value)
        }
    }

    return (
        <div className="pop-up-background" 
            onClick={windowSize.width >=1024? ()=>handleExit(false): ()=>{}}
        >
            <div 
                className="pop-up-container h-4/5" 
                onMouseEnter={()=>setInsideForm(true)} 
                onMouseLeave={()=>setInsideForm(false)}
            >
                <div className="flex justify-center items-center underline p-3 lg:px-5 bg-main-white rounded-t-xl">
                    <FontAwesomeIcon 
                        icon={faX}
                        className="text-main-green-900 hover:text-main-green-500 mr-auto cursor-pointer"
                        onClick={()=>handleExit(false)}
                        onMouseEnter={()=>setInsideForm(false)}
                    />
                    <h3 className="text-lg font-semibold font-kulim mx-auto text-center">
                        Edit Services
                    </h3>
                    <p className="ml-auto mr-0"></p>
                </div>
                <OfferedServices />
            </div>
        </div>
    )
}