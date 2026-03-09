import { Avatar, Button, Divider, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, {useContext, useRef, useState, useEffect} from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthContext';
import {HiOutlineDotsVertical, HiOutlineTrash, HiOutlinePencil, HiOutlinePhotograph, HiOutlineEmojiHappy} from "react-icons/hi";


const PLACEHOLDER_IMAGE = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

const BASE_URL = "https://route-posts.routemisr.com";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  },
});

export default function Comment ({ comment, post, queryKey}) {
  const {userId} = useContext(AuthContext);
  const queryClient = useQueryClient();

  const isOwner = userId?._id === comment.commentCreator?._id;
  const [isEditing , setIsEditing] = useState(false);
  const [editContent , setEditContent] = useState(comment.content || "");
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview ] = useState(comment.image || null);
  useEffect(() => {
    setEditContent(comment.content || "");
    setEditImagePreview(comment.image || null);
    setEditImage(null);
  }, [comment]);

  const editImageRef = useRef(null);
  const [showReplyInput , setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [replyImagePreview, setReplyImagePreview] = useState(null);
  const replyImageRef = useRef(null);

  const [showReplies, setShowReplies] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //Delete Mutation 

  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
  mutationFn: () => axios.delete(`${BASE_URL}/posts/${post._id}/comments/${comment._id}`,
    getAuthHeader()
  ),

  onMutate: async () => {
    await queryClient.cancelQueries(queryKey);

    const previousData = queryClient.getQueryData(queryKey);

    queryClient.setQueryData(queryKey, (old) => {
      if (!old?.data?.data?.comments) return old;

      return {
        ...old,
        data: {
          ...old.data,
          data: {
            ...old.data.data,
            comments: old.data.data.comments.filter(
              (c) => c._id !== comment._id
            ),
          },
        },
      };
    });

    return {previousData};
  },
  onError: (err , variables, context) => {
    queryClient.setQueryData(queryKey, context.previousData);
    toast.error("Comment deletion failed ❌")
  },
  onSuccess: () => {
  toast.success("The comment has been deleted✳️");
  setIsDeleteModalOpen(false); 
  queryClient.invalidateQueries(queryKey);
  },
  });

  //update Mutation 
  const { mutate: updateComment, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      const content = editContent?.trim();

      if (content) {
     formData.append("content", content);
      } else if (editImage) {
        formData.append("content", "image");
      }
      if (editImage) {
        formData.append("image", editImage);
      }
      const res = await axios.put(`${BASE_URL}/posts/${post._id}/comments/${comment._id}`, 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
    toast.success("Comment has been edited♻️");

    setIsEditing(false);
    setEditImage(null);
    setEditImagePreview(null);
    queryClient.invalidateQueries(queryKey);
    },

    onError: () => {
      toast.error("Edited Failed💥");
    },
  });

  //Handlers 

// const file = e.target.files?.[0];
// if (!file) return;
// setEditImage(file);
// setEditImagePreview(URL.createObjectURL(file));
// };

const handleEditImageChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
setEditImage(file);
setEditImagePreview(URL.createObjectURL(file));
};

const removeEditImage = () => {
  setEditImage(null);
  setEditImagePreview(null);
};

const handleReplyImageChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
setReplyImage(file);
setReplyImagePreview(URL.createObjectURL(file));
};

return (
<>
<div className='py-3 px-4'>
  <div className='flex gap-3 relative'>
    <Avatar src={comment.commentCreator.photo || PLACEHOLDER_IMAGE} alt={comment.commentCreator.name} size='sm' className='mt-1'/>
    <div className='flex-1'>
     <div className='flex justify-between items-start'>
      <div>
        <p className='text-sm font-semibold'>{comment.commentCreator.name}</p>
        <p className='text-xs text-default-500'>{new Date(comment.createdAt).toLocaleString("en-US", {
          hour: "numeric", minute: "numeric", day: "numeric", month: "short",})}</p>
      </div>
      {isOwner && (<div className='relative'>
        <button className='rounded-full p-1 hover:bg-default-100 transition' onClick={() => setShowMenu(!showMenu)}>
          <HiOutlineDotsVertical className='text-lg text-default-600'/>
        </button>
        {showMenu && (<div className='overflow-hidden rounded-lg text-sm mt-1 w-40 absolute right-0 bg-content1 border border-default-200 z-50'>
          <button className='w-full px-4 text-left hover:bg-gray-100 text-gray-700 text-sm flex items-center gap-3 py-2.5 transition-colors' 
          onClick={() => {
            setIsEditing(true);
            setShowMenu(false);
          }}> <HiOutlinePencil className='text-default-500 text-[16px]'/>Edit</button>
          <button className='w-full text-left px-4 py-2.5 text-danger hover:bg-default-100 flex items-center gap-2.5'
          onClick={() => {
            setIsDeleteModalOpen(true);
            setShowMenu(false);
          }}>
            <HiOutlineTrash className='text-danger'/> Delete
          </button>
        </div>
      )}
      </div>
    )}
     </div>
     {isEditing ? (
      <div className='space-y-3 mt-2'>
        <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)}
          placeholder='Edit your comment..'
          minRows={2} variant='bordered'/>
          {editImagePreview && (
            <div className='relative inline-block mt-2'>
              <img src={editImagePreview} alt='preview' className='max-h-48 rounded-lg object-cover shadow-sm border border-gray-200'/>
              <button className='text-white rounded-full absolute -top-2 -right-2 bg-gray-500 w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-red-600 transition'
              onClick={removeEditImage}>x</button>
            </div>
          )}
          <div className='flex justify-end flex-wrap gap-2'>
            <Button size='sm' variant='flat' onPress={() => editImageRef.current?.click()}>Add photo</Button>
            <input type='file' accept='image/*' hidden 
            ref={editImageRef} onChange={handleEditImageChange}/>
            <Button size='sm' color='primary' isLoading={isUpdating} onPress={() => updateComment()}>Save</Button>
            <Button size='sm' variant='light' onPress={() => setIsEditing(false)}>Cancel</Button>
          </div>
      </div>
     ) : (
      <>
      {comment.content && comment.content !== "comment" && comment.content !== "." && (
        <p className='mt-1 whitespace-pre-wrap'>{comment.content}</p>
      )}
      {comment.image && (
        <img src={comment.image} alt='comment image' className='object-cover rounded-xl max-h-72 mt-3'/>
      )}
      </>
     )} 
     {!isEditing && (
      <div className='mt-2 flex gap-4 text-xs text-default-500'>
        <button className='hover:underline' onClick={() => setShowReplyInput(!showReplyInput)}>Reply</button>
      </div>
     )}
     {showReplyInput && (
     <div className='mt-3 ml-10'>
      <div className='bg-white rounded-3xl px-4 py-3 shadow-sm border border-gray-100'>
        <Textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} 
          placeholder='Write your comment..' minRows={1} variant='flat'
          className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500"/>
          {replyImagePreview && (
            <div className='relative mt-3 inline-block'>
              <img src={replyImagePreview} alt='preview'
              className='object-cover shadow-sm max-h-40 rounded-2xl border border-gray-200'/>
              <button onClick={() => {
                setReplyImage(null);
                setReplyImagePreview(null);
              }}
              className='flex items-center justify-center text-white rounded-full absolute -top-2 -right-2 bg-red-500 w-6 h-6 text-xs shadow-md hover:bg-red-600 transition'
              >x</button>
            </div>
          )}
          <div className='flex items-center justify-between mt-3'>
            <div className='text-gray-600 flex gap-4'>
              <button className='hover:text-blue-500 transition text-xl'>
                <HiOutlinePhotograph className='text-blue-500'/>
              </button>
              <button className='hover:text-yellow-500 transition text-xl'>
                <HiOutlineEmojiHappy className='text-yellow-500'/>
              </button>
            </div>
            <input type='file' accept='image/*' hidden
            ref={replyImageRef} onChange={handleReplyImageChange} />
            <Button size='sm' color='primary' isIconOnly onPress={() => {
              toast.success("The response has been sent successfully💬");
              setReplyContent("");
              setReplyImage(null);
              setReplyImagePreview(null);
              setShowReplyInput(false);
            }}
            className='rounded-full'>
              <span className='text-lg'>➤</span>
            </Button>
          </div>
      </div>
     </div>
     )}
    </div>
  </div>
  <Divider className='my-4'/>
</div>
<Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} placement='center' backdrop='opaque' size='sm'
//  classNames={{backdrop: 'z-[9998]',
//   base:'z-[9999]'
 >
  <ModalContent> 
    <>
    <ModalHeader className='font-medium text-lg'>Confirm action</ModalHeader>
    <ModalBody className='py-4'>
      <div className='flex items-center text-danger gap-3'>
        <span className='text-2xl'>⚠️</span>
        <div>
          <p className='font-medium'>Delete this comment?</p>
          <p className='mt-1 text-sm text-default-500'>This comment will be permanently removed.</p>
        </div>
      </div>
    </ModalBody>
    <ModalFooter className='gap-3'>
      <Button variant='light' onPress={() => setIsDeleteModalOpen(false)}>Cancel</Button>
      <Button color='danger' onPress={() => deleteComment() }
        // setIsDeleteModalOpen(false);
        
      isLoading={isDeleting}
      disabled={isDeleting}> {isDeleting ? "Deleting comment..." : "Delete comment"}
      </Button>
    </ModalFooter>
    </>

  </ModalContent>
</Modal>
</>
);
}                                             
            