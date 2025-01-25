import React, { useEffect, useState } from "react";
import Header from "../../../components/navigation/Header";
import LoadingAnimation from "../../../components/general/LoadingAnimation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faX } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OrderCancelled(){
    const [hasLoaded, setHasLoaded] = useState(false)
    const [queryParameters] = useSearchParams()
    const coachId = queryParameters.get('coach_id')
    const navigate = useNavigate()

    useEffect(()=>{
        document.title = "Transaction Cancelled!"
        const timeoutId = setTimeout(() => {
            setHasLoaded(true)
        }, 1200)
        return () => clearTimeout(timeoutId)
    },[])

    return (
        <div>
            <Header useCase="onboarding" />
            <section className="mt-16 px-8 font-kulim flex flex-col justify-center items-center">
                {hasLoaded ?
                    <>
                        <FontAwesomeIcon icon={faX} className="mt-6 text-red-500 h-9 mx-auto"/>
                        <h1 className="text-4xl my-8 mx-auto text-center font-semibold">
                            Oop! Something went wrong...
                        </h1>
                        <p className="text-xl text-center mx-auto">
                            Please check your internet connection and try again in a few moments. 
                        </p>
                        <div className="flex my-16">
                            <button
                                className="mx-1.5 py-2 px-5 bg-main-green-500 hover:bg-main-green-900 text-white rounded-xl cursor-pointer"
                                aria-label="redirects to home page"
                                onClick={()=>navigate('/')}
                            >
                                Home
                            </button>
                            <button
                                className="mx-1.5 py-2 px-5 bg-main-green-500 hover:bg-main-green-900 text-white rounded-xl cursor-pointer"
                                aria-label="redirects to back to coach profile page"
                                onClick={()=>navigate(`/auth/coach?coach_id=${coachId}`)}
                            >
                                Back to Coach Profile
                                <FontAwesomeIcon icon={faArrowRight} className="ml-2 my-auto"/>
                            </button>
                        </div>
                    </>
                :
                    <div className="mt-32">
                        <LoadingAnimation />
                    </div>
                }
            </section>
        </div>
    )
}