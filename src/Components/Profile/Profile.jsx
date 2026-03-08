import React, {useContext, useRef, useState, useEffect} from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { AuthContext } from './../../Context/AuthContext';
import PostCard from '../PostCard/PostCard'




export default function Profile() {

const imageInput= useRef();
const [activeTab, setActiveTab] = useState("posts");
// const queryClient = useQueryClient();
const [preview, setPreview] = useState(null);
const [photoUrl, setPhotoUrl] = useState(null);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [reNewPassword, setReNewPassword] = useState("");



const [newName, setNewName] = useState("");



const navigate= useNavigate();
const {userId, updateUserData} = useContext(AuthContext);
const queryClient = useQueryClient();


const {data:postsData} = useQuery({
  queryKey: ["userPosts"],
  queryFn: () => axios.get("https://route-posts.routemisr.com/posts/feed?only=me", {
    headers: {Authorization: `Bearer ${localStorage.getItem("userToken")}`},
  }),
  // staleTime: 1000 * 60 * 5,
})


const myPosts = postsData?.data?.data?.posts ?? [];
const postCount = myPosts.length;

const {data: suggestionData} = useQuery({
  queryKey: ["suggestions"],
  queryFn: () => axios.get("https://route-posts.routemisr.com/users/suggestions?limit=10", {
    headers: {Authorization: `Bearer ${localStorage.getItem("userToken")}`},
  }),
})

const suggestions = suggestionData?.data?.data?.users ?? [];

const {mutate: toggleFollow} = useMutation({
  mutationFn: (followUserId) => axios.put(`https://route-posts.routemisr.com/users/follow-unfollow/${followUserId}`,
   {},
   {
    headers: {Authorization: `Bearer ${localStorage.getItem("userToken")}`}}
  ),
  onSuccess: () => {toast.success("Successful🌟");
    queryClient.invalidateQueries({queryKey: ["suggestions"]});
  },
  onError: () => {toast.error("Failed☄️")}
});


function uploadProfilePhoto(formData) {
return axios.put("https://route-posts.routemisr.com/users/upload-photo", formData,
  {headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  },
}
);
}
/**/ 
function updateName() {
  console.log({
    name: newName,
    email: userId.email,
    password: "123456"
  });
  return axios.put(
    "https://route-posts.routemisr.com/users/update-user",
    {
      name:newName,
      email: userId.email,
      password: currentPassword
    },
    {   
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
}

const {mutate, isPending} = useMutation({
  mutationFn: uploadProfilePhoto,

  onSuccess: (res) =>{
  toast.success("profile photo updated ✅")
    // setuserId(res.data.data.user);

 const updatedUser = res.data.data.user;
 updateUserData(updatedUser)

 localStorage.setItem("userData", JSON.stringify(updatedUser));
//  setUserId(updatedUser);

 queryClient.invalidateQueries({queryKey: ["getAllPost"]});

 navigate("/")

  },
  onError: (error) =>{
 console.log(error);
 toast.error("Upload failed ❌");
  },
});

/**/ 
const { mutate: updateUserName, isPending: isNamePending } = useMutation({
  mutationFn: updateName,

  onSuccess: (res) => {
    const updatedUser = res.data.data.user;
    updateUserData(updatedUser);
    toast.success("Name updated ✅");
  },

  onError: () => {
    toast.error("Failed ❌");
  },
});

///////////////////////////////////

const {mutate: changePass, isPending: isPassPending} = useMutation({
  mutationFn:changePassword,
  onSuccess: () => {
    toast.success("Password Changed♻️");
    setCurrentPassword("");
    setNewPassword("");
    setReNewPassword("");
  },
  onError: () => {
    toast.error("Failed to change this password💢");
  },
});

function changePassword() {
  return axios.patch("https://route-posts.routemisr.com/users/change-password",
    {password:currentPassword,
      newPassword: newPassword
    },
    {headers: {Authorization: `Bearer ${localStorage.getItem("userToken")}`}}
  );
}


function handleImageChange(e) {
const file = e.target.files[0];
if (!file) return;

setPreview(URL.createObjectURL(file));

const formData= new FormData();
formData.append("photo", file);

mutate(formData);
// e.target.value = null;
}

const avatarSrc = preview || userId?.photo || "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

const coverSrc = "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1200&q=80";




const { data: bookmarksData, isLoading: bookmarkLoading } = useQuery({
  queryKey: ["bookmarks"], 
  queryFn: () => axios.get("https://route-posts.routemisr.com/posts//bookmark", {
    headers: {Authorization: `Bearer ${localStorage.getItem("userToken")}`},
  }),
});

const bookmarks = bookmarksData?.data?.data?.bookmarks ?? [];
const savedCount = bookmarks.length;

return (
  <>
  <Helmet>
    <title>{userId?.name || "Profile"}</title>
  </Helmet>

  <div className='min-h-screen bg-[#f4f6fb] rounded-xl'>
    <div className='h-64 bg-linear-to-r from-[#333d5a] via-[#3b4865] to-[#5d799b]'></div> 

    <div className='max-w-6xl mx-auto rounded-md px-5 -mt-32'>
      <div className='bg-white shadow-md p-8 -mb-2 rounded-3xl'>
        <div className='grid grid-cols-12 gap-6 items-start'>
          <div className='col-span-4 flex items-center gap-4'>
            <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow cursor-pointer'
            onClick={() => imageInput.current.click()}>
              <img src={preview || userId?.photo} className='w-full h-full object-cover' />
            </div>
            <input type="file" ref={imageInput} className='hidden' onChange={handleImageChange}/> 
          
          <div className='col-span-2'>
            <h2 className='text-2xl font-bold text-gray-800'>
              {userId?.name || "basma23"}
            </h2>
            <p className='text-gray-500 text-sm'>@{userId?.username || "basma24"}</p>
        </div>
       </div>
      <div className='col-span-2 bg-gray-50 border rounded-xl p-4 text-center'>
        <p className='text-xs uppercase text-gray-500'>Followers</p>
        <p className='text-2xl font-bold'>{userId?.followersCount || 0}</p>
      </div>
      <div className='col-span-2 bg-gray-50 border rounded-xl p-4 text-center'>
        <p className='text-xs text-gray-500 uppercase'>Following</p> 
        <p className='text-2xl font-bold'>{userId?.followersCount || 2}</p>
      </div>
      <div className='col-span-2 bg-gray-50 rounded-xl p-4 text-center border'>
        <p className='text-xs text-gray-500 uppercase'>Bookmarks</p>
        <p className='text-2xl font-bold'>{savedCount}</p>
      </div>
      <div className='col-span-8 bg-indigo-50 border-1 border-gray-300 rounded-xl p-16'>
        <h3 className='font-semibold '>About</h3>
        <p className='text-sm text-gray-600 mb-2'>✉️{userId?.email}</p>
        {/* <p className='text-sm text-gray-600'>Active on Route Posts</p> */}
      </div>
      <div className='col-span-4 grid gap-4'>
        <div className='bg-blue-50 border rounded-xl p-4'>
          <p className='text-xs text-gray-500 uppercase'>MY POSTS</p>
          <p className='text-2xl font-bold mt-2'>{postCount}</p>
        </div>
        <div className='bg-blue-50 border rounded-xl p-4'>
          <p className='text-xs text-gray-500 uppercase'>SAVED POSTS</p>
          <p className='text-2xl font-bold mt-2'>{savedCount}</p>
        </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  <div className='max-w-6xl mx-auto px-6 mt-8'>
    <div className='bg-white flex gap-3 items-center rounded-xl shadow-sm p-3'>
      <button onClick={() => setActiveTab("posts")} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 
        ${activeTab === "posts" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}>📄My Posts</button>
      <button onClick={() => setActiveTab("saved")} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 
        ${activeTab === "saved" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}>📩Saved</button>
        <div className='rounded-full px-3 py-1 ml-auto bg-blue-100 text-sm'>{postCount}</div>
    </div>
    <div className='mt-6 space-y-6'>{activeTab === "posts" && (
      <>
      {myPosts.length === 0 ? (
        <p className='text-center text-gray-500 py-10'>No posts yet</p>
      ) : (
        myPosts.map((post) => (
          <PostCard key={post._id} post={post} isPostDetails={false}/>
        ))
      )}
      </>
    )}
    {activeTab === "saved" && (
      <>
      {bookmarkLoading ? (
        <p className='text-center py-10'>Loading...</p>
      ) : bookmarks.length === 0 ? (
        <p className='text-center text-gray-500 py-10'>No saved posts yet.</p>
      ) : (
        bookmarks.map((post) => (
          <PostCard key={post._id} post={post} isPostDetails={false}/>
        ))
      )}
      </> 
    )}
    </div>
  </div>
  </>
)
}




































// export default function Profile() {
//   const imageInput = useRef();
//   // const queryClient = useQueryClient();
//   const [preview, setPreview] = useState(null);
//   const navigate = useNavigate();
//   const {setUserId} = useContext(AuthContext);
//   const queryClient = useQueryClient();

//   function uploadProfilePhoto(formData) {
//     return axios.put(
//       "https://route-posts.routemisr.com/users/upload-photo",
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//         },
//       }
//     );
//   }

//   const { mutate, isPending } = useMutation({
//   mutationFn: uploadProfilePhoto,

//   onSuccess: (res) => {
//     toast.success("Profile photo updated ✅");

//     // setuserId(res.data.data.user);
//     const updatedUser = res.data.data.user;
    
//     localStorage.setItem("userData", JSON.stringify(updatedUser));
//     setUserId(updatedUser);

//     queryClient.invalidateQueries({ queryKey: ["getAllPost"] });
  
//     navigate("/");
//   },  

//   onError: (error) => {
//     console.log(error);
//     toast.error("Upload failed ❌");
//   },
// });

//   function handleImageChange(e) {
//     const file = e.target.files[0];
//     if (!file) return;

//     setPreview(URL.createObjectURL(file));

//     const formData = new FormData();
//     formData.append("photo", file);

//     mutate(formData);
//   }

//   return (
//     <>
//       <Helmet>
//         <title>profile page</title>
//       </Helmet>

//       <div className="flex flex-col items-center mt-10 gap-4">
//         <div
//           className="w-32 h-32 rounded-full overflow-hidden cursor-pointer border-4 border-gray-300"
//           onClick={() => imageInput.current.click()}
//         >
//           <img
//             src={
//               preview ||
//               "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
//             }
//             alt="profile"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         <input
//           type="file"
//           ref={imageInput}
//           className="hidden"
//           onChange={handleImageChange}
//         />

//         {isPending && <p>Uploading...</p>}
//       </div>
//     </>
//   );
// }