import {zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as zod from "zod";

// import { zodResolver } from './../../../node_modules/@hookform/resolvers/zod/src/zod';
import { Helmet } from 'react-helmet';



const schema = zod.object({
  name: zod.string()
  .min(3, "min length is 3 chars")
  .max(10, "max length is 10 chars")
  .nonempty("name is  required"),

  email: zod.email("invalid email")
  .regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, "not match pattern",)
  .nonempty("email is required"),

  password: zod.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 
    "password should contains at  least 1 special chars, 1 number, 1 capital char, 1 small chars & min length is 8 chars",)
    .nonempty("password is required"),

    rePassword: zod.string().nonempty("password is required"),

    dateOfBirth:  zod.string().refine((date)  => {
      const userDate = new Date(date);
      const currentDate = new Date();

    if (currentDate.getFullYear() - userDate.getFullYear() >= 10) {
        return true;
      } else{
        return false;
      }
    },"invalid date..."),

    gender: zod.enum(["male", "female"]),

    //   return currentDate - userDate >= 10

      // if (currentDate - userDate >= 10){
      //   return true
      // }else{
      //   return false
      // }
//     },"invalid date...").transform((date) => {

//     }),
 }).refine((object) => {
  if (object.password ===  object.rePassword){
    return true
  }
  else{
    return false
  }
 }, {error: "password & confirmation password not matched", path: ["rePassword"]})

export default function Register() {

const navigate = useNavigate();
const[apiError, setApiError] = useState(null);
const [isLoading, setLoading] = useState(false)


const form =  useForm({
  defaultValues: {
    name:"",
    email:"",
    password:"",
    rePassword:"",
    dateOfBirth:"",
    gender:"",
  },

  resolver : zodResolver(schema),

  mode: "onTouched",
});
const {register, handleSubmit, setError, getValues, formState}  = form;
// register('email');
// console.log(formState)

function handleRegister(values){
setLoading(true);
  console.log(values);
          
axios.post(`https://route-posts.routemisr.com/users/signup`, values)
.then((res) => {
  console.log(res.data);

  if (res.data.message === "account created"){
    console.log(res.data.data);

    // setLoading(false);

    navigate("/login");
  }
})
.catch((err) => {
  setApiError(err.response.data.errors);
  setLoading(false);
})
.finally(() => {
setLoading(false);
});
}

  return <>

<Helmet><title>Create account</title></Helmet>

    <div  className='text-center'>
      <h1 className='text-3xl font-bold text-blue-500'>Register Now</h1>

      {apiError && (
        <p className='bg-red-500 text-white font-bold p-2 m-5 rounded-sm w-100 mx-auto'>
          {apiError}
          </p>
      )}


<form onSubmit={handleSubmit(handleRegister)} className="max-w-md mx-auto my-7">
  <div className="relative z-0 w-full mb-5 group">
    <input
    {...register("name"
    //   ,{
    //   required: {value : true, message :"name input is required"},
    //   minLength:{value : 3, message : "min length is 3 chars"},
    //   maxLength:{value : 5, message : "max length is 5 chars"},
    // }
  )}
     type="text"
     id="name"
    className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2
      border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" 
      placeholder=" "
       />
    <label
     htmlFor="name" 
   className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6
     scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand 
     peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
     peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
      Enter Your Name
      </label>
      {formState.errors.name && formState.touchedFields.name && (
        <p className='bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold'>
        {formState.errors.name?.message}</p>
      )} 
      
  </div> 

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

  <div className="relative z-0 w-full mb-5 group">
    <input
    {...register("rePassword"
      // , {
      // validate: function (rePasswordValue) {
      //   if (rePasswordValue === getValues("password")) {
      //     return true;
      //   } else{
      //     return "password & confirm password not match";
      //   }
      // },}
    )}
     type="password"
     id="rePassword"
    className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2
      border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" 
      placeholder=" "
       />
    <label
     htmlFor="rePassword" 
   className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6
     scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand 
     peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
     peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
      Enter Your confirm Password
      </label>
      {formState.errors.rePassword && formState.touchedFields.rePassword && (
        <p className='bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold'>
        {formState.errors.rePassword?.message}</p>
      )} 
  </div> 

  <div className="relative z-0 w-full mb-5 group">
    <input 
    {...register("dateOfBirth"
    //   ,{
    //   valueAsDate: true,
    //   validate: function(value){
        
    //     const userDate  = value.getFullYear();
    //     const currentDate = new Date().getFullYear()

    //     if(currentDate - userDate >= 18) {
    //         return true;  //validation  done
    //     }
    //     else{
    //       return "invalid date  to  accept"//validation  error
    //     }
    //   },
    // }
    )}
    type="date"
     id="date"
    className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2
      border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" 
      placeholder=" "
       />
    <label
     htmlFor="date" 
   className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6
     scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand 
     peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
     peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
      Enter Your confirm Birthday
      </label>
      {formState.errors.dateOfBirth && formState.touchedFields.dateOfBirth && (
        <p className='bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold'>
        {formState.errors.dateOfBirth?.message}</p>
      )} 
  </div> 
<div className='flex gap-4'>
<div className="flex items-center mb-4">
    <input
     {...register("gender"
    //   ,{
    //   pattern:{value: /^(male|female)$/, message: "not valid gender"}
    //  }
    )}
     id="male"
     type="radio"
    defaultValue="male"
     className="w-4 h-4 text-neutral-primary 
    border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2
     focus:outline-none focus:ring-brand-subtle border border-default appearance-none" checked/>
    <label
     htmlFor="male"
     className="select-none ms-2 text-sm font-medium text-heading">
      Male
    </label>
  </div>

  <div className="flex items-center mb-4">
    <input
    {...register("gender")}
     id="female"
     type="radio"
      defaultValue="female"
     className="w-4 h-4 text-neutral-primary 
    border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2
     focus:outline-none focus:ring-brand-subtle border border-default appearance-none" checked/>
    <label
     htmlFor="female"
     className="select-none ms-2 text-sm font-medium text-heading">
      Female
    </label>
  </div>
  {formState.errors.gender && formState.touchedFields.gender && (
        <p className='bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold'>
        {formState.errors.gender?.message}</p>
      )} 
</div>
  <button
  disabled = {isLoading}
  type="submit" 
  className="text-white disabled:cursor-not-allowed disabled:bg-slate-900 disabled:text-slate-200 rounded-lg w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl cursor-pointer
   box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs
    font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">

      {isLoading ?  "Loading..." : "Register"}</button>
</form>
</div>
  </>
}
 