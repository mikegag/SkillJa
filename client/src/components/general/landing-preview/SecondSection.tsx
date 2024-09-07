import React from "react"
import { motion } from "framer-motion"
import data from '../../../data.json'
import { Link } from "react-router-dom"

export default function SecondSection(){
    const landingInfo = data.landing.secondSection
    const smallImageVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    }
    const largeImageVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0 }
    }

    return (
        <div className="bg-main-cream flex flex-wrap justify-center items-center px-2">
            <motion.img 
                src={require('../../../assets/landingAssets/woman-jogging.png')}
                className="w-80 mr-12 ml-0"
                alt="woman jogging outside"
                initial="hidden"
                whileInView="visible"
                variants={largeImageVariants}
                transition={{ duration: 0.9 }}
            />
            <div className="flex flex-col justify-start items-start w-fit">
                <h3 className="w-fit text-3xl font-source font-medium text-main-green-700">
                    {landingInfo.title}
                </h3>
                <p className="my-6 max-w-3xl font-kulim pr-6">
                    {landingInfo.subtitle}
                </p>
                <Link 
                    to={landingInfo.button.link} 
                    className="py-2 px-4 bg-main-green-500 rounded-2xl text-main-white font-kulim hover:bg-main-green-900"
                >
                    <p>{landingInfo.button.value}</p>
                </Link>
            </div>
            <div className="w-full flex justify-evenly mt-14">
                <motion.img 
                    src={require('../../../assets/landingAssets/coach-profile-1.png')}
                    className="w-60"
                    initial="hidden"
                    whileInView="visible"
                    variants={smallImageVariants}
                    transition={{ duration: 0.9 }}
                />
                <motion.img 
                    src={require('../../../assets/landingAssets/coach-profile-2.png')}
                    className="w-60"
                    initial="hidden"
                    whileInView="visible"
                    variants={smallImageVariants}
                    transition={{ duration: 0.9 }}
                />
                <motion.img 
                    src={require('../../../assets/landingAssets/coach-profile-3.png')}
                    className="w-60"
                    initial="hidden"
                    whileInView="visible"
                    variants={smallImageVariants}
                    transition={{ duration: 0.9 }}
                />
            </div>
        </div>
    )
}