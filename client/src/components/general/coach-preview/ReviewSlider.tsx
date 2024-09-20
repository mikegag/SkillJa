import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faStar } from "@fortawesome/free-solid-svg-icons";

interface Review {
    id: number;
    title: string;
    description: string;
    rating: string;
    date: string;
}

interface ReviewData {
    data: Review[]
}
export default function ReviewSlider({data}:ReviewData) {
    // Initialize state to track the starting index of visible items
    const [startIndex, setStartIndex] = useState(0)
    // Number of items to show at once dependent on window size
    const [itemsToShow, setItemsToShow] = useState(1) 

    // Handle the "next" button click
    const handleNext = () => {
        // Ensure that we don't go out of bounds
        if (startIndex + itemsToShow < data.length) {
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
    const visibleReviews = data.slice(startIndex, startIndex + itemsToShow)

    return (
        <div className="flex w-full lg:px-10 justify-center items-center">
            <FontAwesomeIcon 
                icon={faChevronLeft} 
                className={`mr-2 p-1 ${startIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-main-green-500 cursor-pointer'}`} 
                onClick={handlePrev} 
            />
            <div className="flex justify-between">
                {visibleReviews.map((currReview, index) => (
                    <div 
                        key={index} 
                        className="flex flex-col font-kulim bg-main-white py-2 px-4 border border-main-grey-100 rounded-xl"
                    >
                        <div className="flex mb-2">
                            {Array.from({length:Math.round(Number(currReview.rating))}, (_,i)=> 
                                <FontAwesomeIcon icon={faStar} className="text-amber-300 my-auto" key={i}/>
                            )}
                            <p className="text-main-grey-200 my-auto ml-auto">
                                {currReview.date}
                            </p>
                        </div>
                        <p className="font-bold my-1 text-left mr-auto">
                            {currReview.title}
                        </p>
                        <p className="text-left my-1">
                            {currReview.description}
                        </p>
                    </div>
                ))}
            </div>
            <FontAwesomeIcon 
                icon={faChevronRight} 
                className={`ml-2 p-1 ${startIndex + itemsToShow >= data.length ? 'opacity-50 cursor-not-allowed' : 'hover:text-main-green-500 cursor-pointer'}`} 
                onClick={handleNext} 
            />
        </div>
    )
}
