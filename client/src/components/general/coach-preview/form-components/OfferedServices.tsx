import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export default function OfferedServices(){
    const [services, setServices] = useState([])
    //api call to load saved services

    return (
        <div>
            {services ?
            <>
                {services.map((currService, index)=>(
                    <div 
                        className="flex border border-main-grey-100 text-main-green-900 rounded-xl py-2 px-4 my-1 font-kulim cursor-pointer hover:bg-main-green-500 hover:text-main-white"
                        key={index}
                    >
                        <div className="flex flex-col justify-start items-center">
                            <h4>
                                title
                            </h4>
                            <p>
                                See Price and Details
                            </p>
                        </div>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                ))}
            </> 
            :
                <p>
                    No Services Saved/Available
                </p>
            }
        </div>
    )
}