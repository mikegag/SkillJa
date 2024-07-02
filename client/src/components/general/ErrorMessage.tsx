import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"

export default function ErrorMessage(){
    const [hideMessage, setHideMessage] = useState<boolean>(false)

    return (
        <div className="" onClick={()=>setHideMessage(true)}>
            <div className="absolute ml-24 top-10 font-kulim shadow-lg border border-main-green-900 rounded-sm bg-main-white w-64 p-2">
                <span className="text-amber-600 font-semibold text-xl mr-3">
                    !
                </span> 
                passwords must match each other. Try again.
            </div>
        </div>
    )
}