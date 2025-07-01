import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  // Auto-redirect after 5 seconds
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       navigate('/');
//     }, 5000); // 5 seconds

//     return () => clearTimeout(timeout); // cleanup
//   }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist. <br />
        Redirecting you to the homepage...
      </p>
      <Button
        onClick={() => navigate('/')}
      >
        Go to Homepage Now
      </Button>
    </div>
  );
};

export default NotFound;
