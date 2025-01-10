import React, { useEffect } from "react"
import { useState } from "react"
import Header from "../../components/navigation/Header"
import CalendarDisplay from "../../components/general/calendar-preview/CalendarDisplay"
import EventAccordion from "../../components/general/calendar-preview/EventAccordion"
import Footer from "../../components/navigation/Footer"
import axios from "axios"
import GetCSFR from "../../hooks/GetCSFR"

interface MonthDays {
    month: string;
    days: number[];
    yearChange?: boolean;
}

export default function Calendar(){
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const [firstMonthSelectedDay, setFirstMonthSelectedDay] = useState<string>("1")
    const [secondMonthSelectedDay, setSecondMonthSelectedDay] = useState<string>("1")
    const [displayCurrentMonth, setDisplayCurrentMonth] = useState<boolean>(true)
    const [savedEvents, setSavedEvents] = useState([])

    useEffect(()=>{
        document.title = 'SkillJa - Calendar'
    },[])

    // API call to get events for currently selected day
    function retrieveEvents(day:string){
        axios.get(`${process.env.REACT_APP_SKILLJA_URL}/calender/get_events/day?=${day}`, { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
            }) 
            .then(res => {
                if(res.status===200){
                    setSavedEvents(res.data.events)
                } 
            })
            .catch(error => {console.error(error)})
    }

    useEffect(()=>{

    },[firstMonthSelectedDay,secondMonthSelectedDay])

    useEffect(()=>{
        //updates selected day when switching between months on CalendarDisplay
        if(displayCurrentMonth){
            setSecondMonthSelectedDay(firstMonthSelectedDay)
        } else {
            setFirstMonthSelectedDay(secondMonthSelectedDay)
        } 
    },[displayCurrentMonth, firstMonthSelectedDay, secondMonthSelectedDay])

    //returns data for current month and following month based on today's date
    function getDaysCurrentAndNextMonth() {
        const today = new Date()
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ]
        const currentYear = today.getFullYear()
        const currentMonth = today.getMonth()
        const currentMonthDays: MonthDays = {
            month: monthNames[currentMonth],
            days: getMonthDays(currentYear, currentMonth)
        }

        const nextMonth = (currentMonth + 1) % 12
        // update year if current month is December, since New Year calendar is different from current
        const nextMonthYear = nextMonth === 0 ? currentYear + 1 : currentYear
        const yearChange = nextMonth === 0 ? true : false

        const nextMonthDays: MonthDays = {
            month: monthNames[nextMonth],
            days: getMonthDays(nextMonthYear, nextMonth),
            yearChange: yearChange
        }
        
        // get number of days in given month and year
        function daysInMonth(year: number, month: number): number {
            return new Date(year, month + 1, 0).getDate()
        }

        // get list of all days in given month and year
        function getMonthDays(year: number, month: number): number[] {
            const days = []
            const numDays = daysInMonth(year, month)
            for (let day = 1; day <= numDays; day++) {
                days.push(day)
            }
            return days
        }

        return { currentMonthDays, nextMonthDays }
    }
    
    const { currentMonthDays, nextMonthDays } = getDaysCurrentAndNextMonth()

    return (
        <div className="flex flex-col">
            <Header useCase="protected" />
            <div className="flex justify-center items-start flex-wrap mt-10 pb-4 mb-16 lg:mb-32">
                <section className="flex flex-col mx-auto">
                    {displayCurrentMonth ? 
                        <CalendarDisplay monthDays={currentMonthDays} daySelection ={setFirstMonthSelectedDay} monthSelection={setDisplayCurrentMonth} />  
                    :
                        <CalendarDisplay monthDays={nextMonthDays} daySelection ={setSecondMonthSelectedDay} monthSelection={setDisplayCurrentMonth} />
                    }
                </section>
                <section className="flex flex-col items-start justify-start mx-auto border-t md:border-t-0 w-80 mt-10 md:mt-0 lg:ml-4 lg:mr-auto">
                    <div className="flex py-2 font-source text-left w-full mb-6">
                        {displayCurrentMonth ?
                            <h2 className="ml-0 mr-auto pt-6 md:pt-0 my-auto text-2xl text-left">
                                {currentMonthDays.month} {firstMonthSelectedDay}
                            </h2>
                        : 
                            <h2 className="ml-0 mr-auto pt-6 md:pt-0 my-auto text-2xl text-left">
                            {nextMonthDays.month} {secondMonthSelectedDay}
                            </h2>
                        }
                    </div>
                    {savedEvents.length > 0 ?
                        // savedEvents.map(event=>(
                        //     <EventAccordion title={event.title} time={event.time} description={event.description} />
                        // ))
                        <></>
                    :
                        <p>No scheduled events.</p>
                    }
                </section>
            </div>
            <Footer />
        </div>
    )
}