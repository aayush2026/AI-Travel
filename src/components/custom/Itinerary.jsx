import React from 'react'
import ItineraryCard from './ItineraryCard'

const Itinerary = ({trip}) => {
  return (
    <>                
        <h2 className="text-3xl font-bold text-gray-800 my-4 mt-12">Places to visit</h2>
        <div className=''>
            {trip?.tripData?.itinerary?.map((item, index)=>(
                <div key={`day-${item.day}`}>
                    <h2 className='text-xl font-medium bg-gray-200 p-2 px-5 rounded-full mb-4'>Day {item.day}</h2>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 '>
                        {item?.places?.map((place, index)=>(
                            <ItineraryCard key={place.placeName || index} place={place} item={item}/>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </>
  )
}

export default Itinerary