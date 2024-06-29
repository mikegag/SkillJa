import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Link } from "react-router-dom"
import data from "../../../data.json"

export default function ReportIssue(){
    
    return (
        <div className="flex flex-col py-2 px-4 lg:px-16 h-3/4 overflow-scroll">
            <div className="flex justify-center text-center mt-10">
                <Link to={'../'} className="text-3xl my-auto mr-auto hover:text-main-green-500 cursor-pointer">
                    <FontAwesomeIcon 
                        icon={faArrowLeftLong}
                    />
                </Link>
                <h1 className="font-source text-3xl pr-8 mr-auto my-auto text-main-green-900 ">
                    Settings
                </h1>
            </div>
            <div className="flex flex-col justify-center items-center rounded-2xl border lg:mx-auto lg:w-6/12 border-main-green-900 text-main-green-900 bg-main-white py-4 px-6 mt-16">
                <h3 className="font-source underline text-xl mb-4">
                    Report an Issue
                </h3>
                <p className="text-center mx-auto px-4 font-kulim">
                    Have an issue or concern that you want addressed? Leave a detailed message below and 
                    will try our best to get back to you in a timely manner!
                </p>
                <textarea 
                    className="min-h-44 outline max-h-44 w-full rounded-2xl my-10 p-3 font-kulim bg-main-grey-100"
                    placeholder="Enter Your Message Here"
                />
                <button
                    className="form-btn mx-auto mt-8 mb-4"
                >
                    Send Report
                </button>
            </div>
        </div>
    )
}