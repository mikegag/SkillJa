import React, { useState } from 'react'
import axios from 'axios'

export default function ProfilePhotoUploader({ token }: { token: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [buttonText, setButtonText]= useState("Update Photo")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a valid image (JPG, JPEG, or PNG)")
        return
      }

      setSelectedFile(file)

      // Generate a preview URL for the selected file
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
        alert("No file selected!")
        return
    }
    // Set state to uploading and alert user with button text
    setIsUploading(true)
    setButtonText("Uploading...")

    try {
      // Format file data
      const formData = new FormData()
      formData.append("filepath", selectedFile)
      // API request
      const response = await axios.post(
        `${process.env.REACT_APP_SKILLJA_URL}/image/upload_image/`, formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": token,
          },
          withCredentials: true,
        }
      )

    } catch (error) {
        console.error("Error uploading photo:", error);
        alert("Failed to upload photo.")
    } finally {
        // temporarily display success to alert user then reset button text to default value
        setTimeout(() => {
            setButtonText("Success!")
        }, 1500)
        setTimeout(()=>{
            setIsUploading(false)
            setButtonText("Update Photo")
        },3000)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center my-5">
        <img
            src={previewUrl || require('../assets/default-avatar.jpg')}
            className="w-24 h-24 rounded-xl"
            alt="Profile Preview"
        />
        <label className="block text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input"></label>
        <input 
            className="block w-fit py-2 px-4 mt-6 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
            aria-describedby="file_input_help" 
            id="file_input" 
            type="file"
            accept="image/*"
            onChange={handleFileChange}
        />
        <p className="mt-1.5 text-xs px-2 text-gray-500 dark:text-gray-300" id="file_input_help">
            PNG, JPG or JPEG. Recommended: X by X (e.g., 500px by 500px).
        </p>
        <button
            onClick={handleUpload}
            className={`mt-5 mx-auto py-2 px-4 ${isUploading ? "cursor-not-allowed":""} bg-main-green-500 text-main-white font-kulim rounded-xl hover:bg-main-green-700`}
            disabled={isUploading}
        >
        {buttonText}
      </button>
    </div>
  )
}