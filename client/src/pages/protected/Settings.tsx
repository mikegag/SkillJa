import { IconDefinition, faArrowLeftLong, faBell, faChevronRight, faCircleInfo, faCreditCard, faQuestion, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import data from "../../data.json"
import { Link } from "react-router-dom"

const iconMap: Record<string, IconDefinition> = {
    faUser,
    faCreditCard,
    faBell,
    faCircleInfo,
    faQuestion
}

export default function Settings(){

    return (
        <div className="flex flex-col py-2 px-4 lg:px-16">
            <div className="flex justify-center text-center mt-10">
                <Link to={'../'} className="text-3xl my-auto mr-auto hover:text-main-green-500 cursor-pointer">
                    <FontAwesomeIcon 
                        icon={faArrowLeftLong}
                    />
                </Link>
                <h1 className="font-source text-3xl pr-8 mr-auto my-auto text-main-green-900">
                    Settings
                </h1>
            </div>
            <div className="flex flex-col mt-16">
                <h2 className="font-source text-2xl underline my-6">
                    General
                </h2>
                {data.settings[0].general?.map(curr=>(
                    <Link to={curr.link} key={curr.id} className="flex justify-center items-center w-full lg:w-5/12 p-3 border border-main-green-900 rounded-2xl bg-main-white mr-auto my-3 cursor-pointer hover:bg-main-green-500 hover:text-main-white">
                        <FontAwesomeIcon icon={iconMap[curr.icon]} className="mx-2 my-auto" />
                        <p className="mr-auto my-auto">{curr.title}</p>
                        <FontAwesomeIcon icon={faChevronRight} className="ml-auto my-auto"  />
                    </Link>
                ))}
            </div>
            <div className="flex flex-col mt-10">
                <h2 className="font-source text-2xl underline my-6">
                    Settings
                </h2>
                {data.settings[1].support?.map(curr=>(
                    <Link to={curr.link} key={curr.id} className="flex justify-center items-center w-full lg:w-5/12 p-3 border border-main-green-900 rounded-2xl bg-main-white mr-auto my-3 cursor-pointer hover:bg-main-green-500 hover:text-main-white">
                        <FontAwesomeIcon icon={iconMap[curr.icon]} className="mx-2 my-auto" />
                        <p className="mr-auto">{curr.title}</p>
                        <FontAwesomeIcon icon={faChevronRight} className="ml-auto my-auto"  />
                    </Link>
                ))}
            </div>
        </div>
    )
}