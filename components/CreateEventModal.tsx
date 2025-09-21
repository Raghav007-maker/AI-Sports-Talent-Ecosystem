import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

interface CreateEventModalProps {
  organizerId: number;
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ organizerId, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const { addEvent } = useData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !date || !location) return;

    addEvent({
      organizerId,
      title,
      description,
      date: new Date(date),
      location,
    });
    onClose();
  };

  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-light-card dark:bg-dark-card w-full max-w-lg p-6 rounded-lg shadow-lg border border-light-border dark:border-dark-border" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 bg-light-bg dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-md text-dark-text dark:text-light-text" required />
          <textarea placeholder="Event Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 h-24 bg-light-bg dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-md text-dark-text dark:text-light-text" required />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 bg-light-bg dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-md text-dark-text dark:text-light-text" required />
          <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} className="w-full p-2 bg-light-bg dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-md text-dark-text dark:text-light-text" required />
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
