import React, { ChangeEvent, useEffect, useState } from "react"

interface SliderProps {
    onPriceChange: (min: number, max: number) => void;
}

export default function DualSlider({onPriceChange}:SliderProps){
    const [minValue, setMinValue] = useState(0)
    const [maxValue, setMaxValue] = useState(100)
    const minGap = 20
    const minRange = 0
    const maxRange = 100

    useEffect(()=>{
        onPriceChange(minValue, maxValue)
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
            <div className="range-slider-container">
                <div className="flex justify-center my-3">
                    <p className="mr-auto">$</p>
                    <p className="mx-auto ">$$</p>
                    <p className="mx-auto ">$$$</p>
                    <p className="ml-auto">$$$$</p>
                </div>
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