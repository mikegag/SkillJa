import React, { useEffect, useState } from "react"
import Header from "../../components/navigation/Header"
import SearchBar from "../../components/navigation/SearchBar"
import ProfilePreview from "../../components/navigation/ProfilePreview"
import { Link } from "react-router-dom"
import axios from "axios"

export default function HomeFeed(){
    //pass search term and results as optional params to HomeFeed
    //afterwards profilePreview needs to accept props to display specific data
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