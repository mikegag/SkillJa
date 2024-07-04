import { useState, useEffect } from "react";

interface CsfrProps {
    name: string;
}

function getCookie(name: string): string | null {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export default function useCSFR({ name }: CsfrProps): string | null {
    const [csrfToken, setCsrfToken] = useState<string | null>(null);

    useEffect(() => {
        const token = getCookie(name);
        setCsrfToken(token);
    }, [name]);

    return csrfToken;
}
