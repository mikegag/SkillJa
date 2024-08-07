import { faNewspaper } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot, faMedal, faPhone, faUser, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Accordion from "../Accordion";
import data from '../../../data.json'

interface FormStructure {
    fullname: string,
    phonenumber: string,
    address: string,
    biography: string,
    goals: string[],
    primarySport: string,
    sportInterests: string[],
    experienceLevel: string
}

interface FormProps {
    displayForm: (value:boolean) => void
}


export default function EditAthleteProfileForm({displayForm}:FormProps){
    const [formData, setFormData] = useState<FormStructure>({
        fullname: '',
        phonenumber: '',
        address: '',
        biography: '',
        goals: [''],
        primarySport: '',
        sportInterests: [''],
        experienceLevel: ''
    })
    
    const [currentSelectedSports, setCurrentSelectedSports] = useState<string[]>([])
    const [insideForm, setInsideForm] = useState<boolean>(false)

    function handleSubmit(e:React.FormEvent){
        e.preventDefault()
    }

    function handleExit(value:boolean){
        if(insideForm === false){
            displayForm(value)
            setTimeout(() => {
                setInsideForm(true)
            }, 1000);
        }
    }

    
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value, type, dataset } = e.target
    
        if (type === 'text' && (name === 'goals' || name === 'sportInterests') && dataset.index !== undefined) {
            const index = Number(dataset.index);
    
            // Safely handle list updates
            if (Array.isArray(formData[name as keyof typeof formData])) {
                const updatedList = [...formData[name as keyof typeof formData] as string[]]
                updatedList[index] = value
                setFormData(prevState => ({ ...prevState, [name]: updatedList }))
            }
        } else {
            // Handle regular inputs
            setFormData(prevState => ({ ...prevState, [name]: value }))
        }
    }    

    function handleRadioChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, experienceLevel: e.target.value })
    }

    const icons: Record<string, any> = {
        faUser,
        faPhone,
        faLocationDot,
        faNewspaper,
        faMedal
    }

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
                        name={input.name}
                        className="form-input w-full border-main-grey-100 max-h-24 min-h-24"
                        placeholder={input.placeholder}
                        value={formData[input.name as keyof FormStructure] as string}
                        onChange={handleChange}
                    />
                ) : (
                    <input
                        type={input.type}
                        name={input.name}
                        className="form-input w-full border-main-grey-100"
                        placeholder={input.placeholder}
                        value={formData[input.name as keyof FormStructure] as string}
                        onChange={handleChange}
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
            onClick={()=>handleExit(false)}
        >
            <div 
                className="pop-up-container" 
                onMouseEnter={()=>setInsideForm(true)} 
                onMouseLeave={()=>setInsideForm(false)}
            >
                <div className="flex justify-center items-center border-b border-main-grey-100 p-3 lg:px-5 bg-main-white rounded-t-xl">
                    <FontAwesomeIcon 
                        icon={faX}
                        className="text-main-green-900 hover:text-main-green-500 mr-auto cursor-pointer"
                        onClick={()=>handleExit(true)}
                        onMouseEnter={()=>setInsideForm(false)}
                    />
                    <h3 className="text-lg font-medium font-source mx-auto text-center pl-6">
                        Edit Profile
                    </h3>
                    <p 
                        className="text-main-green-900 hover:text-main-green-500 ml-auto cursor-pointer"
                    >
                        Save
                    </p>
                </div>
                <form className="flex flex-col bg-main-white p-3 lg:px-5 rounded-b-xl" onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-center items-center my-5">
                        <img 
                            src={require('../../../assets/default-avatar.jpg')} 
                            className="w-28 rounded-xl"
                        />
                        <button className="mt-8 mx-auto py-2 px-4 bg-main-green-500 text-main-white font-kulim rounded-xl hover:bg-main-green-700">
                            Edit Photo
                        </button>
                    </div>
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
                        {formData.sportInterests[0] !== '' ?
                            formData.sportInterests.map((currSport,index)=>(
                                <button 
                                    onClick={(e)=>{e.preventDefault(); setFormData({...formData, primarySport: currSport})}}
                                    key={index}
                                    className="py-2 px-4 bg-main-white border border-main-grey-100 cursor-pointer"
                                >
                                    {currSport}
                                </button>
                            ))
                        :
                            <p className="text-sm text-main-grey-200 text-center my-4">
                                No Primary Sport Available
                            </p>
                        }

                        <p className="my-6">
                            Sports of Interest
                        </p>
                        <Accordion title="Individual Sports" style="border-main-grey-100">
                            {data.profileForms.athlete.sportOptions.individual.map((option, index) => (
                                <button 
                                    onClick={(e)=>{
                                        e.preventDefault();
                                        setCurrentSelectedSports(prev => 
                                            prev.includes(option) 
                                                ? prev.filter(item => item !== option) 
                                                : [...prev, option])
                                    }}
                                    key={`individual-${index}`} 
                                    aria-label={`team sports option for ${option}`}
                                    className={`text-left p-3 hover:bg-main-green-700 hover:text-main-color-white ${currentSelectedSports.includes(option)? 'bg-main-green-500 text-main-white':''}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </Accordion>
                        <Accordion title="Team Sports" style="border-main-grey-100">
                            {data.profileForms.athlete.sportOptions.team.map((option, index) => (
                                <button 
                                    onClick={(e)=>{
                                        e.preventDefault();
                                        setCurrentSelectedSports(prev => 
                                            prev.includes(option) 
                                                ? prev.filter(item => item !== option) 
                                                : [...prev, option])
                                    }}
                                    key={`individual-${index}`} 
                                    aria-label={`team sports option for ${option}`}
                                    className={`text-left p-3 hover:bg-main-green-700 hover:text-main-color-white ${currentSelectedSports.includes(option)? 'bg-main-green-500 text-main-white':''}`}
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