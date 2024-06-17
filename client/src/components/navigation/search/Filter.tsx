import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { ChangeEvent, useEffect, useState } from "react"
import data from "../../../data.json"
import DualSlider from "./DualSlider"
import SingleSlider from "./SingleSlider"
import MultiOption from "./MultiOption"

interface FilterProps {
    exitView: (value:boolean) => void
}

export default function Filter({exitView}:FilterProps){
    const [singleSliderValue, setSingleSliderValue] = useState(0)
    const [minDualSliderValue, setMinDualSliderValue] = useState(0)
    const [maxDualSliderValue, setMaxDualSliderValue] = useState(100)
    const [MultiOptionValues, setMultiOptionValues] = useState<string[]>([])
    const [insideFilter, setInsideFilter] = useState<boolean>(false)
    const menuData = data.filterMenu[0]
    
    function handleExit(value:boolean){
        if(insideFilter === false){
            exitView(value)
        }
    }

    return (
        <div className="pop-up-background" onClick={()=>handleExit(false)}>
            <div className="pop-up-container" onMouseEnter={()=>setInsideFilter(true)} onMouseLeave={()=>setInsideFilter(false)}>
                <div className="flex justify-center pb-4 border-b-2 border-main-grey-200 text-main-green-900 font-kulim">
                    <FontAwesomeIcon icon={faX} className="w-6 pr-10 ml-5 mr-auto my-auto hover:text-main-green-500 cursor-pointer" onClick={()=> {handleExit(false)}} onMouseEnter={()=>setInsideFilter(false)}/>
                    <p className="my-auto text-xl font-semibold mx-auto">Filters</p>
                    <p className="w-16 text-main-grey-300 ml-auto mr-5 my-auto cursor-pointer hover:text-main-green-500">
                        Clear All
                    </p>
                </div>
                <form className="flex flex-col px-8">
                    <SingleSlider sliderValue={setSingleSliderValue} />
                    <div role="presentation" className="h-0.5 my-10 bg-main-grey-100 rounded-full"></div>
                    <div className="relative w-full mb-8"> 
                        <DualSlider minSliderValue={setMinDualSliderValue} maxSliderValue={setMaxDualSliderValue} />
                    </div>
                    <div role="presentation" className="h-0.5 mt-6 mb-4 bg-main-grey-100 rounded-full"></div>
                    <MultiOption selectedValues={setMultiOptionValues} />
                    <div role="presentation" className="h-0.5 mt-10 bg-main-grey-100 rounded-full"></div>
                    <div className="flex w-full my-7 p-3">
                        <button type="submit" className="mt-2 ml-auto select-btn font-kulim">
                            Show Results
                        </button>       
                    </div>
                </form>
            </div>
        </div>
    )
}