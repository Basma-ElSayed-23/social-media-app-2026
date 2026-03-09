import { createContext, useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"


export const AuthContext =  createContext();

export default function AuthContextProvider({children}) {
   const [userLogin, setUserLogin]  = useState(() => {
    return localStorage.getItem("userToken");
   });
   const [userId , setUserId] = useState(()=>{
   const data = localStorage.getItem("userData");
   return data && data !== "undefined" ? JSON.parse(data) : null;
   })

// const[profilePicRefresh, setprofilePicRefresh] = useState(0)

  //**// */
const updateUserData = (updatedUser) => {
  setUserId(updatedUser);
  localStorage.setItem("userData", JSON.stringify(updatedUser));
};

   useEffect(() =>{
    if (localStorage.getItem("userToken")){
        setUserLogin(localStorage.getItem("userToken"))
}
   },  []);


useEffect(() => {
  if (userLogin) {
    axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${userLogin}`,
      },
    })
    .then((res) => {
      setUserId(res.data.data.user);
      localStorage.setItem("userData", JSON.stringify(res.data.data.user))
    })
  }
}, [userLogin]);



    return  <AuthContext.Provider  value={{userLogin, setUserLogin, userId, updateUserData}}>
        {children}
    </AuthContext.Provider>
}