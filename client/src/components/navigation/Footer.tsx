import React, { useState } from "react"
import { motion } from "framer-motion"
import data from "../../data.json"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopyright } from "@fortawesome/free-regular-svg-icons"


export default function Footer(){
    const [formToDisplay, setFormToDisplay] = useState<string>("")
    const footerData = data.landing.footer
    const motionVariants = {
        hidden: { opacity: 0, x: 30 },
        visible: { opacity: 1, x: 0 }
    }
    
    return (
        <motion.div 
            className="flex flex-col justify-center items-center px-4 mt-6 mb-16"
            initial="hidden"
            whileInView="visible"
            variants={motionVariants}
            transition={{ duration: 0.9 }}
        >
            <div className="flex flex-wrap text-center text-main-green-900 justify-center items-center w-fit">
                <h4 className="my-auto mx-auto lg:mr-8 font-source font-medium text-2xl pb-3">SkillJa.</h4>
                {footerData.subSections.map((section,index)=>(
                    <Link 
                        to={footerData.links[index]} 
                        key={index}
                        className="my-auto mx-auto md:mx-6 font-semibold font-kulim px-2 lg:px-0 pb-3 hover:text-main-green-500 cursor-pointer"
                    >
                        <p>{section}</p>
                    </Link>
                ))}
                <div className="flex mx-auto lg:ml-7 my-auto pb-2">
                    <img 
                        src={require('../../assets/icons/instagram-icon.png')}
                        className="w-7 h-7 text-main-green-900 mx-1 cursor-pointer"
                        alt="social media icon for instagram"
                    />
                    <img 
                        src={require('../../assets/icons/facebook-icon.png')}
                        className="w-7 h-7 text-main-green-900 mx-1 cursor-pointer" 
                        alt="social media icon for facebook"
                    />
                    <img 
                        src={require('../../assets/icons/twitter-icon.png')}
                        className="w-7 h-7 text-main-green-900 mx-1 cursor-pointer" 
                        alt="social media icon for twitter/X"
                    />
                    <img 
                        src={require('../../assets/icons/tiktok-icon.png')}
                        className="w-7 h-7 text-main-green-900 mx-1 cursor-pointer" 
                        alt="social media icon for tiktok"
                    />
                </div> 
            </div>
            <div className="mx-auto flex mt-6 md:mt-4 text-main-green-900 font-kulim">
                <p className="mx-3 text-sm">
                    <FontAwesomeIcon icon={faCopyright} className="mr-1" />
                    SkillJa 2025
                </p>
                <Link to={'/terms-conditions'}>
                    <p className="mx-3 text-sm hover:text-main-green-500 cursor-pointer">
                        Terms
                    </p>
                </Link>
                <Link to={'/privacy-policy'}>
                    <p className="mx-3 text-sm hover:text-main-green-500 cursor-pointer">
                        Privacy
                    </p>
                </Link>
                <Link to={'/contact-us'}>
                    <p className="mx-3 text-sm hover:text-main-green-500 cursor-pointer">
                        Contact Us
                    </p>
                </Link>
            </div>
        </motion.div>
    )
}