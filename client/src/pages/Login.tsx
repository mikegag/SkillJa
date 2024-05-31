import React, { useEffect } from "react"
import SignInPartners from "../components/SignInPartners"
import { Link, useNavigate } from "react-router-dom"

export default function Login(){
    useEffect(() => {
        document.title = "SkillJa - Login"
    }, [])

    const navigate = useNavigate()
    function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        navigate('/onboarding')
    }

    return (
        <div className="flex flex-col h-dvh p-2">
            <h2 className="heading mt-24">Welcome Back!</h2>
            <div className="flex flex-col justify-center items-center py-12">
                <form className="flex flex-col justify-center w-full mx-auto px-4 md:w-7/12 lg:w-4/12" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="form-input mb-5 mt-5"
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
                        className="w-full form-btn bg-main-green-500 text-main-cream mx-auto hover:bg-main-green-700"
                        type="submit"
                    >
                        Login
                    </button>
                </form>
                <div className="flex justify-center items-center my-7">
                    <div className="bg-main-grey-300 h-0.5 w-28 lg:w-40"></div>
                    <p className="mx-3 text-main-grey-200">Or Login with</p>
                    <div className="bg-main-grey-300 h-0.5 w-28 lg:w-40"></div>
                </div>
                <div className="mb-20">
                    <SignInPartners />
                </div>
                <p className="text-main-grey-300 font-kulim">
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