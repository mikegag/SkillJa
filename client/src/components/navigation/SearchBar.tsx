import { faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"


export default function SearchBar(){
    return (
        <div role="search" className="flex bg-main-white rounded-2xl border-2 border-main-grey-100 w-80 p-2 hover:border-main-green-500 hover:cursor-pointer">
            <FontAwesomeIcon 
                icon={faMagnifyingGlass} 
                className="my-auto mx-2 text-lg"
                aria-label="magnifying glass icon within search bar"
            />
            <input 
                aria-label="search term" 
                className="w-full mx-2 focus:outline-none"
                placeholder="find coaches near me..."
            />
            <FontAwesomeIcon 
                icon={faSliders} 
                className="my-auto mx-2 text-lg"
                aria-label="filter icon within search bar"
            />
        </div>
    )
}