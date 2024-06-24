import React from "react"
import { useState } from "react"
import CalendarDisplay from "../../components/general/calendar-preview/CalendarDisplay"

interface MonthDays {
    month: string,
    days: number[]
}

export default function Calendar(){
    const [firstMonthSelectedDay, setFirstMonthSelectedDay] = useState<number>(1)
    const [secondMonthSelectedDay, setSecondMonthSelectedDay] = useState<number>(1)
    //-------implement these as props to calendarDisplay to retreive selected day

    //returns data for current month and following month based on today's date
    function getDaysCurrentAndNextMonth() {
        const today = new Date();
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
            const days = [];
            const numDays = daysInMonth(year, month)
            for (let day = 1; day <= numDays; day++) {
                days.push(day);
            }
            return days;
        }

        const currentMonthDays: MonthDays = {
            month: monthNames[currentMonth],
            days: getMonthDays(currentYear, currentMonth)
        };

        const nextMonth = (currentMonth + 1) % 12;
        const nextMonthYear = nextMonth === 0 ? currentYear + 1 : currentYear

        const nextMonthDays: MonthDays = {
            month: monthNames[nextMonth],
            days: getMonthDays(nextMonthYear, nextMonth)
        };

        return { currentMonthDays, nextMonthDays }
    }
    
    const { currentMonthDays, nextMonthDays } = getDaysCurrentAndNextMonth()

    return (
        <div>
            <CalendarDisplay monthDays={currentMonthDays} />
            <CalendarDisplay monthDays={nextMonthDays} />
        </div>
    )
}