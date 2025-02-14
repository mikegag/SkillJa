import { useState, useEffect } from "react"

export default function useWindowSize() {
    // Initialize the state with default values for width and height, Default W & H set to 1024
    const [windowSize, setWindowSize] = useState({
        width: 1024,  
        height: 1024, 
    })

    useEffect(() => {
        // Function to update the state with the current window dimensions
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
        // Add event listener to handle window resize events
        window.addEventListener("resize", handleResize)
        // Call the function initially to set the state with current window dimensions
        handleResize()

        // Clean up the event listener when the component unmounts
        return () => window.removeEventListener("resize", handleResize)
    }, [])
    // Return the current window dimensions
    return windowSize
}
