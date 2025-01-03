import React, { useEffect, useState, Suspense, lazy } from "react"
import Header from "../../components/navigation/Header"
import SearchBar from "../../components/navigation/SearchBar"
import ProfilePreview from "../../components/navigation/ProfilePreview"
import { Link, useLocation } from "react-router-dom"
import axios from "axios"
import GetCSFR from "../../hooks/GetCSFR"
import GetWindowSize from "../../hooks/GetWindowSize"
import { UserContext } from "../../hooks/RetrieveImageContext"

// Lazy load LoadingAnimation
const LoadingAnimation = lazy(() => import("../../components/general/LoadingAnimation"))

interface resultsType{
    fullname: string;
    id: string;
    specialization: string[];
    location: string;
    rating: number;
    biography: string;
    experience: string;
    price: number;
}

interface dataResultsType {
    results: resultsType[]
}

export default function HomeFeed(){
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const currentWindow = GetWindowSize()
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const location = useLocation()
    const [data, setData] = useState<dataResultsType>({ results: [] })
    const protectedRoute = '/auth/coach' 
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [userEmail, setUserEmail] = useState<string>("")

    useEffect(() => {
        document.title = "SkillJa - Home Feed"
    }, [])

    useEffect(() => {
        // Perform a search if the query parameter exists, search was performed from landing page in this case
        if (location.search) {
            performSearch()
        }
        // checks if user is currently logged in, determines if viewing coach profiles is allowed or not
        axios.get(`${process.env.REACT_APP_SKILLJA_URL}/auth_status/`, {
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            if (res.status === 200) {
                setIsLoggedIn(res.data.is_logged_in)
                setUserEmail(res.data.email)
            } else {
                console.error("Failed to verify authentication")
            }
        })
        .catch(error => {
            console.error("Error checking authentication", error)
        })
    }, [location.search])

    // performs search based on query parameters
    function performSearch(){
        // trigger loading animation while API call is processed
        setIsLoading(true)

        axios.get(`${process.env.REACT_APP_SKILLJA_URL}/search/${location.search}`, { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }) 
            .then(res => {
                if (res.status === 200) {
                    setData(res.data)
                } else {
                    console.error("Failed to retrieve services")
                }
            }) 
            .catch(error => {console.error(error) })
            // End loading
            .finally(() => { setIsLoading(false) })
    }

    return (
        <>
            { (userEmail && isLoggedIn) && ( 
                <UserContext.Provider value={{imageName: userEmail, cache: true}}>
                    <Header useCase="protected"  /> 
                </UserContext.Provider>
            )}
            { (!userEmail || !isLoggedIn) && ( 
                <Header useCase="onboarding"  /> 
            )}
            <div className="px-4">
                <div className="flex flex-col items-center justify-center text-main-green-900 mt-10">
                    <h1 className="font-source font-medium text-4xl my-2">
                        Let's Find Your Coach
                    </h1>
                    <div className="mt-7 lg:mt-1 mb-12 lg:mb-24">
                        {currentWindow.width < 765 ?
                            <SearchBar mobileView={true} />
                            :
                            <SearchBar mobileView={false} />
                        }
                    </div>
                    <div role="presentation" className="h-0.5 bg-main-grey-100 rounded-full w-20 lg:w-32 mb-10"></div>
                    {isLoading ? (
                        <Suspense fallback={<div>Loading...</div>}>
                            <LoadingAnimation />
                        </Suspense>
                    ) 
                    : 
                        data.results.length !== 0 ? (
                            data.results.map(coach => (
                                <Link to={`${isLoggedIn ? `${protectedRoute}?name=${coach.fullname}&coach_id=${coach.id}&location=${coach.location}` : "/signup" }`} 
                                    className="mx-auto my-2 lg:w-9/12"
                                    key={coach.id}
                                >
                                    <ProfilePreview 
                                        id={coach.id}
                                        fullname={coach.fullname}
                                        location={coach.location}
                                        specialization={coach.specialization}
                                        rating={coach.rating}
                                        biography={coach.biography}
                                        price={coach.price}
                                        experience={coach.experience}
                                    />
                                </Link>
                            ))
                        ) 
                        : 
                        (
                            <p className="text-center mx-auto text-lg font-kulim">
                                No coaches match your search criteria. Try again.
                            </p>
                        )
                    }    
                </div>
            </div>
        </>
    )
}