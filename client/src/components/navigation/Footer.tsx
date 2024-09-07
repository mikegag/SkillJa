import React from "react"
import { motion } from "framer-motion"
import data from "../../data.json"
import { Link } from "react-router-dom"

export default function Footer(){
    const footerData = data.landing.footer
    const motionVariants = {
        hidden: { opacity: 0, x: 30 },
        visible: { opacity: 1, x: 0 }
    }
    
    return (
        <motion.div 
            className="flex flex-col justify-center items-center"
            initial="hidden"
            whileInView="visible"
            variants={motionVariants}
            transition={{ duration: 0.9 }}
        >
            <div className="flex text-main-green-900 justify-center">
                <h4 className="my-auto mr-8 font-source font-medium text-2xl">SkillJa.</h4>
                {footerData.subSections.map((section,index)=>(
                    <Link 
                        to={footerData.links[index]} 
                        key={index}
                        className="my-auto mx-6 font-medium font-kulim hover:text-main-green-500 cursor-pointer"
                    >
                        <p>{section}</p>
                    </Link>
                ))}
                <div className="flex ml-7 my-auto">
                    <img 
                        src={require('../../assets/icons/instagram-icon.png')}
                        className="w-7 h-7 text-main-green-900 mx-1 cursor-pointer" 
                    />
                    <img 
                        src={require('../../assets/icons/facebook-icon.png')}
                        className="w-7 h-7 text-main-green-900 mx-1 cursor-pointer" 
                    />
                    <img 
                        src={require('../../assets/icons/twitter-icon.png')}
                        className="w-7 h-7 text-main-green-900 mx-1 cursor-pointer" 
                    />
                    <img 
                        src={require('../../assets/icons/tiktok-icon.png')}
                        className="w-7 h-7 text-main-green-900 mx-1 cursor-pointer" 
                    />
                </div>
            </div>
            <div className="flex justify-between mt-4 text-main-green-900 font-kulim">
                <p className="mx-3 text-sm">@SkillJa 2024</p>
                <p className="mx-3 text-sm">Terms</p>
                <p className="mx-3 text-sm">Privacy</p>
                <p className="mx-3 text-sm">Cookies</p>
            </div>
        </motion.div>
    )
}