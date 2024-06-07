import React, {useState} from "react"
import data from "../../data.json"

interface formProps {
    isClicked: boolean
}
export default function AgreementTerms({isClicked}:formProps){
    const [formToDisplay, setFormToDisplay] = useState<string>("")
    const [clicked, setClicked] = useState<boolean>(false)

    function viewAgreement(input:string):void{
        setFormToDisplay(input)
    }

    function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        setClicked(!clicked)
        isClicked = clicked
    }

    return (
        <div>
            {
                formToDisplay === "terms"?
                    <div className="w-dvw h-dvh flex justify-center items-center bg-black bg-opacity-20">
                        <div className="bg-main-color-white rounded-2xl border border-main-black w-64 h-80 overflow-scroll p-4">
                            {data.terms.information.map((info,index)=>(
                                <>
                                    <h3 key={index}>{info.title}</h3>
                                    <p key={index}>{info.body}</p>
                                </>
                            ))}
                        </div>
                    </div>
                :
                (
                    formToDisplay === "privacy"? ""
                    :
                    <form onSubmit={handleSubmit} className="mb-5 text-center">
                        <input
                            type={data.terms.inputs[0].type}
                            name="agreement"
                        />
                        <label htmlFor="agreement" className="ml-4 text-center">
                            I have read and agree to the 
                            <span className="cursor-pointer text-main-green-500 underline ml-2" onClick={()=>viewAgreement("terms")}>
                                Terms and Conditions
                            </span>
                            , and 
                            <span className="cursor-pointer text-main-green-500 underline ml-2" onClick={()=>viewAgreement("privacy")}>
                                Privacy Policy.
                            </span> 
                        </label>
                    </form>
                )
                
            }
        </div>
    )
}