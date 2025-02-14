import React, { useEffect } from "react"
import { format } from 'date-fns'
import axios from "axios"
import GetCSFR from "../userAuthentication/GetCSFR";

interface EventData {
    title: string;
    description?: string;
    location?: string;
    participants: string;
    date: string;
}

export default function CreateCalendarEvent({title, description, location, participants, date}:EventData){
    // Format the date as 'YYYY-MM-DD-HH-MM'
    const formattedDate = format(new Date(date), 'yyyy-MM-dd-HH-mm')
    const csrfToken = GetCSFR({ name: "csrftoken" })

    // API call to create calendar event
    useEffect(()=>{
        axios.post(`${process.env.REACT_APP_SKILLJA_URL}/calendar/create_calendar_event/`, {title, description, location, participants, formattedDate}, { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
            }) 
            .then(res => {
                if(res.status !==201){
                    return false
                } else{
                    return true
                }
            })
            .catch(error => {console.error(error)})
    },[])
}   
