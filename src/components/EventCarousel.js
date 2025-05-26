import React, { useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EventCard from './EventCard';

const EventCarousel = ({ title, events }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = current.offsetWidth;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex gap-1">
          <IconButton onClick={() => scroll('left')} size="small"><ArrowBackIosNewIcon /></IconButton>
          <IconButton onClick={() => scroll('right')} size="small"><ArrowForwardIosIcon /></IconButton>
        </div>
      </div>
      <div className="relative">
        {(!events || events.length === 0) ? (
          <div className="text-center text-gray-500 py-8 w-full">No hay eventos para mostrar</div>
        ) : (
          <div
            ref={scrollRef}
            className="flex overflow-x-auto no-scrollbar gap-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {events.map((event) => (
              <div
                key={event.id}
                className="min-w-[270px] max-w-[270px] flex-shrink-0"
                style={{ height: 370, scrollSnapAlign: 'start' }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCarousel; 