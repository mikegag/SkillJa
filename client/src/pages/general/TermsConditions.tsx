import React, { useEffect } from "react"
import Header from "../../components/navigation/Header"
import Footer from "../../components/navigation/Footer"
import data from "../../data.json"


export default function TermsConditions(){
    useEffect(()=>{
        document.title = 'SkillJa - Terms & Conditions'
    }, [])

    return (
        <>
            <Header />
            <section className="flex flex-col justify-start items-start font-kulim py-2 px-4 lg:px-20 mx-auto mt-10 mb-24">
                <h2 className="text-3xl font-source mb-2 text-left ml-0 mr-auto">
                    Terms & Conditions
                </h2>
                {data.terms.terms_conditions.map((info, index) => (
                    <div key={index} className="mb-7">
                        <h3 
                            key={`${index}-title`} 
                            className={`font-bold w-full ${index === 0 ? "text-center underline mb-2 text-lg" : "mb-2"}`}
                        >
                            {index !== 0? info.title : ""} 
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
                
            </section>
            <Footer />
        </>
    )
}