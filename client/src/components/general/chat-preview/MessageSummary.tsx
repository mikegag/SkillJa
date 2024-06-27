import { faChevronRight, faCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

export default function MessageSummary(){
    return (
        <div className="flex justify-center items-center bg-main-white border border-main-grey-100 p-3 lg:p-2 lg:border-r-0 lg:border-l-0 cursor-pointer hover:border-main-green-900">
            <FontAwesomeIcon icon={faCircle} className="text-lg lg:text-sm lg:ml-2 text-main-grey-100" />
            <img 
                src={require('../../../assets/google-logo.png')} 
                className="w-14 h-14 lg:w-10 lg:h-10 my-2 mx-4 lg:ml-6 lg:mr-3 rounded-full border"
            />
            <h3 className="text-main-green-900 text-xl font-kulim">Jeff Mare</h3>
            <p className="text-main-grey-300 text-base my-auto ml-auto pr-2">Today</p>
        </div>
    )
}