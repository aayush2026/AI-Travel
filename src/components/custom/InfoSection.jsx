import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { IoIosSend } from "react-icons/io";
import { GetPlaceDetails, PHOTO_REF_URL } from '@/config/globalAPI';

const InfoSection = ({trip}) => {
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
        <div>
            <img src={photo} alt="placeholder_image" className='h-[340px] w-full object-cover rounded-2xl'/>
        </div>
        <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-2'>
                <h2 className='text-4xl my-2 mt-6'>{trip?.userSelection?.location?.formatted_address}</h2>
                <div className='flex gap-4'>
                    <h2 className='p-1 px-4 sm:text-sm md:text-md text-lg bg-gray-200 rounded-full text-gray-600'>📅 {trip?.userSelection?.noOfDays} Day</h2>
                    <h2 className='p-1 px-4 sm:text-sm md:text-md text-lg bg-gray-200 rounded-full text-gray-600'>💵 Budget: {trip?.userSelection?.budget}</h2>
                    <h2 className='p-1 px-4 sm:text-sm md:text-md text-lg bg-gray-200 rounded-full text-gray-600'>🥂 No. of traveller: {trip?.userSelection?.traveller}</h2>
                </div>
            </div>
            <Button><IoIosSend className='m-1'/></Button>
        </div>
    </>
  )
}

export default InfoSection