import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NormalizePath() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Remove extra trailing slashes
    const normalizedPath = location.pathname.replace(/\/+$/, '')
    if (location.pathname !== normalizedPath) {
      navigate(normalizedPath + location.search, { replace: true })
    }
  }, [location, navigate])

  return null
}