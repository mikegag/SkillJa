import React from "react"
import { motion } from "framer-motion"
import data from '../../../data.json'
import { Link } from "react-router-dom"

export default function ThirdSection(){
    const landingInfo = data.landing.thirdSection
    const motionVariants = {
        hidden: { opacity: 0, y: -40 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="bg-main-cream flex flex-wrap justify-center items-center px-2">
            <motion.div 
                className="flex flex-col justify-start items-start w-fit"
                initial="hidden"
                whileInView="visible"
                variants={motionVariants}
                transition={{ duration: 0.9 }}
            >
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
            </motion.div>
            <img 
                src={require('../../../assets/landingAssets/coach-holding-timer.png')}
                className="w-72 ml-12 mr-0"
                alt="woman jogging outside"
            />
            <div className="w-full flex justify-evenly mt-16">
                <img 
                    src={require('../../../assets/landingAssets/calender-clock.png')}
                    className="w-32 h-32"
                />
                <img 
                    src={require('../../../assets/landingAssets/phone-message.png')}
                    className="w-32 h-32"
                />
                <img 
                    src={require('../../../assets/landingAssets/payment-process.png')}
                    className="w-32 h-32"
                />
            </div>
        </div>
    )
}