import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../../components/navigation/Header"
import Footer from "../../../components/navigation/Footer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLongArrowLeft } from "@fortawesome/free-solid-svg-icons"
import Accordion from "../../../components/general/Accordion"
import data from "../../../data.json"
import axios from "axios"
import GetCSFR from "../../../hooks/userAuthentication/GetCSFR"


export default function DeleteAccount(){
    const [reason, setReason] = useState<string>("")
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
    const navigate = useNavigate()
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const [errorMessage, setErrorMessage] = useState<string>("")

    useEffect(()=>{
        document.title = 'SkillJa - Delete Account'
    },[])

    function handleAccountDeletion(){
        axios.post(`${process.env.REACT_APP_SKILLJA_URL}/delete_account/`, {reason: reason},{
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            if (res.status === 200) {
                navigate("/")
            } else {
                setErrorMessage("Failed to delete account. Please try again later.")
            }
        })
        .catch(error => {
            console.error(error);
            setErrorMessage("An unexpected error occurred. Please try again.")
        })
    }

    return (
        <>
            <Header useCase="protected" />
            <section className="font-kulim flex flex-col justify-start items-start py-2 px-4 lg:px-12 mx-auto mt-10 mb-20">
                <FontAwesomeIcon 
                    icon={faLongArrowLeft} 
                    className="text-2xl cursor-pointer mb-9 hover:text-main-green-500" 
                    onClick={()=>navigate("../")}
                />
                <h2 className="text-3xl font-source mb-4">
                    Delete your account
                </h2>
                <p className="mb-9">
                    Permanently delete your account and all associated data. This action cannot be undone.          
                </p>
                <p className="mb-4 font-semibold">
                    Are you sure you want to delete your account?
                </p>
                <p className="mb-9 max-w-3xl">
                    This will permanently remove all your data, including your profile, sessions, and personal information. 
                    For your security, you will need to confirm your identity. You may receive an email from us to verify the deletion request.
                </p>
                <p className="mb-4 font-semibold">
                    Why are you deleting your account?
                </p>
                <Accordion title="Select reason" styles="bg-white mt-2 mb-12 border rounded-xl border-main-grey-100 lg:w-2/6 ml-0 mr-auto">
                    {data.deleteAccount.map((value) => (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setReason((prev) => (prev === value.option ? "" : value.option));
                            }}
                            key={`individual-${value.index}`}
                            value={value.option}
                            aria-label={`account deletion option: ${value.option}`}
                            className={`text-left p-3 hover:bg-main-green-700 hover:text-main-color-white ${
                                reason === value.option ? "bg-main-green-500 text-white" : "bg-white"
                            }`}
                        >
                            {value.option}
                        </button>
                    ))}
                </Accordion>
                <button
                    className={`form-btn ${confirmDelete ? "bg-red-500 hover:bg-red-700" : ""} ${reason.length <= 0 ? 'cursor-not-allowed bg-main-grey-300': 'cursor-pointer bg-main-green-500'}`}
                    onClick={() => {
                        if (confirmDelete && reason.length > 0) {
                            handleAccountDeletion();
                        } else {
                            setConfirmDelete(true);
                        }
                    }}
                    disabled={reason.length <= 0}
                    aria-describedby="delete-warning"
                >
                    {confirmDelete ? "Confirm Account Deletion" : "Delete my account"}
                </button>
                {errorMessage && <p className="text-red-500 mt-4" aria-live="assertive">{errorMessage}</p>}
            </section>
            <Footer />
        </>
    )
}