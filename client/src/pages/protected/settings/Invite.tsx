import React, { useEffect } from "react"
import Header from "../../../components/navigation/Header"
import Footer from "../../../components/navigation/Footer"

export default function Invite(){
    useEffect(()=>{
        document.title = 'SkillJa - Invite Members!'
        // API call for referral link
    },[])

    return (
        <>
            <Header useCase="protected" />
            <section className="font-kulim flex flex-col justify-start items-start py-2 px-4 lg:px-12 mx-auto mt-10 mb-36">
                <h2 className="text-3xl font-source mb-3 pr-3">
                    Earn 5% off your next purchase for every athlete or coach you refer
                </h2>
                <p className="max-w-3xl pr-3 mb-16">
                    Invite a friend to join, and when they sign up and make their first purchase, you'll receive 5% 
                    off your next order as a thank-you. Simply share your unique referral link above to get started!
                </p>
                <p className="mb-6">
                    Send this link to Athletes and Coaches you know, and have them join SkillJa!
                </p>
                <p className="bg-white border border-gray-300 rounded-2xl p-3 mb-6">
                    Link will be available soon! Thank you for your patience.
                </p>
                <button className="form-btn mb-6">
                    Copy Link
                </button>
                <p className="text-sm font-semibold">
                    Copy this link and share it with friends to earn rewards!
                </p>
            </section>
            <Footer />
        </>
    )
}