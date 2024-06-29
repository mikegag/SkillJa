import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import { Link } from "react-router-dom"

export default function AccountInformation(){
    const [initiateUpdate, setInitiateUpdate] = useState<boolean>(false)
    
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
            <div className="flex flex-col justify-center items-center rounded-2xl border lg:mx-auto lg:w-7/12 border-main-green-900 text-main-green-900 bg-main-white py-4 px-6 mt-16">
                <h3 className="font-source underline text-xl mb-4">
                    Payment Method
                </h3>
                <form className="flex flex-col lg:flex-wrap lg:flex-row w-full">
                    <div className="flex flex-col lg:w-5/12 lg:mx-5">
                        <label htmlFor="fullname" className="font-kulim font-semibold my-3">
                            Name on Card:
                        </label>
                        <input 
                            name="fullname" 
                            type="text"
                            placeholder="Enter the fullname on your card"
                            className="font-kulim font-light border-b border-main-grey-100 bg-main-white mb-5 p-2"
                        />
                    </div>
                    <div className="flex flex-col lg:w-5/12 lg:mx-5">
                        <label htmlFor="fullname" className="font-kulim font-semibold my-3">
                            Card Number:
                        </label>
                        <input 
                            name="cardnumber" 
                            type="text"
                            placeholder="Enter your card number"
                            className="font-kulim font-light border-b border-main-grey-100 bg-main-white mb-5 p-2"
                        />
                    </div>
                    <div className="flex flex-col w-32 lg:w-2/12 lg:mx-5">
                        <label htmlFor="fullname" className="font-kulim font-semibold my-3">
                            Expiry Date:
                        </label>
                        <input 
                            name="expiry" 
                            type="text"
                            max={5}
                            placeholder="mm/yy"
                            className="font-kulim font-light border-b border-main-grey-100 bg-main-white mb-5 p-2"
                        />
                    </div>
                    <div className="flex flex-col w-20 lg:w-2/12 lg:mx-5">
                        <label htmlFor="fullname" className="font-kulim font-semibold my-3">
                            CVS:
                        </label>
                        <input 
                            name="cvs" 
                            max={3}
                            type="text"
                            placeholder="###"
                            className="font-kulim font-light border-b border-main-grey-100 bg-main-white mb-5 p-2"
                        />
                    </div>
                    <button
                        className="form-btn mx-auto mt-10 mb-5 lg:h-fit lg:my-auto"
                        onClick={()=>setInitiateUpdate(!initiateUpdate)}
                    >
                        {initiateUpdate ? "Save" : "Update"}
                    </button>
                </form>
            </div>
        </div>
    )
}