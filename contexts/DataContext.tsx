import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AnalysisRecord, SportsEvent, EventApplication, CoachFeedback, User } from '../types';
import { MOCK_ANALYSIS_RECORDS, MOCK_EVENTS, MOCK_EVENT_APPLICATIONS, MOCK_USERS } from '../constants';

interface DataContextType {
  analysisRecords: AnalysisRecord[];
  addAnalysisRecord: (record: Omit<AnalysisRecord, 'id' | 'timestamp' | 'coachFeedback' | 'userId'>, userId: number) => void;
  addCoachFeedback: (analysisId: string, feedback: Omit<CoachFeedback, 'id' | 'timestamp'>) => void;
  getAthleteById: (id: number) => User | undefined;
  
  events: SportsEvent[];
  addEvent: (event: Omit<SportsEvent, 'id'>) => void;
  
  applications: EventApplication[];
  addApplication: (application: Omit<EventApplication, 'id' | 'timestamp'>) => void;
  updateApplicationStatus: (appId: string, status: 'Accepted' | 'Rejected') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analysisRecords, setAnalysisRecords] = useState<AnalysisRecord[]>(MOCK_ANALYSIS_RECORDS);
  const [events, setEvents] = useState<SportsEvent[]>(MOCK_EVENTS);
  const [applications, setApplications] = useState<EventApplication[]>(MOCK_EVENT_APPLICATIONS);

  const getAthleteById = (id: number) => MOCK_USERS.find(user => user.id === id);

  const addAnalysisRecord = (record: Omit<AnalysisRecord, 'id' | 'timestamp' | 'coachFeedback'| 'userId'>, userId: number) => {
    const newRecord: AnalysisRecord = {
      ...record,
      id: `analysis-${Date.now()}`,
      userId: userId,
      timestamp: new Date(),
      coachFeedback: [],
      aiScore: record.aiScore,
    };
    setAnalysisRecords(prev => [newRecord, ...prev]);
  };

  const addCoachFeedback = (analysisId: string, feedback: Omit<CoachFeedback, 'id' | 'timestamp'>) => {
    const newFeedback: CoachFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      timestamp: new Date(),
    };
    setAnalysisRecords(prev => 
      prev.map(record => 
        record.id === analysisId 
          ? { ...record, coachFeedback: [...record.coachFeedback, newFeedback] }
          : record
      )
    );
  };
  
  const addEvent = (event: Omit<SportsEvent, 'id'>) => {
    const newEvent: SportsEvent = {
        ...event,
        id: `event-${Date.now()}`
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const addApplication = (application: Omit<EventApplication, 'id' | 'timestamp'>) => {
    const newApplication: EventApplication = {
        ...application,
        id: `app-${Date.now()}`,
        timestamp: new Date(),
    };
    setApplications(prev => [...prev, newApplication]);
  };

  const updateApplicationStatus = (appId: string, status: 'Accepted' | 'Rejected') => {
    setApplications(prev => prev.map(app => app.id === appId ? { ...app, status } : app));
  };


  return (
    <DataContext.Provider value={{ 
        analysisRecords, addAnalysisRecord, addCoachFeedback, getAthleteById,
        events, addEvent,
        applications, addApplication, updateApplicationStatus
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};