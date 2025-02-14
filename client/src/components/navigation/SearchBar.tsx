import { faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import DropDown from "./search/DropDown"
import SingleSlider from "./search/SingleSlider"
import MultiOption from "./search/MultiOption"
import DualSlider from "./search/DualSlider"
import LocationSuggestions from "../../hooks/LocationSuggestions"

// Define types for the component props and the search term structure
interface SearchBarProps {
    mobileView: boolean;
    queryPage: number;
}

interface SearchTermType {
    sport: string;
    location: {place:string, proximity: number};
    price: {value: string, min:number, max:number};
}

export default function SearchBar({mobileView,queryPage}:SearchBarProps){
    // State for managing filter visibility, search term data, selected filter, and inside status
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<SearchTermType>({
        sport:'',
        location: {place:'', proximity: 10},
        price: {value: '', min:0, max:50}
    })
    const [currentlySelected, setCurrentlySelected] = useState<string>('')
    const [insideSearchBar, setInsideSearchBar] = useState<boolean>(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    // Separate refs for each input
    const sportInputRef = useRef<HTMLInputElement>(null)
    const locationInputRef = useRef<HTMLInputElement>(null)
    const priceInputRef = useRef<HTMLInputElement>(null)
    // Checks if a valid location has been selected from dropdown
    const [validLocationInput, setValidLocationInput] = useState<boolean>(false)

    // Handle focusing the correct input and clearing focus on the others
    const handleFocus = (inputType: string) => {
        // Focus the respective input
        if (inputType === "sport") {
            sportInputRef.current?.focus()
        } else if (inputType === "location") {
            locationInputRef.current?.focus()
        } else if (inputType === "price") {
            priceInputRef.current?.focus()
        }
    }

    useEffect(()=>{
        if(searchParams.get('page')){
            performSearch()
        }
    },[queryPage])

    // Checks if a valid location has been inputted and updates state which is referenced in search bar styling
    useEffect(()=>{
        const validProvinces = ['AB','BC','MB','NB','NL','NT','NS','NU','ON','PE','QC','SK', 'YT']
        setValidLocationInput(validProvinces.some(province => searchTerm.location.place.includes(province)))
    },[searchTerm.location.place])

    // Function to execute search and navigate to home feed page with query parameters
    function performSearch() {
        const queryParams = new URLSearchParams({
            sport: searchTerm.sport,
            location: searchTerm.location.place,
            proximity: searchTerm.location.proximity.toString(),
            priceValue: searchTerm.price.value,
            priceMin: Math.floor(searchTerm.price.min).toString(),
            priceMax: Math.floor(searchTerm.price.max).toString(),
            page: `${queryPage}`
        })

        navigate(`/home-feed?${queryParams.toString()}`)
    }

    // Updates selected sport in the search term
    function handleSportSelect(sport: string){
        setSearchTerm(prevTerm => ({ ...prevTerm, sport }))
    }

    // Updates location proximity in the search term
    function handleLocationChange(value: number){
        setSearchTerm(prevTerm => ({
            ...prevTerm,
            location: { ...prevTerm.location, proximity: value }
        }))
    }

    // Updates price range in the search term
    function handlePriceChange(min: number, max: number){
        setSearchTerm(prevTerm => ({
            ...prevTerm,
            price: { ...prevTerm.price, min, max }
        }))
    }

    // Checks if user clicks outside of the search bar to close it if necessary
    function handleExitSearchBar(event: MouseEvent) {
        const target = event.target as HTMLElement
        if (!target.closest('.search-bar-container')) {
            if (!insideSearchBar) {
                setCurrentlySelected('')
            }
        }
    }

    useEffect(() => {
        // Add event listener for clicks outside of the search bar
        document.addEventListener('click', handleExitSearchBar)
        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('click', handleExitSearchBar)
        }
    }, [insideSearchBar])

    return (
        <>
        {mobileView === true ?
            (isFilterOpen? 
                <div className="pop-up-background">
                    <div className="pop-up-container h-5/6">
                        <div className="flex justify-center pb-4 text-main-green-900 font-kulim">
                            <FontAwesomeIcon icon={faX} className="w-6 pr-10 ml-5 mr-auto my-auto hover:text-main-green-500 cursor-pointer" onClick={()=> {setIsFilterOpen(false)}}/>
                        </div>
                        <div className="px-6 py-1" onClick={()=>setIsFilterOpen(true)}>
                            <div className="border-b border-main-grey-100 font-kulim">
                                <p className="my-3 text-left">
                                    My Sport
                                </p>
                                <input 
                                    id="sport"
                                    name="sport"
                                    aria-label="search sport" 
                                    className={`w-full text-main-grey-400 border border-main-grey-100 p-2 mt-1 rounded-2xl hover:cursor-pointer`}
                                    placeholder="Search Sports"
                                    onChange={(e) => setSearchTerm({ ...searchTerm, sport: e.target.value })}
                                    onClick={()=>setCurrentlySelected('sport')}
                                    value={searchTerm.sport}
                                    autoComplete="off"
                                />
                                <MultiOption onSportSelect={handleSportSelect} />
                            </div>
                            <div className="border-b border-main-grey-100 pb-3 font-kulim">
                                <p className="my-3 text-left">
                                    Where
                                </p>
                                <input 
                                    id="location"
                                    name="location"
                                    aria-label="search location" 
                                    className={` w-full text-main-grey-400 border border-main-grey-100 p-2 mt-1 mb-6 rounded-2xl hover:cursor-pointer`}
                                    placeholder="My location"
                                    onChange={(e) => setSearchTerm({ ...searchTerm, location: {...searchTerm.location, place:e.target.value} })}
                                    onClick={()=>setCurrentlySelected('location')}
                                    value={searchTerm.location.place}
                                    autoComplete="off"
                                />
                                {currentlySelected === 'location' && (
                                    validLocationInput && searchTerm.location.place ?
                                    <SingleSlider sliderValue={handleLocationChange} />
                                    :
                                        <LocationSuggestions locationQuery={searchTerm.location.place} updateSearchLocation={setSearchTerm} inView={currentlySelected === 'location'} insideForm={false} />
                                )}
                                
                            </div>
                            <div className="border-b border-main-grey-100 font-kulim">
                                <p className="my-3 text-left">
                                    Price
                                </p>
                                <input 
                                    id="price"
                                    name="price"
                                    aria-label="search price" 
                                    className={` text-main-grey-400 w-full border border-main-grey-100 p-2 mt-1 mb-3 rounded-2xl hover:cursor-pointer`}
                                    placeholder="$$$"
                                    onChange={(e) => setSearchTerm({...searchTerm, price: {...searchTerm.price, value: e.target.value} })}
                                    onClick={()=>setCurrentlySelected('price')}
                                    value={searchTerm.price.value}
                                    type="number"
                                    autoComplete="off"
                                />
                                <DualSlider onPriceChange={handlePriceChange} />
                            </div>
                            <button
                                className="flex justify-center items-center ml-auto mt-12 p-2.5 rounded-xl bg-main-green-500 hover:bg-main-green-900"
                                aria-label="magnifying glass icon within search bar"
                                onClick={()=>{
                                    performSearch(); 
                                    setIsFilterOpen(prev =>!prev)
                                }}
                            >
                                <FontAwesomeIcon 
                                    icon={faMagnifyingGlass} 
                                    className="text-lg text-main-white"
                                />
                                <p className="pl-2 text-lg text-main-white">
                                    Search
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
                :  
                <div 
                    role="search" 
                    className="flex bg-main-white rounded-2xl border-2 border-main-grey-100 w-80 md:w-6/12 p-3 mx-auto hover:border-main-green-500 hover:cursor-pointer font-kulim"
                    onMouseEnter={()=>setInsideSearchBar(true)}
                    onMouseLeave={()=>setInsideSearchBar(false)}
                >
                    <FontAwesomeIcon 
                        icon={faMagnifyingGlass} 
                        onClick={()=>setIsFilterOpen(true)}
                        className="my-auto mx-2 text-lg hover:text-main-green-500"
                        aria-label="filter icon within search bar"
                    />
                    <input
                        id="search"
                        name="search"
                        aria-label="search term" 
                        className="w-full mx-2 focus:outline-none"
                        placeholder="Find coaches near me..."
                        onClick={()=>{setIsFilterOpen(true)}}
                    />
                    <button
                        className="flex justify-center items-center ml-auto mr-auto p-2 rounded-2xl cursor-pointer"
                        aria-label="magnifying glass icon within search bar"
                    />
                </div>
            )
        :
            <div
                role="search" 
                className={`${currentlySelected? 'bg-main-grey-100' :'bg-main-white'} flex rounded-2xl border-2 border-main-grey-100 w-max mx-auto mt-8 hover:border-main-green-500 hover:cursor-pointer font-kulim`}
                onMouseEnter={()=>setInsideSearchBar(true)}
                onMouseLeave={()=>setInsideSearchBar(false)}
            >
                <div
                    className={`${currentlySelected === 'sport'? 'bg-main-white': (currentlySelected ===''? 'bg-main-white' :'bg-main-grey-100')} flex flex-col justify-center items-start text-left w-60 rounded-2xl py-1.5 px-3.5`}
                    onClick={()=>{
                        setCurrentlySelected('sport');
                        handleFocus('sport');
                    }}
                >
                    <p className="text-main-black mb-1">
                        My Sport
                    </p>
                    <input 
                        id="sport"
                        name="sport"
                        aria-label="search sport" 
                        className={`${currentlySelected === 'sport'? 'bg-main-white': (currentlySelected ===''? 'bg-main-white' :'bg-main-grey-100')} w-full text-main-grey-400 focus:outline-none ml-0 hover:cursor-pointer`}
                        placeholder="Search Sports"
                        ref={sportInputRef}
                        onChange={(e) => setSearchTerm({ ...searchTerm, sport: e.target.value })}
                        onClick={()=>setCurrentlySelected('sport')}
                        value={searchTerm.sport}
                        autoComplete="off"
                    />
                    {currentlySelected === 'sport' ? <DropDown useCase="sport" onSportSelect={handleSportSelect} /> : <></>}
                </div>
                <div role="presentation" className={`h-11 w-0.5 bg-main-grey-100 rounded-full py-0.5 m-auto`}></div>
                <div
                    className={`${currentlySelected === 'location'? 'bg-main-white rounded-2xl': (currentlySelected === ''? 'bg-main-white' :'bg-main-grey-100')} flex flex-col justify-center items-start text-left rounded-2xl py-1.5 px-3.5 w-60 font-kulim`}
                    onClick={()=>{
                        setCurrentlySelected('location');
                        handleFocus('location');
                    }}
                >
                    <p className="text-main-black mb-1">
                        Where
                    </p>
                    <input 
                        id="location"
                        name="location"
                        aria-label="search location" 
                        className={`${currentlySelected === 'location'? 'bg-main-white': (currentlySelected ===''? 'bg-main-white' :'bg-main-grey-100')} w-full text-main-grey-400 focus:outline-none ml-0 hover:cursor-pointer`}
                        placeholder="My location"
                        ref={locationInputRef}
                        onChange={(e) => {const value = e.target.value;
                            setSearchTerm({ ...searchTerm, location: {...searchTerm.location, place:e.target.value} })
                        }}
                        onClick={()=>setCurrentlySelected('location')}
                        value={searchTerm.location.place}
                        autoComplete="off"
                    />
                    {currentlySelected === 'location' && (
                        validLocationInput && searchTerm.location.place ?
                            <DropDown useCase="location" onLocationChange={handleLocationChange} />
                        :
                            <LocationSuggestions locationQuery={searchTerm.location.place} updateSearchLocation={setSearchTerm} inView={currentlySelected === 'location'} insideForm={false}/>
                    )}
                </div>
                <div role="presentation" className="h-11 w-0.5 bg-main-grey-100 rounded-full py-0.5 m-auto"></div>
                <div
                    className={`${currentlySelected === 'price'? 'bg-main-white rounded-2xl': (currentlySelected ===''? 'bg-main-white' :'bg-main-grey-100')} flex justify-center items-center text-left w-56 rounded-2xl py-1.5 px-3.5`}
                    onClick={()=>{
                        setCurrentlySelected('price');
                        handleFocus('price');
                    }}
                >
                    {currentlySelected === 'price' ? <DropDown useCase="price" onPriceChange={handlePriceChange} /> : <></>}
                    <div className={`${currentlySelected === 'price'? 'bg-main-white rounded-2xl': (currentlySelected === ''? 'bg-main-white' :'bg-main-grey-100 rounded-none')} flex flex-col justify-center items-start`}>
                        <p className="text-main-black mb-1">
                            Price
                        </p>
                        <input 
                            id="price"
                            name="price"
                            aria-label="search price" 
                            className={`${currentlySelected === 'price'? 'bg-main-white': (currentlySelected === ''? 'bg-main-white':'bg-main-grey-100 rounded-none')} text-main-grey-400 w-full mx-2 focus:outline-none ml-0 hover:cursor-pointer`}
                            placeholder="$$$"
                            ref={priceInputRef}
                            onChange={(e) => setSearchTerm({...searchTerm, price: {...searchTerm.price, value: e.target.value} })}
                            onClick={()=>setCurrentlySelected('price')}
                            value={searchTerm.price.value}
                            type="number"
                            autoComplete="off"
                        />
                    </div>
                    <div className={`${currentlySelected === 'price'? 'bg-main-white rounded-3xl': (currentlySelected === ''? 'bg-main-white':'bg-main-grey-100 rounded-none')} flex my-auto`}>
                        <button
                            className="flex justify-center items-center ml-auto my-auto p-3 rounded-xl bg-main-green-500 hover:bg-main-green-900"
                            aria-label="magnifying glass icon within search bar"
                            onClick={()=>performSearch()}
                        >
                            <FontAwesomeIcon 
                                icon={faMagnifyingGlass} 
                                className="text-xl text-main-white"
                            />
                        </button>
                    </div>
                </div>
            </div>
        }
        </>
    )
}