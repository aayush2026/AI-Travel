import Hotels from '@/components/custom/Hotels';
import InfoSection from '@/components/custom/InfoSection';
import Itinerary from '@/components/custom/Itinerary';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner';

const ViewTrip = () => {
    const {tripId} = useParams();
    const [trip, setTrip] = useState(null)

    useEffect(() => {
        getTripData();
    }, [tripId])
    

    const getTripData = async () =>{
        try {
            const docRef = doc(db, "AITrips", tripId);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                setTrip(docSnap.data())
            } else {
            // docSnap.data() will be undefined in this case
                console.log("No such document exists!");
            }
        } catch (error) {
            console.error("Error fetching trip data:", error);
            toast.error("Failed to fetch trip data.");
        }
    }

  return (
    <>
        <div className='mx-auto p-6 max-w-7xl'>
            <InfoSection trip={trip}/>
            <Hotels trip={trip}/>
            <Itinerary trip={trip}/>
        </div>

    </>
  )
}

export default ViewTrip