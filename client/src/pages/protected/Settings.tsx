import { IconDefinition, faArrowLeftLong, faBell, faChevronRight, faCircleInfo, faCreditCard, faQuestion, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import data from "../../data.json"
import { Link } from "react-router-dom"
import Header from "../../components/navigation/Header"

const iconMap: Record<string, IconDefinition> = {
    faUser,
    faCreditCard,
    faBell,
    faCircleInfo,
    faQuestion
}

export default function Settings(){
    return (
        <>
            <Header useCase="protected" />
            <div className="flex flex-col py-2 px-4 lg:px-14 mx-auto justify-center items-center">
                <div className="flex justify-center items-center text-center mt-8 w-full">
                    <Link to={'../'} className="text-2xl my-auto mr-auto hover:text-main-green-500 cursor-pointer">
                        <FontAwesomeIcon 
                            icon={faArrowLeftLong}
                        />
                    </Link>
                    <h1 className="font-source text-3xl pr-4 mr-auto my-auto text-main-green-900">
                        Settings
                    </h1>
                </div>
                <div className="flex flex-col mt-7 w-full lg:mx-auto lg:w-10/12 justify-center items-center">
                    {data.settings[0].general?.map(curr=>(
                        <Link to={curr.link} key={curr.id} className="flex justify-center items-center w-full lg:w-5/12 p-3 border border-main-green-900 rounded-2xl bg-main-white mx-auto my-3 cursor-pointer hover:bg-main-green-500 hover:text-main-white">
                            <FontAwesomeIcon icon={iconMap[curr.icon]} className="mx-2 my-auto" />
                            <p className="mr-auto my-auto">{curr.title}</p>
                            <FontAwesomeIcon icon={faChevronRight} className="ml-auto my-auto"  />
                        </Link>
                    ))}
                </div>
                <div className="flex flex-col mt-7 w-full lg:mx-auto lg:w-10/12 justify-center items-center">
                    <h2 className="font-source text-2xl underline my-6">
                        Other
                    </h2>
                    {data.settings[1].support?.map(curr=>(
                        <Link to={curr.link} key={curr.id} className="flex justify-center items-center w-full lg:w-5/12 p-3 border border-main-green-900 rounded-2xl bg-main-white mx-auto my-3 cursor-pointer hover:bg-main-green-500 hover:text-main-white">
                            <FontAwesomeIcon icon={iconMap[curr.icon]} className="mx-2 my-auto" />
                            <p className="mr-auto">{curr.title}</p>
                            <FontAwesomeIcon icon={faChevronRight} className="ml-auto my-auto"  />
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}