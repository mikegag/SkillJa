import { createContext, useContext } from "react";

// Context and Custom Hook + type for RetrieveImage
interface UserContextType {
    imageName: string;
    cache: boolean;
}
export const UserContext = createContext<UserContextType>({
    imageName: "",
    cache: true,
})
export const useUserContext = () => useContext(UserContext)