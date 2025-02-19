import React, {useEffect, useState} from "react"
import data from "../../data.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"

interface formProps {
    isClicked: boolean
}
export default function AgreementTerms({isClicked}:formProps){
    const [formToDisplay, setFormToDisplay] = useState<string>("")
    const [clicked, setClicked] = useState<boolean>(false)

    useEffect(()=>{
        setClicked(clicked)
    },[clicked])

    function viewAgreement(input:string):void{
        setFormToDisplay(input)
    }

    return (
        <div>
            {
            formToDisplay === "terms" ? 
                <div className="pop-up-background">
                    <div className="flex flex-col bg-white rounded-2xl border border-main-black w-80 h-96 lg:w-6/12 lg:h-4/6 overflow-scroll p-4">
                        <button className="ml-auto mr-0 hover:text-main-green-500" onClick={()=>setFormToDisplay("")}>
                            <FontAwesomeIcon icon={faX}/>
                        </button>
                        {data.terms.terms_conditions.map((info, index) => (
                            <div key={index} className="mb-7">
                                <h3 
                                    key={`${index}-title`} 
                                    className={`font-bold w-full ${index === 0 ? "text-center underline mb-2 text-lg" : "mb-2"}`}
                                >
                                    {info.title} 
                                </h3>
                                {Array.isArray(info.body) ? (
                                    info.body.map((val, subIndex) => (
                                        <div key={`${index}-${subIndex}`}>
                                            {val.subheader && <p className="font-semibold">{val.subheader}</p>}
                                            {val.points && val.points.length > 0 && (
                                                <ul className="list-disc pl-5">
                                                    {val.points.map((point, pointIndex) => (
                                                        <li key={`${index}-${subIndex}-${pointIndex}`}>{point}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p>{info.body}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            :
            (
            formToDisplay === "privacy"?
            <div className="pop-up-background">
                <div className="flex flex-col bg-white rounded-2xl border border-main-black w-80 h-96 lg:w-6/12 lg:h-4/6 overflow-scroll p-4">
                    <button className="ml-auto mr-0 hover:text-main-green-500" onClick={()=>setFormToDisplay("")}>
                        <FontAwesomeIcon icon={faX}/>
                    </button>
                    {data.terms.privacy_policy.map((info, index) => (
                        <div key={index} className="mb-7">
                            <h3 
                                key={`${index}-title`} 
                                className={`font-bold w-full ${index === 0 ? "text-center underline mb-2 text-lg" : "mb-2"}`}
                            >
                                {info.title}
                            </h3>
                            {Array.isArray(info.body) ? (
                                info.body.map((val, subIndex) => (
                                    <div key={`${index}-${subIndex}`}>
                                        {val.subheader && <p className="font-semibold">{val.subheader}</p>}
                                        {val.points && val.points.length > 0 && (
                                            <ul className="list-disc pl-5">
                                                {val.points.map((point, pointIndex) => (
                                                    <li key={`${index}-${subIndex}-${pointIndex}`}>{point}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>{info.body}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            :
            <div className="mb-5 text-center">
                <input
                    id="agreement"
                    type={data.terms.inputs[0].type}
                    name="agreement"
                    onClick={()=>setClicked(!clicked)}
                    required
                />
                <label htmlFor="agreement" className="ml-4 text-center">
                    I have read and agree to the 
                    <span className="underline cursor-pointer text-main-green-700 ml-2 hover:text-main-green-500" onClick={()=>viewAgreement("terms")}>
                        Terms and Conditions
                    </span>
                    , and 
                    <span className="underline cursor-pointer text-main-green-700 ml-2 hover:text-main-green-500" onClick={()=>viewAgreement("privacy")}>
                        Privacy Policy.
                    </span> 
                </label>
            </div>
            )  
        }
    </div>
    )
}