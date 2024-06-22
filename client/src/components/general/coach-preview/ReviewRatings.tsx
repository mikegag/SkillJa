import { faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

interface RatingProps {
    reviews: review[]
}

interface review {
    rating: number,
    title: string,
    description: string
}

export default function ReviewRatings({reviews}:RatingProps){
    const ratings = [5, 4, 3, 2, 1]

    function averageOverallRating():string{
        let totalSum = 0
        reviews.map(curr=>{
            totalSum += curr.rating
        })
        return (totalSum / reviews.length).toFixed(1)
    }

    // Determines frequency of rating category and returns a percentage
    function ratingFrequency(rating: number): number {
        let frequency = 0
        reviews.forEach(curr => {
            if (Math.floor(curr.rating) === rating) {
                frequency += 1
            }
        })
        return (frequency / reviews.length) * 180
    }

    return (
        <div className="flex flex-col items-center mx-auto text-main-green-900 mb-8">
            <h1 className="text-2xl mx-auto text-center mb-7 font-source font-medium underline">Ratings & Reviews</h1>
            <div className="flex lg:justify-center mx-auto">
                <h2 className="text-5xl lg:text-6xl my-auto mr-6 lg:mr-14 w-16 font-kulim font-bold">{averageOverallRating()}</h2>
                <div className="flex flex-col w-64 lg:w-full mx-auto">
                    {ratings.map((rating) => (
                        <div key={rating} className="flex items-center mb-1 mx-auto">
                            <p className="mx-1 text-sm font-kulim font-semibold">{rating}</p>
                            <div className="h-1 rounded-full bg-main-grey-200 relative w-52 lg:w-96 mx-2">
                                <div
                                    className="absolute h-1 bg-amber-300 rounded-full"
                                    style={{ width: `${ratingFrequency(rating)}%` }}
                                    role="presentation"
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="h-80 w-full overflow-scroll mt-8">
            {reviews.map((rating) => (
                    <div key={rating.title} className="flex w-72 lg:w-8/12 flex-col items-start my-6 mx-auto rounded-xl bg-main-white border border-main-green-900 shadow-lg p-3 text-main-green-900">
                        <h3 className="text-xl font-source font-medium">{rating.title}</h3>
                        <div className="flex">
                            {Array.from({ length: Math.floor(rating.rating) }).map((_, index) => (
                                <FontAwesomeIcon key={index} icon={faStar} className="text-amber-300 mr-1 mt-1 mb-3" />
                            ))}
                        </div>
                        <p className="font-kulim text-main-green-900">{rating.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}