import React, { useState } from 'react';
import { SportsEvent, User, Role } from '../types';
import { useData } from '../contexts/DataContext';

interface EventDetailModalProps {
  event: SportsEvent;
  currentUser: User;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, currentUser, onClose }) => {
  const { applications, addApplication, updateApplicationStatus, getAthleteById } = useData();
  const [videoUrl, setVideoUrl] = useState('');
  
  const isOrganizer = currentUser.id === event.organizerId;
  
  // For Athletes
  const myApplication = applications.find(app => app.athleteId === currentUser.id && app.eventId === event.id);
  const handleApply = (e: React.FormEvent) => {
      e.preventDefault();
      if (!videoUrl) return;
      addApplication({ eventId: event.id, athleteId: currentUser.id, videoUrl, status: 'Pending' });
      setVideoUrl('');
      // Don't close modal, show application status
  };

  // For Organizer
  const eventApplicants = applications.filter(app => app.eventId === event.id).map(app => {
      const athlete = getAthleteById(app.athleteId);
      return { ...app, athleteName: athlete?.name || 'Unknown' };
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-light-card dark:bg-dark-card w-full max-w-2xl p-6 rounded-lg shadow-lg border border-light-border dark:border-dark-border max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{event.title}</h2>
          <button onClick={onClose} className="text-2xl font-bold text-medium-dark-text dark:text-medium-text hover:text-dark-text dark:hover:text-light-text">&times;</button>
        </div>
        <p className="text-sm text-brand-primary font-semibold">{event.date.toLocaleDateString()} - {event.location}</p>
        <p className="mt-2 mb-6 text-medium-dark-text dark:text-medium-text">{event.description}</p>
        
        <div className="border-t border-light-border dark:border-dark-border pt-4">
          {currentUser.role === Role.ATHLETE && (
            <div>
              <h3 className="font-bold mb-2">My Application</h3>
              {myApplication ? (
                <p>Your application status: <span className={`font-semibold ${
                  myApplication.status === 'Accepted' ? 'text-green-500' :
                  myApplication.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'
                }`}>{myApplication.status}</span></p>
              ) : (
                <form onSubmit={handleApply} className="space-y-2">
                  <input type="text" placeholder="Enter highlight video URL" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full p-2 bg-light-bg dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-md text-dark-text dark:text-light-text" required />
                  <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary">Submit Application</button>
                </form>
              )}
            </div>
          )}

          {isOrganizer && (
            <div>
              <h3 className="font-bold mb-2">Applicants</h3>
              {eventApplicants.length > 0 ? (
                <ul className="space-y-2">
                  {eventApplicants.map(app => (
                    <li key={app.id} className="flex justify-between items-center bg-light-bg dark:bg-gray-800 p-3 rounded">
                      <div>
                        <p className="font-semibold">{app.athleteName}</p>
                        <a href={app.videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-primary hover:underline">View Video</a>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className={`text-sm font-semibold ${
                            app.status === 'Accepted' ? 'text-green-500' :
                            app.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'
                        }`}>{app.status}</span>
                        {app.status === 'Pending' && (
                          <>
                            <button onClick={() => updateApplicationStatus(app.id, 'Accepted')} className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">Accept</button>
                            <button onClick={() => updateApplicationStatus(app.id, 'Rejected')} className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No applications yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
