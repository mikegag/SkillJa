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
            formToDisplay === "terms"?
                <div className="w-dvw h-dvh flex justify-center items-center bg-black bg-opacity-60 absolute top-0 left-0">
                    <div className="flex flex-col bg-white rounded-2xl border border-main-black w-80 h-96 overflow-scroll p-4">
                        <button className="ml-auto mr-0 hover:text-main-green-500" onClick={()=>setFormToDisplay("")}>
                            <FontAwesomeIcon icon={faX}/>
                        </button>
                        {data.terms.terms_conditions.map((info,index)=>(
                            <>
                                    <h3 key={index + "title"} className={`font-bold w-full ${index===0? "text-center underline mb-2 text-lg":"mb-2"}`}>
                                    { info.title}
                                </h3>
                                <p key={index + "body"} className="mb-6">
                                    {info.body}
                                </p>
                            </>
                        ))}
                    </div>
                </div>
            :
            (
            formToDisplay === "privacy"?
            <div className="w-dvw h-dvh flex justify-center items-center bg-black bg-opacity-60 absolute top-0 left-0">
                <div className="flex flex-col bg-white rounded-2xl border border-main-black w-80 h-96 overflow-scroll p-4">
                    <button className="ml-auto mr-0 hover:text-main-green-500" onClick={()=>setFormToDisplay("")}>
                        <FontAwesomeIcon icon={faX}/>
                    </button>
                    {data.terms.privacy_policy.map((info,index)=>(
                        <>
                            <h3 key={index + "title"} className={`font-bold w-full ${index===0? "text-center underline mb-2 text-lg":"mb-2"}`}>
                                { info.title}
                            </h3>
                            <p key={index + "body"} className="mb-6">
                                {info.body}
                            </p>
                        </>
                    ))}
                </div>
            </div>
            :
            <div className="mb-5 text-center">
                <input
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