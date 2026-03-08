// import { CardFooter, CardHeader } from '@heroui/react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import React, {useContext, useRef, useState} from 'react';
// import { toast } from 'react-toastify';
// import { AuthContext } from '../../Context/AuthContext';


// const PLACEHOLDER_IMAGE = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";
// // const BASE_URL = "https://route-posts.routemisr.com"
// // const authHeader =() => ({Authorization: `Bearer ${localStorage.getItem("userToken")}`});

// export default function Comment({comment , queryKey, post}) {



// const { userId } = useContext(AuthContext);
//   const queryClient = useQueryClient();
//   const isOwner = userId?._id === comment.commentCreator?._id;

//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState(comment.content || "");
//   const [editImage, setEditImage] = useState(null);
//   const [editImagePreview, setEditImagePreview] = useState(null);
//   const editImageRef = useRef();
//   const menuRef = useRef();

//   const [showReplyInput, setShowReplyInput] = useState(false);
//   const [replyContent, setReplyContent] = useState("");
//   const [replyImage, setReplyImage] = useState(null);
//   const [replyImagePreview, setReplyImagePreview] = useState(null);
//   const [showMenu, setShowMenu] = useState(false);
//   const replyImageRef = useRef();

//   const [showReplies, setShowReplies] = useState(false);

//   // ─── Get Replies ──────────────────────────────────────────────────────────
//   const { data: repliesData } = useQuery({
//     queryKey: ["replies", comment._id],
//     queryFn: () => axios.get(`${BASE_URL}/posts//comments/${comment._id}/replies`, { headers: authHeader() }),
//     enabled: showReplies,
//   });
//   const replies = repliesData?.data?.data?.replies ?? [];

//   // ─── Delete Comment ───────────────────────────────────────────────────────
//   const { mutate: deleteComment, isPending: isDeleting } = useMutation({
//     mutationFn: () => axios.delete(`${BASE_URL}/posts//comments/${comment._id}`, { headers: authHeader() }),
//     onSuccess: () => { toast.success("Comment deleted 🗑️"); queryClient.invalidateQueries({ queryKey }); },
//     onError: () => toast.error("Failed to delete ❌"),
//   });

//   // ─── Update Comment ───────────────────────────────────────────────────────
//   const { mutate: updateComment, isPending: isUpdating } = useMutation({
//     mutationFn: () => {
//       const fd = new FormData();
//       fd.append("content", editContent);
//       if (editImage) fd.append("image", editImage);
//       return axios.put(`${BASE_URL}/posts//comments/${comment._id}`, fd, { headers: authHeader() });
//     },
//     onSuccess: () => {
//       toast.success("Comment updated ✅");
//       setIsEditing(false);
//       setEditImage(null);
//       setEditImagePreview(null);
//       queryClient.invalidateQueries({ queryKey });
//     },
//     onError: () => toast.error("Failed to update ❌"),
//   });

//   // ─── Create Reply ─────────────────────────────────────────────────────────
//   const { mutate: createReply, isPending: isReplying } = useMutation({
//     mutationFn: () => {
//       const fd = new FormData();
//       if (replyContent) fd.append("content", replyContent);
//       if (replyImage) fd.append("image", replyImage);
//       return axios.post(`${BASE_URL}/posts//comments/${comment._id}/replies`, fd, { headers: authHeader() });
//     },
//     onSuccess: () => {
//       toast.success("Reply sent 💬");
//       setReplyContent("");
//       setReplyImage(null);
//       setReplyImagePreview(null);
//       setShowReplyInput(false);
//       setShowReplies(true);
//       queryClient.invalidateQueries({ queryKey: ["replies", comment._id] });
//     },
//     onError: () => toast.error("Failed to reply ❌"),
//   });

//   function handleEditImageChange(e) {
//     const file = e.target.files[0];
//     if (!file) return;
//     setEditImage(file);
//     setEditImagePreview(URL.createObjectURL(file));
//   }

//   function handleReplyImageChange(e) {
//     const file = e.target.files[0];
//     if (!file) return;
//     setReplyImage(file);
//     setReplyImagePreview(URL.createObjectURL(file));
//   }






//   console.log(comment)
//   return (
//     <CardFooter>
//            <CardHeader className="flex gap-3">
//             <img
//               alt="heroui logo"
//               height={40}
//               radius="sm"
//               src={comment.commentCreator.photo}
//               width={40}
//               onError={(e) => {e.target.src = PLACEHOLDER_IMAGE}}
//             />
//             <div className="flex flex-col">
//               <p className="text-md">{comment.commentCreator.name}</p>
//               <p className="text-small text-default-500">{comment.createdAt}</p>
//               {comment.content && <p>{comment.content}</p> }
//               {comment.image && <img src={comment.image}/>}
//             </div>
//           </CardHeader>
//           </CardFooter>
//   )
// }




// import { 
//   Avatar, 
//   Button, 
//   Divider, 
//   Textarea, 
//   Modal, 
//   ModalContent, 
//   ModalHeader, 
//   ModalBody, 
//   ModalFooter 
// } from "@heroui/react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import React, { useContext, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import { AuthContext } from "../../Context/AuthContext";
// import { HiOutlineDotsVertical, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";

// const PLACEHOLDER_IMAGE = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

// const BASE_URL = "https://route-posts.routemisr.com";

// const getAuthHeader = () => ({
//   headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
// });

// export default function Comment({ comment, post, queryKey }) {
//   const { userId } = useContext(AuthContext);
//   const queryClient = useQueryClient();

//   const isOwner = userId?._id === comment.commentCreator?._id;

//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState(comment.content || "");
//   const [editImage, setEditImage] = useState(null);
//   const [editImagePreview, setEditImagePreview] = useState(comment.image || null);
//   const editImageRef = useRef(null);

//   const [showReplyInput, setShowReplyInput] = useState(false);
//   const [replyContent, setReplyContent] = useState("");
//   const [replyImage, setReplyImage] = useState(null);
//   const [replyImagePreview, setReplyImagePreview] = useState(null);
//   const replyImageRef = useRef(null);

//   const [showReplies, setShowReplies] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   // ─── Delete Mutation with Optimistic Delete ───────────────────────
//   const { mutate: deleteComment, isPending: isDeleting } = useMutation({
//     mutationFn: () =>
//       axios.delete(
//         `${BASE_URL}/posts/${post._id}/comments/${comment._id}`,
//         getAuthHeader()
//       ),

//     onMutate: async () => {
//       await queryClient.cancelQueries({ queryKey });

//       const previousData = queryClient.getQueryData(queryKey);

//       // اختفاء التعليق فورًا (optimistic)
//       queryClient.setQueryData(queryKey, (old) => {
//         if (!old?.data?.data?.comments) return old;
//         return {
//           ...old,
//           data: {
//             ...old.data,
//             data: {
//               ...old.data.data,
//               comments: old.data.data.comments.filter(c => c._id !== comment._id),
//             },
//           },
//         };
//       });

//       return { previousData };
//     },

//     onError: (err, variables, context) => {
//       queryClient.setQueryData(queryKey, context.previousData);
//       toast.error("فشل حذف التعليق ❌");
//     },

//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey });
//     },

//     onSuccess: () => {
//       toast.success("تم حذف التعليق بنجاح 🗑️");
//     },
//   });

//   // ─── Update Mutation (نفس اللي كان) ──────────────────────────────
//   const { mutate: updateComment, isPending: isUpdating } = useMutation({
//     mutationFn: () => {
//       const fd = new FormData();
//       fd.append("content", editContent);
//       if (editImage) fd.append("image", editImage);
//       return axios.put(
//         `${BASE_URL}/posts/${post._id}/comments/${comment._id}`,
//         fd,
//         getAuthHeader()
//       );
//     },
//     onSuccess: () => {
//       toast.success("تم تعديل التعليق بنجاح ✅");
//       setIsEditing(false);
//       setEditImage(null);
//       setEditImagePreview(null);
//       queryClient.invalidateQueries({ queryKey });
//     },
//     onError: () => toast.error("فشل التعديل ❌"),
//   });

//   // ─── Handlers ─────────────────────────────────────────────────────
//   const handleEditImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setEditImage(file);
//     setEditImagePreview(URL.createObjectURL(file));
//   };

//   const handleReplyImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setReplyImage(file);
//     setReplyImagePreview(URL.createObjectURL(file));
//   };

//   return (
//     <>
//       <div className="py-3">
//         <div className="flex gap-3 relative">
//           <Avatar
//             src={comment.commentCreator.photo || PLACEHOLDER_IMAGE}
//             alt={comment.commentCreator.name}
//             size="sm"
//             className="mt-1"
//           />

//           <div className="flex-1">
//             {/* Header */}
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="font-semibold text-sm">{comment.commentCreator.name}</p>
//                 <p className="text-xs text-default-500">
//                   {new Date(comment.createdAt).toLocaleString("en-US", {
//                     hour: "numeric",
//                     minute: "numeric",
//                     day: "numeric",
//                     month: "short",
//                   })}
//                 </p>
//               </div>

//               {isOwner && (
//                 <div className="relative">
//                   <button
//                     className="p-1 rounded-full hover:bg-default-100 transition"
//                     onClick={() => setShowMenu(!showMenu)}
//                   >
//                     <HiOutlineDotsVertical className="text-lg text-default-600" />
//                   </button>

//                   {showMenu && (
//                     <div className="absolute right-0 mt-1 w-40 bg-content1 border border-default-200 rounded-lg shadow-lg z-50 text-sm overflow-hidden">
//                       <button
//                         className="w-full text-left px-4 py-2.5 hover:bg-default-100 flex items-center gap-2.5"
//                         onClick={() => {
//                           setIsEditing(true);
//                           setShowMenu(false);
//                         }}
//                       >
//                         <HiOutlinePencil className="text-default-600" />
//                         Edit
//                       </button>

//                       <button
//                         className="w-full text-left px-4 py-2.5 text-danger hover:bg-default-100 flex items-center gap-2.5"
//                         onClick={() => {
//                           setIsDeleteModalOpen(true);
//                           setShowMenu(false);
//                         }}
//                       >
//                         <HiOutlineTrash className="text-danger" />
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Content */}
//             {isEditing ? (
//               <div className="mt-2 space-y-3">
//                 <Textarea
//                   value={editContent}
//                   onChange={(e) => setEditContent(e.target.value)}
//                   placeholder="Edit your comment..."
//                   minRows={2}
//                   variant="bordered"
//                 />

//                 {editImagePreview && (
//                   <img
//                     src={editImagePreview}
//                     alt="preview"
//                     className="max-h-48 rounded-lg object-cover"
//                   />
//                 )}

//                 <div className="flex flex-wrap gap-2 justify-end">
//                   <Button
//                     size="sm"
//                     variant="flat"
//                     onPress={() => editImageRef.current?.click()}
//                   >
//                     Add photo
//                   </Button>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     hidden
//                     ref={editImageRef}
//                     onChange={handleEditImageChange}
//                   />

//                   <Button
//                     size="sm"
//                     color="primary"
//                     isLoading={isUpdating}
//                     onPress={() => updateComment()}
//                   >
//                     Save
//                   </Button>

//                   <Button size="sm" variant="light" onPress={() => setIsEditing(false)}>
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {comment.content && <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>}
//                 {comment.image && (
//                   <img
//                     src={comment.image}
//                     alt="comment image"
//                     className="mt-3 max-h-72 rounded-xl object-cover"
//                   />
//                 )}
//               </>
//             )}

//             {/* Actions */}
//             {!isEditing && (
//               <div className="mt-2 flex gap-4 text-xs text-default-500">
//                 <button
//                   className="hover:underline"
//                   onClick={() => setShowReplyInput(!showReplyInput)}
//                 >
//                   Reply
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         <Divider className="my-4" />
//       </div>

//       {/* Delete Confirmation Modal - مطابق للصورة */}
//       <Modal
//         isOpen={isDeleteModalOpen}
//         onOpenChange={setIsDeleteModalOpen}
//         placement="center"
//         backdrop="blur"
//         size="sm"
//       >
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="text-lg font-medium">
//                 Confirm action
//               </ModalHeader>
//               <ModalBody className="py-4">
//                 <div className="flex items-center gap-3 text-danger">
//                   <span className="text-2xl">⚠️</span>
//                   <div>
//                     <p className="font-medium">Delete this comment?</p>
//                     <p className="text-sm text-default-500 mt-1">
//                       This comment will be permanently removed.
//                     </p>
//                   </div>
//                 </div>
//               </ModalBody>
//               <ModalFooter className="gap-3">
//                 <Button 
//                   variant="light" 
//                   onPress={onClose}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   color="danger"
//                   onPress={() => {
//                     setIsDeleteModalOpen(false); // أغلق فورًا
//                     deleteComment();             // امسح فورًا (optimistic)
//                   }}
//                   isLoading={isDeleting}
//                   disabled={isDeleting}
//                 >
//                   {isDeleting ? "Deleting comment..." : "Delete comment"}
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }


// import { 
//   Avatar, 
//   Button, 
//   Divider, 
//   Textarea, 
//   Modal, 
//   ModalContent, 
//   ModalHeader, 
//   ModalBody, 
//   ModalFooter 
// } from "@heroui/react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import React, { useContext, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import { AuthContext } from "../../Context/AuthContext";
// import { HiOutlineDotsVertical, HiOutlineTrash, HiOutlinePencil, HiOutlinePhotograph,      // ← أضفنا دي
//   HiOutlineEmojiHappy } from "react-icons/hi";

// const PLACEHOLDER_IMAGE = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

// const BASE_URL = "https://route-posts.routemisr.com";

// const getAuthHeader = () => ({
//   headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
// });

// export default function Comment({ comment, post, queryKey }) {
//   const { userId } = useContext(AuthContext);
//   const queryClient = useQueryClient();

//   const isOwner = userId?._id === comment.commentCreator?._id;

//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState(comment.content || "");
//   const [editImage, setEditImage] = useState(null);
//   const [editImagePreview, setEditImagePreview] = useState(comment.image || null);
//   const editImageRef = useRef(null);

//   const [showReplyInput, setShowReplyInput] = useState(false);
//   const [replyContent, setReplyContent] = useState("");
//   const [replyImage, setReplyImage] = useState(null);
//   const [replyImagePreview, setReplyImagePreview] = useState(null);
//   const replyImageRef = useRef(null);

//   const [showReplies, setShowReplies] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   // ─── Delete Mutation ───────────────────────────────────────────────
//   const { mutate: deleteComment, isPending: isDeleting } = useMutation({
//     mutationFn: () =>
//       axios.delete(
//         `${BASE_URL}/posts/${post._id}/comments/${comment._id}`,
//         getAuthHeader()
//       ),

//     onMutate: async () => {
//       await queryClient.cancelQueries({ queryKey });
//       const previousData = queryClient.getQueryData(queryKey);
//       queryClient.setQueryData(queryKey, (old) => {
//         if (!old?.data?.data?.comments) return old;
//         return {
//           ...old,
//           data: {
//             ...old.data,
//             data: {
//               ...old.data.data,
//               comments: old.data.data.comments.filter(c => c._id !== comment._id),
//             },
//           },
//         };
//       });
//       return { previousData };
//     },
//     onError: (err, variables, context) => {
//       queryClient.setQueryData(queryKey, context.previousData);
//       toast.error("فشل حذف التعليق ❌");
//     },
//     onSettled: () => queryClient.invalidateQueries({ queryKey }),
//     onSuccess: () => toast.success("تم حذف التعليق بنجاح 🗑️"),
//   });

//   // ─── Update Mutation ──────────────────────────────────────────────
//   const { mutate: updateComment, isPending: isUpdating } = useMutation({
//     mutationFn: () => {
//       const fd = new FormData();
//       fd.append("content", editContent);
//       if (editImage) fd.append("image", editImage);
//       return axios.put(
//         `${BASE_URL}/posts/${post._id}/comments/${comment._id}`,
//         fd,
//         getAuthHeader()
//       );
//     },
//     onSuccess: () => {
//       toast.success("تم تعديل التعليق بنجاح ✅");
//       setIsEditing(false);
//       setEditImage(null);
//       setEditImagePreview(null);
//       queryClient.invalidateQueries({ queryKey });
//     },
//     onError: () => toast.error("فشل التعديل ❌"),
//   });

//   // ─── Create Reply Mutation ────────────────────────────────────────
//   const { mutate: createReply, isPending: isReplying } = useMutation({
//     mutationFn: () => {
//       const fd = new FormData();
//       if (replyContent.trim()) fd.append("content", replyContent);
//       if (replyImage) fd.append("image", replyImage);
//       return axios.post(
//         `${BASE_URL}/posts/${post._id}/comments/${comment._id}/replies`,
//         fd,
//         getAuthHeader()
//       );
//     },
//     onSuccess: () => {
//       toast.success("تم إرسال الرد بنجاح 💬");
//       setReplyContent("");
//       setReplyImage(null);
//       setReplyImagePreview(null);
//       setShowReplyInput(false);
//       setShowReplies(true); // عشان الردود تظهر فورًا بعد الإرسال
//       queryClient.invalidateQueries({ queryKey: ["replies", comment._id] });
//     },
//     onError: () => toast.error("فشل إرسال الرد ❌"),
//   });

//   // ─── Handlers ─────────────────────────────────────────────────────
//   const handleEditImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setEditImage(file);
//     setEditImagePreview(URL.createObjectURL(file));
//   };

//   const removeEditImage = () => {
//     setEditImage(null);
//     setEditImagePreview(null);
//   };

//   const handleReplyImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setReplyImage(file);
//     setReplyImagePreview(URL.createObjectURL(file));
//   };

//   // الدالة اللي كانت ناقصة (ده اللي كان بيسبب الخطأ)
//   const handleSendReply = () => {
//     createReply(); // هتبعت الرد للسيرفر
//   };

//   return (
//     <>
//       <div className="py-3 px-4">
//         <div className="flex gap-3 relative">
//           <Avatar
//             src={comment.commentCreator.photo || PLACEHOLDER_IMAGE}
//             alt={comment.commentCreator.name}
//             size="sm"
//             className="mt-1"
//           />

//           <div className="flex-1">
//             {/* Header */}
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="font-semibold text-sm">{comment.commentCreator.name}</p>
//                 <p className="text-xs text-default-500">
//                   {new Date(comment.createdAt).toLocaleString("en-US", {
//                     hour: "numeric",
//                     minute: "numeric",
//                     day: "numeric",
//                     month: "short",
//                   })}
//                 </p>
//               </div>

//               {isOwner && (
//                 <div className="relative">
//                   <button
//                     className="p-1 rounded-full hover:bg-default-100 transition"
//                     onClick={() => setShowMenu(!showMenu)}
//                   >
//                     <HiOutlineDotsVertical className="text-lg text-default-600" />
//                   </button>

//                   {showMenu && (
//                     <div className="absolute right-0 mt-1 w-40 bg-content1 border border-default-200 rounded-lg shadow-lg z-50 text-sm overflow-hidden">
//                       <button
//                         className="w-full text-left px-4 py-2.5 hover:bg-default-100 flex items-center gap-2.5"
//                         onClick={() => {
//                           setIsEditing(true);
//                           setShowMenu(false);
//                         }}
//                       >
//                         <HiOutlinePencil className="text-default-600" />
//                         Edit
//                       </button>

//                       <button
//                         className="w-full text-left px-4 py-2.5 text-danger hover:bg-default-100 flex items-center gap-2.5"
//                         onClick={() => {
//                           setIsDeleteModalOpen(true);
//                           setShowMenu(false);
//                         }}
//                       >
//                         <HiOutlineTrash className="text-danger" />
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Content */}
//             {isEditing ? (
//               <div className="mt-2 space-y-3">
//                 <Textarea
//                   value={editContent}
//                   onChange={(e) => setEditContent(e.target.value)}
//                   placeholder="Edit your comment..."
//                   minRows={2}
//                   variant="bordered"
//                 />

//                 {editImagePreview && (
//                   <img
//                     src={editImagePreview}
//                     alt="preview"
//                     className="max-h-48 rounded-lg object-cover"
//                   />
//                 )}

//                 <div className="flex flex-wrap gap-2 justify-end">
//                   <Button
//                     size="sm"
//                     variant="flat"
//                     onPress={() => editImageRef.current?.click()}
//                   >
//                     Add photo
//                   </Button>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     hidden
//                     ref={editImageRef}
//                     onChange={handleEditImageChange}
//                   />

//                   <Button
//                     size="sm"
//                     color="primary"
//                     isLoading={isUpdating}
//                     onPress={() => updateComment()}
//                   >
//                     Save
//                   </Button>

//                   <Button size="sm" variant="light" onPress={() => setIsEditing(false)}>
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {comment.content && <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>}
//                 {comment.image && (
//                   <img
//                     src={comment.image}
//                     alt="comment image"
//                     className="mt-3 max-h-72 rounded-xl object-cover"
//                   />
//                 )}
//               </>
//             )}

//             {/* Actions */}
//             {!isEditing && (
//               <div className="mt-2 flex gap-4 text-xs text-default-500">
//                 <button
//                   className="hover:underline"
//                   onClick={() => setShowReplyInput(!showReplyInput)}
//                 >
//                   Reply
//                 </button>
//               </div>
//             )}

//             {/* Reply Input - الشكل الجميل */}
//             {showReplyInput && (
//               <div className="mt-3 ml-10">
//                 <div className="bg-white rounded-3xl px-4 py-3 shadow-sm border border-gray-100">
//                   <Textarea
//                     value={replyContent}
//                     onChange={(e) => setReplyContent(e.target.value)}
//                     placeholder="اكتب ردك..."
//                     minRows={1}
//                     variant="flat"
//                     className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500"
//                   />

//                   {replyImagePreview && (
//                     <div className="relative mt-3 inline-block">
//                       <img
//                         src={replyImagePreview}
//                         alt="preview"
//                         className="max-h-40 rounded-2xl object-cover shadow-sm border border-gray-200"
//                       />
//                       <button
//                         onClick={() => {
//                           setReplyImage(null);
//                           setReplyImagePreview(null);
//                         }}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-red-600 transition"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   )}

//                   <div className="flex justify-between items-center mt-3">
//                     <div className="flex gap-4 text-gray-600">
//                       <button
//                         onClick={() => replyImageRef.current?.click()}
//                         className="hover:text-blue-500 transition text-xl"
//                       >
//                         <HiOutlinePhotograph className="text-blue-500" />
//                       </button>
//                       <button className="hover:text-yellow-500 transition text-xl">
//                         <HiOutlineEmojiHappy className="text-yellow-500" />
//                       </button>
//                     </div>

//                     <input
//                       type="file"
//                       accept="image/*"
//                       hidden
//                       ref={replyImageRef}
//                       onChange={handleReplyImageChange}
//                     />

//                     <Button
//                       size="sm"
//                       color="primary"
//                       isIconOnly
//                       onPress={handleSendReply}
//                       isLoading={isReplying}
//                       className="rounded-full"
//                     >
//                       <span className="text-lg">➤</span>
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <Divider className="my-4" />
//       </div>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={isDeleteModalOpen}
//         onOpenChange={setIsDeleteModalOpen}
//         placement="center"
//         backdrop="blur"
//         size="sm"
//       >
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="text-lg font-medium">
//                 Confirm action
//               </ModalHeader>
//               <ModalBody className="py-4">
//                 <div className="flex items-center gap-3 text-danger">
//                   <span className="text-2xl">⚠️</span>
//                   <div>
//                     <p className="font-medium">Delete this comment?</p>
//                     <p className="text-sm text-default-500 mt-1">
//                       This comment will be permanently removed.
//                     </p>
//                   </div>
//                 </div>
//               </ModalBody>
//               <ModalFooter className="gap-3">
//                 <Button 
//                   variant="light" 
//                   onPress={onClose}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   color="danger"
//                   onPress={() => {
//                     setIsDeleteModalOpen(false);
//                     deleteComment();
//                   }}
//                   isLoading={isDeleting}
//                   disabled={isDeleting}
//                 >
//                   {isDeleting ? "Deleting comment..." : "Delete comment"}
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }


// import { 
//   Avatar, 
//   Button, 
//   Divider, 
//   Textarea, 
//   Modal, 
//   ModalContent, 
//   ModalHeader, 
//   ModalBody, 
//   ModalFooter 
// } from "@heroui/react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import React, { useContext, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import { AuthContext } from "../../Context/AuthContext";
// import { HiOutlineDotsVertical, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";

// const PLACEHOLDER_IMAGE = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

// const BASE_URL = "https://route-posts.routemisr.com";

// const getAuthHeader = () => ({
//   headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
// });

// export default function Comment({ comment, post, queryKey }) {
//   const { userId } = useContext(AuthContext);
//   const queryClient = useQueryClient();

//   const isOwner = userId?._id === comment.commentCreator?._id;

//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState(comment.content || "");
//   const [editImage, setEditImage] = useState(null);
//   const [editImagePreview, setEditImagePreview] = useState(comment.image || null);
//   const editImageRef = useRef(null);

//   const [showReplyInput, setShowReplyInput] = useState(false);
//   const [replyContent, setReplyContent] = useState("");
//   const [replyImage, setReplyImage] = useState(null);
//   const [replyImagePreview, setReplyImagePreview] = useState(null);
//   const replyImageRef = useRef(null);

//   const [showReplies, setShowReplies] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   // ─── Delete Mutation with Optimistic Delete ───────────────────────
//   const { mutate: deleteComment, isPending: isDeleting } = useMutation({
//     mutationFn: () =>
//       axios.delete(
//         `${BASE_URL}/posts/${post._id}/comments/${comment._id}`,
//         getAuthHeader()
//       ),

//     onMutate: async () => {
//       await queryClient.cancelQueries({ queryKey });

//       const previousData = queryClient.getQueryData(queryKey);

//       // اختفاء التعليق فورًا (optimistic)
//       queryClient.setQueryData(queryKey, (old) => {
//         if (!old?.data?.data?.comments) return old;
//         return {
//           ...old,
//           data: {
//             ...old.data,
//             data: {
//               ...old.data.data,
//               comments: old.data.data.comments.filter(c => c._id !== comment._id),
//             },
//           },
//         };
//       });

//       return { previousData };
//     },

//     onError: (err, variables, context) => {
//       queryClient.setQueryData(queryKey, context.previousData);
//       toast.error("فشل حذف التعليق ❌");
//     },

//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey });
//     },

//     onSuccess: () => {
//       toast.success("تم حذف التعليق بنجاح 🗑️");
//     },
//   });

//   // ─── Update Mutation (نفس اللي كان) ──────────────────────────────
//   const { mutate: updateComment, isPending: isUpdating } = useMutation({
//     mutationFn: () => {
//       const fd = new FormData();
//       fd.append("content", editContent);
//       if (editImage) fd.append("image", editImage);
//       return axios.put(
//         `${BASE_URL}/posts/${post._id}/comments/${comment._id}`,
//         fd,
//         getAuthHeader()
//       );
//     },
//     onSuccess: () => {
//       toast.success("تم تعديل التعليق بنجاح ✅");
//       setIsEditing(false);
//       setEditImage(null);
//       setEditImagePreview(null);
//       queryClient.invalidateQueries({ queryKey });
//     },
//     onError: () => toast.error("فشل التعديل ❌"),
//   });

//   // ─── Handlers ─────────────────────────────────────────────────────
//   const handleEditImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setEditImage(file);
//     setEditImagePreview(URL.createObjectURL(file));
//   };

//   const handleReplyImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setReplyImage(file);
//     setReplyImagePreview(URL.createObjectURL(file));
//   };

//   return (
//     <>
//       <div className="py-3">
//         <div className="flex gap-3 relative">
//           <Avatar
//             src={comment.commentCreator.photo || PLACEHOLDER_IMAGE}
//             alt={comment.commentCreator.name}
//             size="sm"
//             className="mt-1"
//           />

//           <div className="flex-1">
//             {/* Header */}
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="font-semibold text-sm">{comment.commentCreator.name}</p>
//                 <p className="text-xs text-default-500">
//                   {new Date(comment.createdAt).toLocaleString("en-US", {
//                     hour: "numeric",
//                     minute: "numeric",
//                     day: "numeric",
//                     month: "short",
//                   })}
//                 </p>
//               </div>

//               {isOwner && (
//                 <div className="relative">
//                   <button
//                     className="p-1 rounded-full hover:bg-default-100 transition"
//                     onClick={() => setShowMenu(!showMenu)}
//                   >
//                     <HiOutlineDotsVertical className="text-lg text-default-600" />
//                   </button>

//                   {showMenu && (
//                     <div className="absolute right-0 mt-1 w-40 bg-content1 border border-default-200 rounded-lg shadow-lg z-50 text-sm overflow-hidden">
//                       <button
//                         className="w-full text-left px-4 py-2.5 hover:bg-default-100 flex items-center gap-2.5"
//                         onClick={() => {
//                           setIsEditing(true);
//                           setShowMenu(false);
//                         }}
//                       >
//                         <HiOutlinePencil className="text-default-600" />
//                         Edit
//                       </button>

//                       <button
//                         className="w-full text-left px-4 py-2.5 text-danger hover:bg-default-100 flex items-center gap-2.5"
//                         onClick={() => {
//                           setIsDeleteModalOpen(true);
//                           setShowMenu(false);
//                         }}
//                       >
//                         <HiOutlineTrash className="text-danger" />
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Content */}
//             {isEditing ? (
//               <div className="mt-2 space-y-3">
//                 <Textarea
//                   value={editContent}
//                   onChange={(e) => setEditContent(e.target.value)}
//                   placeholder="Edit your comment..."
//                   minRows={2}
//                   variant="bordered"
//                 />

//                 {editImagePreview && (
//                   <img
//                     src={editImagePreview}
//                     alt="preview"
//                     className="max-h-48 rounded-lg object-cover"
//                   />
//                 )}

//                 <div className="flex flex-wrap gap-2 justify-end">
//                   <Button
//                     size="sm"
//                     variant="flat"
//                     onPress={() => editImageRef.current?.click()}
//                   >
//                     Add photo
//                   </Button>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     hidden
//                     ref={editImageRef}
//                     onChange={handleEditImageChange}
//                   />

//                   <Button
//                     size="sm"
//                     color="primary"
//                     isLoading={isUpdating}
//                     onPress={() => updateComment()}
//                   >
//                     Save
//                   </Button>

//                   <Button size="sm" variant="light" onPress={() => setIsEditing(false)}>
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {comment.content && <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>}
//                 {comment.image && (
//                   <img
//                     src={comment.image}
//                     alt="comment image"
//                     className="mt-3 max-h-72 rounded-xl object-cover"
//                   />
//                 )}
//               </>
//             )}

//             {/* Actions */}
//             {!isEditing && (
//               <div className="mt-2 flex gap-4 text-xs text-default-500">
//                 <button
//                   className="hover:underline"
//                   onClick={() => setShowReplyInput(!showReplyInput)}
//                 >
//                   Reply
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         <Divider className="my-4" />
//       </div>

//       {/* Delete Confirmation Modal - مطابق للصورة */}
//       <Modal
//         isOpen={isDeleteModalOpen}
//         onOpenChange={setIsDeleteModalOpen}
//         placement="center"
//         backdrop="blur"
//         size="sm"
//       >
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="text-lg font-medium">
//                 Confirm action
//               </ModalHeader>
//               <ModalBody className="py-4">
//                 <div className="flex items-center gap-3 text-danger">
//                   <span className="text-2xl">⚠️</span>
//                   <div>
//                     <p className="font-medium">Delete this comment?</p>
//                     <p className="text-sm text-default-500 mt-1">
//                       This comment will be permanently removed.
//                     </p>
//                   </div>
//                 </div>
//               </ModalBody>
//               <ModalFooter className="gap-3">
//                 <Button 
//                   variant="light" 
//                   onPress={onClose}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   color="danger"
//                   onPress={() => {
//                     setIsDeleteModalOpen(false); // أغلق فورًا
//                     deleteComment();             // امسح فورًا (optimistic)
//                   }}
//                   isLoading={isDeleting}
//                   disabled={isDeleting}
//                 >
//                   {isDeleting ? "Deleting comment..." : "Delete comment"}
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }


 



import { 
  Avatar, 
  Button, 
  Divider, 
  Textarea, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter 
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../Context/AuthContext";
import { HiOutlineDotsVertical, HiOutlineTrash, HiOutlinePencil, HiOutlinePhotograph, HiOutlineEmojiHappy  } from "react-icons/hi";

const PLACEHOLDER_IMAGE = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

const BASE_URL = "https://route-posts.routemisr.com";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
});

export default function Comment({ comment, post, queryKey }) {
  const { userId } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const isOwner = userId?._id === comment.commentCreator?._id;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content || "");
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(comment.image || null);
  useEffect(() => {
  setEditContent(comment.content || "");
  setEditImagePreview(comment.image || null);
  setEditImage(null);
}, [comment]);
  const editImageRef = useRef(null);

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [replyImagePreview, setReplyImagePreview] = useState(null);
  const replyImageRef = useRef(null);

  const [showReplies, setShowReplies] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

 // ─── Delete Mutation (مع loading toast) ───────────────────────
const { mutate: deleteComment, isPending: isDeleting } = useMutation({
  mutationFn: () =>
    axios.delete(
      `${BASE_URL}/posts/${post._id}/comments/${comment._id}`,
      getAuthHeader()
    ),

  onMutate: async () => {
    await queryClient.cancelQueries( queryKey );

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

    return { previousData };
  },

  onError: (err, variables, context) => {
    queryClient.setQueryData(queryKey, context.previousData);
    toast.error("فشل حذف التعليق ❌");
  },

  onSuccess: () => {
  toast.success("تم حذف التعليق 🗑️");
  queryClient.invalidateQueries( queryKey );
},
});

// ─── Update Mutation (مع loading toast) ──────────────────────────────
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
    const res = await axios.put(
      `${BASE_URL}/posts/${post._id}/comments/${comment._id}`,
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
    toast.success("تم تعديل التعليق ✅");

    setIsEditing(false);
    setEditImage(null);
    setEditImagePreview(null);

    queryClient.invalidateQueries(queryKey);
  },

  onError: () => {
    toast.error("فشل التعديل ❌");
  },
});

  // ─── Handlers ─────────────────────────────────────────────────────
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
      <div className="py-3 px-4">
        <div className="flex gap-3 relative">
          <Avatar
            src={comment.commentCreator.photo || PLACEHOLDER_IMAGE}
            alt={comment.commentCreator.name}
            size="sm"
            className="mt-1"
          />

          <div className="flex-1">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm">{comment.commentCreator.name}</p>
                <p className="text-xs text-default-500">
                  {new Date(comment.createdAt).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>

              {isOwner && (
                <div className="relative">
                  <button
                    className="p-1 rounded-full hover:bg-default-100 transition"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <HiOutlineDotsVertical className="text-lg text-default-600" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-1 w-40 bg-content1 border border-default-200 rounded-lg shadow-lg z-50 text-sm overflow-hidden">
                      <button
                        className="w-full text-left px-4 py-2.5 hover:bg-default-100 flex items-center gap-2.5"
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                      >
                        <HiOutlinePencil className="text-default-600" />
                        Edit
                      </button>

                      <button
                        className="w-full text-left px-4 py-2.5 text-danger hover:bg-default-100 flex items-center gap-2.5"
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setShowMenu(false);
                        }}
                      >
                        <HiOutlineTrash className="text-danger" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            {isEditing ? (
              <div className="mt-2 space-y-3">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit your comment..."
                  minRows={2}
                  variant="bordered"
                />

                {/* الصورة المرفوعة أثناء التعديل - مع علامة × */}
                {editImagePreview && (
                  <div className="relative inline-block mt-2">
                    <img
                      src={editImagePreview}
                      alt="preview"
                      className="max-h-48 rounded-lg object-cover shadow-sm border border-gray-200"
                    />
                    <button
                      onClick={removeEditImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-red-600 transition"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => editImageRef.current?.click()}
                  >
                    Add photo
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={editImageRef}
                    onChange={handleEditImageChange}
                  />

                  <Button
                    size="sm"
                    color="primary"
                    isLoading={isUpdating}
                    onPress={() => updateComment()}
                  >
                    Save
                  </Button>

                  <Button size="sm" variant="light" onPress={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
  {comment.content && comment.content !== "comment" && comment.content !== "." && (
    <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>
  )}

  {comment.image && (
    <img
      src={comment.image}
      alt="comment image"
      className="mt-3 max-h-72 rounded-xl object-cover"
    />
  )}
</>
            )}

            {/* Actions */}
            {!isEditing && (
              <div className="mt-2 flex gap-4 text-xs text-default-500">
                <button
                  className="hover:underline"
                  onClick={() => setShowReplyInput(!showReplyInput)}
                >
                  Reply
                </button>
              </div>
            )}

            {/* Reply Input */}
            {showReplyInput && (
              <div className="mt-3 ml-10">
                <div className="bg-white rounded-3xl px-4 py-3 shadow-sm border border-gray-100">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="اكتب ردك..."
                    minRows={1}
                    variant="flat"
                    className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500"
                  />

                  {replyImagePreview && (
                    <div className="relative mt-3 inline-block">
                      <img
                        src={replyImagePreview}
                        alt="preview"
                        className="max-h-40 rounded-2xl object-cover shadow-sm border border-gray-200"
                      />
                      <button
                        onClick={() => {
                          setReplyImage(null);
                          setReplyImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-4 text-gray-600">
                      <button
                        onClick={() => replyImageRef.current?.click()}
                        className="hover:text-blue-500 transition text-xl"
                      >
                        <HiOutlinePhotograph className="text-blue-500" />
                      </button>
                      <button className="hover:text-yellow-500 transition text-xl">
                        <HiOutlineEmojiHappy className="text-yellow-500" />
                      </button>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      ref={replyImageRef}
                      onChange={handleReplyImageChange}
                    />

                    <Button
                      size="sm"
                      color="primary"
                      isIconOnly
                      onPress={() => {
                        // هنا هتحطي كود إرسال الرد لو عندك mutation
                        toast.success("تم إرسال الرد بنجاح 💬");
                        setReplyContent("");
                        setReplyImage(null);
                        setReplyImagePreview(null);
                        setShowReplyInput(false);
                      }}
                      className="rounded-full"
                    >
                      <span className="text-lg">➤</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Divider className="my-4" />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        placement="center"
        backdrop="blur"
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-medium">
                Confirm action
              </ModalHeader>
              <ModalBody className="py-4">
                <div className="flex items-center gap-3 text-danger">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-medium">Delete this comment?</p>
                    <p className="text-sm text-default-500 mt-1">
                      This comment will be permanently removed.
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="gap-3">
                <Button 
                  variant="light" 
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    setIsDeleteModalOpen(false);
                    deleteComment();
                  }}
                  isLoading={isDeleting}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting comment..." : "Delete comment"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}


