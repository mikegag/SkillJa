import { useState, useEffect } from "react"
import axios from "axios"

interface Image {
    name: string;
    styles: string;
}

export default function RetrieveImage({name, styles}:Image) {
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    if(name !== "default"){
        const fetchImage = async () => {
        try {
            const response = await axios.get(
            `${process.env.REACT_APP_SKILLJA_URL}/image/get_image/?image_name=${name}`
            )
            setImageUrl(response.data.signed_url)
        } catch (error) {
            console.error("Error fetching the signed image URL:", error)
        }
        }

        fetchImage()
    }
  }, [])

  return (
    <img 
        src={imageUrl ? imageUrl : require('../assets/default-avatar.jpg')} 
        alt={imageUrl ? "profile picture of user": "default avatar"}
        className={`${styles? styles: "w-60 h-60"}`}
    />
  )
}
