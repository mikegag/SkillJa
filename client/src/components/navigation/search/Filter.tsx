import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { ChangeEvent, useEffect, useState } from "react"
import data from "../../../data.json"
import DualSlider from "./DualSlider"



export default function Filter(){
    const [minValue, setMinValue] = useState(25)
    const [maxValue, setMaxValue] = useState(75)
    const [singleSliderValue, setSingleSliderValue] = useState(0)
    const [minDualSliderValue, setMinDualSliderValue] = useState(0)
    const [maxDualSliderValue, setMaxDualSliderValue] = useState(100)
    const minGap = 10
    const minRange = 0
    const maxRange = 100
    const menuData = data.filterMenu[0]

    function handleMinChange(e: ChangeEvent<HTMLInputElement>){
        const value = parseInt(e.target.value)
        if (value + minGap <= maxValue) {
            setMinValue(value)
        }
    }

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
        <div className="pop-up-background">
            <div className="pop-up-container">
                <div className="flex justify-center pb-4 border-b-2 border-main-grey-200 text-main-green-900 font-kulim">
                    <FontAwesomeIcon icon={faX} className="w-6 pr-10 ml-5 mr-auto my-auto hover:text-main-green-500 cursor-pointer"/>
                    <p className="my-auto text-xl font-semibold mx-auto">Filters</p>
                    <p className="w-16 text-main-grey-300 ml-auto mr-5 my-auto cursor-pointer hover:text-main-green-500">Clear All</p>
                </div>
                <form className="flex flex-col px-8">
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
                    <input type="range" name="location" min="0" max="50" step="2" className="slider"></input>
                    <div role="presentation" className="h-0.5 my-10 bg-main-grey-100 rounded-full"></div>
                    <div className="relative w-full mb-8"> 
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
                    </div>
                    <div role="presentation" className="h-0.5 my-7 bg-main-grey-100 rounded-full"></div>
                    <div>
                        <label htmlFor="location" className="text-main-green-900 text-lg font-semibold font-kulim mt-6 mb-4">
                            {menuData.sport.title}
                        </label>
                        <div className="flex flex-wrap mt-4">
                            {menuData.sport.options.map((option, index) => (
                                <button
                                    key={`sport=${index}`}
                                    aria-label={`sport filter option for ${option}`}
                                    className={`rounded-full shadow-sm select-btn m-2 border-main-grey-200`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                    <DualSlider minSliderValue={setMinDualSliderValue} maxSliderValue={setMaxDualSliderValue} />
                    <div className="flex w-full border-t-2 my-7 border-main-grey-100 p-3">
                        <button type="submit" className="mt-6 ml-auto select-btn font-kulim">
                            Show Results
                        </button>       
                    </div>
                </form>
                
            </div>
        </div>
    )
}