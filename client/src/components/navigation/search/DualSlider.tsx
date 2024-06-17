import React, { ChangeEvent, useEffect, useState } from "react"
import data from "../../../data.json"

interface SliderProps {
    minSliderValue: (value:number)=> void, 
    maxSliderValue: (value:number)=>void,
}

export default function DualSlider({minSliderValue, maxSliderValue}:SliderProps){
    const menuData = data.filterMenu[0]
    const [minValue, setMinValue] = useState(25)
    const [maxValue, setMaxValue] = useState(75)
    const minGap = 20
    const minRange = 0
    const maxRange = 100

    useEffect(()=>{
        minSliderValue(minValue)
        maxSliderValue(maxValue)
    },[minValue,maxValue])

    //Handles the change event for the minimum range slider (left positioned slider)
    function handleMinChange(e: ChangeEvent<HTMLInputElement>){
        const value = parseInt(e.target.value)
        if (value + minGap <= maxValue) {
            setMinValue(value)
        }
    }
    //Handles the change event for the maximum range slider (right positioned slider)
    function handleMaxChange(e: ChangeEvent<HTMLInputElement>){
        const value = parseInt(e.target.value)
        if (value - minGap >= minValue) {
            setMaxValue(value)
        }
    }
    //returns left position of slider to update background color
    const getLeftPosition = () => {
        return ((minValue - minRange) / (maxRange - minRange)) * 100;
    }
     //returns right position of slider to update background color
    const getRightPosition = () => {
        return ((maxValue - minRange) / (maxRange - minRange)) * 100;
    }

    return (
        <>
            <label htmlFor="location" className="text-main-green-900 text-lg font-semibold font-kulim">
                {menuData.price.title}
            </label>
            <div className="flex justify-center my-3">
                <p className="mr-auto">$</p>
                <p className="mx-auto ">$$</p>
                <p className="mx-auto ">$$$</p>
                <p className="ml-auto">$$$$</p>
            </div>
            <div className="range-slider-container">
                <div
                    className="range-slider-fill"
                    style={{
                        left: `${getLeftPosition()}%`,
                        width: `${getRightPosition() - getLeftPosition()}%`
                    }}
                ></div>
                <input
                    type="range"
                    min={minRange}
                    max={maxRange}
                    value={minValue}
                    onChange={handleMinChange}
                    className="range-slider range-slider-1"
                />
                <input
                    type="range"
                    min={minRange}
                    max={maxRange}
                    value={maxValue}
                    onChange={handleMaxChange}
                    className="range-slider range-slider-2"
                /> 
            </div>
        </>
    )
}