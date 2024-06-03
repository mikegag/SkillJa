import React, { useEffect } from "react"
import SignInPartners from "../components/SignInPartners"
import { Link, useNavigate } from "react-router-dom"
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock } from "@fortawesome/free-solid-svg-icons"
import data from "../data.json"

export default function SignUp(){
    useEffect(() => {
        document.title = "SkillJa - Sign Up"
    }, [])
    
    const navigate = useNavigate()
    function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        navigate('/onboarding')
    }

    return (
        <div className="flex flex-col h-dvh p-2">
            <h2 className="heading mt-20">{data.signup[0].title}</h2>
            <div className="flex flex-col justify-center items-center py-12">
                <form className="flex flex-col justify-center w-full mx-auto px-11 md:w-7/12 lg:w-4/12" onSubmit={handleSubmit}>
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="form-input mb-5"
                            placeholder="Full Name"
                            required
                        />
                         <FontAwesomeIcon
                            icon={faUser}
                            className="absolute inset-y-4 left-0 flex items-center pl-4 text-main-grey-500"
                        />
                    </div>
                    <div className="relative w-full">
                        <input
                            type="email"
                            className="form-input mb-5"
                            placeholder="Email"
                            required
                        />
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            className="absolute inset-y-4 left-0 flex items-center pl-4 text-main-grey-500"
                        />
                    </div>
                    <div className="relative w-full">
                        <input
                            type="password"
                            className="form-input mb-5"
                            placeholder="Password"
                            required
                        />
                        <FontAwesomeIcon
                            icon={faLock}
                            className="absolute inset-y-4 left-0 flex items-center pl-4 text-main-grey-500"
                        />
                    </div>
                    <div className="relative w-full">
                        <input
                            type="password"
                            className="form-input mb-5"
                            placeholder="Confirm Password"
                            required
                        />
                        <FontAwesomeIcon
                            icon={faLock}
                            className="absolute inset-y-4 left-0 flex items-center pl-4 text-main-grey-500"
                        />
                    </div>
                    <button
                        className="w-full form-btn mx-auto"
                        aria-label="sign up form submission"
                        type="submit"
                    >
                        Next Steps
                    </button>
                </form>
                <div className="flex justify-center items-center my-7">
                    <div className="bg-main-grey-300 h-0.5 w-28 lg:w-40"></div>
                    <p className="mx-3 text-main-grey-200">Or Sign Up With</p>
                    <div className="bg-main-grey-300 h-0.5 w-28 lg:w-40"></div>
                </div>
                <div className="mb-9">
                    <SignInPartners />
                </div>
                <p className="text-main-grey-300 font-kulim">
                    Already have an account? 
                    <Link to={'/login'}>
                        <span className="underline cursor-pointer text-main-green-700 ml-1 hover:text-main-green-500">
                            Login Here
                        </span>
                    </Link>
                </p>
            </div>
        </div>

    )
} 