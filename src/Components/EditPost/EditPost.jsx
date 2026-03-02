import React from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import {useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect, useRef} from 'react';
import { toast } from 'react-toastify';
import { BsFileImage } from "react-icons/bs";
import { FaWindowClose } from "react-icons/fa";


export default function EditPost() {

    const {id} = useParams();
   console.log("EditPost rendered, id:", id)
    const [body, setBody] = useState("");
    const [currentImage, setCurrentImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const imageInput = useRef();
    const navigate = useNavigate();
    const queryClient = useQueryClient();



function getSinglePost(){
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`,{
        headers: {
            Authorization:`Bearer ${localStorage.getItem("userToken")}`,
        },
    }
    );
}


const {data, isLoading, isError,error} = useQuery ({
    queryKey: ["singlePost" , id],
    queryFn: getSinglePost,
});
 

useEffect(() => {
    if (data?.data?.data?.post) {
        
     
        const post = data.data.data.post;

      setBody(post.body || "")
      if (post.image) {
        setCurrentImage(post.image);
      }

    }
}, [data]);




function prepareUpdateData() {
    const formData = new FormData();

    if (body && body.trim() !== ""){
        formData.append("body", body);
        console.log(body);
    }

    if (imageInput.current?.files[0]){
        formData.append("image", imageInput.current.files[0]);
    }
    return formData;
}



function updatePost(){
    return axios.put(`https://route-posts.routemisr.com/posts/${id}`,
        prepareUpdateData(), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        }

   );
}

const {mutate, isPending} = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
        toast.success("Updated is Done🆙");
        queryClient.invalidateQueries({queryKey: ["getAllPosts"]});
        navigate("/")
    },
    onError: () => {
      toast.error("Updated is Failed💥");
    },
});


if (isLoading) return <h2 className='text-center mt-5 text-amber-300 bg-blue-400 p-5 rounded-2xl'>Please Wait , just Loading..</h2>

if (isError) {
    console.error("error", error);

    return(
        <div className='text-red-500 bg-black text-lg p-4 mt-8'>
            <br/>
            {error?.response?.data.message || error?.message || "(error404)"}
            <br/>
            <small className='text-gray-500'>can detect from console or id</small>
        </div>
    );
}

  return (
<div className='max-w-xl mt-5 mx-auto rounded-2xl border-1'>
    <h2 className='text-medium mb-3 ms-3 text-gray-400'>Edit Post</h2>

    <textarea value={body} onChange={(e) => setBody(e.target.value)} className='w-full mb-3 p-8'/>


    {previewImage ? (
        <div className='relative'>
        <img
         src={previewImage} 
        alt='preview' 
        className=' rounded object-cover'/>

     <FaWindowClose onClick={() =>
         {setPreviewImage(null);
            imageInput.current.value = ""
         }}
        className='absolute top-2 bg-blue-800 text-white text-2xl right-2 rounded-full cursor-pointer p-1'
         />
        </div>
        ) : currentImage ? (
            <div className='relative'>
            <img src={currentImage} 
          alt='current'
         className=' rounded object-cover'/>
         <FaWindowClose onClick={() =>
         {setCurrentImage(null);
         }}
          className='absolute top-2 bg-blue-800 text-white text-2xl right-2 rounded-full cursor-pointer p-1'
         />
            </div>
            ) : null }
          
    

        <input type="file" ref={imageInput} className='hidden' onChange={(e) => {if (e.target.files[0]){
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
        }}
        }/>
<div className='flex items-center justify-between gap-10'>


<BsFileImage onClick={() => imageInput.current.click()} className='size-6 text-3xl text-green-600 cursor-pointer ms-7'/>


        <button className='bg-blue-500 text-white py-2 rounded-md me-7' onClick={mutate} disabled={isPending}>
            
            {isPending ? "updating..." : "Update Post"}
        </button>
</div>
</div>
  )
  }

