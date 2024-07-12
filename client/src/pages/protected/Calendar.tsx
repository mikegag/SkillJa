import React, { useEffect } from "react"
import { useState } from "react"
import Header from "../../components/navigation/Header"
import CalendarDisplay from "../../components/general/calendar-preview/CalendarDisplay"
import CalendarForm from "../../components/general/calendar-preview/CalendarForm"
import EventAccordion from "../../components/general/calendar-preview/EventAccordion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong, faChevronLeft, faChevronRight, faPlusCircle } from "@fortawesome/free-solid-svg-icons"

interface MonthDays {
    month: string,
    days: number[]
}

export default function Calendar(){
    const [firstMonthSelectedDay, setFirstMonthSelectedDay] = useState<string>("1")
    const [secondMonthSelectedDay, setSecondMonthSelectedDay] = useState<string>("1")
    const [displayCurrentMonth, setDisplayCurrentMonth] = useState<boolean>(true)
    const [addNewEvent, setAddNewEvent] = useState<boolean>(false)

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

        function daysInMonth(year: number, month: number): number {
            return new Date(year, month + 1, 0).getDate()
        }

        function getMonthDays(year: number, month: number): number[] {
            const days = []
            const numDays = daysInMonth(year, month)
            for (let day = 1; day <= numDays; day++) {
                days.push(day)
            }
            return days
        }

        const currentMonthDays: MonthDays = {
            month: monthNames[currentMonth],
            days: getMonthDays(currentYear, currentMonth)
        };

        const nextMonth = (currentMonth + 1) % 12
        const nextMonthYear = nextMonth === 0 ? currentYear + 1 : currentYear

        const nextMonthDays: MonthDays = {
            month: monthNames[nextMonth],
            days: getMonthDays(nextMonthYear, nextMonth)
        };

        return { currentMonthDays, nextMonthDays }
    }
    
    const { currentMonthDays, nextMonthDays } = getDaysCurrentAndNextMonth()

    return (
        <div className="flex flex-col">
            <Header useCase="protected" />
            <div className="flex flex-wrap h-dvh">
                <section className="flex flex-col m-auto my-8 lg:my-14">
                    <div className="ml-auto">
                        <button 
                            className="p-1 mx-2 w-fit text-main-green-900 hover:text-main-green-500"
                            onClick={()=>setDisplayCurrentMonth(true)}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <button 
                            className="p-1 mx-2 w-fit text-main-green-900 hover:text-main-green-500"
                            onClick={()=>setDisplayCurrentMonth(false)}
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                    {displayCurrentMonth ? 
                        <CalendarDisplay monthDays={currentMonthDays} daySelection ={setFirstMonthSelectedDay} />  
                    :
                        <CalendarDisplay monthDays={nextMonthDays} daySelection ={setSecondMonthSelectedDay} />
                    }
                </section>
                <section className="flex flex-col items-center justify-start bg-main-green-800 mt-auto pb-6 min-h-96 lg:h-dvh w-full rounded-t-3xl lg:w-5/12 lg:ml-auto lg:rounded-l-none lg:rounded-tr-none">
                    {addNewEvent ?
                    <>
                        <div className="flex justify-start w-full mt-12 mb-6 py-2 px-8">
                            <h2 className="mr-auto heading text-main-cream"></h2>
                            <FontAwesomeIcon 
                                icon={faArrowLeftLong} 
                                onClick={()=>setAddNewEvent(false)}
                                className="text-3xl ml-auto text-main-cream hover:text-main-green-300 cursor-pointer" 
                            />
                        </div>
                        <CalendarForm />
                    </>
                    :
                    <>
                        <div className="flex justify-start w-full mt-12 mb-12 py-2 px-8">
                            {displayCurrentMonth?
                                <h2 className="mr-auto heading text-main-cream">
                                {currentMonthDays.month} {firstMonthSelectedDay}
                                </h2>
                            : 
                                <h2 className="mr-auto heading text-main-cream">
                                {nextMonthDays.month} {secondMonthSelectedDay}
                                </h2>
                            }
                            <FontAwesomeIcon 
                                icon={faPlusCircle} 
                                onClick={()=>setAddNewEvent(true)}
                                className="text-2xl ml-auto text-main-cream hover:text-main-green-300 cursor-pointer" 
                            />
                        </div>
                        <EventAccordion title="Workout with Fred" time="4:00pm" description="workout with Coach Steph" />
                        <EventAccordion title="active recovery" time="7:00pm" description="sleep" />
                    </>
                    }
                </section>
            </div>
        </div>
    )
}