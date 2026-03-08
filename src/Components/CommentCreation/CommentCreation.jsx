// import { Input } from '@heroui/react';
import React, {useState} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { set, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaRegImage } from "react-icons/fa";
import { BsEmojiSmile } from 'react-icons/bs';
import { IoSend, IoClose } from 'react-icons/io5';
import { LuLoader } from "react-icons/lu";
// import { FaComment } from "react-icons/fa";


const userData = JSON.parse(localStorage.getItem("userData"));

 export default function CommentCreation({postId , queryKey, userAvatar}) {
const [imagePreview, setImagePreview] = useState(null);
const [imageFile, setImageFile] = useState(null);

const form = useForm({defaultValues : {body: '' }});
const queryClient = useQueryClient();
const {register, handleSubmit, reset} = form;

function createComment({ body, imageFile}) {
    const hasImage = !!imageFile;

    if (hasImage) {
        const formData = new FormData();
        if (body) formData.append('content', body);
        formData.append('image', imageFile);
        return axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments`, formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    } else{
        return axios.post(
            `https://route-posts.routemisr.com/posts/${postId}/comments`,
            {content: body},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}
const {isPending, mutate} = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey});
        reset();
        setImagePreview(null);
        setImageFile(null);
        toast.success('Comment created🟢');
    },
    onError: () => {
        toast.error('Comment failed❌');
    },
});

function handleImageChange(e){
const file = e.target.files[0];
if (!file) return;
setImageFile(file);
setImagePreview(URL.createObjectURL(file));
}
function removeImage(){
    setImagePreview(null);
    setImageFile(null);
}
function handleCreateComment(values){
if (!values.body && !imageFile) return;

mutate({ body: values.body, imageFile })
}

return (
    <div className='w-full px-3 py-2'>
        <form onSubmit={handleSubmit(handleCreateComment)}>
       <div className='flex items-center gap-2'>
        <div className='shrink-0 w-9 h-9'>
            <img src={userData?.photo} alt='avatar' className='w-9 h-9 rounded-full object-cover'/>
        </div>
        <div className='flex-1'>
            <input {...register('body')} type="text" placeholder='Comment as Basma Ezz...' 
            className='w-full bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-blue-200 transition-all duration-200'
             />
        </div>
       </div>
      

        <div className='flex items-center justify-between mt-2 pl-11'>
            <div className='flex items-center gap-2'>
                <label htmlFor={`img-upload-${postId}`}
                className='w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:text-blue-500 hover:bg-blue-50 cursor-pointer transition-colors duration-150'
                title='Add image'>
                    <FaRegImage className='text-base'/>
                </label>
                <input type="file" id={`img-upload-${postId}`} accept='image/*' hidden onChange={handleImageChange} />
                <button type='button' className='w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 cursor-pointer transition-colors duration-150'
                title='Add emoj'>
                    <BsEmojiSmile className='text-base' />
                </button>
            </div>
            <button type='submit' disabled={isPending} className='w-9 h-9 rounded-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white shadow-sm transition-all duration-200'
            >{isPending ? <LuLoader className='animate-spin text-sm'/>
            : <IoSend className='text-sm translate-x-px'/>
            }
                </button>
        </div> 
        {imagePreview && (
        <div className='overflow-hidden relative mt-3 ml-11 rounded-xl'>
            <img src={imagePreview} alt="preview"
            className='w-full max-h-60 object-cover rounded-xl' 
            />
            <button type='button' onClick={removeImage}
            className='rounded-full absolute top-2 right-2 h-7 w-7 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white flex items-center justify-center transition-all duration-150'
            >
                <IoClose className='text-sm'/>
            </button>
        </div>
        )}
       
        </form>
    </div>
);
}


