import { createContext } from "react";

const UserContext = createContext({
    username:"",
    setUsername:(u)=>{}
});

export default UserContext;