import { useState, useEffect } from "react"

export default function useWindowSize(){
    const [windowSize, setWindowSize] = useState({
        //default set to 1024
        width: 1024,
        height: 1024,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return windowSize
}