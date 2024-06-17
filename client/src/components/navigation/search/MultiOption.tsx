import React, { useEffect, useState } from "react"
import data from "../../../data.json"

interface SliderProps {
    selectedValues: (value:string[])=> void
}
export default function MultiOption({selectedValues}:SliderProps){
    const menuData = data.filterMenu[0]
    const [answers, setAnswers] = useState<string[]>([])

    //updates array of answers based on new selection
    function handleAnswer(e:React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault()
        const selection = (e.target as HTMLInputElement).value
        //if selected answer is already within previous array of choices it is not added
        const updatedAnswers = answers.includes(selection) ? 
            ( answers.filter((ans: string) => ans !== selection) )
            : 
            //removes initial empty selection from array
            answers.includes('') ? 
                ( answers.filter((ans: string) => ans !== '') )
                :
                [...answers, selection]
        setAnswers(updatedAnswers)
    }

    useEffect(()=>{
        selectedValues(answers)
    },[answers])

    return (
        <>
            <label htmlFor="location" className="text-main-green-900 text-lg font-semibold font-kulim mt-6 mb-4">
                {menuData.sport.title}
            </label>
            <div className="flex flex-wrap mt-4">
                {menuData.sport.options.map((option, index) => (
                    <button
                        key={`sport=${index}`}
                        onClick={(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleAnswer(e)}
                        value={option}
                        aria-label={`sport filter option for ${option}`}
                        className={`rounded-full shadow-sm select-btn m-2 border-main-grey-200 ${answers.includes(option) ? 'bg-main-green-500 text-main-white' : 'bg-main-white text-main-black'}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </>
    )
}