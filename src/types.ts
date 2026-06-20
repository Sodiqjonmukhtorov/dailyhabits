export interface VocabWord {
  english: string;
  uzbek: string;
}

export interface DayPhrase {
  english: string;
  uzbek: string;
}

export interface DayData {
  dayNumber: number;
  theme: string;
  words: VocabWord[];
  phrases: DayPhrase[];
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  duration?: string;
  description: string;
  instructions: string[];
  tips?: string[];
  type: 'routine' | 'brain_activation' | 'shadowing' | 'pattern' | 'speaking_topic' | 'vocab_upgrade' | 'expansion' | 'pressure' | 'listening' | 'mirror' | 'recording';
}

export interface SpeechPattern {
  id: string;
  phrase: string;
  uzbek: string;
  category: 'Opinion' | 'Adding' | 'Reason' | 'Comparing' | 'Uncertainty' | 'Example' | 'Ending';
  example: string;
  uzbekExample: string;
}

export interface RecordedAudio {
  id: string;
  timestamp: string;
  topic: string;
  duration: number; // in seconds
  analysis?: {
    stuckPoints: number;
    notes: string;
  };
  audioUrl: string;
}

export interface DailyProgress {
  completedScheduleItems: string[]; // List of ScheduleItem IDs completed for the current day
  completedWords: string[]; // List of English vocabulary words checked off
  completedPatterns: string[]; // List of Pattern IDs checked off
  sentenceExpansionsCount: number;
  pressureAnswersCount: number;
}

export type ActiveTab = 'schedule' | 'vocabulary' | 'patterns' | 'expansion' | 'pressure' | 'recorder' | 'drills';
