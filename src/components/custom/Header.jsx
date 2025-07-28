import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext'; // 👈 use AuthContext

const Header = () => {
  const { user, login, logout } = useAuth(); // 👈 from AuthProvider
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className='mx-auto max-w-7xl'>
      <div className='flex justify-between items-center my-4 p-2 px-4 border-t-2 rounded-lg shadow-lg/20'>
        <Link to='/' className='flex items-center'>
          <img src="/travellogo.png" alt="travel logo" style={{ width: '45px', height: '45px', marginRight: '10px' }} />
          <span className='text-3xl'>AI Travel</span>
        </Link>

        {user ? (
          <div className='flex items-center gap-5'>
            <Button className='rounded-full' variant='outline' onClick={() => navigate("/create-trip")}>
              Create Trip
            </Button>
            <Button className='rounded-full' onClick={() => navigate("/my-trips")}>
              My Trips
            </Button>

            <Popover>
              <PopoverTrigger>
                <img src={user?.picture} alt="User profile" className='h-[40px] rounded-full' />
              </PopoverTrigger>
              <PopoverContent side='bottom' align='end'>
                <p className='py-2'>Logout here</p>
                <Button onClick={handleLogout} className='w-full'>
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
      </div>

      {/* Login Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <div className='flex items-center'>
              <img src="/travellogo.png" alt="travel logo" style={{ width: '35px', height: '35px', marginRight: '10px' }} />
              <span className='text-3xl text-gray-900'>AI Travel</span>
            </div>
            <DialogTitle className="text-lg font-bold mt-6">Sign In With Google</DialogTitle>
            <DialogDescription>Sign in securely with Firebase Google Auth.</DialogDescription>
          </DialogHeader>

          <Button className='w-full mt-6' onClick={() => login().then(() => setOpenDialog(false))}>
            <FcGoogle className="mr-2" /> Sign In With Google
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
