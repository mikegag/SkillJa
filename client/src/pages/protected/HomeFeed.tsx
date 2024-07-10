import React, { useEffect, useState } from "react"
import Header from "../../components/general/Header"
import SearchBar from "../../components/navigation/SearchBar"
import ProfilePreview from "../../components/navigation/ProfilePreview"
import { Link } from "react-router-dom"
import axios from "axios"

export default function HomeFeed(){

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
        <>
            <Header useCase="protected"/>
            <div className="px-2">
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
        </>
    )
}