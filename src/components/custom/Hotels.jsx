import React from 'react';
import HotelCard from './HotelCard';

const Hotels = ({ trip }) => {
  const hotels = trip?.tripData?.hotels;

  if (!hotels || hotels.length === 0) {
    return <p className="mt-6 text-gray-600">No hotel recommendations available.</p>;
  }

  return (
    <section className="mt-10">
      <h2 className="text-3xl font-bold text-gray-800 my-4">Hotel Recommendations</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {hotels.map((hotel, index) => (
          <HotelCard key={hotel.name || index} hotel={hotel} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Hotels;
