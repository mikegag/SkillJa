import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import { Link } from "react-router-dom"

export default function AccountInformation(){
    const [initiateDelete, setInitiateDelete] = useState<boolean>(false)
    
    return (
        <div className="flex flex-col py-2 px-4 lg:px-16">
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
                    Notifications
                </h3>
                <div className="flex w-full border-b border-main-grey-200 font-kulim pb-8 my-4">
                    <p className="text-lg">
                        Promotional & Marketing
                    </p>
                    <label className="inline-flex items-center cursor-pointer ml-auto">
                        <input type="checkbox" value="" className="sr-only peer" />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-main-green-500"></div>
                    </label>
                </div>
                <div className="flex w-full border-b border-main-grey-200 font-kulim pb-8 my-4">
                    <p className="text-lg">
                        Upcoming Sessions
                    </p>
                    <label className="inline-flex items-center cursor-pointer ml-auto">
                        <input type="checkbox" value="" className="sr-only peer" />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-main-green-500"></div>
                    </label>
                </div>
                <div className="flex w-full border-b border-main-grey-200 font-kulim pb-8 mt-4 mb-8">
                    <p className="text-lg">
                        Unread Messages
                    </p>
                    <label className="inline-flex items-center cursor-pointer ml-auto">
                        <input type="checkbox" value="" className="sr-only peer" />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-main-green-500"></div>
                    </label>
                </div>
            </div>
        </div>
    )
}