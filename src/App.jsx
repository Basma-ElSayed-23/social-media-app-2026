import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Notfound from './Components/Notfound/Notfound';
import CounterContextProvider from './Context/CounterContext';
import {HeroUIProvider} from "@heroui/system";
import Profile from './Components/Profile/Profile';
import AuthContextProvider from './Context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import {QueryClientProvider, QueryClient} from "@tanstack/react-query"
import PostDetails from './Components/PostDetails/PostDetails';
import { ToastContainer } from 'react-toastify';
import DetectOffline from './Components/DetectOffline/DetectOffline';
import { useNetworkState } from 'react-use';



const router= createBrowserRouter([
 { path:"" , element: <Layout/>, 
 children:[
// { index: true, element: <ProtectedRoute> <Home/> </ProtectedRoute>},
{ path: "/", element: <ProtectedRoute> <Home/> </ProtectedRoute>},
{ path: "postDetails/:id", element: <ProtectedRoute><PostDetails/></ProtectedRoute>},
{ path: "login", element: <Login/>},
{ path: "profile", element: <ProtectedRoute><Profile/></ProtectedRoute>},
{ path: "register", element: <Register/>},
{ path: "*", element: <Notfound/>},

 ],
},
]);

const query = new QueryClient({})

export default function App() {

const {online} = useNetworkState();


  return(
      <>
      {!online && <DetectOffline/> }
      
      <QueryClientProvider client={query}>
      <AuthContextProvider>
        <HeroUIProvider>
      <CounterContextProvider>
        <RouterProvider router={router}></RouterProvider>
        <ToastContainer/>
        </CounterContextProvider>
      </HeroUIProvider>
      </AuthContextProvider>
      </QueryClientProvider>
      
  </>
  )
   
}
