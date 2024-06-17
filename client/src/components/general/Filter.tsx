import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { ChangeEvent, ReactEventHandler, useState } from "react"

export default function Filter(){
    const [minValue, setMinValue] = useState(25);
    const [maxValue, setMaxValue] = useState(75);
    const minGap = 10;
    const minRange = 0;
    const maxRange = 100;

    function handleMinChange(e: ChangeEvent<HTMLInputElement>){
        const value = parseInt(e.target.value)
        if (value + minGap <= maxValue) {
            setMinValue(value)
        }
    };

    function handleMaxChange(e: ChangeEvent<HTMLInputElement>){
        const value = parseInt(e.target.value)
        if (value - minGap >= minValue) {
            setMaxValue(value)
        }
    }
    
    return (
        <div className="w-dvw h-dvh flex justify-center items-center bg-black bg-opacity-60 absolute pb-10 top-0 left-0">
            <div className="flex flex-col bg-white rounded-2xl border border-main-black w-80 h-96 lg:w-6/12 lg:h-4/6 overflow-scroll py-5">
                <div className="flex justify-center pb-4 border-b-2 border-main-grey-200 text-main-green-900 font-kulim">
                    <FontAwesomeIcon icon={faX} className="w-6 pr-10 ml-5 mr-auto my-auto hover:text-main-green-500 cursor-pointer"/>
                    <p className="my-auto text-xl font-semibold mx-auto">Filters</p>
                    <p className="w-16 text-main-grey-300 ml-auto mr-5 my-auto cursor-pointer hover:text-main-green-500">Clear All</p>
                </div>
                <form className="flex flex-col px-8">
                    <label htmlFor="location" className="text-main-green-900 text-lg font-semibold font-kulim mt-6 mb-4">
                        Location
                    </label>
                    <div className="flex justify-center">
                        <p className="mr-auto">
                            0 km
                        </p>
                        <p className="mx-auto pl-1">
                            10 km
                        </p>
                        <p className="mx-auto pl-1">
                            20 km
                        </p>
                        <p className="mx-auto pl-1">
                            30 km
                        </p>
                        <p className="mx-auto pl-1">
                            40 km
                        </p>
                        <p className="ml-auto">
                            50 km
                        </p>
                    </div>
                    <input type="range" name="location" min="0" max="50" step="2" className="slider"></input>
                    <div role="presentation" className="h-0.5 my-10 bg-main-grey-100 rounded-full"></div>
                    <div className="relative w-full"> 
                        <label htmlFor="location" className="text-main-green-900 text-lg font-semibold font-kulim mt-6 mb-4">
                            Price
                        </label>
                        <div className="flex justify-center mt-4">
                            <p className="mr-auto">
                                $
                            </p>
                            <p className="mx-auto ">
                                $$
                            </p>
                            <p className="mx-auto ">
                                $$$
                            </p>
                            <p className="ml-auto">
                                $$$$
                            </p>
                        </div>
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
                </form>
            </div>
        </div>
    )
}