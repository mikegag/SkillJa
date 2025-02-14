import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import _ from 'lodash'
import GetWindowSize from '../../../hooks/GetWindowSize'

interface Location {
  name: string;
}

interface SearchTermType {
  sport: string;
  location: {place:string, proximity: number};
  price: {value: string, min:number, max:number};
}

interface Props {
  locationQuery: string;
  updateLocation: (updateFn: (prev: SearchTermType) => SearchTermType) => void;
  inView: boolean;
}

export default function LocationSuggestions({locationQuery, updateLocation, inView}:Props){
  const [locations, setLocations] = useState<Location[] | null>(null)
  const windowSize = GetWindowSize()

  const fetchLocations = async (locationQuery:string) => {
    if (!locationQuery) {
      setLocations(null)
      return
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_SKILLJA_URL}/search/location/?search=${locationQuery}`)
      setLocations(response.data.locations)
    } catch (error) {
      console.error("Error fetching locations:", error)
    }
  }

  // Memoize debounce function so it doesn't change on re-renders
  const debouncedFetch = useCallback(_.debounce(fetchLocations, 450), [])

  useEffect(() => {
    debouncedFetch(locationQuery)
    return () => debouncedFetch.cancel()
  }, [locationQuery, debouncedFetch])

  return (
    inView ? (
      <ul
        className={`p-2.5 border border-main-grey-100 bg-white w-60 absolute shadow-lg z-50 rounded-xl 
          ${windowSize.width > 800 
            ? locations && locations?.length > 2
              ? 'mt-56 -ml-4' 
              : 'mt-36 -ml-4'
            : locations && locations?.length > 2
              ? '-mt-2 -ml-0' 
              : 'mt-0 -ml-0'
          }`}
      >
        {locations && locations.length > 0 ? 
          locations.map((location: Location, index: number) => (
            <li
              key={index}
              className='text-main-grey-300'
              onClick={() => {
                updateLocation((prev) => ({
                  ...prev,
                  location: { ...prev.location, place: location.name },
                }));
              }}
            >
              {location.name}
            </li>
          ))
        : 
          <li className="text-main-grey-300">No results found</li>
        }
      </ul>
    )
    :
    <></>
  )
}
