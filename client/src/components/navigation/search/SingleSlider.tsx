import React, { ChangeEvent } from "react"
import data from "../../../data.json"

interface SliderProps {
    sliderValue:(value:number)=> void
}

export default function singleSlider({sliderValue}: SliderProps){
    const menuData = data.filterMenu[0]

    const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        sliderValue(value)
    }

    return (
        <>
            <label htmlFor="location" className="text-main-green-900 text-lg font-semibold font-kulim mt-6 mb-4">
                {menuData.location.title}
            </label>
            <div className="flex justify-center">
                <p className="mr-auto">0 km</p>
                <p className="mx-auto pl-1">10 km</p>
                <p className="mx-auto pl-1">20 km</p>
                <p className="mx-auto pl-1">30 km</p>
                <p className="mx-auto pl-1">40 km </p>
                <p className="ml-auto">50 km</p>
            </div>
            <input 
                type="range" 
                name="location" 
                min="0" 
                max="50" 
                step="2" 
                className="slider"
                onChange={handleSliderChange}
            >
            </input>
        </>
    )
}