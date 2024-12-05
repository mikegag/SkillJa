import React, { useState } from "react"
import data from "../../../../data.json"
import axios from "axios"
import GetCSFR from "../../../../hooks/GetCSFR"

interface TemplateProps {
    useCase: 'full-program' | 'online-program' | 'individual-session';
    savedInformation?: SavedInformationType;
}

type CoachServiceFormType = {
    id: string;
    label: string; 
    input: string; 
    placeholder?: string;
    maxLength: number;
}[]

type SavedInformationType = {
    id?: number;
    type: string;
    title: string;
    description: string;
    duration: string;
    frequency: string;
    targetAudience?: string;
    location?: string;
    deliverable?: string;
    price: number;
}

export default function ServiceTemplate({useCase, savedInformation}:TemplateProps){
    const csrfToken = GetCSFR({ name: "csrftoken" })
    let formData = data.CoachServiceForm[useCase] as CoachServiceFormType

    const [serviceData, setServiceData] = useState<SavedInformationType>({
        type: useCase || savedInformation?.type || "",
        title: savedInformation?.title || "",
        description: savedInformation?.description || "",
        duration: savedInformation?.duration ||"",
        frequency: savedInformation?.frequency || "",
        targetAudience: savedInformation?.targetAudience || "",
        location: savedInformation?.location || "",
        deliverable: savedInformation?.deliverable || "",
        price: savedInformation?.price || 0,
    })

    // submits newly created service
    function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        // convert price from string (default form input behaviour) to number
        setServiceData((prevData) => ({
            ...prevData,
            price: Number(prevData.price)
        }))

        // if service id exists, include data in api call to handle duplication
        if (savedInformation?.id !== undefined){
            serviceData.id = savedInformation.id
        }

        axios.post('https://www.skillja.ca/auth/profile/create_service/', serviceData, {
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

    // Handle input changes for text, text area, and button fields
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target
        setServiceData(prevState => ({ ...prevState, [name]: value }))
    }    

    // Handle deletion of selected service
    function handleDelete(e:React.FormEvent){
        // if service id exists then trigger api call
        if (savedInformation?.id !== undefined){
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
    }

    return (
        <div className="p-3">
            <form 
                className="flex flex-col border border-main-grey-100 rounded-xl p-4"
            >
                <h3 className="font-semibold mb-4 font-kulim underline">
                    {formData[0].input === 'title'? formData[0].label : 'Title'}
                </h3>
                {formData.map((currInput, index)=>(
                    currInput.input !== 'title' ?
                        <div 
                            key={index}
                            className="flex flex-col"
                        >
                            <label
                                className="my-2 font-kulim"
                                htmlFor={currInput.id}
                            >
                                {currInput.label}
                            </label>
                            <input
                                id={currInput.id}
                                type={currInput.input}
                                name={currInput.id}
                                value={serviceData[currInput.id as keyof SavedInformationType] || ""}
                                placeholder={currInput.placeholder}
                                maxLength={currInput.maxLength}
                                className="form-input w-full border-main-grey-100 px-3 mb-3"
                                onChange={handleChange}
                                autoComplete="on"
                                required
                            />
                        </div>
                    :
                    <></>
                ))}
                {savedInformation?.id !== undefined ? 
                    <div className="flex justify-center items-center flex-wrap">
                        <button 
                            className="bg-main-green-500 rounded-xl p-3 mb-3 mt-6 mx-auto md:w-52 text-main-white hover:bg-main-green-700"
                            onClick={handleSubmit}
                        >
                            Update
                        </button>
                        <button 
                            className="bg-gray-500 rounded-xl p-3 mb-3 mt-6 ml-3 mr-auto md:w-52 text-main-white hover:bg-red-500"
                            onClick={handleDelete}
                            type="button"
                        >
                            Delete
                        </button>
                    </div>
                :
                    <button 
                        className="bg-main-green-500 rounded-xl p-3 mb-3 mt-6 mx-auto md:w-72 text-main-white hover:bg-main-green-700"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                }
            </form>
        </div>
    )
}