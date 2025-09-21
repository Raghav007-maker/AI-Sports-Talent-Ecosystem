import React, { useState } from 'react';
import { Role, User, SportsEvent } from '../types';
import { useData } from '../contexts/DataContext';
import CreateEventModal from './CreateEventModal';
import EventDetailModal from './EventDetailModal';

interface EventsViewProps {
  currentUser: User;
}

const EventsView: React.FC<EventsViewProps> = ({ currentUser }) => {
  const { events } = useData();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SportsEvent | null>(null);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upcoming Sports Events</h2>
        {currentUser.role === Role.COACH && (
          <button 
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2 text-sm font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
          >
            Create Event
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {events.map(event => (
          <div 
            key={event.id} 
            className="bg-light-bg dark:bg-gray-800 p-4 rounded-lg border border-light-border dark:border-dark-border cursor-pointer hover:border-brand-primary"
            onClick={() => setSelectedEvent(event)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-dark-text dark:text-light-text">{event.title}</h3>
                <p className="text-sm text-medium-dark-text dark:text-medium-text">{event.location}</p>
              </div>
              <p className="text-sm font-semibold text-brand-primary">{event.date.toLocaleDateString()}</p>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-medium-dark-text dark:text-medium-text">No upcoming events.</p>}
      </div>

      {isCreateOpen && <CreateEventModal organizerId={currentUser.id} onClose={() => setCreateOpen(false)} />}
      {selectedEvent && <EventDetailModal event={selectedEvent} currentUser={currentUser} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
};

export default EventsView;
