import { faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import Filter from "./search/Filter"


export default function SearchBar(){
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    return (
        <>
        {isFilterOpen ? 
            <Filter exitView= {setIsFilterOpen} /> 
            :  
            <div role="search" className="flex bg-main-white rounded-2xl border-2 border-main-grey-100 w-96 p-3 hover:border-main-green-500 hover:cursor-pointer">
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
                    onClick={()=>setIsFilterOpen(true)}
                    className="my-auto mx-2 text-lg hover:text-main-green-500"
                    aria-label="filter icon within search bar"
                />
            </div>
        }
        </>
    )
}