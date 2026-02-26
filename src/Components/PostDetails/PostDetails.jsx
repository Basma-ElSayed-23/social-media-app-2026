import axios from 'axios';
import React from 'react';
import { useParams } from "react-router-dom";
import Loader from './../Loader/Loader';
import { useQuery } from '@tanstack/react-query';
import PostCard from './../PostCard/PostCard';



export default function PostDetails() {

const{id} = useParams()


function getPostDetails(){
    
return axios.get(`https://route-posts.routemisr.com/posts/${id}` , {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`
    }
})
}
const {data, isLoading, isError, isFetching, error} = useQuery({
  queryKey: ["getSinglePost", id],
  queryFn: getPostDetails,
});

// console.log(data?.data.data.post);



if (isLoading){ 
  return <Loader/>}

if (isError){
  return <h1>{error.message}</h1>
}


  return <>
  <PostCard post={data?.data.data.post} isPostDetails/></>
}

