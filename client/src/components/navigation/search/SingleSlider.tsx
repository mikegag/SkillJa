import React, { ChangeEvent } from "react"

interface SliderProps {
    sliderValue:(value:number)=> void
}

export default function singleSlider({sliderValue}: SliderProps){
    const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        sliderValue(value)
    }

    return (
        <>
            <div className="flex justify-center">
                <p className="mr-auto">0 km</p>
                <p className="mx-auto">25 km</p>
                <p className="ml-auto">50 km</p>
            </div>
            <input 
                type="range" 
                name="location" 
                min="0" 
                max="50" 
                step="5" 
                className="slider"
                onChange={handleSliderChange}
            >
            </input>
        </>
    )
}