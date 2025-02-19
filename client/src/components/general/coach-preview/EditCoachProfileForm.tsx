import { faNewspaper } from "@fortawesome/free-regular-svg-icons"
import { faLocationDot, faMedal, faPhone, faUser, faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useRef, useState } from "react";
import Accordion from "../Accordion"
import data from '../../../data.json'
import GetWindowSize from '../../../hooks/general/GetWindowSize'
import axios from "axios"
import GetCSFR from "../../../hooks/userAuthentication/GetCSFR"
import ProfilePhotoUploader from "../../../hooks/images/ProfilePhotoUploader"
import { faFacebook, faInstagram, faTiktok, faTwitter } from "@fortawesome/free-brands-svg-icons"
import LocationSuggestions from "../../../hooks/general/LocationSuggestions"

interface FormStructure {
    fullname: string;
    phonenumber: string;
    location: string;
    biography: string;
    primarySport: string;
    sportInterests: string[];
    experienceLevel: string;
    ageGroups: string[];
    instagram: string;
    facebook: string;
    twitter: string;
    tiktok: string;
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
    fullname: string;
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

export default function EditCoachProfileForm({displayForm, prevSavedData}:FormProps){
    const [formData, setFormData] = useState<FormStructure>({
        fullname: prevSavedData?.fullname || '',
        phonenumber: prevSavedData?.phonenumber || '',
        location: prevSavedData?.profile.location || '',
        biography: prevSavedData?.profile.biography || '',
        primarySport: prevSavedData?.profile.primary_sport || '',
        sportInterests: prevSavedData?.preferences.specialization || [],
        experienceLevel: prevSavedData?.preferences.experience_level || '',
        ageGroups: prevSavedData?.preferences.age_groups || [],
        instagram: prevSavedData?.profile.instagram || '',
        facebook: prevSavedData?.profile.facebook || '',
        twitter: prevSavedData?.profile.twitter || '',
        tiktok: prevSavedData?.profile.tiktok || ''
    })
    const [currentPrimarySport, setCurrentPrimarySport] = useState<string>(prevSavedData?.profile.primary_sport || "")
    const [insideForm, setInsideForm] = useState<boolean>(false)
    const windowSize = GetWindowSize()
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
    const [focusedInputId, setFocusedInputId] = useState<string | null>(null)

    // Updates which element is currently in focus
    const handleFocus = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFocusedInputId(event.target.id);
    }

    // Handles form submission/saving
    function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_SKILLJA_URL}/auth/profile/update_coach_profile/`, formData, {
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
            .catch(error => {console.error('Error:', error)})
    }
    // Close the form if user clicks outside of it
    function handleExit(value:boolean){
        if(!insideForm){
            displayForm(value)
        }
    }
    // Handle input changes for text, text area, and button fields
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>) {
        const { name, value, type, dataset } = e.target
    
        if (type === 'text' && (name === 'ageGroups' || name === 'sportInterests') && dataset.index !== undefined) {
            const index = Number(dataset.index);
    
            // Safely handle list updates
            if (Array.isArray(formData[name as keyof typeof formData])) {
                const updatedList = [...formData[name as keyof typeof formData] as string[]]
                updatedList[index] = value
                setFormData(prevState => ({ ...prevState, [name]: updatedList }))
            }
        } else {
            // Handle all other input types
            setFormData(prevState => ({ ...prevState, [name]: value }))
        }
    }    
    // Update form state when radio buttons are selected
    function handleRadioChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, experienceLevel: e.target.value })
    }
    // Toggle age group selection when buttons are clicked
    function handleButtonChange(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        const duplicateAnswer = formData.ageGroups.includes(e.currentTarget.value)
        const filteredInput = formData.ageGroups.filter(currInput=>currInput!==e.currentTarget.value)
        if(!duplicateAnswer){
            setFormData({ ...formData, ageGroups: [...formData.ageGroups,e.currentTarget.value]})
        }
        else{
            setFormData({ ...formData, ageGroups: filteredInput})
        }
    }
    // Toggle sports of interest when accordion options are clicked
    function handleAccordionChange(e:React.MouseEvent<HTMLButtonElement>){
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
        faMedal,
        faInstagram,
        faFacebook,
        faTwitter,
        faTiktok
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
        else if(input.type === 'button'){
            return (
                <button
                    key={input.id}
                    value={input.placeholder}
                    className={`form-input text-main-green-900 font-semibold border-main-grey-100 px-0 my-1 w-full ${formData.ageGroups.includes(input.placeholder)? 'bg-main-green-500 text-main-white':''}`}
                    onClick={handleButtonChange}
                >
                    {input.placeholder}
                </button>
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
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        onFocus={handleFocus}
                        maxLength={220}
                    />
                ) 
                : 
                (
                    input.id === 'location' ?
                        <div className="relative">
                            <input
                                id={input.id}
                                type={input.type}
                                name={input.name}
                                className="form-input w-full border-main-grey-100"
                                placeholder={input.placeholder}
                                value={formData[input.name as keyof FormStructure] as string}
                                onChange={handleChange}
                                ref={inputRef as React.RefObject<HTMLInputElement>}
                                onFocus={handleFocus}
                                maxLength={110}
                                data-index={input.index || ''}
                                autoComplete="off"
                            />
                            {
                            focusedInputId === 'location' && (
                                <LocationSuggestions
                                    <FormStructure>
                                    locationQuery={formData.location}
                                    inView={true}
                                    insideForm={true}
                                    updateFormLocation={setFormData}
                                />
                            )}

                        </div>
                    :
                        <input
                            id={input.id}
                            type={input.type}
                            name={input.name}
                            className="form-input w-full border-main-grey-100"
                            placeholder={input.placeholder}
                            value={formData[input.name as keyof FormStructure] as string}
                            onChange={handleChange}
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            onFocus={handleFocus}
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
                <div className="flex justify-center items-center p-3 lg:px-5 bg-main-white rounded-t-xl">
                    <FontAwesomeIcon 
                        icon={faX}
                        className="text-main-green-900 hover:text-main-green-500 mr-auto cursor-pointer"
                        onClick={()=>handleExit(false)}
                        onMouseEnter={()=>setInsideForm(false)}
                    />
                    <h3 className="text-lg font-semibold font-kulim underline mx-auto text-center pl-6">
                        Edit Profile
                    </h3>
                    <p 
                        className="text-main-green-900 font-kulim my-auto hover:text-main-green-500 ml-auto cursor-pointer"
                        onClick={handleSubmit}
                    >
                        Save
                    </p>
                </div>
                <form className="flex flex-col bg-main-white p-3 lg:px-5 rounded-b-xl" onSubmit={handleSubmit}>
                    <ProfilePhotoUploader token={csrfToken!} />
                    <div className="relative">
                        <p>Personal Information</p>
                        {data.profileForms.coach.personalInformation.map(renderInput)}

                        <p className="text-xs text-main-grey-200 text-center mb-8 px-6">
                            {data.profileForms.coach.warningInfo}
                        </p>
                        <p className="my-6">Social Media Links</p>
                            {data.profileForms.coach.socialMedia.map(renderInput)}
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
                                        ${currentPrimarySport === currSport ? "bg-main-green-500 text-white" : "bg-white text-black"}
                                        hover:bg-main-green-600 hover:text-white`}
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
                            Sports You Coach
                        </p>
                        <Accordion title="Individual Sports" styles="border-main-grey-100 border rounded-xl">
                            {data.profileForms.coach.sportOptions.individual.map((option, index) => (
                                <button 
                                    onClick={(e)=>{
                                        e.preventDefault()
                                        handleAccordionChange(e);
                                    }}
                                    key={`individual-${index}`} 
                                    value={option}
                                    aria-label={`team sports option for ${option}`}
                                    className={`text-left p-3 hover:bg-main-green-700 hover:text-main-color-white ${formData.sportInterests.includes(option)? 'bg-main-green-500 text-main-white':''}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </Accordion>
                        <Accordion title="Team Sports" styles="border-main-grey-100 border rounded-xl mt-2">
                            {data.profileForms.coach.sportOptions.team.map((option, index) => (
                                <button 
                                    onClick={(e)=>{
                                        e.preventDefault()
                                        handleAccordionChange(e)
                                    }}
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
                        {data.profileForms.coach.experienceLevel.map(renderInput)}

                        <p className="my-6">Age Groups Coached</p>
                        {data.profileForms.coach.ageGroups.map(renderInput)}
                    </div>
                </form>
            </div>
        </div>
    )
}