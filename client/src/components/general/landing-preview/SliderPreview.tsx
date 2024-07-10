import React, { useState } from "react";
import data from "../../../data.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

// Number of items to show at once
const windowSize = 5 

export default function SliderPreview() {
    const sliderData = data.onboarding.sports
    const [startIndex, setStartIndex] = useState(0)

    const handleNext = () => {
        if (startIndex + windowSize < sliderData.length) {
            setStartIndex(startIndex + windowSize)
        }
    }

    const handlePrev = () => {
        if (startIndex - windowSize >= 0) {
            setStartIndex(startIndex - windowSize)
        }
    }

    const visibleSports = sliderData.slice(startIndex, startIndex + windowSize)

    return (
        <div className="flex w-full px-10 justify-center items-center">
            <FontAwesomeIcon 
                icon={faChevronLeft} 
                className={`mr-6 ${startIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-main-green-500 cursor-pointer'}`} 
                onClick={handlePrev} 
            />
            <div className="w-7/12 flex justify-between">
                {visibleSports.map((currSport, index) => (
                    <div key={index} className="bg-main-white py-2 px-4 border rounded-xl" role="presentation">
                        {currSport}
                    </div>
                ))}
            </div>
            <FontAwesomeIcon 
                icon={faChevronRight} 
                className={`ml-6 ${startIndex + windowSize >= sliderData.length ? 'opacity-50 cursor-not-allowed' : 'hover:text-main-green-500 cursor-pointer'}`} 
                onClick={handleNext} 
            />
        </div>
    );
}
