

import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Drill, AnalysisFeedback, User, AnalysisRecord, ImprovementTip } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractFrameFromVideo = (videoFile: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.muted = true;

    video.onloadeddata = () => {
      video.currentTime = 1; // Seek to the 1-second mark
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          return reject(new Error('Canvas to Blob conversion failed'));
        }
        const frameFile = new File([blob], 'frame.jpg', { type: 'image/jpeg' });
        URL.revokeObjectURL(video.src);
        resolve(frameFile);
      }, 'image/jpeg');
    };

    video.onerror = (e) => {
      reject(new Error('Failed to load video'));
    };
  });
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeMedia = async (mediaFile: File, sport: string): Promise<AnalysisFeedback> => {
  try {
    const isVideo = mediaFile.type.startsWith('video/');
    const imageFile = isVideo ? await extractFrameFromVideo(mediaFile) : mediaFile;
    
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `You are a world-class sports performance analyst and sports physiotherapist. Analyze the provided image of a ${sport} athlete.
    1.  **Technique Analysis**: Provide 3 specific strengths and 3 concrete areas for improvement in their form and technique.
    2.  **Injury Risk Assessment**: Based on their posture and form, identify any potential FUTURE injury risks. Be specific about the body part and the reason. If no obvious risks, state that form looks solid.
    3.  **Cheat Detection**: Analyze the movement for any signs of cheating. This includes, but is not limited to: using improper or illegal equipment, not completing the full range of motion for an exercise, manipulating the video (e.g., speeding it up), or faking the drill. Describe any suspicious activities found. If no cheating is detected, state "Authentic effort detected.".
    4.  **Injury Detection**: Analyze the athlete's movement for any visual cues of a CURRENT injury (e.g., limping, favoring a limb, restricted motion). If you see signs of a potential injury, describe what you see. If not, state that "No immediate signs of injury are visible."
    5.  **Performance Score**: Based on all of the above, provide an overall performance score from 0 to 100, where 100 is a perfect, professional-level execution.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, {text: prompt}] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            techniqueAnalysis: { type: Type.STRING, description: 'Markdown formatted analysis of strengths and weaknesses.' },
            injuryRisk: { type: Type.STRING, description: 'Assessment of potential future injury risks.' },
            cheatDetection: { type: Type.STRING, description: 'Analysis for any signs of cheating or disingenuous effort.' },
            injuryDetection: { type: Type.STRING, description: 'Analysis of visual cues for current injuries.' },
            performanceScore: { type: Type.INTEGER, description: 'An overall performance score from 0 to 100.' }
          },
          required: ['techniqueAnalysis', 'injuryRisk', 'cheatDetection', 'injuryDetection', 'performanceScore']
        }
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error analyzing performance:", error);
    return {
        techniqueAnalysis: "Error: Could not analyze performance.",
        injuryRisk: "Error: Could not assess injury risk.",
        cheatDetection: "Error: Could not perform cheat detection.",
        injuryDetection: "Error: Could not perform injury detection.",
        performanceScore: 0
    };
  }
};

export const generateBio = async (achievements: string, sport: string): Promise<string> => {
    try {
        const prompt = `Write a compelling and professional bio for a ${sport} athlete with the following key points: ${achievements}. The bio should be engaging, concise (around 100-150 words), and written in the third person.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating bio:", error);
        return "Error: Could not generate bio. Please try again.";
    }
};

export const comparePlayers = async (player1: string, player2: string): Promise<string> => {
    try {
        const prompt = `Compare the following two athletes and provide a scouting report. Who would be a better fit for a team that values speed and agility? Provide a brief summary of each player's strengths and a final recommendation. \n\nAthlete 1:\n${player1}\n\nAthlete 2:\n${player2}\n\nFormat the response as markdown.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error comparing players:", error);
        return "Error: Could not compare players. Please try again.";
    }
};

export const generateDrills = async (sport: string, skill: string): Promise<Drill[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate 3 creative and effective training drills for a ${sport} team to improve ${skill}.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: {
                                type: Type.STRING,
                                description: 'The catchy name of the drill.'
                            },
                            objective: {
                                type: Type.STRING,
                                description: 'The primary goal of this drill.'
                            },
                            setup: {
                                type: Type.STRING,
                                description: 'Equipment and player positioning required.'
                            },
                            instructions: {
                                type: Type.STRING,
                                description: 'Step-by-step instructions on how to perform the drill.'
                            }
                        },
                        required: ["title", "objective", "setup", "instructions"]
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating drills:", error);
        return [];
    }
};

export const generateImprovementTips = async (athlete: User, history: AnalysisRecord[]): Promise<ImprovementTip[]> => {
    try {
        const historySummary = history.map(h => `- ${h.timestamp.toLocaleDateString()}: ${h.feedback.techniqueAnalysis.replace(/\n/g, ' ')}`).join('\n');
        
        const prompt = `You are an expert ${athlete.sport} coach. Based on the following athlete profile and their recent performance analysis history, generate 3 concrete, actionable improvement tips. For each tip, provide a clear focus area, a specific suggestion, and a sample drill they can perform.

        **Athlete Profile:**
        - Name: ${athlete.name}
        - Sport: ${athlete.sport}
        - Stats: Sprint: ${athlete.stats.sprint}, Vertical: ${athlete.stats.vertical}, Endurance: ${athlete.stats.endurance}, Agility: ${athlete.stats.agility}

        **Recent Performance History:**
        ${historySummary || 'No recent analysis available.'}

        Provide a structured plan to help them improve.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            focusArea: { type: Type.STRING, description: 'The general skill or area to improve (e.g., "Shooting Form", "Explosive Power").' },
                            suggestion: { type: Type.STRING, description: 'A specific, actionable piece of advice for the athlete.' },
                            drill: { type: Type.STRING, description: 'A simple drill the athlete can do to practice the suggestion.' }
                        },
                        required: ['focusArea', 'suggestion', 'drill']
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating improvement tips:", error);
        return [];
    }
};

export const createChat = (athlete: User): Chat => {
    const systemInstruction = `You are a friendly and knowledgeable AI sports assistant. You are talking to ${athlete.name}, a ${athlete.age}-year-old ${athlete.sport} athlete. Their current stats are: Sprint: ${athlete.stats.sprint}, Vertical: ${athlete.stats.vertical}, Endurance: ${athlete.stats.endurance}, Agility: ${athlete.stats.agility}. Be supportive and provide safe, helpful advice related to sports training, nutrition, and mindset. Do not give medical advice.`;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return chat;
};