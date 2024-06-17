import React from "react"
import SearchBar from "../../components/navigation/SearchBar"
import ProfilePreview from "../../components/navigation/ProfilePreview"
import Filter from "../../components/general/Filter"


export default function HomeFeed(){
    return (
        <div className="p-4">
            <div className="flex px-6 py-2">
                <p className="ml-0 mr-auto my-auto font-medium font-source text-lg text-main-green-900">Hi, username</p>
                <img 
                    src={require('../../assets/google-logo.png')} 
                    className="w-10 rounded-full border-2 border-main-green-500" 
                    alt="profile picture of logged in user"
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
                <ProfilePreview />
                <Filter />
            </div>
        </div>
    )
}