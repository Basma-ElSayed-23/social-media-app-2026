import React, {useState} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoKeyOutline } from "react-icons/io5";

export default function Settings() {

 const [currentPassword, setCurrentPassword] = useState("");
 const [newPassword, setNewPassword] = useState("");
 const [reNewPassword, setReNewPassword] = useState("");
 const isPasswordValid = newPassword.length >=8
 const isMatch = newPassword === reNewPassword



function changePassword() {
    if(newPassword !== reNewPassword) {
        toast.error ("Passwords do not match");
        return;
    }
    axios.patch(`https://route-posts.routemisr.com/users/change-password`, 
        {
            password: currentPassword,
            newPassword: newPassword
        },
        {headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
        }
        }
    ).then(() => {
    toast.success("Password updated✔️")
    }).catch(() => {
        toast.error("Something went wrong ✖️")
    })
}

  return (
    <div className='min-h-screen flex justify-center items-start pt-10 bg-gray-100'>
        <div className='w-162.5 rounded-2xl bg-white shadow-md p-8'>
            <div className='flex gap-3 mb-6 items-center'>
                <div className='bg-blue-100 text-blue-600 flex items-center justify-center w-10 h-10 rounded-full'>
                    <IoKeyOutline size={18} />
                </div>
                <div>
                    <h2 className='font-bold text-xl'>Change Password</h2>
                    <p className='text-gray-500 text-sm'>Keep your secure by using a strong password.</p>
                </div>
            </div>
            {/*current pass*/ }
            <label className='font-medium mb-1 block text-sm'>Current password</label>
            <input type="password" className='w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            placeholder='Enter current password' value={currentPassword} onChange={(e) =>setCurrentPassword(e.target.value)} />
             {/*new pass*/}
            <label className='font-medium mb-1 block text-sm'>New password</label>
            <input type="password"  placeholder='Enter new password' value={newPassword} onChange={(e) =>setNewPassword(e.target.value)}
             className={`w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                ${newPassword && !isPasswordValid ? "border-red-500" : "border-gray-300"}`}/>

                {newPassword && !isPasswordValid && (<p className='text-red-500 text-sm mb-3'>At least 8 characters with uppercase, lowercase, number, and special character.</p>)}
                {/*confirm pass */}
                <label className='font-medium mb-1 block text-sm'>Confirm new password</label>
            <input type="password"  placeholder='Re-enter new password' value={reNewPassword} onChange={(e) =>setReNewPassword(e.target.value)}
             className={`w-full border rounded-lg p-2 mb-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                ${reNewPassword && !isMatch ? "border-red-500" : "border-gray-300"}`}
            />
            {reNewPassword && !isMatch && (<p className='text-red-500 text-sm mb-3'>Passwords do not match.</p>)}

            <button onClick={changePassword} disabled={!currentPassword || !isPasswordValid || !isMatch}
            className={`w-full rounded-lg font-semibold transition py-2 ${!currentPassword || !isPasswordValid || !isMatch
                ? "bg-blue-300 cursor-not-allowed text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}>Update password</button>
        </div>
    </div>
  )
}
