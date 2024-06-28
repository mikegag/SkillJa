import { faEnvelope, faHouse, faPhone, faSliders, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import { Link } from "react-router-dom"

export default function Profile(){
    const [updateDetails, setUpdateDetails] = useState<boolean>(false)

    return (
        <div className="py-4 px-8 lg:px-24">
            <div className="flex justify-center text-center mt-10">
                <h1 className="font-source text-3xl pl-8 ml-auto my-auto text-main-green-900">Profile</h1>
                <Link to={'./settings'} className="text-2xl my-auto ml-auto hover:text-main-green-500 cursor-pointer">
                    <FontAwesomeIcon 
                        icon={faSliders}
                    />
                </Link>
            </div>
            <section className="flex items-center border-b-2 mt-14 border-main-green-500 lg:pb-4">
                <img 
                    src={require('../../assets/google-logo.png')} 
                    className="border-2 border-main-green-500 w-36 h-36 rounded-full mr-10 lg:mr-14"
                />
                <div className="flex flex-col items-start font-kulim text-main-green-900 lg:mt-4">
                    <h2 className="text-2xl font-medium">Tom Chant</h2>
                    <h3 className="text-xl my-2 font-medium">Toronto, ON</h3>
                    <p className="my-6">Hi! I'm Tom and I love running! With over 10+ years of coaching experience I can help you 
                    out with your next big race.</p>
                </div>
            </section>
            <section>
                <form className="flex flex-col justify-start mx-auto items-center mt-10 lg:w-4/12">
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="form-input w-full mb-5"
                            placeholder="Fullname"
                        />
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            className="absolute inset-y-4 left-0 flex items-center pl-4 pt-0.5 text-main-grey-500"
                        />
                    </div>
                    <div className="relative w-full">
                        <input
                            type="email"
                            className="form-input w-full mb-5"
                            placeholder="Email"
                        />
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            className="absolute inset-y-4 left-0 flex items-center pl-4 pt-0.5 text-main-grey-500"
                        />
                    </div>
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="form-input w-full mb-5"
                            placeholder="Address"
                        />
                        <FontAwesomeIcon
                            icon={faHouse}
                            className="absolute inset-y-4 left-0 flex items-center pl-4 pt-0.5 text-main-grey-500"
                        />
                    </div>
                    <div className="relative w-full">
                        <input
                            type="tel"
                            className="form-input w-full mb-5"
                            placeholder="Telephone"
                        />
                        <FontAwesomeIcon
                            icon={faPhone}
                            className="absolute inset-y-4 left-0 flex items-center pl-4 pt-0.5 text-main-grey-500"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="form-btn mx-auto mt-5"
                        onClick={()=>setUpdateDetails(!updateDetails)}
                    >
                        {updateDetails ? 'Save' : 'Update'}
                    </button>
                </form>
            </section>
        </div>
    )
}