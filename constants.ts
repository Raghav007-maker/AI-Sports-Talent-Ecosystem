import { User, Role, AnalysisRecord, SportsEvent, EventApplication } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: Role.ATHLETE,
    email: 'athlete@test.com',
    password: 'password',
    sport: 'Basketball',
    age: 22,
    location: 'Mumbai, MH',
    avatarUrl: 'https://picsum.photos/seed/priya/200',
    stats: { sprint: '4.8s', vertical: '32 in', endurance: '9/10', agility: '9/10' },
    streak: 7,
    badges: ['5-Day Streak', 'Top Performer', 'Video Analyst'],
    leaderboardPosition: 1,
    aiScore: 95,
    profileVisibility: 'Visible',
    coachId: 5, // Coached by Coach Kumar
  },
  {
    id: 2,
    name: 'Rohan Gupta',
    role: Role.ATHLETE,
    email: 'rohan@test.com',
    password: 'password',
    sport: 'Soccer',
    age: 20,
    location: 'Delhi, DL',
    avatarUrl: 'https://picsum.photos/seed/rohan/200',
    stats: { sprint: '4.5s', vertical: '30 in', endurance: '10/10', agility: '8/10' },
    streak: 3,
    badges: ['First Analysis'],
    leaderboardPosition: 3,
    aiScore: 88,
    profileVisibility: 'Visible',
    coachId: 5, // Coached by Coach Kumar
  },
  {
    id: 3,
    name: 'Ananya Singh',
    role: Role.ATHLETE,
    email: 'ananya@test.com',
    password: 'password',
    sport: 'Track & Field',
    age: 19,
    location: 'Bengaluru, KA',
    avatarUrl: 'https://picsum.photos/seed/ananya/200',
    stats: { sprint: '10.9s (100m)', vertical: '28 in', endurance: '8/10', agility: '9/10' },
    streak: 5,
    badges: ['5-Day Streak'],
    leaderboardPosition: 4,
    aiScore: 85,
    profileVisibility: 'Hidden',
    coachId: 5, // Coached by Coach Kumar
  },
    {
    id: 4,
    name: 'Arjun Patel',
    role: Role.ATHLETE,
    email: 'arjun@test.com',
    password: 'password',
    sport: 'Football',
    age: 21,
    location: 'Ahmedabad, GJ',
    avatarUrl: 'https://picsum.photos/seed/arjun/200',
    stats: { sprint: '4.4s', vertical: '38 in', endurance: '7/10', agility: '10/10' },
    streak: 10,
    badges: ['10-Day Streak', 'Consistency King'],
    leaderboardPosition: 2,
    aiScore: 92,
    profileVisibility: 'Visible',
    // No coachId, unassigned
  },
  {
    id: 5,
    name: 'Coach Kumar',
    role: Role.COACH,
    email: 'coach@test.com',
    password: 'password',
    sport: 'Multi-Sport',
    age: 45,
    location: 'Chennai, TN',
    avatarUrl: 'https://picsum.photos/seed/coachkumar/200',
    stats: { sprint: 'N/A', vertical: 'N/A', endurance: 'N/A', agility: 'N/A' },
  },
];

export const MOCK_ANALYSIS_RECORDS: AnalysisRecord[] = [
  {
    id: 'analysis-1',
    userId: 1, // Priya Sharma
    mediaUrl: 'https://dummy-video-url.com/video1.mp4',
    mediaType: 'video',
    timestamp: new Date(Date.now() - 86400000 * 21), // 3 weeks ago
    aiScore: 82,
    feedback: {
      techniqueAnalysis: 'Initial form shows promise, but elbow is flaring out.',
      injuryRisk: 'Moderate risk due to inconsistent landing.',
      cheatDetection: 'Authentic effort detected.',
      injuryDetection: 'No immediate signs of injury are visible.'
    },
    coachFeedback: []
  },
   {
    id: 'analysis-1.5',
    userId: 1, // Priya Sharma
    mediaUrl: 'https://dummy-video-url.com/video1.5.mp4',
    mediaType: 'video',
    timestamp: new Date(Date.now() - 86400000 * 14), // 2 weeks ago
    aiScore: 88,
    feedback: {
      techniqueAnalysis: 'Improvement in elbow positioning. Follow-through is getting better.',
      injuryRisk: 'Risk is lessening, but still focus on soft landings.',
      cheatDetection: 'Authentic effort detected.',
      injuryDetection: 'No immediate signs of injury are visible.'
    },
    coachFeedback: []
  },
  {
    id: 'analysis-2',
    userId: 1, // Priya Sharma
    mediaUrl: 'https://dummy-video-url.com/video2.mp4',
    mediaType: 'video',
    timestamp: new Date(Date.now() - 86400000 * 7), // 1 week ago
    aiScore: 91,
    feedback: {
      techniqueAnalysis: 'Strengths: Excellent follow-through on shots.\nImprovements: Keep elbow tucked in more consistently.',
      injuryRisk: 'Moderate risk of ankle sprain due to landing mechanics. Recommend stabilization exercises.',
      cheatDetection: 'Authentic effort detected.',
      injuryDetection: 'Athlete appears to be slightly favoring their left leg upon landing. Monitor for potential calf strain.'
    },
    coachFeedback: [
      {
        id: 'fb-1',
        coachId: 5,
        coachName: 'Coach Kumar',
        feedback: 'Great work, Priya! Let\'s focus on that elbow positioning in our next session.',
        timestamp: new Date(Date.now() - 86400000 * 6)
      }
    ]
  },
  {
    id: 'analysis-3',
    userId: 2, // Rohan Gupta
    mediaUrl: 'https://dummy-image-url.com/image1.jpg',
    mediaType: 'image',
    timestamp: new Date(Date.now() - 86400000 * 5), // 5 days ago
    aiScore: 88,
    feedback: {
      techniqueAnalysis: 'Strengths: Good body positioning when striking the ball.\nImprovements: Work on non-kicking foot placement for better balance.',
      injuryRisk: 'Form looks solid. Low immediate injury risk.',
      cheatDetection: 'Authentic effort detected.',
      injuryDetection: 'No immediate signs of injury are visible.'
    },
    coachFeedback: []
  },
   {
    id: 'analysis-4',
    userId: 1, // Priya Sharma
    mediaUrl: 'https://dummy-video-url.com/video3.mp4',
    mediaType: 'video',
    timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
    aiScore: 95,
    feedback: {
      techniqueAnalysis: 'Elbow is consistently tucked now. Shot form is powerful and accurate.',
      injuryRisk: 'Landing mechanics have improved significantly. Low risk.',
      cheatDetection: 'Authentic effort detected.',
      injuryDetection: 'No favoring of legs detected. Movement appears fluid.'
    },
    coachFeedback: [
       {
        id: 'fb-2',
        coachId: 5,
        coachName: 'Coach Kumar',
        feedback: 'This is exactly what we were working towards. Fantastic improvement!',
        timestamp: new Date(Date.now() - 86400000)
      }
    ]
  },
];

export const MOCK_EVENTS: SportsEvent[] = [
    {
        id: 'event-1',
        organizerId: 5, // Coach Kumar
        title: 'National Pro Football Scouting Combine',
        description: 'The premier national combine for elite football talent. Drills will test speed, agility, and on-field decision making. Top performers will be scouted by professional league teams.',
        date: new Date(Date.now() + 86400000 * 14), // 2 weeks from now
        location: 'Kolkata, WB'
    },
    {
        id: 'event-2',
        organizerId: 5, // Coach Kumar
        title: 'Indian National Youth Athletics Championship',
        description: 'The official national championship for track and field athletes under 22. Events include 100m sprint, long jump, and more. A crucial opportunity to be seen by national team selectors.',
        date: new Date(Date.now() + 86400000 * 30), // 1 month from now
        location: 'Pune, MH'
    }
];

export const MOCK_EVENT_APPLICATIONS: EventApplication[] = [
    {
        id: 'app-1',
        eventId: 'event-1',
        athleteId: 2, // Rohan Gupta
        videoUrl: 'https://dummy-video-url.com/rohan-highlight.mp4',
        status: 'Pending',
        timestamp: new Date(Date.now() - 86400000) // 1 day ago
    },
     {
        id: 'app-2',
        eventId: 'event-1',
        athleteId: 4, // Arjun Patel
        videoUrl: 'https://dummy-video-url.com/arjun-highlight.mp4',
        status: 'Accepted',
        timestamp: new Date(Date.now() - 86400000 * 2) // 2 days ago
    }
];