import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Link } from "react-router-dom"
import data from "../../../data.json"

export default function Faqs(){
    
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
                    FAQs
                </h3>
                {data.faqs.map((curr,index)=>(
                    <div key={index} className="flex flex-col w-full border-b border-main-grey-200 font-kulim pb-8 my-4">
                        <p className="text-lg mb-4">
                            {curr.question}
                        </p>
                        <p>
                            {curr.answer}
                        </p>
                    </div>
                ))
                }
            </div>
        </div>
    )
}