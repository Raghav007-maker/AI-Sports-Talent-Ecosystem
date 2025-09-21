export enum Role {
  ATHLETE = 'Athlete',
  COACH = 'Coach',
}

export interface User {
  id: number;
  name: string;
  role: Role;
  email: string;
  password?: string; // Should not be stored in client state long-term
  sport: string;
  age: number;
  location: string;
  avatarUrl: string;
  stats: {
    sprint: string;
    vertical: string;
    endurance: string;
    agility: string;
  };
  streak?: number;
  badges?: string[];
  leaderboardPosition?: number;
  aiScore?: number;
  profileVisibility?: 'Visible' | 'Hidden';
  coachId?: number; // Link athlete to a coach
}


export interface Drill {
  title: string;
  objective: string;
  setup: string;
  instructions: string;
}

export interface AnalysisFeedback {
  techniqueAnalysis: string;
  injuryRisk: string;
  cheatDetection: string;
  injuryDetection: string;
  performanceScore?: number; // Added for the graph
}

export interface CoachFeedback {
  id: string;
  coachId: number;
  coachName: string;
  feedback: string;
  timestamp: Date;
}

export interface AnalysisRecord {
  id: string;
  userId: number; // Link to the athlete
  mediaUrl: string;
  mediaType: 'image' | 'video';
  feedback: AnalysisFeedback;
  timestamp: Date;
  coachFeedback: CoachFeedback[];
  aiScore?: number; // Added to store the score for historical tracking
}

export interface SportsEvent {
  id: string;
  organizerId: number; // Coach who created it
  title: string;
  description: string;
  date: Date;
  location: string;
}

export interface EventApplication {
  id: string;
  eventId: string;
  athleteId: number;
  videoUrl: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  timestamp: Date;
}

export interface ImprovementTip {
  focusArea: string;
  suggestion: string;
  drill: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}