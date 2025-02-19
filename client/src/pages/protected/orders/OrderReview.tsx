import React, { useEffect, useState } from "react"
import Header from "../../../components/navigation/Header"
import Footer from "../../../components/navigation/Footer"
import { Rating } from 'react-simple-star-rating'
import GetWindowSize from '../../../hooks/general/GetWindowSize'
import axios from "axios"
import CreateCSFR from "../../../hooks/userAuthentication/CreateCSFR"
import GetCSFR from "../../../hooks/userAuthentication/GetCSFR"
import { useNavigate, useSearchParams } from "react-router-dom"
import LoadingAnimation from "../../../components/general/LoadingAnimation"

export default function OrderReview(){
    const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false)
    const [submitInProgress,setSubmitInProgress] = useState<boolean>(false)
    const [responseMessage, setResponseMessage] = useState<string>("")
    const navigate = useNavigate()
    const [queryParameters] = useSearchParams()
    const coach = queryParameters.get('coach_name')
    const jwtToken = queryParameters.get('token')
    const [rating1, setRating1] = useState<number>(0)
    const [rating2, setRating2] = useState<number>(0)
    const [description, setDescription] = useState<string>("N/A")
    const [title, setTitle] = useState<string>("N/A")
    //creates and sets new CSFR Token in cookies in case user is not logged in 
    const windowSize = GetWindowSize()
    const tooltipArray = ["Terrible","Terrible+","Bad","Bad+","Average","Average+","Great","Great+","Awesome","The Best!"]
    const fillColorArray = ["#f17a45","#f17a45","#f19745","#f19745","#f1a545","#f1a545","#f1b345","#f1b345","#f1d045","#f1d045"]
    // handle rating for first review question
    const handleRating1 = (rate: number) => {
        setRating1(rate)
    }
    // handle rating for second review question
    const handleRating2 = (rate: number) => {
        setRating2(rate)
    }

    //creates and sets new CSFR Token in cookies in case user is not logged in 
    const csrfToken = CreateCSFR({ name: "csrftoken" })

    // API call to update review for coach
    function submitReview(){
        const averageRating = (rating1+rating2) / 2
        setSubmitInProgress(true)
        axios.post(`${process.env.REACT_APP_SKILLJA_URL}/review/create_review/`, 
            {rating: averageRating, title: title, description: description, token: jwtToken}, 
        {
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            }, 
            withCredentials: true
        })
        .then(res => {
            if (res.status === 201) {
                setResponseMessage("Thank you for your feedback!")
            } else {
                setResponseMessage("Error submitting review. Please email support@skillja.com")
            }
        })
        .catch(error => {console.error(error)})
        .finally(()=>{setReviewSubmitted(true)})
    }

    return (
        <div>
            <Header useCase="onboarding" />
            <section className="flex flex-col justify-center items-center mb-32 mt-10">
                {coach ?
                <>
                    <h1 className="mb-6 md:mb-10 font-kulim text-2xl font-semibold mx-auto text-center px-4">
                        Review your order
                    </h1>
                    {submitInProgress ?
                        !reviewSubmitted ?
                            <LoadingAnimation />
                        :
                            <div className="flex flex-col justify-center items-center mt-20">
                                <p className="mx-auto font-kulim text-lg">{responseMessage}</p>
                                <button className="form-btn mt-5" onClick={()=>navigate('/')}>
                                    Home
                                </button>
                            </div>
                    :
                        <section className="flex flex-col justify-center items-center">
                            <p className="my-4 font-kulim text-center px-4">How was your overall experience with Coach {coach?.split('-')[0]} {coach?.split('-')[1]}?</p>
                            <div className="star-rating" onClick={(e) => e.stopPropagation()}>
                                <Rating
                                onClick={handleRating1}
                                size={windowSize.width > 600 ? 50 : 30}
                                transition
                                allowFraction={true}
                                showTooltip
                                tooltipClassName="w-36 text-center font-kulim"
                                tooltipDefaultText="Your Rating"
                                tooltipArray={tooltipArray}
                                fillColorArray={fillColorArray}
                                />
                            </div>
                            <p className="mt-10 mb-4 font-kulim text-center px-4">How would you describe your purchase from Coach {coach?.split('-')[0]} {coach?.split('-')[1]}?</p>
                            <div className="star-rating" onClick={(e) => e.stopPropagation()}>
                                <Rating
                                onClick={handleRating2}
                                size={windowSize.width > 600 ? 50 : 30}
                                transition
                                allowFraction={true}
                                showTooltip
                                tooltipClassName="w-36 text-center font-kulim"
                                tooltipDefaultText="Your Rating"
                                tooltipArray={tooltipArray}
                                fillColorArray={fillColorArray}
                                />
                            </div>
                            <input 
                                type="text" 
                                maxLength={20} 
                                placeholder="Review Title..." 
                                className="w-64 lg:w-96 border p-3 border-main-grey-100 rounded-xl focus:outline-0 hover:border-main-green-500 mt-12"
                                onChange={(e)=>setTitle(e.target.value)}
                            />
                            <textarea 
                                className="w-64 lg:w-96 border p-3 border-main-grey-100 rounded-xl focus:outline-0 hover:border-main-green-500 max-h-28 min-h-28 mt-4" 
                                maxLength={220}
                                placeholder="Review Description..."
                                onChange={(e)=>setDescription(e.target.value)}
                            />
                            <button 
                                className={`${rating1 === 0 || rating2 === 0 || title === 'N/A' || description === 'N/A' ? 
                                    'cursor-not-allowed bg-main-grey-200':'cursor-pointer'} form-btn cursor-pointer mx-auto px-4 py-2 mt-8 mb-4`
                                }
                                onClick={()=>submitReview()}
                                disabled={rating1 === 0 || rating2 === 0 || title === 'N/A' || description === 'N/A'}
                            >
                                Submit Review
                            </button>
                        </section>
                    }
                </>
                :
                    
                    <p className="mt-28">Oops! Something went wrong. Let's take you 
                        <span className="underline hover:text-main-green-500 ml-1 cursor-pointer font-medium" onClick={()=>navigate('/')}>home</span>
                    </p>
                }
            </section>
            <Footer />
        </div>
    )
}
