import { useState, useEffect } from "react"
import axios from "axios"

interface CsfrProps {
    name: string;
}

export default function CreateCSFR({ name }: CsfrProps): string | null {
    const [csrfToken, setCsrfToken] = useState<string | null>(null)
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const res = await axios.get('/csrf_token/',{ 
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                })
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
