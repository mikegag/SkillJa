import React, { useEffect } from "react"
import Header from "../../components/navigation/Header"
import Footer from "../../components/navigation/Footer"
import GetWindowSize from "../../hooks/general/GetWindowSize"

export default function AboutUs(){
    const windowSize = GetWindowSize()
    useEffect(()=>{
        document.title = 'SkillJa - About Us'
    },[])

    return (
        <div>
            <Header />
            <section className="flex flex-col justify-start items-start font-kulim py-2 px-4 lg:px-12 mx-auto mt-10 mb-24">
                <h1 className="font-source text-4xl font-bold mx-auto text-center">
                    Make Training Simple, Enjoyable,
                </h1>
                <h1 className="font-source text-4xl font-bold mx-auto text-center mt-3 mb-6"> 
                    and Effective.
                </h1>
                <p className="max-w-4xl text-center mx-auto text-gray-700 mb-24 lg:mb-36 px-5">
                    SkillJa is the platform that connects you with top coaches across all sports, bringing together your 
                    sessions, goals, and progress in one place. From anywhere, SkillJa helps athletes of all levels find 
                    the right coach, stay motivated, and maximize their potential.
                </p>
                <section className="flex flex-wrap w-full max-w-5xl mx-auto mb-20">
                    <div className="flex flex-col justify-start items-start my-auto mx-auto pl-4 md:ml-0 md:mr-auto">
                        <h2 className="font-source text-3xl font-bold mr-auto text-left">
                            What Drives Us
                        </h2>
                        <p className="text-sm text-gray-700 mt-4 w-80 lg:w-full lg:max-w-xl">
                            We believe every athlete deserves the right coach to unlock their potential. That's why we're here—to 
                            make finding, connecting, and working with sports coaches simple and accessible for everyone. 
                            From discovering personalized fitness programs to booking one-on-one sessions, our mission is to empower 
                            athletes to achieve their goals and build meaningful relationships with expert coaches in every sport 
                            imaginable. Your success is our passion.
                        </p>
                    </div>
                    <img 
                        src={require('../../assets/aboutUsAssets/man-cycling-on-bike.png')} 
                        className="mx-auto h-60 w-60 mt-12 md:my-auto md:ml-auto md:mr-0 md:pl-2 md:w-80 md:h-80"
                        alt="man sitting on a bike"
                    />
                </section>
                <section className="flex flex-wrap w-full max-w-5xl mx-auto mb-28">
                    { windowSize.width > 950 ? 
                    (   <>
                        <img 
                            src={require('../../assets/aboutUsAssets/man-standing-on-podium.png')} 
                            className=" my-auto mr-auto ml-0 pr-8 w-80 h-80"
                            alt="man standing on a podium celebrating"
                        />
                        <div className="flex flex-col justify-start items-start my-auto mr-0 ml-auto">
                            <h2 className="font-source text-3xl font-bold mr-auto text-left">
                                Where We're Headed
                            </h2>
                            <p className="text-sm text-gray-700 mt-4 w-80 lg:w-full lg:max-w-xl">
                                We see a future where every athlete has access to the tools, support, and expertise they need to thrive. 
                                Our vision is to be the ultimate bridge between athletes and coaches, fostering a global community where 
                                skills are sharpened, goals are achieved, and dreams are realized. Together, we're shaping a world where no 
                                goal is out of reach, and every effort is met with guidance and inspiration.
                            </p>
                        </div>
                        </>
                    )
                    :
                    (
                        <>
                        <div className="flex flex-col justify-start items-start my-auto mx-auto lg:ml-0 lg:mr-auto">
                            <h2 className="font-source text-3xl font-bold mr-auto text-left">
                                Where We're Headed
                            </h2>
                            <p className="text-sm text-gray-700 mt-4 w-80 lg:w-full lg:max-w-xl">
                                We see a future where every athlete has access to the tools, support, and expertise they need to thrive. 
                                Our vision is to be the ultimate bridge between athletes and coaches, fostering a global community where 
                                skills are sharpened, goals are achieved, and dreams are realized. Together, we're shaping a world where no 
                                goal is out of reach, and every effort is met with guidance and inspiration.
                            </p>
                        </div>
                        <img 
                            src={require('../../assets/aboutUsAssets/man-standing-on-podium.png')} 
                            className="mx-auto h-60 w-60 mt-12 pl-3 md:my-auto md:ml-auto md:mr-0 md:pl-2 md:w-80 md:h-80"
                            alt="man standing on a podium celebrating"
                        />
                        </>
                    )
            }
                </section>
                <section className="flex flex-wrap w-full max-w-5xl mx-auto mb-20">
                    <div className="flex flex-col justify-start items-start my-auto mx-auto lg:ml-0 lg:mr-auto">
                        <h2 className="font-source text-3xl font-bold mr-auto text-left">
                            From Passion to Purpose
                        </h2>
                        <p className="text-sm text-gray-700 mt-4 w-80 lg:w-full lg:max-w-xl">
                            We are a teacher-turned-developer and a mechanical engineering student united by our love for running, weightlifting, 
                            and golf. The idea for SkillJa was born during countless shared workouts, where we realized how challenging it can be 
                            to find the right coach to meet individual goals. <br /> <br/>

                            Frustrated by the lack of centralized resources for athletes to discover quality coaching, we decided to build a solution. 
                            Rooted in Toronto and powered by our values of integrity, respect, discipline, and teamwork, we're on a mission to make 
                            coaching accessible to everyone, no matter the sport or location. <br /> <br />

                            With SkillJa, we hope to empower athletes to achieve their best and give coaches a platform to share their expertise with 
                            the world.
                        </p>
                    </div>
                    <img 
                        src={require('../../assets/main-landing-racers.png')} 
                        className="mx-auto h-60 w-60 mt-12 pl-3 md:my-auto md:ml-auto md:mr-0 md:pl-2 md:w-80 md:h-80"
                        alt="two runners kneeling at a start line"
                    />
                </section>
            </section>
            <Footer />
        </div>
    )
}