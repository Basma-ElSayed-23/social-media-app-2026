import { Avatar, 
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
 } from '@heroui/react'
import React, { useContext } from 'react'
import { useState, useRef } from 'react';
import { IoMdClose } from "react-icons/io";
import { BsFileImage } from "react-icons/bs";
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AuthContext } from './../../Context/AuthContext';


export default function PostCreation() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [isUploaded, setisUploaded] = useState(false);
  const {userId} = useContext(AuthContext);

  const query = useQueryClient()

  const textInput = useRef(null);
  const imageInput = useRef(null);

// const formData = new FormData()

function prepareData(){
  const formData = new FormData();

  if (textInput.current.value) {
  formData.append("body" , textInput.current.value);
  }

  if (imageInput.current.files[0]) {
  formData.append("image" , imageInput.current.files[0]);
  }
  

  return formData;
}

  function createPost(){
    return axios.post(`https://route-posts.routemisr.com/posts`, prepareData(), {
    headers: {Authorization: `Bearer ${localStorage.getItem("userToken")}`}
   })
  }

const {data , isPending, mutate} = useMutation({
  mutationFn: createPost,
  onSuccess: () => {
  query.invalidateQueries({queryKey: ["getAllPost"]});
  toast.success("post successful✅", {closeOnClick : true, autoClose : 2000})
  setisUploaded(null);
  // textInput.current.value = "";
  // imageInput.current.value = "";
  },
  onError : () => { toast.error("post failed❌", {closeOnClick : true, autoClose : 2000})}
})

  function handleImagePreview(e){
   console.log("changed", e.target.files[0]);
   const path = URL.createObjectURL(e.target.files[0])
   setisUploaded(path);
  }

  function handleRemoveImage(){
    setisUploaded(false);
    imageInput.current.value = ""
  }


  return (
    <div className='max-w-125 mx-auto mb-6 bg-slate-100 p-2 rounded-sm'>
      <div className='flex gap-2'>
        <Avatar isBordered size="md" src={userId?.photo} name={userId?.name}/>
        <input onClick={onOpen} type="text" className='w-full bg-slate-300 rounded-sm focus:outline-none' placeholder='Whats on your mind?' readOnly/>
      </div>
      <div className='modal'>
         {/* <Button onPress={onOpen}>Open Modal</Button> */}
         <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Post</ModalHeader>
              <ModalBody>
                <textarea ref={textInput} className='w-full bg-slate-300 rounded-sm focus:outline-none p-5' placeholder='Whats on your mind?'></textarea>
                {isUploaded &&  <div className='relative'>
                  <img
            alt="Card background"
            className="object-cover rounded-xl"
            src={isUploaded}/>
            <IoMdClose onClick={handleRemoveImage} className='absolute top-2.5 end-2.5 text-blue-600 cursor-pointer size-7' />
                </div> }
                
              </ModalBody>
              <ModalFooter className='flex items-center justify-center gap-10'>
                <label>
                  <BsFileImage className='size-6 cursor-pointer text-green-600' />
                  <input ref={imageInput} type="file" hidden onChange={handleImagePreview}/>
                </label>
                
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <button color="primary" onClick={function(){
                  onClose()
                  mutate()
                }}>
                  Create
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      </div>
    </div>
  )
}

