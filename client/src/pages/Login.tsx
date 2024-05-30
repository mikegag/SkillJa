import React from "react"
import SignInPartners from "../components/SignInPartners"
import { Link, useNavigate } from "react-router-dom"

export default function Login(){
    const navigate = useNavigate()
    function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        navigate('/onboarding')
    }
    
    return (
        <div className="flex flex-col justify-end h-dvh bg-main-color-darkgreen">
            <h2 className="font-source font-normal text-3xl text-main-color-white mx-auto my-auto pt-8">Welcome Back!</h2>
            <div className="flex flex-col justify-center items-center bg-main-color-white rounded-t-3xl py-12">
                <form className="flex flex-col justify-center w-full mx-auto px-11 md:w-7/12 lg:w-4/12" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="form-input mb-9 mt-5"
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        className="form-input mb-5"
                        placeholder="Password"
                        required
                    />
                    <button
                        className="form-btn"
                        type="submit"
                    >
                        Login
                    </button>
                </form>
                <div className="flex justify-center items-center my-4">
                    <div className="bg-main-color-darkgreen h-0.5 w-24"></div>
                    <p className="mx-2">Or</p>
                    <div className="bg-main-color-darkgreen h-0.5 w-24"></div>
                </div>
                <div className="mt-6 mb-8">
                    <SignInPartners />
                </div>
                <p className="text-gray-400 font-source">
                    Don't have an account? 
                    <Link to={'/signup'}>
                        <span className="underline cursor-pointer text-main-color-darkgreen ml-1">
                            Sign Up Here
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    )
} 