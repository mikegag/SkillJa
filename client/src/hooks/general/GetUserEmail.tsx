import axios from "axios"

interface Props {
  token: string;
}

// Used to retrieve user email during onboarding process to assist SendEmailConfirmation hook
export default async function GetUserEmail({ token }: Props){

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SKILLJA_URL}/get_user_email/`,
      {
        headers: {
          "X-CSRFToken": token,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )

    return response.data.user_email || ""
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
    return ""
  }
}
