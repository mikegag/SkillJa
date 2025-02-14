import React, { useState } from "react"
import data from "../../../../data.json"
import axios from "axios"
import GetCSFR from "../../../../hooks/userAuthentication/GetCSFR"
import { useForm } from "react-hook-form"

interface TemplateProps {
    useCase: 'full-program' | 'online-program' | 'individual-session';
    savedInformation?: SavedInformationType;
}

type CoachServiceFormType = {
    id: string;
    label: string; 
    input: string; 
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    minLength?: {
        value: string;
        message:string;
    };
    maxLength?: {
        value: string;
        message:string;
    };
    required?: {
        value: boolean;
        message:string;
    }
}[]

type SavedInformationType = {
    id?: number;
    type: string;
    title: string;
    description: string;
    duration?: string;
    frequency: string;
    targetAudience?: string;
    location?: string;
    deliverable?: string;
    price: number;
    sessionLength?: number;
}

export default function ServiceTemplate({useCase, savedInformation}:TemplateProps){
    const csrfToken = GetCSFR({ name: "csrftoken" })
    let formData = data.CoachServiceForm[useCase] as CoachServiceFormType

    const [serviceData, setServiceData] = useState<SavedInformationType>({
        type: useCase || savedInformation?.type || "",
        title: savedInformation?.title || "",
        description: savedInformation?.description || "",
        duration: savedInformation?.duration || "",
        frequency: savedInformation?.frequency || "",
        targetAudience: savedInformation?.targetAudience || "",
        location: savedInformation?.location || "",
        deliverable: savedInformation?.deliverable || "",
        price: savedInformation?.price || 0,
        sessionLength: savedInformation?.sessionLength || 0,
    })

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SavedInformationType>({
        defaultValues: {
            type: savedInformation?.type || useCase,
            title: savedInformation?.title || undefined,
            description: savedInformation?.description || undefined,
            duration: savedInformation?.duration || undefined,
            frequency: savedInformation?.frequency || undefined,
            targetAudience: savedInformation?.targetAudience || undefined,
            location: savedInformation?.location || undefined,
            deliverable: savedInformation?.deliverable || undefined,
            price: savedInformation?.price || undefined,
            sessionLength: savedInformation?.sessionLength || undefined,
        }
    })

    // submits newly created service
    function onSubmit(data:SavedInformationType){
        // convert price from string (default form input behaviour) to number
        const finalData = {
            ...data,
            type: savedInformation?.type || useCase,
            price: parseInt(data.price.toString()),
            duration: data.duration || null, 
            sessionLength: parseInt(data.sessionLength?.toString() || "0"),
            id: savedInformation?.id ?? undefined,
        } 

        // if service id exists, include data in api call to handle duplication
        if (savedInformation?.id !== undefined){
            serviceData.id = savedInformation.id
        }

        axios.post(`${process.env.REACT_APP_SKILLJA_URL}/auth/profile/create_service/`, finalData, {
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            // Reload page to update profile information with new changes
            if (res.status === 201) {
                window.location.reload()
            } else {
                console.error("submission failed")
            }
        })
        .catch(error => console.error('Error submitting form:', error))
    }

    // Handle deletion of selected service
    function handleDelete(e:React.FormEvent){
        // only trigger if a previously saved service exists
        if (savedInformation?.id !== undefined) {
            axios.post('https://www.skillja.ca/auth/profile/delete_service/', { id: savedInformation.id }, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            .then(res => {
                // Reload page to update profile information with new changes
                if (res.status === 200) {
                    window.location.reload()
                } else {
                    console.error("service deletion failed")
                }
            })
            .catch(error => console.error('Error deleting service:', error))
        }
    }

    return (
        <div className="p-3">
            <form 
                className="flex flex-col border border-main-grey-100 rounded-xl p-4"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h3 className="font-semibold mb-4 font-kulim underline">
                    {formData[0].input === 'title'? formData[0].label : 'Title'}
                </h3>
                
                {formData.map((currInput, index) => (
                    currInput.input !== 'title' && (
                        <div key={index} className="flex flex-col">
                            <label className="my-2 font-kulim" htmlFor={currInput.id}>
                                {currInput.label}
                            </label>
                            <input
                                id={currInput.id}
                                type={currInput.input}
                                {...register(currInput.id as keyof SavedInformationType, {
                                    required: currInput.required && "This field is required",
                                    minLength: currInput.minLength && {
                                        value: Number(currInput.minLength.value),
                                        message: `Minimum ${currInput.minLength.value} characters required`
                                    },
                                    maxLength: currInput.maxLength && {
                                        value: Number(currInput.maxLength.value),
                                        message: `Maximum ${currInput.maxLength.value} characters allowed`
                                    },
                                    min: currInput.min,
                                    max: currInput.max,
                                })}
                                placeholder={currInput.placeholder}
                                className="form-input w-full border-main-grey-100 px-3 mb-3"
                                autoComplete="on"
                            />
                            {errors[currInput.id as keyof SavedInformationType] && (
                                <p className="text-red-500 text-sm mb-3 mx-auto text-center">
                                    *{errors[currInput.id as keyof SavedInformationType]?.message}*
                                </p>
                            )}
                        </div>
                    )
                ))}

                {savedInformation?.id !== undefined ? 
                    <div className="flex justify-center items-center flex-wrap">
                        <button className="bg-main-green-500 rounded-xl p-3 mb-3 mt-6 mx-auto md:w-52 text-main-white hover:bg-main-green-700">
                            Update
                        </button>
                        <button 
                            className="bg-gray-500 rounded-xl p-3 mb-3 mt-6 ml-3 mr-auto md:w-52 text-main-white hover:bg-red-500"
                            onClick={handleDelete}
                            aria-label="Delete previously saved Service"
                            type="button"
                        >
                            Delete
                        </button>
                    </div>
                :
                    <button 
                        className="bg-main-green-500 rounded-xl p-3 mb-3 mt-6 mx-auto md:w-72 text-main-white hover:bg-main-green-700"
                        aria-label="Save/Create Service"
                    >
                        Save
                    </button>
                }
            </form>
        </div>
    )
}