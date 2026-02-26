import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import Login from '../Login/Login';

export default function ProtectedRoute({children}) {
    const   navigate = useNavigate()


  if  (localStorage.getItem("userToken")){
    return  <>{children}</>
  }
  else{
     return <Navigate to ="/login"/>
  }



}
