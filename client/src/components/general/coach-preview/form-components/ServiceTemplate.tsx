import React from "react";
import data from "../../../../data.json"

interface TemplateProps {
    useCase: 'full-program' | 'online-program' | 'individual-session';
    savedInformation?: SavedInformationType;
}

type CoachServiceFormType = {
    id: string;
    label: string; 
    input: string; 
    placeholder?: string;
}[]

type SavedInformationType = {
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
    let formData = data.CoachServiceForm.fullProgram as CoachServiceFormType
    if(useCase === 'full-program'){
        formData = data.CoachServiceForm.fullProgram as CoachServiceFormType
    }
    else if(useCase === 'online-program'){
        formData = data.CoachServiceForm.onlineProgram as CoachServiceFormType
    }
    else if(useCase === 'individual-session'){
        formData = data.CoachServiceForm.individualSession as CoachServiceFormType
    }

    function handleSubmit(){
        //api call
    }

    return (
        <div className="p-3">
            <form 
                onSubmit={handleSubmit} 
                className="flex flex-col border border-main-grey-100 rounded-xl p-3"
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
                            >
                                {currInput.label}
                            </label>
                            <input
                                id={currInput.id}
                                type={currInput.input}
                                placeholder={savedInformation ? String(savedInformation[currInput.id as keyof SavedInformationType]) : currInput.placeholder}
                                className="form-input w-full border-main-grey-100 px-2 mb-3"
                            />
                        </div>
                    :
                    <></>
                ))}
                <button 
                    className="bg-main-green-500 rounded-xl p-3 mb-3 mt-6 mx-auto lg:w-72 text-main-white hover:bg-main-green-700"
                >
                    Save
                </button>
            </form>
        </div>
    )
}