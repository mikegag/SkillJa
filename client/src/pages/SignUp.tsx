import React from "react"
import SignInPartners from "../components/SignInPartners"
import { Link, useNavigate } from "react-router-dom"

export default function SignUp(){
    const navigate = useNavigate()
    function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        navigate('/onboarding')
    }

    return (
        <div className="flex flex-col justify-end h-dvh bg-main-color-darkgreen">
            <div className="flex flex-col justify-center items-center bg-main-color-white rounded-t-3xl py-14 lg:py-10">
                <div className="mt-3 mb-14">
                    <SignInPartners />
                </div>
                <form className="flex flex-col justify-center w-full mx-auto px-11 md:w-7/12 lg:w-4/12" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-input mb-9"
                        placeholder="Full Name"
                        required
                    />
                    <input
                        type="email"
                        className="form-input mb-9"
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        className="form-input mb-9"
                        placeholder="Password"
                        required
                    />
                    <input
                        type="password"
                        className="form-input mb-5"
                        placeholder="Confirm Password"
                        required
                    />
                    <button
                        className="form-btn"
                        type="submit"
                    >
                        Next Steps
                    </button>
                </form>
                <p className="text-gray-400 font-source">
                    Already have an account? 
                    <Link to={'/login'}>
                        <span className="underline cursor-pointer text-main-color-darkgreen ml-1">
                            Login Here
                        </span>
                    </Link>
                </p>
            </div>
        </div>

    )
} 