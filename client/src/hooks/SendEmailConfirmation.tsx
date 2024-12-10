import axios from "axios"

interface SendEmailConfirmationProps {
  recipient: string;
  token: string;
}

//---- this can only be sent after account has been created in onboarding
export default async function SendEmailConfirmation({ recipient, token }: SendEmailConfirmationProps): Promise<boolean> {

  try {
    const response = await axios.post(
      "https://www.skillja.ca/email/new_user_confirmation/", { recipient },
      {
        headers: {
          "X-CSRFToken": token,
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
