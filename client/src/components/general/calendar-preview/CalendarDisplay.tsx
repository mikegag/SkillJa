import React from "react"
import { useState, useEffect } from "react"

interface MonthDays {
    month: string,
    days: number[]
}

interface CalendarProps {
    monthDays: MonthDays,
    daySelection: (value:string)=>void
}

export default function CalendarDisplay({ monthDays, daySelection }:CalendarProps){
    const [selectedDay, setSelectedDay] = useState<string>("1")
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    useEffect(()=>{
        setSelectedDay(today.toDateString().slice(8,10))
    },[])

    useEffect(()=>{
        daySelection(selectedDay)
    },[selectedDay])

    function getFirstDayOfMonth(year: number, month: number): number {
        return new Date(year, month, 1).getDay()
    }

    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonthIndex = new Date(`${monthDays.month} 1, ${currentYear}`).getMonth()
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonthIndex)
    const weeks: number[][] = Array.from({ length: 6 }, () => [])

    let currentWeek = 0

    // Empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        weeks[currentWeek].push(0)
    }

    // Fill the days of the month
    monthDays.days.forEach((day) => {
        if (weeks[currentWeek].length === 7) {
            currentWeek++
        }
        weeks[currentWeek].push(day)
    });

    // Fill remaining empty cells for the last week
    while (weeks[currentWeek].length < 7) {
        weeks[currentWeek].push(0)
    }

    return (
        <div className="text-lg lg:text-2xl">
            <h2 className="text-main-green-900 font-source text-2xl lg:text-3xl mb-4 lg:mb-8">
                {monthDays.month.slice(0,4)} {selectedDay}
            </h2>
            <table>
                <thead className="border-b border-main-green-900">
                    <tr>
                        {daysOfWeek.map((day) => (
                            <th
                                key={day}
                                className="pr-3 lg:pr-5 pb-1 font-kulim font-light"
                            >
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="pt-6">
                {weeks.map((week, index) => (
                    <tr key={index} className={index===0? 'pt-6': ""}>
                        {week.map((day, i) => (
                            
                            <td 
                                key={i} 
                                id={`${monthDays.month}-${day}`}
                                className={`
                                    ${day === 0 ? 'empty cursor-not-allowed' : ''} 
                                    ${index===0? 'pt-5': ""}  
                                    font-kulim py-2`
                                }
                            >
                                <div className="flex w-full cursor-pointer" onClick={()=>setSelectedDay(day.toString())}>
                                    <p className={`px-2 py-0.5 lg:py-2 lg:px-3 mx-auto 
                                            ${today.toDateString().slice(8,10) == day.toString() && today.toDateString().slice(4,7) == monthDays.month.slice(0,3) ? "underline":""} 
                                            ${selectedDay == day.toString()? "flex justify-center bg-amber-400 rounded-full":""}  
                                            ${day === 0 ? 'cursor-not-allowed' : ''} `}
                                    >
                                        {day !== 0 ? day : ''}
                                    </p>
                                </div>
                            </td>
                            
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}