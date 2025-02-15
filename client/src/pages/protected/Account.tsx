import React, { useEffect } from "react"
import Header from "../../components/navigation/Header"
import Footer from "../../components/navigation/Footer"
import { faBell, faCreditCard, faNewspaper } from "@fortawesome/free-solid-svg-icons"
import { faCircleQuestion, faEnvelope, faEye, faPaperPlane } from "@fortawesome/free-regular-svg-icons"
import data from "../../data.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

const icons: Record<string, any>={
    faNewspaper,
    faCreditCard,
    faBell,
    faPaperPlane,
    faEye,
    faCircleQuestion,
    faEnvelope
}

export default function Account(){
    useEffect(()=>{
        document.title = 'SkillJa - Account'
    },[])
    
    return (
        <>
            <Header useCase="protected" />
            <section className="flex flex-col justify-start items-start font-kulim py-2 px-4 lg:px-24 mx-auto mt-10 mb-16">
                <h2 className="text-3xl font-source mb-2">
                    Account
                </h2>
                <p className="mb-12">
                    Manage your account settings and preferences to personalize SkillJa for your experience
                </p>
                <div className="flex flex-wrap">
                    {data.settings[0].account?.map((item)=>(
                        <Link 
                            key={item.id} 
                            to={item.link}
                            className="flex flex-col justify-start items-start bg-white border border-gray-300 rounded-xl p-3.5 mb-4 md:mr-6 w-full md:w-80 lg:w-96 cursor-pointer hover:border-main-green-400 hover:shadow-md"
                        >
                            <FontAwesomeIcon icon={icons[item.icon]} className="text-xl m-0"/>
                            <h3 className="text-xl font-source font-medium mt-8 mb-2">
                                {item.title}
                            </h3>
                            <p>
                                {item.subtitle}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
            <section className="flex flex-col justify-start items-start font-kulim py-2 px-4 lg:px-24 mx-auto mb-32">
                <h2 className="text-3xl font-source mb-2">
                    Support
                </h2>
                <p className="mb-12">
                    Find answers, get help, and connect with our team for assistance
                </p>
                <div className="flex flex-wrap">
                    {data.settings[1].support?.map((item)=>(
                        <Link 
                            key={item.id} 
                            to={item.link}
                            className="flex flex-col justify-start items-start bg-white border border-gray-300 rounded-xl p-3.5 mb-4 md:mr-6 w-full md:w-80 lg:w-96 cursor-pointer hover:border-main-green-400 hover:shadow-md"
                        >
                            <FontAwesomeIcon icon={icons[item.icon]} className="text-xl m-0"/>
                            <h3 className="text-xl font-source font-medium mt-8 mb-2">
                                {item.title}
                            </h3>
                            <p>
                                {item.subtitle}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
            <Footer />
        </>
    )
}