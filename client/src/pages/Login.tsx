import React, { useEffect, useState } from "react"
import Header from "../components/navigation/Header"
import SignInPartners from "../components/userAuthentication/SignInPartners"
import LoadingAnimation from "../components/general/LoadingAnimation"
import { Link, useNavigate } from "react-router-dom"
import { faUser } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import GetCSFR from "../hooks/GetCSFR"

interface FormStructure {
    email: string,
    password: string,
}

export default function Login(){
    const [loading, setLoading] = useState(false)
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const navigate = useNavigate()
    const [formData, setFormData] = useState<FormStructure>({
        email: '',
        password: ''
    })

    useEffect(() => {
        document.title = "SkillJa - Login"
    }, [])


    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        setLoading(true)
        axios.post('/login/', formData, {
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
            .then(res => {
                setLoading(false)
                if (res.status === 200) {
                    navigate("/auth/home-feed")
                } else {
                    console.error("login failed")
                }
            })
            .catch(error => {
                if (error.response) {
                    // the server responded with a status code that falls out of the range of 2xx
                    console.error('Error response:', error.response.data)
                    console.error('Status:', error.response.status)
                    console.error('Headers:', error.response.headers)
                } else if (error.request) {
                    // no response was received
                    console.error('No response received:', error.request)
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error setting up request:', error.message)
                }
                console.error('Error config:', error.config)
            })
    } 

    return (
        <div className="flex flex-col h-dvh px-2">
            <Header useCase="default" />
            <h2 className="heading mt-10">Welcome Back!</h2>
            <div className="flex flex-col justify-center items-center py-12">
            {loading ? (
                <div className="mt-20">
                    <LoadingAnimation />
                </div>
            ) : (
            <>
                <form className="flex flex-col justify-center w-full mx-auto px-4 md:w-7/12 lg:w-4/12" onSubmit={handleSubmit}>
                    <div className="relative w-full">
                        <input
                            type="email"
                            name="email"
                            className="form-input w-full mb-5 mt-5"
                            placeholder="Email"
                            autoComplete="on"
                            onChange={handleChange}
                            required
                        />
                        <FontAwesomeIcon
                            icon={faUser}
                            className="absolute inset-y-9 left-0 flex items-center pl-4 text-main-grey-500"
                        />
                    </div>
                    <div className="relative w-full">
                        <input
                            type="password"
                            name="password"
                            className="form-input w-full mb-5"
                            placeholder="Password"
                            autoComplete="on"
                            onChange={handleChange}
                            required
                        />
                        <FontAwesomeIcon
                            icon={faLock}
                            className="absolute inset-y-4 left-0 flex items-center pl-4 text-main-grey-500"
                        />
                    </div>
                    <button
                        className="w-full form-btn mx-auto"
                        type="submit"
                        aria-label="login form submission"
                    >
                        Login
                    </button>
                </form>
                <div className="flex justify-center items-center my-7">
                    <div className="bg-main-grey-300 h-0.5 w-28 lg:w-36"></div>
                    <p className="mx-3 lg:mx-4 text-main-grey-200">Or Login with</p>
                    <div className="bg-main-grey-300 h-0.5 w-28 lg:w-36"></div>
                </div>
                <div className="mb-9 my-auto">
                    <SignInPartners />
                </div>
                <p className="text-main-grey-300 font-kulim">
                    Don't have an account? 
                    <Link to={'/signup'}>
                        <span className="underline cursor-pointer text-main-green-700 ml-1 hover:text-main-green-500">
                            Sign Up Here
                        </span>
                    </Link>
                </p>
            </>
            )}
            </div>
        </div>
    )
} 