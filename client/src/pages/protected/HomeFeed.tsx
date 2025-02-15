import React, { useEffect, useState, Suspense, lazy } from "react"
import Header from "../../components/navigation/Header"
import SearchBar from "../../components/navigation/SearchBar"
import ProfilePreview from "../../components/navigation/ProfilePreview"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import axios from "axios"
import GetCSFR from "../../hooks/userAuthentication/GetCSFR"
import GetWindowSize from "../../hooks/general/GetWindowSize"
import { UserContext } from "../../hooks/images/RetrieveImageContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong, faArrowRightLong } from "@fortawesome/free-solid-svg-icons"
import Footer from "../../components/navigation/Footer"
import { updateTimezone } from "../../hooks/general/UpdateTimezone"

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
    results: resultsType[];
    totalResults: number;
    totalPages: number;
    currentPage: number;
}

export default function HomeFeed(){
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const currentWindow = GetWindowSize()
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const location = useLocation()
    const [data, setData] = useState<dataResultsType>({ results: [], totalResults: 0, totalPages: 4, currentPage: 1 })
    const protectedRoute = '/auth/coach' 
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [userEmail, setUserEmail] = useState<string>("")
    const [queryPage, setQueryPage] = useState<number>(1)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        document.title = "SkillJa - Home Feed"
        // Update user's timezone upon initial login
        if(isLoggedIn && location.search === '' && csrfToken){
            updateTimezone(csrfToken)
        }
    }, [])

    useEffect(() => {
        // Perform a search if the query parameter exists/updates
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
            <div className="px-4 mb-64">
                <div className="flex flex-col items-center justify-center text-main-green-900 mt-10">
                    <h1 className="font-source font-medium text-4xl my-2">
                        Let's Find Your Coach
                    </h1>
                    <div className="mt-7 lg:mt-1 mb-12 lg:mb-24">
                        {currentWindow.width < 765 ?
                            <SearchBar mobileView={true} queryPage={queryPage}/>
                            :
                            <SearchBar mobileView={false} queryPage={queryPage}/>
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
                            location.search && (
                                <p className="text-center mx-auto text-lg font-kulim">
                                    No coaches match your search criteria. Try again.
                                </p>
                            )
                    } 
                    {data.totalPages > 1 && searchParams.get('page') && (
                        <div className="mx-auto mt-20 mb-5 w-full lg:w-8/12 flex justify-center items-center border-t border-main-grey-100 py-4">
                            <p 
                                className={`ml-0 mr-auto text-main-grey-400 ${data.currentPage === 1? "cursor-not-allowed": "cursor-pointer hover:text-main-green-500"} pr-2 w-28 text-start`}
                                onClick={()=>setQueryPage(data.currentPage-1)}
                            >
                                <FontAwesomeIcon icon={faArrowLeftLong} className="mr-2"/>
                                Previous
                            </p>
                            {Array.from(Array(data.totalPages)).map((page, index)=>(
                                <p 
                                    key={index} 
                                    className={`${data.currentPage === (index+1) ? "bg-main-green-500" : "bg-main-grey-100"} 
                                        py-1.5 px-3 text-white text-sm rounded-lg my-auto mx-2 cursor-pointer hover:bg-main-grey-200`}
                                    onClick={()=>setQueryPage(index+1)}
                                >
                                    {index+1}
                                </p>
                            ))}
                            <p 
                                className={`mr-0 ml-auto text-main-grey-400 ${data.totalPages === data.currentPage ? "cursor-not-allowed": "cursor-pointer hover:text-main-green-500"} w-28 text-end pl-2`}
                                onClick={()=>setQueryPage(data.currentPage+1)}
                            >
                                Next
                                <FontAwesomeIcon icon={faArrowRightLong} className="ml-2"/>
                            </p>
                        </div>
                    )}   
                </div>
            </div>
            <Footer />
        </>
    )
}