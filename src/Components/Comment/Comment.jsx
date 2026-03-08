import { CardFooter, CardHeader } from '@heroui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, {useContext, useRef, useState} from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Context/AuthContext';


const PLACEHOLDER_IMAGE = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";
const BASE_URL = "https://route-posts.routemisr.com"
const authHeader =() => ({Authorization: `Bearer ${localStorage.getItem("userToken")}`});

export default function Comment({comment , queryKey}) {



const { userId } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const isOwner = userId?._id === comment.commentCreator?._id;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content || "");
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const editImageRef = useRef();

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [replyImagePreview, setReplyImagePreview] = useState(null);
  const replyImageRef = useRef();

  const [showReplies, setShowReplies] = useState(false);

  // ─── Get Replies ──────────────────────────────────────────────────────────
  const { data: repliesData } = useQuery({
    queryKey: ["replies", comment._id],
    queryFn: () => axios.get(`${BASE_URL}/posts//comments/${comment._id}/replies`, { headers: authHeader() }),
    enabled: showReplies,
  });
  const replies = repliesData?.data?.data?.replies ?? [];

  // ─── Delete Comment ───────────────────────────────────────────────────────
  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: () => axios.delete(`${BASE_URL}/posts//comments/${comment._id}`, { headers: authHeader() }),
    onSuccess: () => { toast.success("Comment deleted 🗑️"); queryClient.invalidateQueries({ queryKey }); },
    onError: () => toast.error("Failed to delete ❌"),
  });

  // ─── Update Comment ───────────────────────────────────────────────────────
  const { mutate: updateComment, isPending: isUpdating } = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("content", editContent);
      if (editImage) fd.append("image", editImage);
      return axios.put(`${BASE_URL}/posts//comments/${comment._id}`, fd, { headers: authHeader() });
    },
    onSuccess: () => {
      toast.success("Comment updated ✅");
      setIsEditing(false);
      setEditImage(null);
      setEditImagePreview(null);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => toast.error("Failed to update ❌"),
  });

  // ─── Create Reply ─────────────────────────────────────────────────────────
  const { mutate: createReply, isPending: isReplying } = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      if (replyContent) fd.append("content", replyContent);
      if (replyImage) fd.append("image", replyImage);
      return axios.post(`${BASE_URL}/posts//comments/${comment._id}/replies`, fd, { headers: authHeader() });
    },
    onSuccess: () => {
      toast.success("Reply sent 💬");
      setReplyContent("");
      setReplyImage(null);
      setReplyImagePreview(null);
      setShowReplyInput(false);
      setShowReplies(true);
      queryClient.invalidateQueries({ queryKey: ["replies", comment._id] });
    },
    onError: () => toast.error("Failed to reply ❌"),
  });

  function handleEditImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setEditImage(file);
    setEditImagePreview(URL.createObjectURL(file));
  }

  function handleReplyImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setReplyImage(file);
    setReplyImagePreview(URL.createObjectURL(file));
  }












  console.log(comment)
  return (
    <CardFooter>
           <CardHeader className="flex gap-3">
            <img
              alt="heroui logo"
              height={40}
              radius="sm"
              src={comment.commentCreator.photo}
              width={40}
              onError={(e) => {e.target.src = PLACEHOLDER_IMAGE}}
            />
            <div className="flex flex-col">
              <p className="text-md">{comment.commentCreator.name}</p>
              <p className="text-small text-default-500">{comment.createdAt}</p>
              {comment.content && <p>{comment.content}</p> }
              {comment.image && <img src={comment.image}/>}
            </div>
          </CardHeader>
          </CardFooter>
  )
}




