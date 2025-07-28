import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import UserTripCard from '@/components/custom/UserTripCard';
import { useAuth } from '@/context/AuthContext';

const MyTrips = () => {
  const [userTrips, setUserTrips] = useState([]);
  const { user } = useAuth();
  const[loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserTrips = async () => {
      if (!user?.uid) {
        navigate('/');
        return;
      }

      try {
        const q = query(collection(db, 'AITrips'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const trips = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));

        setUserTrips(trips);
      } catch (error) {
        console.error('Failed to fetch user trips:', error);
        toast.error('Unable to fetch trips');
      } finally{
        setLoading(false)
      }
    };

    getUserTrips();
  }, [user, navigate]);

  return (
    <>
        <div className='mt-6 mx-auto max-w-7xl'>
            <h2 className='text-3xl font-bold my-2'>My Trips</h2>
            {loading ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Skeleton key={item} className="h-[250px] w-full rounded-xl bg-gray-200" />
                    ))}
                </div>
            ) : userTrips.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {userTrips.map((trip) => (
                        <UserTripCard key={trip.id} trip={trip} />
                    ))}
                </div>
            ) : (
                <div className='flex justify-center items-center h-48'>
                    <p className='text-xl text-gray-500'>No trips found</p>
                </div>
            )}
        </div>
    </>
  );
};

export default MyTrips;
