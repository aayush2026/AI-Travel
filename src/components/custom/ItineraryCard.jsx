import { GetPlaceDetails, PHOTO_REF_URL } from '@/config/globalAPI';
import React, { useEffect, useState } from 'react'

const ItineraryCard = ({place, item}) => {
    const [photo, setPhoto] = useState()
    
    useEffect(() => {
        if (place) {
            getPlacePhoto();
        }
    }, [place])

    const getPlacePhoto = async () =>{
        const query = place?.placeName
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
            key={`${item.day}-${place.placeName}`}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName)}`}
            target="_blank"
            >
            <div className="flex rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-transform transform hover:scale-105 mb-6 border border-gray-200 bg-white">
                <div className="w-52 h-52 flex-shrink-0 overflow-hidden">
                <img
                    src={photo}
                    alt={place.placeName}
                    className="w-full h-full object-cover"
                />
                </div>
                <div className="p-4 flex flex-col justify-between">
                <h2 className="text-xl font-semibold text-gray-800">{place.placeName}</h2>
                <p className="text-gray-600 text-sm mt-1">{place.description}</p>
                <div className="text-sm text-gray-700 mt-2 space-y-1">
                    <p><strong>Best Time:</strong> {place.bestTimeToVisit}</p>
                    <p><strong>Time to Spend:</strong> {place.timeToSpend}</p>
                    <p><strong>Ticket:</strong> {place.ticketPrice}</p>
                    <p><strong>Rating:</strong> ⭐ {place.rating}</p>
                </div>
                </div>
            </div>
            </a>
    </>
  )
}

export default ItineraryCard