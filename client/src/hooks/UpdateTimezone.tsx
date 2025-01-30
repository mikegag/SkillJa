import axios from "axios"

export async function updateTimezone(csrfToken: string): Promise<void> {
    try {
        // Retrieve local timezone
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        
        // API call to update user timezone
        const response = await axios.post(
            `${process.env.REACT_APP_SKILLJA_URL}/update_timezone/`,
            { timezone: userTimezone },
            {
                headers: {
                    "X-CSRFToken": csrfToken,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );

        // Log any issues
        if (response.status !== 200) {
            console.error("Error updating timezone", response);
        }
    } catch (error) {
        console.error("Timezone update failed:", error);
    }
}