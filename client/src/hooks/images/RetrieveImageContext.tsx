import { createContext, useContext } from "react";

// Context and Custom Hook + type for RetrieveImage
interface UserContextType {
    imageName: string;
    cache: boolean;
    id?:string;
}
export const UserContext = createContext<UserContextType>({
    imageName: "",
    cache: true,
})
export const useUserContext = () => useContext(UserContext)