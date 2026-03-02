import React, {  useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import PostCard from '../PostCard/PostCard';
import Loader from '../Loader/Loader';
import { useQuery } from '@tanstack/react-query';
import PostCreation from './../PostCreation/PostCreation';
import { Helmet } from 'react-helmet';



export default function Home() {

const { userLogin} = useContext(AuthContext);
const [editingPost, setEditingPost] = useState(null);
  /**/
  

function getAllPosts(){
 return axios.get(`https://route-posts.routemisr.com/posts`, {
    //params:
    headers:{
      // Authorization:`Bearer ${localStorage.getItem("userToken")}`,
      Authorization:`Bearer ${userLogin}`,
    },
  })
}
// console.log("userLogin:", userLogin);
const {data, isLoading, isError, isFetching, error} = useQuery({
  queryKey: ["getAllPost", userLogin],
  queryFn: getAllPosts,
  enabled: !!userLogin,
});

//  if (!userLogin) return null;

if (isLoading){ 
  return <Loader/>}

if (isError){
  return <h1>Something went wrong !!💥</h1>
}

// console.log("data", data?.data.data.posts);
// console.log("isLoading", isLoading);
// console.log("isError", isError);
// console.log("isFetching", isFetching);
  return (
  <>

<Helmet><title>Home page</title></Helmet>

  <PostCreation/>

    {data?.data.data.posts?.map((post) =>(
      <PostCard key={post._id} post={post}/> ))}
     
  </>
  );
}

