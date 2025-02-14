import React from "react"
import { Link } from "react-router-dom"

export default function NotFound(){
    return (
        <div className="text-center mx-auto mt-32">
            <p className="font-kulim text-xl">
                Oops! That wasn't supposed to happen. Please Reload the page or go back to 
                <Link to='/' className="underline ml-2">
                    home
                </Link>
            </p>
        </div>
    )
}