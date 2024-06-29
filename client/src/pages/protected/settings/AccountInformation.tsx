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
                    Account Information
                </h3>
                {initiateDelete ?
                    <>
                        <p className="text-center mx-auto font-kulim mt-2 mb-16 px-4"> 
                            Are you sure you want to delete your account? All your personal data 
                            and details pertaining to your account will be lost.
                        </p>
                        <button 
                            className="form-btn my-3"
                            onClick={()=>setInitiateDelete(false)}
                        >
                            No, Go Back
                        </button>
                        <button 
                            className="form-btn bg-main-black hover:bg-main-green-500 my-3"
                           
                        >
                            Yes, I'm Sure
                        </button>
                    </>
                    :
                    <>
                        <p className="font-kulim font-medium mr-auto my-3">
                            Name: <span className="font-normal"></span>
                        </p>
                        <p className="font-kulim font-medium mr-auto my-3">
                            Email: <span className="font-normal"></span>
                        </p>
                        <p className="font-kulim font-medium mr-auto my-3">
                            Phone: <span className="font-normal"></span>
                        </p>
                        <p className="font-kulim font-medium mr-auto my-3">
                            Gender: <span className="font-normal"></span>
                        </p>
                        <p className="font-kulim font-medium mr-auto my-3">
                            Profile Type: <span className="font-normal"></span>
                        </p>
                        <p className="font-kulim font-medium mr-auto my-3">
                            Member Since: <span className="font-normal"></span>
                        </p>
                        <div className="h-1 w-full bg-main-green-900 my-6"></div>
                        <button 
                            className="form-btn bg-main-black hover:bg-main-green-500 my-6"
                            onClick={()=>setInitiateDelete(true)}
                        >
                            Delete Account
                        </button>
                    </>
                }
            </div>
        </div>
    )
}