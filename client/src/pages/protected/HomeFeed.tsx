import React, { useEffect, useState } from "react"
import SearchBar from "../../components/navigation/SearchBar"
import ProfilePreview from "../../components/navigation/ProfilePreview"
import { Link } from "react-router-dom"
import axios from "axios"

interface UserDataStructure {
    fullname: string,
    picture: string
}

export default function HomeFeed(){
    const [userData, setuserData] = useState<UserDataStructure>({
        fullname: '',
        picture: ''
    })

    // useEffect(()=>{
    //     axios.get('http://localhost:8000/auth/home-feed/', {
    //     })
    //         .then(res => {
    //             if (res.status === 200) {
    //                 //set user data

    //             } else {
    //                 console.error("failed to retrieve user data ")
    //             }
    //         })
    //         .catch(error => {
    //             if (error.response) {
    //                 // the server responded with a status code that falls out of the range of 2xx
    //                 console.error('Error response:', error.response.data)
    //                 console.error('Status:', error.response.status)
    //                 console.error('Headers:', error.response.headers)
    //             } else if (error.request) {
    //                 // no response was received
    //                 console.error('No response received:', error.request)
    //             } else {
    //                 // Something happened in setting up the request that triggered an Error
    //                 console.error('Error setting up request:', error.message)
    //             }
    //             console.error('Error config:', error.config)
    //         })
    // },[])

    return (
        <div className="p-4">
            <div className="flex px-6 py-2">
                <p className="ml-0 mr-auto my-auto font-medium font-source text-lg text-main-green-900">
                    Hi, {userData.fullname? userData.fullname : "Guest"}
                </p>
                <img 
                    src={userData.picture? userData.picture : require('../../assets/default-avatar.jpg')}
                    className="w-10 rounded-full border-2 border-main-green-500" 
                    alt="profile of logged in user"
                />
            </div>
            <div className="flex flex-col items-center justify-center text-main-green-900 mt-10">
                <h1 className="font-source font-medium text-4xl my-8">
                    Lets find your Coach.
                </h1>
                <SearchBar />
                <h2 className="font-source font-medium text-2xl mt-14 mb-8">
                    Because you like running...
                </h2>
                <Link to={'/auth/coach'} className="mx-auto lg:w-5/12">
                    <ProfilePreview />
                </Link>
            </div>
        </div>
    )
}