import {zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';


import * as zod from "zod";
import { AuthContext } from '../../Context/AuthContext';

// import { zodResolver } from './../../../node_modules/@hookform/resolvers/zod/src/zod';
import { Helmet } from 'react-helmet';

const schema = zod.object({
  
  email: zod.email("invalid email")
  .regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, "not match pattern",)
  .nonempty("email is required"),

  password: zod.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 
    "password should contains at  least 1 special chars, 1 number, 1 capital char, 1 small chars & min length is 8 chars",)
    .nonempty("password is required"),

 });


export default function Login() {

const navigate = useNavigate();
const[apiError, setApiError] = useState(null);
const [isLoading, setLoading] = useState(false);
const {userLogin, setUserLogin} = useContext(AuthContext)


const form =  useForm({
  defaultValues: {
    email:"",
    password:"",
  },

  resolver : zodResolver(schema),

  mode: "onTouched",
});
const {register, handleSubmit, setError, getValues, formState}  = form;
// register('email');
// console.log(formState)
// axios.post(`https://route-posts.routemisr.com/users/signin`, values)
// .then((res) => {
// console.log(res.data.data.token);



//   if (res.data.message === "signed in successfully"){
//     localStorage.setItem("userToken", res.data.data.token);
//     setUserLogin(res.data.data.token);
//     // setUserLogin(res.data.data.token)
//     navigate("/");
//   }
// })
// .catch((err) => {
//   setApiError(err.response?.data?.message|| "Wrong to login");

// })
// .finally(() => {
// setLoading(false);
// });
// }



function handleLogin(values){
setLoading(true);

axios.post(`https://route-posts.routemisr.com/users/signin`, values)
.then((res) => {
  if (res.data.message === "signed in successfully"){
    localStorage.setItem("userToken", res.data.data.token);
    localStorage.setItem("userData", JSON.stringify(res.data.data.user));
    setUserLogin(res.data.data.token);
   navigate("/");
  }
})
.catch((err) => {
  setApiError(err.response?.data?.message|| "Wrong to login");
})
.finally(() => {
setLoading(false);
});
}

  return <>

<Helmet><title>login to Facebook</title></Helmet>

    <div  className='text-center'>
      <h1 className='text-3xl font-bold text-blue-500'>Login in to Facebook</h1>

      {apiError && (
        <p className='bg-red-500 text-white font-bold p-2 m-5 rounded-sm w-[400px] mx-auto'>
          {apiError}
          </p>
      )}


<form 
onSubmit={handleSubmit(handleLogin)} 
  className="max-w-md mx-auto my-7">

  <div className="relative z-0 w-full mb-5 group">
    <input
{...register("email"
//   ,{
//   pattern: {value: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, message: "invalid email",},
//   required: {value: true, message:"email is required"},
// }
)}

     type="email"
     id="email"
    className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2
      border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" 
      placeholder=" "
       />
    <label
     htmlFor="email" 
   className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6
     scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand 
     peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
     peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
      Enter Your Email
      </label>
      {formState.errors.email && formState.touchedFields.email && (
        <p className='bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold'>
        {formState.errors.email?.message}</p>
      )} 
  </div> 

  <div className="relative z-0 w-full mb-5 group">
    <input
    {...register("password"
    //   ,{
    //   pattern: {value: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/ , message: "password must contain 1 number (0-9),password must contain 1 uppercase letters,"},
    // }
  )}
     type="password"
     id="password"
    className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2
      border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" 
      placeholder=" "
       />
    <label
     htmlFor="password" 
   className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6
     scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand 
     peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
     peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
      Enter Your Password
      </label>
     {formState.errors.password && formState.touchedFields.password && (
        <p className='bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold'>
        {formState.errors.password?.message}</p>
      )} 
  </div> 

  <button
  disabled = {isLoading}
  type="submit" 
  className="text-white disabled:cursor-not-allowed disabled:bg-slate-900 disabled:text-slate-200 rounded-lg w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl cursor-pointer
   box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs
    font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">

      {isLoading ?  "Loading..." : "Login"}</button>
</form>
</div>
  </>
}
 