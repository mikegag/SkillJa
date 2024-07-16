import { useState, useEffect } from "react"
import axios from "axios"

interface CsfrProps {
    name: string;
}

export default function CreateCSFR({ name }: CsfrProps): string | null {
    const [csrfToken, setCsrfToken] = useState<string | null>(null)
    const api = process.env.RAILWAY_URL 
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const res = await axios.get(`/${api}/csrf_token/`)
                const token = res.data.csrfToken
                if (token) {
                    setCsrfToken(token)
                    document.cookie = `csrftoken=${token}; path=/`
                }
            } catch (error) {
                console.error('Error fetching CSRF token:', error)
            }
        }

        fetchCsrfToken()
    }, [name])

    return csrfToken
}
