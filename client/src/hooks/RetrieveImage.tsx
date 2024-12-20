import { useState, useEffect } from "react"
import axios from "axios"

interface Image {
    imageName?: string;
    id?:string;
    url?: string;
    styling: string;
}

export default function RetrieveImage({imageName, styling, url, id}:Image) {
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImage = async (endpoint: string) => {
      try {
        const response = await axios.get(endpoint)
        if (response.status === 200) {
          setImageUrl(response.data.signed_url)
        } else {
          setError("No image found for this user.")
        }
      } catch {
        setError("Could not retrieve the image. Please try again later.")
        console.log(error)
      }
    }

    if (imageName && imageName !== "default") {
      const endpoint = `${process.env.REACT_APP_SKILLJA_URL}/image/get_image/?image_name=${imageName}`
      fetchImage(endpoint)
    } else if (id) {
      const endpoint = `${process.env.REACT_APP_SKILLJA_URL}/image/get_image/?id=${id}`
      fetchImage(endpoint)
    } else if (url) {
      setImageUrl(url)
    }
  }, [imageName, id, url])

  return (
    <img 
        src={imageUrl ? imageUrl : require('../assets/default-avatar.jpg')} 
        alt={imageUrl ? "profile picture of user": "default avatar"}
        className={`${styling? styling: "w-60 h-60"}`}
    />
  )
}
