import { faLongArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { useNavigate } from "react-router-dom"

export default function ComingSoon(){
    const navigate = useNavigate()
    return (
        <div className="flex justify-center items-center mt-28 px-8">
            <FontAwesomeIcon 
                    className="text-2xl lg:text-4xl my-auto ml-auto mr-2 lg:mr-5 hover:text-main-green-500 cursor-pointer"
                    icon={faLongArrowLeft} 
                    onClick={(()=>navigate('../'))}
            />
            <p className="font-kulim text-xl w-fit lg:text-2xl text-center mr-auto">
                This page is still under construction 🛠️
            </p>
        </div>
    )
}