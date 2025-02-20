import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import GetWindowSize from './GetWindowSize';

interface Location {
  name: string;
}

interface SearchTermType {
  sport: string;
  location: { place: string; proximity: number };
  price: { value: string; min: number; max: number };
}


interface BaseFormStructure {
  fullname: string;
  phonenumber: string;
  location: string;
  biography: string;
  primarySport: string;
  sportInterests: string[];
  experienceLevel: string;
}

interface AthleteFormStructure extends BaseFormStructure {
  goals: string[];
}

interface CoachFormStructure extends BaseFormStructure {
  ageGroups: string[];
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
  };
}

interface Props<T extends BaseFormStructure> {
  locationQuery: string;
  updateSearchLocation?: (updateFn: (prev: SearchTermType) => SearchTermType) => void;
  updateFormLocation?: (updateFn: (prev: T) => T) => void;
  inView: boolean;
  insideForm: boolean;
}

export default function LocationSuggestions<T extends BaseFormStructure>({locationQuery,updateSearchLocation, updateFormLocation,insideForm,inView}: Props<T>) {
  const [locations, setLocations] = useState<Location[] | null>(null);
  const windowSize = GetWindowSize();

  const fetchLocations = async (locationQuery: string) => {
    if (!locationQuery) return setLocations(null);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SKILLJA_URL}/search/location/?search=${locationQuery}`
      );
      setLocations(response.data.locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Memoized debounce function
  const debouncedFetch = useCallback(_.debounce(fetchLocations, 450), []);

  useEffect(() => {
    debouncedFetch(locationQuery);
    return () => debouncedFetch.cancel();
  }, [locationQuery, debouncedFetch]);


  return (
    inView ? (
      <ul
        className={`p-2.5 border border-main-grey-100 bg-white w-60 absolute shadow-lg z-50 rounded-xl 
          ${!insideForm ? `${windowSize.width > 800 
            ? locations && locations.length >= 3
              ? 'mt-60 -ml-4' 
              : 'mt-40 -ml-4'
            : locations && locations.length === 2
              ? '-mt-2 -ml-0' 
              : 'mt-0 -ml-0'
          }`
          :
            'mt-4 ml-0 w-full'
          }`}
      >
        {locations && locations.length > 0 ? (
          locations.map((location: Location, index: number) => (
            <li
              key={index}
              className="text-main-grey-300 cursor-pointer hover:text-main-grey-500 py-1"
              onClick={() => {
                // Use the correct update function based on whether we are inside the form or not
                if (insideForm) { updateFormLocation &&
                  updateFormLocation((prev) => ({
                    ...prev,
                    location: location.name,
                  } as T))
                } else { updateSearchLocation &&
                  updateSearchLocation((prev: SearchTermType) => ({
                    ...prev,
                    location: {proximity: prev.location.proximity, place:location.name},
                  }))
                }
              }}
            >
              {location.name}
            </li>
          ))
        ) : (
          <li className="text-main-grey-300 py-1">No results found</li>
        )}
      </ul>
    ) : (
      <></>
    )
  )
}