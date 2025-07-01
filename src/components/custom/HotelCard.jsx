import { GetPlaceDetails, PHOTO_REF_URL } from '@/config/globalAPI';
import React, { useEffect, useState } from 'react'
import { FaLocationDot, FaStar } from "react-icons/fa6";

const HotelCard = ({hotel, index}) => {
    const [photo, setPhoto] = useState()
    
    useEffect(() => {
        if (hotel) {
            getPlacePhoto();
        }
    }, [hotel])

    const getPlacePhoto = async () =>{
        const query = hotel?.name
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
        <a
            key={index}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name)}`}
            target="_blank"
            className="block rounded-xl overflow-hidden shadow-sm hover:shadow-lg transform transition-all hover:scale-105 border border-gray-200"
        >
            <img
              src={photo}
              alt={hotel.name}
              className="w-full h-40 object-cover"
            />

            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">{hotel.name}</h2>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <FaLocationDot className="text-red-500" /> {hotel.address}
              </p>

              <div className="flex items-center justify-between text-sm pt-2">
                <span className="font-medium text-primary">
                  💵 {hotel.price} <span className="text-gray-500">/ night</span>
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                  {hotel.rating} <FaStar />
                </span>
              </div>
            </div>
          </a>
    </>
  )
}

export default HotelCard