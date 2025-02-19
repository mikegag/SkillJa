import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Header from "../../components/navigation/Header";
import SignInPartners from "../../components/userAuthentication/SignInPartners";
import LoadingAnimation from "../../components/general/LoadingAnimation";
import { Link, useNavigate } from "react-router-dom";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import GetCSFR from "../../hooks/userAuthentication/GetCSFR";
import Footer from "../../components/navigation/Footer";

interface FormStructure {
  email: string;
  password: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false)
  const csrfToken = GetCSFR({ name: "csrftoken" })
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")
  
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormStructure>()

  useEffect(() => {
    document.title = "SkillJa - Login";
  }, [])

  // Function to handle form submission
  function onSubmit(data:FormStructure){
    setLoading(true)
    axios
      .post(`${process.env.REACT_APP_SKILLJA_URL}/login/`, data, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          // Simulate loading process
          const timer = setTimeout(() => {
            setLoading(false)
            navigate("/home-feed")
          }, 1000)
          // End loading animation and cleanup timer
          return ()=> clearTimeout(timer)
        } else if(res.status === 204) {
            setErrorMessage("Your account has not been confirmed! Please check your email and click the confirmation link sent to you.")
        } else {
            setErrorMessage("Login failed. Try again!")
          }
      })
      .catch((error) => { 
        alert('Error occurred! Please try again later.')
        console.error(error)
      })
  }

  return (
    <div className="flex flex-col h-dvh px-2">
      <Header useCase="default" />
      <h2 className="heading mt-10">Welcome Back!</h2>
      <div className="flex flex-col justify-center items-center py-12">
        {loading ? ( errorMessage.length === 0 ? 
          <div className="mt-20 h-56">
            <LoadingAnimation />
          </div>
          :
          <div className="mt-20 h-56">
            <p className="text-center mx-auto px-3">
              Your account has not been confirmed or was previously deleted. Check your email for a confirmation link!
            </p>
          </div>
        ) : (
          <>
            <form
              className="flex flex-col justify-center w-full mx-auto px-4 md:w-7/12 lg:w-4/12"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="relative w-full">
                <input
                  type="email"
                  className="form-input w-full mb-5 mt-5"
                  placeholder="Email"
                  autoComplete="on"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute inset-y-9 left-0 flex items-center pl-4 text-main-grey-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mb-3 mx-auto text-center">
                    *{errors.email.message}*
                  </p>
                )}
              </div>
              <div className="relative w-full">
                <input
                  type="password"
                  className="form-input w-full mb-5"
                  placeholder="Password"
                  autoComplete="on"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 4,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute inset-y-4 left-0 flex items-center pl-4 text-main-grey-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm my-3 mx-auto text-center">
                    *{errors.password.message}*
                  </p>
                )}
                {errorMessage && (
                  <p className="text-red-500 text-sm my-3 mx-auto text-center">
                    *{errorMessage}*
                  </p>
                )}
              </div>
              <button
                className="w-full form-btn mx-auto"
                type="submit"
                aria-label="login form submission"
                disabled={loading ? true: false}
              >
                Login
              </button>
            </form> 
            {/* <div className="flex justify-center items-center my-7" role="presentation">
                <div className="bg-main-grey-300 h-0.5 w-28 lg:w-36"></div>
                <p className="mx-3 lg:mx-4 text-main-grey-200">Or Login with</p>
                <div className="bg-main-grey-300 h-0.5 w-28 lg:w-36"></div>
            </div>
            <div className="mb-9 my-auto">
                <SignInPartners />
            </div> */}
            <div className="bg-main-grey-300 h-0.5 w-28 lg:w-44 mt-16 mb-8" role="presentation"></div>
            <p className="text-main-grey-300 font-kulim">
              Don't have an account?
              <Link to={"/signup"}>
                <span className="underline cursor-pointer font-semibold text-main-green-700 ml-1 hover:text-main-green-500">
                  Sign Up Here
                </span>
              </Link>
            </p>
          </>
        )}
      </div>
      <div className="mb-6 mt-10">
        <Footer />
      </div>
    </div>
  )
} 
