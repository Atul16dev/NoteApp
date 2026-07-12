import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext, createContext } from "react";
import toast from "react-hot-toast";

const authContext = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const login = (user) => {
    setUser(user);
  };

    const handleLogout = () =>{
    localStorage.removeItem('token');
    setUser(null);

    toast.success("Logged out successfully 👋");
  }

  useEffect(() => {
    const verifyuser = async()=>{

      const token = localStorage.getItem("token");


    if (!token) {
      setUser(null);
      return;
    }

      try {
        const res = await axios.get('http://localhost:5000/api/auth/verify',{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        })
        if(res.data.success){
          setUser(res.data.user)
        } else{
          setUser(null)
        }
      } catch (error) {
        console.log(error)
        setUser(null);///
      }
    }
    verifyuser()
  },[])
  return (
    <authContext.Provider value={{ user, login, handleLogout }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
export default ContextProvider;
