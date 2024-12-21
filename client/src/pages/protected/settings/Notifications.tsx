import React, { useEffect, useState } from "react"
import Header from "../../../components/navigation/Header"
import Footer from "../../../components/navigation/Footer"
import axios from "axios";
import GetCSFR from "../../../hooks/GetCSFR";

interface Form {
    messaging: boolean;
    appointments: boolean;
    marketing: boolean;
}

export default function AccountInformation(){
    const [formData, setFormData] = useState<Form>({
        messaging: false,
        appointments: false,
        marketing: false,
    })
    const [disableButton, setDisableButton] = useState<boolean>(true)
    const csrfToken = GetCSFR({ name: "csrftoken" })

    // Retrieve any saved notification preferences
    useEffect(()=>{
        document.title = 'SkillJa - Notifications'
        axios.get(`${process.env.REACT_APP_SKILLJA_URL}/settings/get_notification_preferences`, { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }) 
        .then(res => {
            if (res.status === 200) {
                setFormData({
                    messaging: res.data.messaging,
                    appointments: res.data.appointments,
                    marketing: res.data.marketing
                })
            }
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDisableButton(false)
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }))
    }

    function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_SKILLJA_URL}/settings/update_notification_preferences`, formData, { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }) 
        .then(res => {
            if (res.status === 200) {
                setDisableButton(true)
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    return (
        <>
            <Header useCase="protected" />
            <section className="flex flex-col justify-center items-center font-kulim py-2 px-4 lg:px-12 mx-auto mt-10 mb-20">
                <h2 className="text-3xl font-source mb-2">
                    Notifications
                </h2>
                <p>
                    Customize your alerts and email preferences
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center w-full mt-8">
                    {[
                        {
                            id: "messaging",
                            label: "Messaging Notifications",
                            description: "Notify me when I receive messages from other users",
                        },
                        {
                            id: "appointments",
                            label: "Appointment Reminders",
                            description: "Notify me before an upcoming appointment",
                        },
                        {
                            id: "marketing",
                            label: "Marketing",
                            description:
                                "Allow SkillJa to notify me about upcoming promotions and other marketing announcements",
                        },
                    ].map(({ id, label, description }) => (
                        <div key={id} className="flex w-full md:w-3/6 bg-white border border-gray-300 rounded-2xl font-kulim px-4 py-2 my-2">
                            <div className="flex flex-col justify-start items-start mr-4">
                                <p className="text-lg">{label}</p>
                                <p className="text-gray-400">{description}</p>
                            </div>
                            <label className="inline-flex items-center cursor-pointer ml-auto my-auto">
                                <input
                                    id={id}
                                    name={id}
                                    type="checkbox"
                                    checked={formData[id as keyof Form]}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-main-green-500"></div>
                            </label>
                        </div>
                    ))}
                    <button 
                        className={`form-btn mt-9 mx-auto ${disableButton ? "text-gray-400": "text-white"}`} 
                        disabled={disableButton}
                    >
                        Save changes
                    </button>
                </form>
            </section>
            <Footer />
        </>
    )
}