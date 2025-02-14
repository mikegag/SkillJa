// Converts UTC Time to user's local time zone
export default function UseLocalTime(utcTime: string): string {
    if (!utcTime) {
        // Return fallback value for invalid time
        return "Invalid Time"
    }

    const date = new Date(utcTime)
    if (isNaN(date.getTime())) {
        // Return fallback for invalid date
        return "Invalid Time";
    } else {
        const options: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
            // Ensures AM/PM format
            hour12: true, 
        };

        let formattedTime = date.toLocaleTimeString(undefined, options);

        // Remove padded zeros (if necessary)
        formattedTime = formattedTime.replace(/^0+/, "");
        return formattedTime;
    }
}

