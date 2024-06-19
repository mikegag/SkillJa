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

    function averageOverallRating():string{
        let totalSum = 0
        reviews.map(curr=>{
            totalSum += curr.rating
        })
        return (totalSum / reviews.length).toFixed(1)
    }

    //determines frequency of rating category and returns a score out of 10
    function ratingFrequency(input:string):number{
        let frequency = 0
        reviews.map(curr=>{
            if(curr.rating.toString().includes(input)){
                frequency += 1
            }
        })
        return (frequency/reviews.length) * 10
    }

    return (
        <div className="text-main-green-900 lg:w-7/12">
            <h1 className="text-source text-xl">Ratings & Reviews</h1>
            <div className="flex lg:w-5/12">
                <h2 className="text-3xl">{averageOverallRating()}</h2>
                <div className="flex">
                    <p>5</p>
                    <div className="h-1 rounded-full bg-main-grey-200 relative w-full">
                        <div className="absolute h-1 bg-amber-300 mr-3"></div>
                    </div>
                </div>
                
            </div>
            

        </div>
    )
}