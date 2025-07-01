import { GetPlaceDetails, PHOTO_REF_URL } from '@/config/globalAPI'
import React, { useEffect, useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import { Link } from 'react-router'

const UserTripCard = ({trip}) => {
    const [photo, setPhoto] = useState()
    
    useEffect(() => {
        if (trip?.userSelection?.location?.formatted_address) {
            getPlacePhoto();
        }
    }, [trip])

    const getPlacePhoto = async () =>{
        const query = trip?.userSelection?.location?.formatted_address;
        if (!query) return;

        try {
            const data = { textQuery: query };

            const result =await GetPlaceDetails(data)
            // console.log(result);
            const photoRef = result?.data?.places?.[0]?.photos?.[0]?.name;
            if (photoRef) {
                const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', photoRef);
                setPhoto(PhotoUrl);
            }
        } catch (error) {
            console.error("Error fetching photos", error);
        }
    }


  return (
    <>
        <Link to={`/view-trip/${trip.id}`} className="block rounded-xl overflow-hidden shadow-sm hover:shadow-lg transform transition-all hover:scale-105 border border-gray-200">
            <img
                src={photo}
                alt='placeholder image'
                className="w-full h-40 object-cover"
            />

            <div className="p-3">
                <h2 className="text-lg font-semibold text-gray-900">{trip?.userSelection?.location?.formatted_address}</h2>
                <p className="text-sm text-gray-800 flex items-center gap-2">
                    {trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.budget} Budget
                </p>
            </div>
        </Link>
    </>
  )
}

export default UserTripCard