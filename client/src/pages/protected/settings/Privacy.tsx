import React, { useEffect, useState } from "react"
import Header from "../../../components/navigation/Header"
import Footer from "../../../components/navigation/Footer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faX } from "@fortawesome/free-solid-svg-icons"
import data from "../../../data.json"
import { Link } from "react-router-dom"


export default function Invite(){
    const [formToDisplay, setFormToDisplay] = useState<string>("")
    
    useEffect(()=>{
        document.title = 'SkillJa - Privacy'
    },[])

    return (
        <>
            <Header useCase="protected" />
            <section className="font-kulim flex flex-col justify-start items-start py-2 px-4 lg:px-12 mx-auto mt-10 mb-20">
                <h2 className="text-3xl font-source mb-3">
                    Privacy
                </h2>
                <p className="mb-9">
                    Control your location sharing and data preferences
                </p>
                <p className="mb-4 font-semibold">
                    Privacy Overview
                </p>
               <div 
                    onClick={()=>setFormToDisplay("privacy")}
                    className="flex justify-center items-start bg-white p-3 border border-gray-300 rounded-2xl mb-4 cursor-pointer hover:border-main-green-500 w-80 lg:w-3/6">
                    <p className="ml-0 mr-auto">
                        Privacy Policy
                    </p>
                    <FontAwesomeIcon 
                        icon={faChevronRight} 
                        className="text-gray-400 my-auto ml-auto mr-0"
                    />
               </div>
               <div 
                    onClick={()=>setFormToDisplay("terms")}
                    className="flex justify-center items-start bg-white p-3 border border-gray-300 rounded-2xl mb-4 cursor-pointer hover:border-main-green-500 w-80 lg:w-3/6"
                >
                    <p className="ml-0 mr-auto">
                        Terms & Conditions
                    </p>
                    <FontAwesomeIcon 
                        icon={faChevronRight} 
                        className="text-gray-400 my-auto ml-auto mr-0"
                    />
               </div>
               <div 
                    onClick={()=>setFormToDisplay("data")}
                    className="flex justify-center items-start bg-white p-3 border border-gray-300 rounded-2xl mb-4 cursor-pointer hover:border-main-green-500 w-80 lg:w-3/6">
                    <p className="ml-0 mr-auto">
                        How SkillJa uses your data
                    </p>
                    <FontAwesomeIcon 
                        icon={faChevronRight} 
                        className="text-gray-400 my-auto ml-auto mr-0"
                    />
               </div>
               <p className="mt-6 mb-4 font-semibold">
                    Your Data Controls
               </p>
               <Link
                    to={"./delete-account"}
                    className="flex justify-center items-start bg-white p-3 border border-gray-300 rounded-2xl mb-4 cursor-pointer hover:border-main-green-500 w-80 lg:w-3/6">
                    <p className="ml-0 mr-auto">
                        Delete account
                    </p>
                    <FontAwesomeIcon 
                        icon={faChevronRight} 
                        className="text-gray-400 my-auto ml-auto mr-0"
                    />
               </Link>
               {
                formToDisplay === "terms"?
                    <div className="w-dvw h-dvh flex justify-center items-center bg-black bg-opacity-60 absolute top-0 left-0">
                        <div className="flex flex-col bg-white rounded-2xl border border-main-black w-80 h-96 lg:w-6/12 lg:h-4/6 overflow-scroll p-4">
                            <button className="ml-auto mr-0 hover:text-main-green-500" onClick={()=>setFormToDisplay("")}>
                                <FontAwesomeIcon icon={faX}/>
                            </button>
                            {data.terms.terms_conditions.map((info, index) => (
                                <div key={index} className="mb-7">
                                    <h3 
                                        key={`${index}-title`} 
                                        className={`font-bold w-full ${index === 0 ? "text-center underline mb-2 text-lg" : "mb-2"}`}
                                    >
                                        {info.title} 
                                    </h3>
                                    {Array.isArray(info.body) ? (
                                        info.body.map((val, subIndex) => (
                                            <div key={`${index}-${subIndex}`}>
                                                {val.subheader && <p className="font-semibold">{val.subheader}</p>}
                                                {val.points && val.points.length > 0 && (
                                                    <ul className="list-disc pl-5">
                                                        {val.points.map((point, pointIndex) => (
                                                            <li key={`${index}-${subIndex}-${pointIndex}`}>{point}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>{info.body}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                :
                (
                    formToDisplay === "privacy" ?
                    <div className="w-dvw h-dvh flex justify-center items-center bg-black bg-opacity-60 absolute top-0 left-0">
                        <div className="flex flex-col bg-white rounded-2xl border border-main-black w-80 h-96 lg:w-6/12 lg:h-4/6 overflow-scroll p-4">
                            <button className="ml-auto mr-0 hover:text-main-green-500" onClick={()=>setFormToDisplay("")}>
                                <FontAwesomeIcon icon={faX}/>
                            </button>
                            {data.terms.privacy_policy.map((info, index) => (
                                <div key={index} className="mb-7">
                                    <h3 
                                        key={`${index}-title`} 
                                        className={`font-bold w-full ${index === 0 ? "text-center underline mb-2 text-lg" : "mb-2"}`}
                                    >
                                        {info.title}
                                    </h3>
                                    {Array.isArray(info.body) ? (
                                        info.body.map((val, subIndex) => (
                                            <div key={`${index}-${subIndex}`}>
                                                {val.subheader && <p className="font-semibold">{val.subheader}</p>}
                                                {val.points && val.points.length > 0 && (
                                                    <ul className="list-disc pl-5">
                                                        {val.points.map((point, pointIndex) => (
                                                            <li key={`${index}-${subIndex}-${pointIndex}`}>{point}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>{info.body}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                :
                    (
                        formToDisplay === "data" ?
                            <div className="w-dvw h-dvh flex justify-center items-center bg-black bg-opacity-60 absolute top-0 left-0">
                                <div className="flex flex-col bg-white rounded-2xl border border-main-black w-80 h-96 lg:w-6/12 lg:h-4/6 overflow-scroll p-4">
                                    <button className="ml-auto mr-0 hover:text-main-green-500" onClick={()=>setFormToDisplay("")}>
                                        <FontAwesomeIcon icon={faX}/>
                                    </button>
                                    {data.terms.data_collection.map((info, index) => (
                                        <div key={index} className="mb-7">
                                            <h3 
                                                key={`${index}-title`} 
                                                className={`font-bold w-full ${index === 0 ? "text-center underline mb-2 text-lg" : "mb-2"}`}
                                            >
                                                {info.title}
                                            </h3>
                                            {info.body.map((val, subIndex) => (
                                                <div key={`${index}-${subIndex}`} className="mb-2">
                                                    {val.subheader && <p className="font-semibold">{val.subheader}</p>}
                                                    {val.points.length > 0 && (
                                                        <ul className="list-disc pl-5">
                                                            {val.points.map((point, pointIndex) => (
                                                                <li key={`${index}-${subIndex}-${pointIndex}`}>{point}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        :
                            <></>
                    )
                )}
            </section>
            <Footer />
        </>
    )
}