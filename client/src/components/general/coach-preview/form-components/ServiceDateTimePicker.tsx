import axios from "axios"
import React, { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface Props {
    csrftoken: string;
    coachId: string;
}

interface Availability {
    currentMonth: Month;
    nextMonth: Month;
}

interface Month {
    // [day of week index 1-7]: [startHour, startMinute, endHour, endMinute]
    weekly: { [day:number]: [number, number, number, number] };
    // e.g., [1, 15, 20] (specific dates in the month)
    blockedDays: number[];
}


export default function ServiceDateTimePicker({ csrftoken, coachId }: Props) {
    const [startDate, setStartDate] = useState(new Date())
    const [openPicker, setOpenPicker] = useState<boolean>(false)
    const [CoachAvailability, setCoachAvailability] = useState<Availability | null>(null)

    // Calculate the date range
    const today = new Date()
    const twoMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate())

    // Dynamic time range calculation using API data
    const getMinMaxTime = (date: Date | null) => {
        if (!date || !CoachAvailability) return {}

        // Determine if the date is in the current or next month
        const isCurrentMonth = date.getMonth() === today.getMonth()
        const availability = isCurrentMonth ? CoachAvailability.currentMonth : CoachAvailability.nextMonth
         // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const dayOfWeek = date.getDay()
        // Adjust Sunday to 7 for API alignment
        const dayKey = dayOfWeek === 0 ? 7 : dayOfWeek
        const daySchedule = availability.weekly[dayKey] || null

        if (!daySchedule) return {}

        const [startHour, startMinute, endHour, endMinute] = daySchedule

        const minTime = new Date()
        minTime.setHours(startHour, startMinute, 0, 0)

        const maxTime = new Date()
        maxTime.setHours(endHour, endMinute, 0, 0)

        return { minTime, maxTime }
    }

    // Determine time range based on the selected date
    const { minTime, maxTime } = getMinMaxTime(startDate)

    // API call to get coach availability
    function getCoachAvailability() {
        axios.get(`${process.env.REACT_APP_SKILLJA_URL}/calendar/get_coach_availability/?coachId=${coachId}`, {
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            })
            .then((res) => {
                if (res.status === 200) {
                    setCoachAvailability(res.data.availability)
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    return (
        <div className="ml-0 mr-auto my-6 w-56">
            {openPicker ? (
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date!)}
                    showTimeSelect
                    dateFormat="Pp"
                    popperClassName="datepicker"
                    className="border mx-auto text-center w-56 border-main-grey-100 rounded-2xl p-2 focus:ring-0 outline-main-green-500"
                    minDate={today} // Restrict dates to today and onwards
                    maxDate={twoMonthsFromNow} // Restrict dates to two months from today
                    minTime={minTime} // Set dynamic min time
                    maxTime={maxTime} // Set dynamic max time
                    filterDate={(date) => {
                        if (!CoachAvailability) return true;
                        // Determine if the date is in the current or next month
                        const isCurrentMonth = date.getMonth() === today.getMonth();
                        const availability = isCurrentMonth ? CoachAvailability.currentMonth : CoachAvailability.nextMonth;
                        const dayOfMonth = date.getDate();
                        const isBlockedDay = availability.blockedDays.includes(dayOfMonth);
                        // Disable blocked days only
                        return !isBlockedDay;
                    }}
                />
            ) : (
                <div
                    role="presentation"
                    className="bg-white rounded-2xl mx-auto text-center px-4 py-2 border border-main-grey-100 cursor-pointer hover:border-main-green-500"
                    onClick={() => {
                        setOpenPicker(true);
                        getCoachAvailability();
                    }}
                >
                    Select Date & Time
                </div>
            )}
        </div>
    )
}
