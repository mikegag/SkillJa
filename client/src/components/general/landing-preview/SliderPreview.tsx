import React, { useState, useEffect } from "react";
import data from "../../../data.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import useWindowSize from '../../../hooks/GetWindowSize';

export default function SliderPreview() {
    const sliderData = data.onboarding.sports
    // Initialize state to track the starting index of visible items
    const [startIndex, setStartIndex] = useState(0)
    // Get current window size
    const windowSize = useWindowSize() 
    // Number of items to show at once dependent on window size
    const [itemsToShow, setItemsToShow] = useState(windowSize.width < 1150 ? 4 : 5) 

    // Update the number of items to show based on the current window size
    useEffect(() => {
        setItemsToShow(windowSize.width < 1150 ? 4 : 5)
    }, [windowSize])

    // Handle the "next" button click
    const handleNext = () => {
        // Ensure that we don't go out of bounds
        if (startIndex + itemsToShow < sliderData.length) {
            setStartIndex(startIndex + itemsToShow)
        }
    }

    // Handle the "previous" button click
    const handlePrev = () => {
        // Ensure that we don't go out of bounds
        if (startIndex - itemsToShow >= 0) {
            setStartIndex(startIndex - itemsToShow)
        }
    }

    // Get the visible items based on the current startIndex and itemsToShow
    const visibleSports = sliderData.slice(startIndex, startIndex + itemsToShow)

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
                className={`ml-6 ${startIndex + itemsToShow >= sliderData.length ? 'opacity-50 cursor-not-allowed' : 'hover:text-main-green-500 cursor-pointer'}`} 
                onClick={handleNext} 
            />
        </div>
    );
}
