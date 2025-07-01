import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { FcGoogle } from 'react-icons/fc'
import { IoIosAdd } from 'react-icons/io'

const Header = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [openDialog, setOpenDialog] = useState(false)
    const navigate = useNavigate();
    
    // useEffect(()=>{
    //     console.log(user);
    // },[])

    const login=useGoogleLogin({
        onSuccess:(response)=>getUserProfile(response),
        onError:(error)=>console.log(error),
    })

    const getUserProfile = async (tokenInfo)=>{
        try {
            const res = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
            {
                headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'application/json',
                },
            }
            );
            // console.log(res.data);
            localStorage.setItem('user', JSON.stringify(res.data))
            setOpenDialog(false)
        } catch (error) {
            console.error('Error in getUserProfile:', error);
        }
    }

  return <>
        <div className='mx-auto max-w-7xl'>
            <div className='flex justify-between items-center my-4 p-2 px-4 border-t-2 rounded-lg shadow-lg/20 max-w-7xl'>
                <div className='flex items-center'>
                    <Link to={'/'} className='flex items-center'>
                        <img src="/travellogo.png" alt="travel logo" style={{width: '45px',height: '45px',marginRight: '10px'}}/>
                        <span className='text-3xl'>AI Travel</span>
                    </Link>
                </div>
                {user ?
                    <div className='flex items-center gap-5'>
                        <Button className='rounded-full' variant='outline' onClick={()=>navigate("/create-trip")}>Create Trip</Button>
                        <Button className='rounded-full' onClick={()=>navigate("/my-trips")}>My Trips</Button>
                        <Popover>
                            <PopoverTrigger>
                                <img src={user?.picture} alt="User profile" className='h-[40px] rounded-full'/>
                            </PopoverTrigger>
                            <PopoverContent side='bottom' align='end' className="w-fit">
                                <p className='py-2'>Logout here</p>
                                <Button onClick={()=>{
                                    googleLogout();
                                    localStorage.removeItem('user');
                                    navigate('/')
                                }} className='w-full'>Logout</Button>
                            </PopoverContent>
                        </Popover>
                    </div> 
                    :<Button onClick={()=>setOpenDialog(true)}>Sign In</Button>
                }
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <div className='flex items-center'>
                            <img
                            src="/travellogo.png"
                            alt="travel logo"
                            style={{ width: '35px', height: '35px', marginRight: '10px' }}
                            />
                            <span className='text-3xl text-gray-900'>AI Travel</span>
                        </div>

                        <DialogTitle className="text-lg font-bold mt-6">
                            Sign In With Google
                        </DialogTitle>

                        <DialogDescription>
                            Sign in securely with Google OAuth.
                        </DialogDescription>
                    </DialogHeader>

                    <Button className='w-full mt-6' onClick={login}>
                        <FcGoogle className="mr-2" /> Sign In With Google
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    </>
}

export default Header