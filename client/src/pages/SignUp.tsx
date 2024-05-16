import React from "react"

export default function SignUp(){
    return (
        <div className="flex flex-col justify-end h-dvh bg-main-color-darkgreen">
            <div className="flex flex-col justify-center items-center bg-main-color-white rounded-t-3xl py-8">
                <div className="flex justify-center mt-4 mb-12">
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
                <form className="flex flex-col justify-center w-full mx-auto px-11 lg:w-4/12">
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
                        className="form-input"
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
                    <span className="underline cursor-pointer text-main-color-darkgreen ml-1">
                        Login Here
                    </span>
                </p>
            </div>
        </div>

    )
} 