import { faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import Filter from "./search/Filter"
import axios from "axios"
import GetCSFR from "../../hooks/GetCSFR"

export default function SearchBar(){
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const [searchTerm, setSearchTerm] = useState<string>('')

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
        if (e.key === 'Enter') {
            e.preventDefault()
            performSearch(searchTerm)
        }
    }

    function performSearch(query: string){
        axios.get('https://www.skillja.ca/search', { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }) 
            .then(res => {
                if (res.status === 200) {
                    
                } else {
                    console.error("Failed to retrieve services")
                }
            })
            .catch(error => {
                if (error.response) {
                    // the server responded with a status code that falls out of the range of 2xx
                    console.error('Error response:', error.response.data)
                    console.error('Status:', error.response.status)
                    console.error('Headers:', error.response.headers)
                } else if (error.request) {
                    // no response was received
                    console.error('No response received:', error.request)
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error setting up request:', error.message)
                }
                console.error('Error config:', error.config)
            })
    }

    return (
        <>
        {isFilterOpen ? 
            <Filter exitView= {setIsFilterOpen} /> 
            :  
            <div role="search" className="flex bg-main-white rounded-2xl border-2 border-main-grey-100 w-80 lg:w-4/12 p-3 hover:border-main-green-500 hover:cursor-pointer">
                <FontAwesomeIcon 
                    icon={faMagnifyingGlass} 
                    className="my-auto mx-2 text-lg"
                    aria-label="magnifying glass icon within search bar"
                />
                <input 
                    aria-label="search term" 
                    className="w-full mx-2 focus:outline-none"
                    placeholder="find coaches near me..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={searchTerm}
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