import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import React, { Suspense, useState } from "react"
import { useForm } from "react-hook-form"
import LoadingAnimation from "../LoadingAnimation"

interface FormStructure {
    message: string;
}

interface Props {
    csrftoken: string;
    coachId: string;
}

export default function ContactCoachForm({coachId, csrftoken}:Props){
    const [openForm, setOpenForm] = useState<boolean>(false)
    const [responseMessage, setResponseMessage] = useState<string>()
    const [messageAttempted, setMessageAttempted] = useState<boolean>(false)

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormStructure>()

    // API call to contact coach
    function handleMessage(){
        // Clear previous response message and initiate loading animation
        setResponseMessage("")
        setMessageAttempted(true)
        axios.post(`${process.env.REACT_APP_SKILLJA_URL}/chat/contact_coach/`, {coach_id: coachId}, { 
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
            }) 
            .then(res => {
                if(res.status===201){
                    setResponseMessage('Message sent!')
                } else {
                    setResponseMessage('Something went wrong! Please try again later.')
                }
            })
            .catch(error => {
                if(error.response.data.error.includes('yourself')){
                    setResponseMessage("You cannot send a message to yourself!")
                } else if (error.response.data.error.includes('exists')){
                    setResponseMessage("A chat already exists between you and this coach!")
                } else {
                    setResponseMessage("Error sending message.")
                }
                
            })
    }

    return (
        <>
            {openForm ?
                <div className="pop-up-background">
                    <form onSubmit={handleSubmit(handleMessage)} className="pop-up-container h-2/5 py-4 px-6">
                        <FontAwesomeIcon 
                            icon={faX} 
                            className="text-xl mt-4 mb-8 ml-auto mr-0 hover:text-main-green-500 cursor-pointer" 
                            onClick={()=>{setOpenForm(false)}}
                            aria-label="close contact coach form"
                        />
                        {messageAttempted ?
                            <Suspense fallback={<LoadingAnimation />}> 
                                <p className="mx-auto mt-14">
                                    {responseMessage}
                                </p> 
                            </Suspense>
                        :
                            <>
                            <textarea
                                className="form-input h-40 p-3"
                                placeholder="Type your message here..."
                                autoComplete="on"
                                {...register("message", {
                                    required: "Message is required",
                                    minLength: {
                                        value: 20,
                                        message: "Message must be at least 20 characters",
                                    },
                                    maxLength: {
                                        value: 200,
                                        message: "Message must be no longer than 200 characters",
                                    },
                                })}
                            />
                            {errors.message && (
                                <p className="text-red-500 text-sm mb-3 mx-auto text-center">
                                    *{errors.message.message}*
                                </p>
                            )}
                            <button 
                                type="submit" 
                                className={`form-btn m-auto py-2 px-8 my-4 ${messageAttempted ? "cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                {messageAttempted ? "Sending..." : "Send Message"}
                            </button>
                            </>
                        }
                    </form>
                </div>
            :
                <button 
                    className="form-btn py-2 px-5 my-4 rounded-xl font-medium text-base"
                    onClick={()=>setOpenForm(true)}
                >
                    Contact
                </button>
            }
        </>
    )
}