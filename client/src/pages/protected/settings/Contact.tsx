import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Header from "../../../components/navigation/Header"
import Footer from "../../../components/navigation/Footer"
import axios from "axios"
import GetCSFR from "../../../hooks/GetCSFR"
import Accordion from "../../../components/general/Accordion"
import data from "../../../data.json"

interface FormStructure {
    firstname: string;
    lastname: string;
    email: string;
    reason: string;
    message: string;
}

export default function Contact(){
    const [disableButton, setDisableButton] = useState<boolean>(false)
    const csrfToken = GetCSFR({ name: "csrftoken" })
    // Used to keep track of suspect submission attempts
    const [preventSubmit, setPreventSubmit] = useState<boolean>(false)

    // React Hook Form setup
    const {
        register,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<FormStructure>()

    useEffect(()=>{
        document.title = 'SkillJa - Contact Us'
    }, [])

    function onSubmit(data:FormStructure){
        setDisableButton(true)

        if(!preventSubmit){
            axios.post(`${process.env.REACT_APP_SKILLJA_URL}/settings/contact_us/`, data, { 
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }) 
            .then(res => {
                if (res.status === 200) {
                    setDisableButton(true)
                    setTimeout(() => {
                        setDisableButton(false)
                        window.location.reload()
                    }, 4000)
                }
            })
            .catch(error => {
                alert("Error occurred! Please try again later.")
                console.log(error)
                setDisableButton(true)
                setTimeout(() => {
                    setDisableButton(false)
                    window.location.reload()
                }, 7000)
            })
        }
    }

    return (
        <>
            <Header  />
            <section className="flex flex-col justify-start items-start font-kulim py-2 px-4 lg:px-12 mx-auto mt-10 mb-24">
                <h2 className="text-3xl font-source mb-2 text-left ml-0 mr-auto">
                    Contact Us
                </h2>
                <p>
                    Reach out directly for support with any issues or questions.
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-start w-full max-w-xl mt-8">
                    <div className="flex justify-start items-start w-full mb-3">
                        <div className="flex flex-col justify-start items-start w-full mr-4">
                            <label className="font-semibold mb-0.5">First Name</label>
                            <input
                                id="firstname" 
                                type="text" 
                                className="form-input px-3 border-gray-300"
                                {...register("firstname", {
                                    required: "First Name is required",
                                    pattern: {
                                      value: /^[A-Za-z]{2,}$/,
                                      message: "Enter a valid First Name",
                                    },
                                    minLength:{
                                        value: 2,
                                        message: "First Name must be at least 2 characters long."
                                    },
                                    maxLength:{
                                        value: 60,
                                        message: "First Name must be at most 60 characters long."
                                    }
                                })}
                            />
                        </div>
                        <div className="flex flex-col justify-start items-start w-full">
                            <label className="font-semibold mb-0.5">Last Name</label>
                            <input 
                                id="lastname"
                                type="text" 
                                className="form-input px-3 border-gray-300" 
                                {...register("lastname", {
                                    required: "Last Name is required",
                                    pattern: {
                                      value: /[A-Za-z]{2,}$/,
                                      message: "Enter a valid Last Name",
                                    },
                                    minLength:{
                                        value: 2,
                                        message: "Last Name must be at least 2 characters long."
                                    },
                                    maxLength:{
                                        value: 60,
                                        message: "last Name must be at most 60 characters long."
                                    }
                                })}
                            />
                        </div>
                    </div>  
                    {errors.firstname && <p className="text-red-500">{errors.firstname.message}</p>}
                    {errors.lastname && <p className="text-red-500">{errors.lastname.message}</p>}
                    <label className="font-semibold mb-0.5">Email</label>
                    <input 
                        id="email"
                        type="email" 
                        className="form-input px-3 border-gray-300 w-full mr-4 mb-3"
                        {...register("email", {
                            required: "email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Enter a valid email address",
                            }
                        })}
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    <input id="newsletter" type="checkbox" className="hidden w-0.5 h-0.5 mx-auto border-0 outline-none bg-main-cream" onClick={()=>setPreventSubmit(true)}/>
                    <label className="font-semibold mb-0.5">Reason For Contact</label>
                    <Accordion title="Select reason" styles="border-main-grey-100 w-full bg-white border rounded-2xl" titleStyles="font-kulim">
                        {data.contactUs.map((option, index) => (
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setValue("reason", option.option); 
                                }}
                                id={option.option}
                                key={`individual-${index}`} 
                                value={option.option}
                                aria-label={`Reason for ${option.option}`}
                                className={`text-left p-3 font-kulim hover:bg-main-green-700 hover:text-main-color-white ${
                                    option.option === watch("reason") ? 'bg-main-green-500 text-main-color-white' : ''
                                }`}
                            >
                                {option.option}
                            </button>
                        ))}
                    </Accordion>
                    <label className="font-semibold mt-4 mb-0.5">What Can We Help You with?</label>
                    <textarea
                        id="message"  
                        className="form-input px-3 border border-gray-300 w-full min-h-36 max-h-44" 
                        {...register("message", {
                            required: "message is required",
                            minLength:{
                                value: 110,
                                message: "Please be more descriptive in your message!"
                            },
                            maxLength:{
                                value: 600,
                                message: "Message must be at most 1000 characters long."
                            }
                        })}
                    />
                    <input id="phone_extension" type="text" className="opacity-80 pt-1 w-0.5 h-0.5 mx-auto border-0 outline-none bg-main-cream" onClick={()=>setPreventSubmit(true)}/>
                    {errors.message && <p className="text-red-500">{errors.message.message}</p>}
                    <button 
                        className="form-btn mt-4 px-7 py-2 mr-auto" 
                        type="submit"
                        aria-label="contact form submission"
                        disabled={disableButton}
                    >
                        {disableButton ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </section>
            <Footer />
        </>
    )
}