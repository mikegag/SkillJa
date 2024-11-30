import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import GetWindowSize from '../../../hooks/GetWindowSize'
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
                className="pop-up-container h-4/6" 
                onMouseEnter={()=>setInsideForm(true)} 
                onMouseLeave={()=>setInsideForm(false)}
            >
                <div className="flex justify-center items-center border-b border-main-grey-100 p-3 lg:px-5 bg-main-white rounded-t-xl">
                    <FontAwesomeIcon 
                        icon={faX}
                        className="text-main-green-900 hover:text-main-green-500 mr-auto cursor-pointer"
                        onClick={()=>handleExit(false)}
                        onMouseEnter={()=>setInsideForm(false)}
                    />
                    <h3 className="text-lg font-medium font-source mx-auto text-center pl-10 lg:pl-24">
                        Edit Services
                    </h3>
                    <p className="mx-auto"> </p>
                </div>
                <OfferedServices />
            </div>
        </div>
    )
}