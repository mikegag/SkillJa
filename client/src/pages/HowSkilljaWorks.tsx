import React, { useEffect, useState } from "react"
import Header from "../components/navigation/Header"
import Footer from "../components/navigation/Footer"
import data from "../data.json"

interface Data {
    header: {
        title: string,
        subtitle: string
    };
    step1: {
        subtitle: string,
        description: string,
        image: string
    };
    step2: {
        subtitle: string,
        description: string,
        image: string,
        secondImage?: string
    };
    step3: {
        subtitle: string,
        description: string,
        image: string 
    };
    step4: {
        subtitle: string,
        description: string,
        image: string
    };
}

export default function HowSkilljaWorks(){
    const [selectedCategory, setSelectedCategory] = useState<'athlete'|'coach'>('athlete')
    const [pageData, setPageData] = useState<Data>(data.howSkilljaWorks.athlete)

    useEffect(()=>{
        document.title = 'SkillJa - How SkillJa Works'
    }, [])

    return (
        <>
            <Header />
            <section className="flex flex-col py-2 px-4 lg:px-12 mx-auto mt-10 mb-20">
                <h2 className="text-4xl font-source font-semibold mb-2 mx-auto text-center">
                    {pageData.header.title}
                </h2>
                <p className="text-2xl my-4 mx-auto font-source text-center px-4">
                    {pageData.header.subtitle}
                </p>
                <p className="mt-4 m-auto text-main-grey-300 font-kulim text-center">
                    Are you an athlete or a coach? Select your role to see how it works.
                </p>
                <div className="mt-4 flex justify-center items-center text-black">
                    <button 
                        className={`mr-3 px-5 py-2 w-24 rounded-xl border text-black border-main-grey-100 ${selectedCategory === 'athlete' ? 'bg-main-green-500 text-white':'bg-white text-black'} hover:bg-main-green-500 hover:text-white cursor-pointer`}
                        onClick={()=>{
                            setSelectedCategory('athlete');
                            setPageData(data.howSkilljaWorks.athlete)
                        }}
                        aria-label="athlete information section"
                    >
                        Athlete
                    </button>
                    <button 
                        className={`px-4 py-2 w-24 rounded-xl border text-black border-main-grey-100 ${selectedCategory === 'coach' ? 'bg-main-green-500 text-white':'bg-white text-black'} hover:bg-main-green-500 hover:text-white cursor-pointer`}
                        onClick={()=>{
                            setSelectedCategory('coach');
                            setPageData(data.howSkilljaWorks.coach)
                        }}
                        aria-label="coach information section"
                    >
                        Coach
                    </button>
                </div>
            </section>
            <section className="flex flex-col justify-center items-center px-4 lg:px-40 mb-44">
                <section className="flex flex-wrap justify-center items-center w-full mb-24">
                    <div className="flex flex-col justify-start items-start mb-6 md:my-auto ml-0 mr-auto md:pr-8 lg:pr-16 max-w-xl">
                        <h3 className="text-3xl font-source font-semibold">
                            Step 1
                        </h3>
                        <p className="text-xl my-3 font-source text-main-green-700">
                            {pageData.step1.subtitle}
                        </p>
                        <p className="font-kulim md:max-w-72 lg:max-w-96">
                            {pageData.step1.description}
                        </p>
                    </div>
                    {selectedCategory === 'athlete' ?
                        <div className="rounded-xl bg-main-green-200 px-5 py-2">
                            <img 
                                src={require(`../assets/howSkilljaWorks/${pageData.step1.image}`)} 
                                className="mx-auto my-auto pt-4 w-96 h-48"
                                alt="list of questions that will be asked to an athlete during the signup process"
                            />
                        </div>
                    :
                        <div className="rounded-xl bg-main-green-700 px-5 pt-2 pb-5">
                            <img 
                                src={require(`../assets/howSkilljaWorks/${pageData.step1.image}`)} 
                                className="mx-auto my-auto pt-4 w-96 h-48"
                                alt="list of questions that will be asked to a coach during the signup process"
                            />
                        </div>
                    }
                </section>
                <section className="flex flex-wrap justify-center items-center w-full mb-24">
                    <div className="flex flex-col justify-start items-start mb-6 md:my-auto ml-0 mr-auto md:pr-8 lg:pr-16 max-w-xl">
                        <h3 className="text-3xl font-source font-semibold">
                            Step 2
                        </h3>
                        <p className="text-xl my-3 font-source text-main-green-700">
                            {pageData.step2.subtitle}
                        </p>
                        <p className="font-kulim md:max-w-72 lg:max-w-96">
                            {pageData.step2.description}
                        </p>
                    </div>
                    {selectedCategory === 'athlete' ?
                        <div className="flex flex-col p-6 rounded-xl bg-main-green-200">
                            <img 
                                src={require(`../assets/howSkilljaWorks/${pageData.step2.image}`)} 
                                className="mx-auto my-auto w-80 h-32 rounded-xl shadow-lg"
                                alt="showcasing the search bar available on the landing page"
                            />
                            <img 
                                src={require(`../assets/howSkilljaWorks/${pageData.step2.secondImage}`)} 
                                className="mx-auto my-auto pt-4 w-80 h-28"
                                alt="list of coaches available on SkillJA"
                            />
                        </div>
                    :
                        <div className="flex flex-col p-6 rounded-xl bg-main-green-700">
                            <img 
                                src={require(`../assets/howSkilljaWorks/${pageData.step2.image}`)} 
                                className="mx-auto my-auto w-92 h-64 rounded-xl shadow-lg"
                                alt="a coach profile demonstrating his services and other personal details"
                            />
                        </div>
                    }       
                </section>
                <section className="flex flex-wrap justify-center items-center w-full mb-24">
                    <div className="flex flex-col justify-start items-start mb-6 md:my-auto ml-0 mr-auto md:pr-8 lg:pr-16 max-w-xl">
                        <h3 className="text-3xl font-source font-semibold">
                            Step 3
                        </h3>
                        <p className="text-xl my-3 font-source text-main-green-700">
                            {pageData.step3.subtitle}
                        </p>
                        <p className="font-kulim md:max-w-72 lg:max-w-96">
                            {pageData.step3.description}
                        </p>
                    </div>
                    {selectedCategory === 'athlete' ?
                        <div className="flex flex-wrap px-4 pt-6 pb-4 rounded-xl bg-main-green-200">
                            <img 
                                src={require(`../assets/howSkilljaWorks/${pageData.step3.image}`)} 
                                className="mx-auto my-auto w-96 h-48"
                                alt="list of potential services an athlete can purchase"
                            />
                        </div>
                    :
                        <div className="flex flex-wrap px-1 py-5 rounded-xl bg-main-green-700">
                            <img 
                                src={require(`../assets/howSkilljaWorks/${pageData.step3.image}`)} 
                                className="mx-auto my-auto w-96 h-28"
                                alt="list of potential services a coach can create"
                            />
                        </div>
                    }
                </section>
                <section className="flex flex-wrap justify-center items-center w-full">
                    <div className="flex flex-col justify-start items-start mb-6 md:my-auto ml-0 mr-auto md:pr-8 lg:pr-16 max-w-xl">
                        <h3 className="text-3xl font-source font-semibold">
                            Step 4
                        </h3>
                        <p className="text-xl my-3 font-source text-main-green-700">
                            {pageData.step4.subtitle}
                        </p>
                        <p className="font-kulim md:max-w-72 lg:max-w-96">
                            {pageData.step4.description}
                        </p>
                    </div>
                    {selectedCategory === 'athlete' ?
                        <div className="flex flex-wrap px-2 py-6 rounded-xl bg-main-green-200">
                            <img 
                                src={require(`../assets/howSkilljaWorks/${pageData.step4.image}`)} 
                                className="mx-4 my-auto w-72 md:w-96 h-60 rounded-xl shadow-lg"
                                alt="conversation between athlete and coach showcasing ease of use"
                            />
                        </div>
                    :
                        <div className="flex flex-wrap px-2 py-6 rounded-xl bg-main-green-700">
                            <img 
                                src={require(`../assets/howSkilljaWorks/${pageData.step4.image}`)} 
                                className="mx-4 my-auto w-72 md:w-96 h-68 rounded-xl"
                                alt="conversation between athlete and coach showcasing ease of use"
                            />
                        </div>
                    }
                </section>
            </section>
            <Footer />
        </>
    )
}