import {Card, CardHeader, CardBody, CardFooter, Divider, Image, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import Comment from "../Comment/Comment";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import CommentCreation from './../CommentCreation/CommentCreation';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import { TbTrashFilled } from "react-icons/tb";
import { useContext } from "react";
import { AuthContext } from './../../Context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const PLACEHOLDER_IMAGE = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"

export default function PostCard({post, isPostDetails = false}) {
  const {body, image, createdAt, user, topComment, _id: postId}  = post;
  const {name, photo} = user;
  const query = useQueryClient();

  
  const {userId : loggedUser} = useContext(AuthContext);
  const navigate =  useNavigate()

  const myTopComment = topComment;

  const PostUserId =user._id  // userId from post

  function getPostComments(){
    return axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments`,{
      headers: {Authorization: `Bearer ${localStorage.getItem("userToken")}`},
      // params :{limit: 10}
    });
  }

  const {data, isLoading, isError, error} = useQuery({
    queryKey: ["getPostComments", postId],
    queryFn: getPostComments,
    enabled: isPostDetails
  });


  if (!body && !image) return;


  function deleteMyPost(){
   return axios.delete(`https://route-posts.routemisr.com/posts/${postId}`, {
      headers: {Authorization: `Bearer ${localStorage.getItem("userToken")}`},
    });
  }

  // const query = useQueryClient()

  const {isPending, mutate} = useMutation({
  mutationFn: deleteMyPost,
  onSuccess: () => {
    toast.success("Deleted Successfully✔️");
    query.invalidateQueries({queryKey : ["getAllPost"]})
    navigate("/")
  },
  onError: () => {
     toast.error("Deleted Failed✖️")
  },
  onSettled: () => {},
  });




  return (
    <Card className="max-w-125 mx-auto mb-5">
      <CardHeader className="flex justify-between gap-3">
        <div className="flex gap-3">
      <img
          alt="heroui logo"
          height={40}
          radius="sm"
          src={photo}
          width={40}
          onError={(e) => {e.target.src = PLACEHOLDER_IMAGE}}
        />
        <div className="flex flex-col">
          <p className="text-md">{name}</p>
          <p className="text-small text-default-500">{createdAt}</p>
        </div>
        </div>
        
       {loggedUser && loggedUser?._id === PostUserId && (<Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="light">
<HiOutlineDotsHorizontal className="cursor-pointer" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
       
          <DropdownItem key="edit" textValue="Edit Post" onPress={() => navigate(`/editPost/${postId}`)}>
             <div className="flex items-center justify-between">
              Edit Post <FaRegEdit />
          </div>
          </DropdownItem>
        
        <DropdownItem key="delete" className="text-danger" color="danger"> 
          <div className="flex items-center justify-between" onClick={mutate}>
          Delete Post <TbTrashFilled />
          </div>
          </DropdownItem>
          
      </DropdownMenu>
    </Dropdown>)}

      </CardHeader>
      <Divider />
      <CardBody>
       {body && <p className="mb-2">{body}</p>}
       {image && <img src={image} alt={body}/>}
      </CardBody>
      <Divider />
      <CardFooter>
       <div className="w-full flex justify-between">
        <div className="cursor-pointer">👍Like</div>
        <div className="cursor-pointer"><Link to={`/postDetails/${postId}`}>🗨️Comment</Link></div>
        <div className="cursor-pointer">🔄️Share</div>
       </div>
      </CardFooter>
     <CommentCreation postId = {postId} queryKey={isPostDetails ? ["getPostComments"] : ["getAllPost"] }/>
     {/* <div>comment</div> */}
      {/* {isPostDetails === false && myTopComment && (<Comment comment={myTopComment} />)} */}

    {isPostDetails === false && myTopComment && (
      <Comment
       comment={myTopComment}
       post={post}
       queryKey={"getAllPost"} />)}

    {/* {isPostDetails && data?.data.data.comments.map((currentComment) =>(<Comment key={currentComment._id} comment={currentComment} />))} */}
    {isPostDetails && data?.data.data.comments?.map((currentComment) =>(
      <Comment key={currentComment._id} 
      comment={currentComment}
      post={post}
      queryKey={["getPostComments"]} />))}
    </Card>
  );
}
