import React from "react"

export default function Login(){
    return (
        <div className="flex flex-col justify-end h-dvh bg-main-color-darkgreen">
            <h2 className="font-source font-normal text-3xl text-main-color-white mx-auto my-auto pt-8">Welcome Back!</h2>
            <div className="flex flex-col justify-center items-center bg-main-color-white rounded-t-3xl py-8">
                <form className="flex flex-col justify-center w-full mx-auto px-11 lg:w-4/12">
                    <input
                        type="email"
                        className="form-input mb-9 mt-5"
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        className="form-input mb-4"
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
                <div className="flex justify-center mt-6 mb-8">
                    <img 
                        src={require('../assets/Apple-logo.png')} 
                        className="w-12 cursor-pointer" 
                        alt="apple logo which redirects user to sign in through their apple account"
                    />
                    <img 
                        src={require('../assets/Google-logo.png')} 
                        className="w-12 ml-10 mr-10 cursor-pointer" 
                        alt="google logo which redirects user to sign in through their google account"
                    />
                    <img 
                        src={require('../assets/FB-logo.png')} 
                        className="w-12 cursor-pointer" 
                        alt="facebook logo which redirects user to sign in through their facebook account"
                    />
                </div>
                <p className="text-gray-400 font-source">
                    Don't have an account? 
                    <span className="underline cursor-pointer text-main-color-darkgreen ml-1">
                        Sign Up Here
                    </span>
                </p>
            </div>
        </div>
    )
} 