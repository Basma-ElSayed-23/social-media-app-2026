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


//   return (
//     <>
//     <Helmet><title>profile page</title></Helmet>
//     <div className='flex flex-col items-center mt-10 gap-4'>
//       <div className='w-32 h-32 overflow-hidden cursor-pointer border-4 border-gray-400 rounded-full' 
//       onClick={() => imageInput.current.click()}>
//        <img src={preview || photoUrl || "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"} alt="profile"
//         className='w-full object-cover h-full'/>
        
//       </div>
//       <input type="file" ref={imageInput} className='hidden' onChange={handleImageChange}/>

//       {isPending && <p>Uploading...</p>}

    

//       <div className="flex flex-col gap-2 mt-4 w-64">
//   <input
//     type="text"
//     value={newName}
//     onChange={(e) => setNewName(e.target.value)}
//     placeholder="Enter new name"
//     className="border p-2 rounded"
//   />

//   <button
//     onClick={() => updateUserName({ name: newName })}
//     className="bg-blue-500 text-white p-2 rounded"
//   >
//     Update Name
//   </button>

//   {isNamePending && <p>Updating...</p>}
// </div>


//  <div className='flex flex-col p-4 gap-2 border rounded-xl'>
//   <h3 className='text-lg font-bold'>Change Password</h3>
//   <input type="password" className='p-2 rounded border' value={currentPassword} 
//    onChange={(e) => setCurrentPassword(e.target.value)} placeholder='Current Password'/>
//    <input type="password" className='p-2 rounded border' value={newPassword} 
//    onChange={(e) => setNewPassword(e.target.value)} placeholder='New Password'/>
//    <input type="password" className='p-2 rounded border' value={reNewPassword} 
//    onChange={(e) => setReNewPassword(e.target.value)} placeholder='Confirm new Password'/>
   
//    <button  onClick={() => changePass()} disabled= {isPending || !currentPassword || !newPassword || !reNewPassword}
//    className='bg-green-400 text-white p-2 disabled:bg-gray-400 rounded-xl'>
//    {isPassPending ? "Changing♻️" : "Change Password"}</button>
// </div> 
//  </div>
//     </>
    
//   );
// }

return (
    <>
      <Helmet><title>Profile – {userId?.name || "User"}</title></Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
.pp * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        .pp-layout { display: flex; gap: 24px; align-items: flex-start; max-width: 1100px; margin: 0 auto; padding: 24px 16px; }
        .pp-main { flex: 1; min-width: 0; }
        .pp-cover { position: relative; width: 100%; height: 240px; background: #ccc; overflow: hidden; border-radius: 0 0 16px 16px; }
        .pp-cover img { width: 100%; height: 100%; object-fit: cover; }
        .pp-cover-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.5)); }
        .pp-avatar-row { display: flex; align-items: flex-end; gap: 16px; padding: 0 20px; margin-top: -50px; position: relative; z-index: 10; }
        .pp-avatar { width: 100px; height: 100px; border-radius: 50%; border: 4px solid #fff; overflow: hidden; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,.18); flex-shrink: 0; position: relative; transition: transform .2s; }
        .pp-avatar:hover { transform: scale(1.04); }
        .pp-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .pp-avatar-ov { position: absolute; inset: 0; background: rgba(0,0,0,.35); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .2s; border-radius: 50%; color: #fff; font-size: 20px; }
        .pp-avatar:hover .pp-avatar-ov { opacity: 1; }
        .pp-userinfo { padding-bottom: 8px; }
        .pp-userinfo h2 { margin: 0; font-size: 20px; font-weight: 700; color: #1a1a2e; }
        .pp-userinfo p { margin: 2px 0 0; font-size: 12px; color: #777; }
        .pp-stats { display: flex; padding: 12px 20px 0; border-bottom: 1px solid #e8e8ef; }
        .pp-stat { text-align: center; padding: 6px 24px; }
        .pp-stat .num { font-size: 18px; font-weight: 700; color: #1a1a2e; }
        .pp-stat .lbl { font-size: 11px; color: #888; }
        .pp-tabs { display: flex; gap: 4px; padding: 10px 20px 0; border-bottom: 2px solid #e8e8ef; }
        .pp-tab { padding: 8px 18px; border: none; background: transparent; font-size: 13px; font-weight: 600; color: #888; cursor: pointer; border-radius: 8px 8px 0 0; transition: all .2s; position: relative; }
        .pp-tab.active { color: #4361ee; background: #f0f3ff; }
        .pp-tab.active::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2px; background: #4361ee; border-radius: 2px; }
        .pp-content { padding: 20px; }
        .pp-card { background: #fff; border-radius: 14px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,.07); margin-bottom: 16px; }
        .pp-card h3 { margin: 0 0 14px; font-size: 15px; font-weight: 700; color: #1a1a2e; display: flex; align-items: center; gap: 7px; }
        .pp-ig { display: flex; flex-direction: column; gap: 10px; }
        .pp-inp { width: 100%; border: 1.5px solid #e2e6f0; border-radius: 10px; padding: 10px 13px; font-size: 13px; outline: none; transition: border-color .2s, box-shadow .2s; background: #fafbff; }
        .pp-inp:focus { border-color: #4361ee; box-shadow: 0 0 0 3px rgba(67,97,238,.12); background: #fff; }
        .pp-btn-blue { background: linear-gradient(135deg, #4361ee, #7209b7); color: #fff; border: none; border-radius: 10px; padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px; transition: opacity .2s, transform .15s; }
        .pp-btn-blue:hover { opacity: .9; transform: translateY(-1px); }
        .pp-btn-blue:disabled { background: #c9d0e8; cursor: not-allowed; transform: none; }
        .pp-btn-green { background: linear-gradient(135deg, #06d6a0, #1b9aaa); color: #fff; border: none; border-radius: 10px; padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px; transition: opacity .2s, transform .15s; }
        .pp-btn-green:hover { opacity: .9; transform: translateY(-1px); }
        .pp-btn-green:disabled { background: #c9d0e8; cursor: not-allowed; transform: none; }
        .pp-err { color: #e63946; font-size: 12px; margin: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pp-spin { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; display: inline-block; }
        @media (max-width: 700px) { .pp-layout { flex-direction: column; } }
      `}</style>

      <div className="pp" style={{ background: "#f4f6fb", minHeight: "100vh" }}>

        <div className="pp-cover">
          <img src={coverSrc} alt="cover" />
          <div className="pp-cover-overlay" />
        </div>

        <div className="pp-layout">
          <div className="pp-main">

            <div className="pp-avatar-row">
              <div className="pp-avatar" onClick={() => imageInput.current.click()}>
                <img src={avatarSrc} alt="avatar" />
                <div className="pp-avatar-ov">📷</div>
              </div>
              <input type="file" ref={imageInput} style={{ display: "none" }}
                onChange={handleImageChange} accept="image/*" />
              <div className="pp-userinfo">
                <h2>{userId?.name || "Your Name"}</h2>
                <p>{userId?.email || "email@example.com"}</p>
              </div>
            </div>

            {isPending && (
              <p style={{ padding: "6px 20px", fontSize: 12, color: "#888" }}>Uploading photo...</p>
            )}

            <div className="pp-stats">
              <div className="pp-stat">
                <div className="num">{postCount}</div>
                <div className="lbl">Posts</div>
              </div>
            </div>

            <div className="pp-tabs">
              <button className={`pp-tab ${activeTab === "posts" ? "active" : ""}`}
                onClick={() => setActiveTab("posts")}>🖼️ My Posts</button>
              <button className={`pp-tab ${activeTab === "edit" ? "active" : ""}`}
                onClick={() => setActiveTab("edit")}>✏️ Edit Profile</button>
              <button className={`pp-tab ${activeTab === "password" ? "active" : ""}`}
                onClick={() => setActiveTab("password")}>🔒 Password</button>
            </div>

            <div className="pp-content">

              {activeTab === "posts" && (
                <div>
                  {myPosts.length === 0 ? (
                    <p style={{ color: "#aaa", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
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
                <div className="pp-card">
                  <h3>✏️ Update Name</h3>
                  <div className="pp-ig">
                    <input className="pp-inp" type="text" value={newName}
                      onChange={(e) => setNewName(e.target.value)} placeholder="Enter new name" />
                    <input className="pp-inp" type="password" value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password (required)" />
                    <button className="pp-btn-blue" onClick={() => updateUserName()}
                      disabled={isNamePending || !newName || !currentPassword}>
                      {isNamePending ? <><span className="pp-spin" /> Updating...</> : "Save Name"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "password" && (
                <div className="pp-card">
                  <h3>🔒 Change Password</h3>
                  <div className="pp-ig">
                    <input className="pp-inp" type="password" value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" />
                    <input className="pp-inp" type="password" value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                    <input className="pp-inp" type="password" value={reNewPassword}
                      onChange={(e) => setReNewPassword(e.target.value)} placeholder="Confirm New Password" />
                    {newPassword && reNewPassword && newPassword !== reNewPassword && (
                      <p className="pp-err">⚠️ Passwords don't match</p>
                    )}
                    <button className="pp-btn-green" onClick={() => changePass()}
                      disabled={isPassPending || !currentPassword || !newPassword || !reNewPassword || newPassword !== reNewPassword}>
                      {isPassPending ? <><span className="pp-spin" /> Changing...</> : "Change Password"}
                    </button>
                  </div>
                </div>
              )}

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