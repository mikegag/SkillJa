import React from "react"
import axios from "axios"
import GetCSFR from "./GetCSFR"

interface SendEmailConfirmationProps {
  recipient: string;
}

//---- this can only be sent after account has been created in onboarding
export async function SendEmailConfirmation({ recipient }: SendEmailConfirmationProps): Promise<boolean> {
  const csrfToken = GetCSFR({ name: "csrftoken" })

  try {
    const response = await axios.post(
      "https://www.skillja.ca/email/new_user_confirmation/", { recipient },
      {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )

    return response.status === 200
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        console.error("Error response:", error.response.data)
        console.error("Status:", error.response.status)
        console.error("Headers:", error.response.headers)
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request)
      } else {
        // An error occurred in setting up the request
        console.error("Error setting up request:", error.message)
      }
    } else {
      console.error("Unexpected error:", error)
    }
    return false
  }
}
