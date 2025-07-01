import UserTripCard from '@/components/custom/UserTripCard';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';

const MyTrips = () => {
    const navigate = useNavigate();
    const [userTrips, setUserTrips] = useState([])

    useEffect(() => {
        const getUserTrips = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                navigate('/');
                return;
            }

            const q = query(collection(db, 'AITrips'), where('userEmail', '==', user.email));
            const querySnapshot = await getDocs(q);

            const trips = [];
            querySnapshot.forEach((doc) => {
                trips.push(doc.data());
            });

            setUserTrips(trips);
        };

        getUserTrips();
    }, [navigate]);

  return (
    <div className='mt-6 mx-auto max-w-7xl'>
        <h2 className='text-3xl font-bold my-2'>My Trips</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {userTrips.length>0 ? userTrips.map((trip, index)=>(
                <UserTripCard key={index} trip={trip}/>
            ))
            : [1,2,3,4,5,6].map((item,index)=>(
                <Skeleton className="h-[250px] w-[250px] rounded-xl bg-gray-200" />
            ))
            }
        </div>
    </div>
  )
}

export default MyTrips