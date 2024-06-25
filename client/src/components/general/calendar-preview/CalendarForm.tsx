import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import { faHeading, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

export default function CalendarForm(){
    return (
        <div>
            <h2 className="heading lg:mt-10 text-main-cream">New Event</h2>
            <form className=" flex flex-col py-10 w-72 lg:w-96 mx-auto">
                <div className="relative w-full">
                    <input 
                        type="text" 
                        name="title" 
                        className="form-input mb-5" 
                        placeholder="Example - 'Workout with Chris'" 
                        required
                    />
                    <FontAwesomeIcon
                        icon={faHeading}
                        className="absolute inset-y-1/4 left-0 flex items-center pl-4 text-main-grey-500"
                    />
                </div>
                <div className="relative w-full">
                    <input 
                        type="date" 
                        name="date" 
                        className="form-input date-input-alternative mb-5" 
                        required
                    />
                </div>
                <div className="relative w-full">
                    <input 
                        type="time" 
                        name="time" 
                        min="04:00" 
                        max="23:00" 
                        className="form-input time-input mb-5" 
                        required
                    />
                </div>
                <textarea 
                    name="description" 
                    className="form-input p-4 mb-5 max-h-20 min-h-20" 
                    placeholder="Enter Your Event Description"
                    required/>
                <button 
                    type="submit" 
                    className="form-btn bg-main-green-400 hover:bg-main-green-500 w-full">
                    Save
                </button>
            </form>
        </div>
    )
}