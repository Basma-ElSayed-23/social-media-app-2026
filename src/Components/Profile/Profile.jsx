import React, {useContext, useRef, useState, useEffect} from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { AuthContext } from './../../Context/AuthContext';



export default function Profile() {

const imageInput= useRef();
// const queryClient = useQueryClient();
const [preview, setPreview] = useState(null);
const [photoUrl, setPhotoUrl] = useState(null);



const [newName, setNewName] = useState("");



const navigate= useNavigate();
const {userId, updateUserData} = useContext(AuthContext);
const queryClient = useQueryClient();


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
      password: "123456"
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

function handleImageChange(e) {
const file = e.target.files[0];
if (!file) return;


setPreview(URL.createObjectURL(file));



const formData= new FormData();
formData.append("photo", file);

mutate(formData);
// e.target.value = null;
}


  return (
    <>
    <Helmet><title>profile page</title></Helmet>
    <div className='flex flex-col items-center mt-10 gap-4'>
      <div className='w-32 h-32 overflow-hidden cursor-pointer border-4 border-gray-400 rounded-full' 
      onClick={() => imageInput.current.click()}>
       <img src={preview || photoUrl || "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"} alt="profile"
        className='w-full object-cover h-full'/>
        
      </div>
      <input type="file" ref={imageInput} className='hidden' onChange={handleImageChange}/>

      {isPending && <p>Uploading...</p>}

      /**/ */

      <div className="flex flex-col gap-2 mt-4 w-64">
  <input
    type="text"
    value={newName}
    onChange={(e) => setNewName(e.target.value)}
    placeholder="Enter new name"
    className="border p-2 rounded"
  />

  <button
    onClick={() => updateUserName({ name: newName })}
    className="bg-blue-500 text-white p-2 rounded"
  >
    Update Name
  </button>

  {isNamePending && <p>Updating...</p>}
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