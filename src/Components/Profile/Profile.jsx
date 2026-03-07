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


return (
  <>
    <Helmet>
      <title>Profile – {userId?.name || "User"}</title>
    </Helmet>

  
    <div className="min-h-screen bg-[#f4f6fb] font-poppins antialiased">
      {/* Cover */}
      <div className="relative w-full h-60 bg-gray-300 overflow-hidden rounded-b-2xl">
        <img 
          src={coverSrc} 
          alt="cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/50" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0">

            {/* Avatar + User Info Row */}
            <div className="flex items-end gap-4 px-5 -mt-16 relative z-10">
              <div 
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105"
                onClick={() => imageInput.current.click()}
              >
                <img 
                  src={avatarSrc} 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-2xl">📷</span>
                </div>
              </div>

              <input 
                type="file" 
                ref={imageInput} 
                className="hidden"
                onChange={handleImageChange} 
                accept="image/*" 
              />

              <div className="pb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a2e] m-0">
                  {userId?.name || "Your Name"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {userId?.email || "email@example.com"}
                </p>
              </div>
            </div>

            {isPending && (
              <p className="px-5 py-1.5 text-sm text-gray-600">
                Uploading photo...
              </p>
            )}

            {/* Stats */}
            <div className="flex border-b border-gray-200 mt-4">
              <div className="text-center px-6 py-2">
                <div className="text-lg font-bold text-[#1a1a2e]">{postCount}</div>
                <div className="text-xs text-gray-500 font-medium">Posts</div>
              </div>
              {/* لو عندك إحصائيات تانية → ضيفها هنا بنفس الطريقة */}
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 border-b-2 border-gray-200 mt-3 px-4">
              <button
                className={`px-4 sm:px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors ${
                  activeTab === "posts"
                    ? "text-[#4361ee] bg-blue-50/80"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("posts")}
              >
                🖼️ My Posts
              </button>

              <button
                className={`px-4 sm:px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors ${
                  activeTab === "edit"
                    ? "text-[#4361ee] bg-blue-50/80"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("edit")}
              >
                ✏️ Edit Profile
              </button>

              <button
                className={`px-4 sm:px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors ${
                  activeTab === "password"
                    ? "text-[#4361ee] bg-blue-50/80"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("password")}
              >
                🔒 Password
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {activeTab === "posts" && (
                <div>
                  {myPosts.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">
                      No posts yet
                    </p>
                  ) : (
                    myPosts.map((post) => (
                      <PostCard key={post._id} post={post} isPostDetails={false} />
                    ))
                  )}
                </div>
              )}

              {activeTab === "edit" && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h3 className="text-base font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
                    ✏️ Update Name
                  </h3>
                  <div className="space-y-3">
                    <input
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50/60 focus:bg-white focus:border-[#4361ee] focus:ring-3 focus:ring-[#4361ee]/20 outline-none transition-all"
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter new name"
                    />
                    <input
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50/60 focus:bg-white focus:border-[#4361ee] focus:ring-3 focus:ring-[#4361ee]/20 outline-none transition-all"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current Password (required)"
                    />
                    <button
                      className="w-full bg-gradient-to-r from-[#4361ee] to-[#7209b7] text-white font-semibold text-sm py-2.5 px-5 rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                      onClick={updateUserName}
                      disabled={isNamePending || !newName || !currentPassword}
                    >
                      {isNamePending ? (
                        <>
                          <span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Save Name"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "password" && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h3 className="text-base font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
                    🔒 Change Password
                  </h3>
                  <div className="space-y-3">
                    <input
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50/60 focus:bg-white focus:border-[#06d6a0] focus:ring-3 focus:ring-[#06d6a0]/20 outline-none transition-all"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current Password"
                    />
                    <input
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50/60 focus:bg-white focus:border-[#06d6a0] focus:ring-3 focus:ring-[#06d6a0]/20 outline-none transition-all"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password"
                    />
                    <input
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50/60 focus:bg-white focus:border-[#06d6a0] focus:ring-3 focus:ring-[#06d6a0]/20 outline-none transition-all"
                      type="password"
                      value={reNewPassword}
                      onChange={(e) => setReNewPassword(e.target.value)}
                      placeholder="Confirm New Password"
                    />

                    {newPassword && reNewPassword && newPassword !== reNewPassword && (
                      <p className="text-red-500 text-xs mt-1">⚠️ Passwords don't match</p>
                    )}

                    <button
                      className="w-full bg-gradient-to-r from-[#06d6a0] to-[#1b9aaa] text-white font-semibold text-sm py-2.5 px-5 rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                      onClick={changePass}
                      disabled={isPassPending || !currentPassword || !newPassword || !reNewPassword || newPassword !== reNewPassword}
                    >
                      {isPassPending ? (
                        <>
                          <span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Changing...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
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