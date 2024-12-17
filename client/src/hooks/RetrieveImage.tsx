import { useState, useEffect } from "react"
import axios from "axios"

interface Image {
    imageName?: string;
    url?: string;
    styling: string;
}

export default function RetrieveImage({imageName, styling, url}:Image) {
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    // If an image name is passed as a prop, trigger API call
    if(imageName !== "default" && imageName !== "" && imageName !== undefined){
        const fetchImage = async () => {
        try {
            const response = await axios.get(
            `${process.env.REACT_APP_SKILLJA_URL}/image/get_image/?image_name=${imageName}`
            )
            setImageUrl(response.data.signed_url)
        } catch (error) {
            console.error("Error fetching the signed image URL:", error)
        }
        }

        fetchImage()
    }
    // If an image url is passed as a prop, set its value in state
    if(url !== "" && url !== undefined){
        setImageUrl(url)
    }

  }, [])

  return (
    <img 
        src={imageUrl ? imageUrl : require('../assets/default-avatar.jpg')} 
        alt={imageUrl ? "profile picture of user": "default avatar"}
        className={`${styling? styling: "w-60 h-60"}`}
    />
  )
}
