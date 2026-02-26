import { Input } from '@heroui/react';
import { useMutation,useQuery , useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FaComment } from "react-icons/fa";
import { FaFileImage } from "react-icons/fa";
import { LuLoader } from "react-icons/lu";
import { toast } from 'react-toastify';



export default function CommentCreation({postId , queryKey}) {

   const form = useForm({
    defaultValues:{
        body: "",
        image: ""
    }
   })

   const query = useQueryClient();
   

   const {register, handleSubmit, reset} = form;


function createComment(formData){
   return axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments`,
     formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        }
    });
}

const {data , isPending , mutate} = useMutation({
    mutationFn: createComment,
    onSuccess: () => {query.invalidateQueries({queryKey: queryKey});
        reset()
        toast.success("comment created🟢")
    },
    onError: () => { toast.error("comment failed🚫")},
    onSettled: () => {}
})

function handleCreateComment(values){

if(!values.body && values.image[0]) return

     const formData = new FormData()

   if (values.body){
    formData.append("content" ,values.body)
   }
   if (values.image[0]){
   formData.append("image" ,values.image[0])
   }
      mutate(formData)
}

  return (
    <>
    <div className='w-[90%] mx-auto cursor-pointer my-1'>
        <form onSubmit={handleSubmit(handleCreateComment)}> 
<Input

        {...register("body")}
          labelPlacement="outside"
          placeholder="Write a comment...."
          endContent={
            <button 
            disabled = {isPending} type='submit' className='bg-blue-300 disabled:bg-slate-500 disabled:cursor-not-allowed cursor-pointer p-2 flex justify-center items-center rounded-sm'>
                {isPending ? <LuLoader className='animate-spin' /> : <FaComment />}
            
            </button>
          }
          type="text"
        />
        <label htmlFor="icon">
            <div className='bg-blue-400 cursor-pointer w-full p-2 my-2 rounded-sm flex'>
            <FaFileImage />
            </div>
            
         </label> 
            <input {...register("image")} id="icon" type="file" hidden />
        </form>
       
    </div>
   
    </>
    
  );
}
