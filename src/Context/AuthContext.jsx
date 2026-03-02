import { createContext, useEffect, useState } from "react";
import axios from "axios";
// import {jwtDecode} from "jwt-decode"


export const AuthContext =  createContext();

export default function AuthContextProvider({children}) {
   const [userLogin, setUserLogin]  = useState(() => {
    return localStorage.getItem("userToken");
   });
   const [userId , setUserId] = useState(()=>{
    const data = localStorage.getItem("userData");
    //**// */
  return data && data !== "undefined" ? JSON.parse(data) : null;
   })
  

//    useEffect(() =>{
//     if (localStorage.getItem("userToken")){
//         setUserLogin(localStorage.getItem("userToken"))
// }
//    },  []);


//    useEffect(() => {
//     if (localStorage.getItem("userToken")) {
//         const {user} = jwtDecode(localStorage.getItem("userToken"));
//    setuserId(user)
// }
//    }, [userLogin])


useEffect(() => {
  if (userLogin){
    axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${userLogin}`,
      },
    })
    .then((res) => {
      setUserId(res.data.data.user);
    })
    .catch((err) => {
    console.log(err);
    });
  }
},[userLogin]);


// useEffect(() => {
//   if (userLogin) {
//     axios
//       .get("https://route-posts.routemisr.com/users/profile-data", {
//         headers: {
//           Authorization: `Bearer ${userLogin}`,
//         },
//       })
//       .then((res) => {
//         setuserId(res.data.data.user);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }, [userLogin]);




    return  <AuthContext.Provider  value={{userLogin, setUserLogin, userId, setUserId}}>
        {children}
    </AuthContext.Provider>
}