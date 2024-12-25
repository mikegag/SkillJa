import { useState, useEffect, useContext } from "react"
import { useUserContext } from "../hooks/RetrieveImageContext"
import axios from "axios"
import GetCSFR from "./GetCSFR";

interface Image {
    id?:string;
    url?: string;
    styling: string;
}

export default function RetrieveImage({ styling, url, id}:Image) {
  const [imageUrl, setImageUrl] = useState("")
  const csrfToken = GetCSFR({ name: "csrftoken" })
  const userContext = useUserContext()
  

    useEffect(() => {
        const fetchCacheImage = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_SKILLJA_URL}/image/get_cached_image/`, {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                })
                // if coach image is not requested and cached image exists
                if (res.status === 200 && (!id && !url)) {
                    setImageUrl(res.data.profile_image_url)
                } 
                else if (res.status === 204 || (id || url)) {
                    // If no cached image, fetch a new profile image url or fetch coach image
                    const fetchImage = async (endpoint:string) => {
                        try {
                            const response = await axios.get(endpoint, { 
                                headers: {
                                    'X-CSRFToken': csrfToken,
                                    'Content-Type': 'application/json'
                                },
                                withCredentials: true
                            })
                            if (response.status === 200) {
                                setImageUrl(response.data.signed_url)
                            } else {
                                console.error("No image found for this user.")
                            }
                        } catch (error) {
                            console.error("Could not retrieve the image. Please try again later.")
                            console.error(error)
                        }
                    } 

                    // Construct the appropriate endpoint based on input parameters
                    if (userContext.imageName && userContext.imageName !== "default") {
                        const endpoint = `${process.env.REACT_APP_SKILLJA_URL}/image/get_image/?image_name=${userContext.imageName}&cache=${userContext.cache}`
                        fetchImage(endpoint)
                    } else if (id) {
                        const endpoint = `${process.env.REACT_APP_SKILLJA_URL}/image/get_image/?id=${id}`
                        fetchImage(endpoint)
                    } else if (url) {
                        setImageUrl(url)
                    }
                }
            } catch (error) {
                console.error("Error checking authentication", error)
            }
        }   
            fetchCacheImage()
            
    }, [id, url])


  return (
    <img 
        src={imageUrl ? imageUrl : require('../assets/default-avatar.jpg')} 
        alt={imageUrl ? "profile picture of user": "default avatar"}
        className={`${styling? styling: "w-60 h-60"}`}
    />
  )
}
