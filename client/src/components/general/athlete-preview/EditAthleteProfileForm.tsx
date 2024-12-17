import { faNewspaper } from "@fortawesome/free-regular-svg-icons"
import { faLocationDot, faMedal, faPhone, faUser, faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import Accordion from "../Accordion"
import data from '../../../data.json'
import GetWindowSize from '../../../hooks/GetWindowSize'
import axios from "axios"
import GetCSFR from "../../../hooks/GetCSFR"
import ProfilePhotoUploader from "../../../hooks/ProfilePhotoUploader"

interface FormStructure {
    fullname: string,
    phonenumber: string,
    location: string,
    biography: string,
    goals: string[],
    primarySport: string,
    sportInterests: string[],
    experienceLevel: string
}

interface FormProps {
    displayForm: (value:boolean) => void;
    prevSavedData?: ProfileDetails;
}

interface Review {
    id: number;
    title: string;
    description: string;
    rating: string;
    date: string;
}

interface Service {
    type: string;
    title: string;
    description: string;
    duration: string;
    frequency?: string;
    target_audience?: string;
    location?: string;
    deliverable?: string;
    price: number;
}
  
interface ProfileDetails {
    name: string;
    email: string;
    iscoach: boolean;
    isathlete: boolean;
    phonenumber: string;
    profile: {
        location: string;
        biography: string;
        primary_sport: string;
        picture: string | null;
        reviews: Review[];
        rating: number;
        instagram?: string,
        facebook?: string,
        twitter?: string,
        tiktok?: string
    };
    preferences: {
        experience_level: string;
        goals?: string[];
        sport_interests?: string[];
        age_groups?: string[];
        specialization?: string[];
        services?: Service[];
    }
}

export default function EditAthleteProfileForm({displayForm, prevSavedData}:FormProps){
    const [formData, setFormData] = useState<FormStructure>({
        fullname: prevSavedData?.name || "",
        phonenumber: prevSavedData?.phonenumber || "",
        location: prevSavedData?.profile.location || "",
        biography: prevSavedData?.profile.biography || "",
        goals: prevSavedData?.preferences.goals || [],
        primarySport: prevSavedData?.profile.primary_sport || "",
        sportInterests: prevSavedData?.preferences.sport_interests || [],
        experienceLevel: prevSavedData?.preferences.experience_level || ""
    })
    const [currentPrimarySport, setCurrentPrimarySport] = useState<string>(prevSavedData?.profile.primary_sport || "")
    const [insideForm, setInsideForm] = useState<boolean>(false)
    const windowSize = GetWindowSize()
    const csrfToken = GetCSFR({ name: "csrftoken" })

    // Handles form submission/saving
    function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        axios.post('https://www.skillja.ca/auth/profile/update_athlete_profile/', formData, {
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
    // Close the form if user clicks outside of it
    function handleExit(value:boolean){
        if(!insideForm){
            displayForm(value)
        }
    }
    // Handle input changes for text, text area, and button fields
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value, dataset } = e.target

        if (name.toLowerCase().includes('goal') && dataset.index !== undefined) {
            const index = Number(dataset.index)
            let updatedGoals = [...formData.goals]
            if (!formData.goals[index]) {
                updatedGoals.push(value)
            } else {
                updatedGoals[index] = value
            }
            setFormData(prevState => ({ ...prevState, goals: updatedGoals }))
        
        } else if (name === 'sportInterests' && dataset.index !== undefined) {
            const index = Number(dataset.index)
            const updatedSports = [...formData.sportInterests]
            updatedSports[index] = value
            setFormData(prevState => ({ ...prevState, sportInterests: updatedSports }))
        } else {
            setFormData(prevState => ({ ...prevState, [name]: value }))
        }
    }
    // Update form state when radio buttons are selected
    function handleRadioChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, experienceLevel: e.target.value })
    }
    // Toggle sports of interest when accordion options are clicked
    function handleAccordionChange(e:React.MouseEvent<HTMLButtonElement>){
        e.preventDefault()
        const duplicateAnswer = formData.sportInterests.includes(e.currentTarget.value)
        const filteredInput = formData.sportInterests.filter(currInput=>currInput!==e.currentTarget.value)
        if(!duplicateAnswer){
            setFormData({ ...formData, sportInterests: [...formData.sportInterests,e.currentTarget.value]})
        }
        else{
            setFormData({ ...formData, sportInterests: filteredInput})
        }
    }
    // Define icons used across the form
    const icons: Record<string, any> = {
        faUser,
        faPhone,
        faLocationDot,
        faNewspaper,
        faMedal
    }
    // Render form inputs dynamically based on their type
    function renderInput(input: any) {
        const IconComponent = icons[input.icon]
        if (input.type === 'radio') {
            return (
                <div 
                    key={input.id} 
                    className={`flex items-center form-input border-main-grey-100 px-0 my-2 w-full ${formData.experienceLevel === input.value? 'bg-main-green-500':''}`}
                >
                    <input 
                        type="radio" 
                        id={input.id}
                        name={input.name}
                        value={input.value}
                        checked={formData.experienceLevel === input.value}
                        onChange={handleRadioChange}
                        className="form-radio-input w-min"
                    />
                    <label htmlFor={input.id} className={`w-full text-main-green-900 font-semibold cursor-pointer text-center ${formData.experienceLevel === input.value? 'text-main-white':''}`}>
                        {input.label}
                    </label>
                </div>
            )
        }
        return (
            <div key={input.id} className="relative w-full mb-5 mt-5">
                {input.type === 'textarea' ? (
                    <textarea
                        id={input.id}
                        name={input.name}
                        className="form-input w-full border-main-grey-100 max-h-24 min-h-24"
                        placeholder={input.placeholder}
                        value={formData[input.name as keyof FormStructure] as string}
                        onChange={handleChange}
                        maxLength={220}
                    />
                ) : (
                    <input
                        id={input.id}
                        type={input.type}
                        name={input.name}
                        className="form-input w-full border-main-grey-100"
                        placeholder={input.placeholder}
                        value={formData[input.name as keyof FormStructure] as string}
                        onChange={handleChange}
                        maxLength={110}
                        data-index={input.index || ''}
                    />
                )}
                <FontAwesomeIcon
                    icon={IconComponent}
                    className="absolute inset-y-4 left-0 flex items-center pl-4 text-main-grey-500"
                />
            </div>
        )
    }

    return (
        <div className="pop-up-background" 
            onClick={windowSize.width >=1024 ? 
                ()=>handleExit(false) 
            : 
                undefined
            }
        > 
            <div 
                className="pop-up-container h-4/5" 
                onMouseEnter={()=>setInsideForm(true)} 
                onMouseLeave={()=>setInsideForm(false)}
            >
                <div className="flex justify-center items-center border-b border-main-grey-100 p-3 lg:px-5 bg-main-white rounded-t-xl">
                    <FontAwesomeIcon 
                        icon={faX}
                        className="text-main-green-900 hover:text-main-green-500 mr-auto cursor-pointer"
                        onClick={()=>handleExit(false)}
                        onMouseEnter={()=>setInsideForm(false)}
                    />
                    <h3 className="text-lg font-medium font-source mx-auto text-center pl-6">
                        Edit Profile
                    </h3>
                    <p 
                        className="text-main-green-900 hover:text-main-green-500 ml-auto cursor-pointer"
                        onClick={handleSubmit}
                    >
                        Save
                    </p>
                </div>
                <form className="flex flex-col bg-main-white p-3 lg:px-5 rounded-b-xl" onSubmit={handleSubmit}>
                    <ProfilePhotoUploader token={csrfToken!}/>
                    <div>
                        <p>Personal Information</p>
                        {data.profileForms.athlete.personalInformation.map(renderInput)}

                        <p className="text-xs text-main-grey-200 text-center mb-8 px-6">
                            {data.profileForms.athlete.warningInfo}
                        </p>
                        <p className="my-6">
                            My Current Goals
                        </p>
                        {data.profileForms.athlete.goals.map(renderInput)}

                        <p className="my-6">
                            Primary Sport
                        </p>
                        {formData.sportInterests.length !== 0 || prevSavedData?.profile.primary_sport ?
                            <>
                            {formData.sportInterests.map((currSport,index)=>(
                                <button 
                                    onClick={(e)=>{
                                        e.preventDefault(); 
                                        setFormData({...formData, primarySport: currSport});
                                        setCurrentPrimarySport(currSport);
                                    }}
                                    key={index}
                                    className={`py-2 px-4 rounded-xl mr-2 border border-main-grey-100 cursor-pointer
                                        ${currentPrimarySport === currSport ? "bg-main-color-darkgreen text-white" : "bg-white text-black"}
                                        hover:bg-main-color-lightgreen`}
                                >
                                    {currSport}
                                </button>
                            ))}
                            </>

                        :
                            <p className="text-sm text-main-grey-200 text-center my-4">
                                No Primary Sport Available
                            </p>
                        }

                        <p className="my-6">
                            Sports of Interest
                        </p>
                        <Accordion title="Individual Sports" styles="border-main-grey-100">
                            {data.profileForms.athlete.sportOptions.individual.map((option, index) => (
                                <button 
                                    onClick={(e)=>{e.preventDefault(); handleAccordionChange(e)}}
                                    key={`individual-${index}`} 
                                    value={option}
                                    aria-label={`team sports option for ${option}`}
                                    className={`text-left p-3 hover:bg-main-green-700 hover:text-main-color-white ${formData.sportInterests.includes(option)? 'bg-main-green-500 text-main-white':''}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </Accordion>
                        <Accordion title="Team Sports" styles="border-main-grey-100">
                            {data.profileForms.athlete.sportOptions.team.map((option, index) => (
                                <button 
                                    onClick={(e)=>{e.preventDefault(); handleAccordionChange(e)}}
                                    key={`individual-${index}`} 
                                    value={option}
                                    aria-label={`team sports option for ${option}`}
                                    className={`text-left p-3 hover:bg-main-green-700 hover:text-main-color-white ${formData.sportInterests.includes(option)? 'bg-main-green-500 text-main-white':''}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </Accordion>

                        <p className="my-6">Experience Level</p>
                        {data.profileForms.athlete.experienceLevel.map(renderInput)}
                    </div>
                </form>
            </div>
        </div>
    )
}