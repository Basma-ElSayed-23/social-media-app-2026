import React, {  useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../PostCard/PostCard';
import Loader from '../Loader/Loader';
import { useQuery } from '@tanstack/react-query';
import PostCreation from './../PostCreation/PostCreation';
import { Helmet } from 'react-helmet';


export default function Home() {

function getAllPosts(){
 return axios.get(`https://route-posts.routemisr.com/posts`, {
    //params:
    headers:{
      Authorization:`Bearer ${localStorage.getItem("userToken")}`,
    },
  })
}

const {data, isLoading, isError, isFetching, error} = useQuery({
  queryKey: ["getAllPost"],
  queryFn: getAllPosts,
});

// console.log("data", data?.data.data.posts);
// console.log("isLoading", isLoading);
// console.log("isError", isError);
// console.log("isFetching", isFetching);


if (isLoading){ 
  return <Loader/>}

if (isError){
  return <h1>{error.message}</h1>
}

  return (
  <>

<Helmet><title>Home page</title></Helmet>


  <PostCreation/>

  
    {data?.data.data.posts?.map((post) =>(
      <PostCard key={post._id} post={post}/> ))}
     
  </>
  );
}

