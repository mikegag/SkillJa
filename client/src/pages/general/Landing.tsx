import React, { useEffect, Suspense, useState } from "react"
import { useInView } from "react-intersection-observer"
import GetWindowSize from "../../hooks/general/GetWindowSize"
import CreateCSFR from "../../hooks/userAuthentication/CreateCSFR"
import HeroSection from "../../components/general/landing-preview/HeroSection"
import Footer from "../../components/navigation/Footer"
import NewsletterPopUp from "../../components/general/landing-preview/NewsletterPopUp"
import { faL } from "@fortawesome/free-solid-svg-icons"

// Lazy load sections
const SecondSection = React.lazy(() =>
    import("../../components/general/landing-preview/SecondSection")
)
const ThirdSection = React.lazy(() =>
    import("../../components/general/landing-preview/ThirdSection")
)
const FourthSection = React.lazy(() =>
    import("../../components/general/landing-preview/FourthSection")
)

export default function Landing(){
    //creates and sets new CSFR Token in cookies
    const newToken = CreateCSFR({ name: "csrftoken" })
    const currentWindow = GetWindowSize()
    // Intersection Observer hooks for each section
    const [refSecond, inViewSecond] = useInView({ triggerOnce: true })
    const [refThird, inViewThird] = useInView({ triggerOnce: true })
    const [refFourth, inViewFourth] = useInView({ triggerOnce: true })
    const [showNewsletter, setShowNewsletter] = useState<boolean>(false)

    useEffect(() => {
        document.title = "SkillJa | Find Sport Coaches and Instructors"
         // Delay Newsletter Popup
         const timer = setTimeout(() => {
          setShowNewsletter(true)
      }, 3500)

      return () => clearTimeout(timer)
    }, [])

    return (
        <>
          {currentWindow.width < 1024 ? (
            <>
              <HeroSection view="mobile" />

              {showNewsletter && <NewsletterPopUp handleExit={setShowNewsletter} />}
              
              <div className="mt-16 mb-12">
                <Footer />
              </div>
            </>
          ) : (
            <>
              <HeroSection view="desktop" />

              {showNewsletter && <NewsletterPopUp handleExit={setShowNewsletter} />}

              <div className="mt-44" ref={refSecond}>
                {inViewSecond && (
                  <Suspense fallback={<div>Loading...</div>}>
                    <SecondSection />
                  </Suspense>
                )}
              </div>
    
              <div className="mt-44" ref={refThird}>
                {inViewThird && (
                  <Suspense fallback={<div>Loading...</div>}>
                    <ThirdSection />
                  </Suspense>
                )}
              </div>
    
              <div className="mt-44" ref={refFourth}>
                {inViewFourth && (
                  <Suspense fallback={<div>Loading...</div>}>
                    <FourthSection />
                  </Suspense>
                )}
              </div>
    
              <div className="mt-44 mb-10">
                <Footer />
              </div>
            </>
          )}
        </>
      )
}

