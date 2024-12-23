import React, { useEffect, useState } from "react"
import Header from "../../../components/navigation/Header"
import Footer from "../../../components/navigation/Footer"
import data from "../../../data.json"
import Accordion from "../../../components/general/Accordion"

type Category = 'getting-started' | 'coaching-programs' | 'payments-support'


export default function Faqs(){
    const [selectedCategory, setSelectedCategory] = useState<Category>("getting-started")
    const [questionData, setQuestionData] = useState(data.faqs.gettingStarted)
    const formattedCategory = {'getting-started': 'Getting Started' , 
        'coaching-programs': 'Coaching & Programs' , 
        'payments-support': 'Payment & Support'
    }
    
    useEffect(()=>{
        document.title = 'SkillJa - Frequently Asked Questions'
        
        const categoryData: Record<Category, any> ={
            "getting-started": data.faqs.gettingStarted,
            "coaching-programs": data.faqs.coachingPrograms,
            "payments-support": data.faqs.paymentSupport
        }
        setQuestionData(categoryData[selectedCategory])
    },[selectedCategory])

    return (
        <>
            <Header useCase="protected" />
            <section className="flex flex-col justify-center items-center font-kulim py-2 px-4 lg:px-12 mx-auto mt-10 mb-20">
                <h2 className="text-4xl font-semibold font-source mb-4 text-center">
                    Frequently Asked Questions
                </h2>
                <p className="mb-14 mx-auto text-center max-w-3xl">
                    Find answers to common questions about our platform. Browse by category or search for specific topics 
                    to get the information you need quickly.
                </p>
                <div className="w-full lg:max-w-3xl flex items-center justify-evenly mb-20">
                    {(["getting-started", "coaching-programs", "payments-support"] as Category[]).map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`form-btn border border-gray-300 px-1 mx-2 w-fit text-base md:px-5 md:mx-auto hover:text-white ${
                                selectedCategory === category ? "bg-main-green-500 text-white" : "bg-white text-black"
                            }`}
                        >
                            {formattedCategory[category]}
                        </button>
                    ))}
                </div>
                <div className="flex flex-col w-full lg:w-4/6 mb-2">
                    {questionData.map((value: { question: string; answer: string }, index: number) => (
                        <Accordion
                            key={index}
                            title={value.question}
                            children={value.answer}
                            styles="border-0 bg-transparent w-full font-kulim font-semibold"
                            titleStyles="border-0 bg-transparent ml-0 mr-auto font-kulim text-left"
                            childrenStyles="border-t-0 bg-transparent px-3 font-kulim font-medium text-gray-500"
                        />
                    ))}
                </div>
            </section>
            <Footer />
        </>
    )
}