import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  BookOpen, 
  Compass, 
  Cpu, 
  Volume2, 
  Award, 
  Clock, 
  HelpCircle, 
  Sliders, 
  Activity, 
  VolumeX, 
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Smile,
  Mic,
  Flame
} from 'lucide-react';
import { DAYS_DATA, SCHEDULE_TEMPLATES, FILLER_PHRASES_DATA } from './data';
import { ActiveTab, DailyProgress } from './types';

// Component Imports
import DailyRoutineTracker from './components/DailyRoutineTracker';
import VocabularyTrainer from './components/VocabularyTrainer';
import PatternReviewer from './components/PatternReviewer';
import SentenceExpansionWidget from './components/SentenceExpansionWidget';
import PressureSpeakingSim from './components/PressureSpeakingSim';
import VoiceRecorderWidget from './components/VoiceRecorderWidget';
import SpecialFluencyDrills from './components/SpecialFluencyDrills';

export default function App() {
  // 1. Core State
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const saved = localStorage.getItem('fluency_flow_selected_day');
    return saved ? parseInt(saved) : 1;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('schedule');

  // Complete data states for multiple days
  const [progress, setProgress] = useState<Record<number, DailyProgress>>(() => {
    const saved = localStorage.getItem('fluency_flow_progress_v2');
    if (saved) return JSON.parse(saved);
    
    // Initial empty template for all 7 days
    const initial: Record<number, DailyProgress> = {};
    for (let i = 1; i <= 7; i++) {
      initial[i] = {
        completedScheduleItems: [],
        completedWords: [],
        completedPatterns: [],
        sentenceExpansionsCount: 0,
        pressureAnswersCount: 0
      };
    }
    return initial;
  });

  // Toggle for the Filler Phrases Sidebar / Modal
  const [showFillers, setShowFillers] = useState<boolean>(false);

  // Save states on change
  useEffect(() => {
    localStorage.setItem('fluency_flow_selected_day', selectedDay.toString());
  }, [selectedDay]);

  useEffect(() => {
    localStorage.setItem('fluency_flow_progress_v2', JSON.stringify(progress));
  }, [progress]);

  // Read current active day's data & progress
  const dayProgress = progress[selectedDay] || {
    completedScheduleItems: [],
    completedWords: [],
    completedPatterns: [],
    sentenceExpansionsCount: 0,
    pressureAnswersCount: 0
  };

  const dayData = DAYS_DATA[selectedDay - 1] || DAYS_DATA[0];

  // 2. Action Toggles
  const handleToggleScheduleItem = (id: string) => {
    setProgress((prev) => {
      const dayProg = prev[selectedDay] ? { ...prev[selectedDay] } : {
        completedScheduleItems: [], completedWords: [], completedPatterns: [], sentenceExpansionsCount: 0, pressureAnswersCount: 0
      };
      
      const current = dayProg.completedScheduleItems;
      const isCompleted = current.includes(id);
      
      const updated = isCompleted 
        ? current.filter(x => x !== id) 
        : [...current, id];
        
      return {
        ...prev,
        [selectedDay]: {
          ...dayProg,
          completedScheduleItems: updated
        }
      };
    });
  };

  const handleToggleWord = (english: string) => {
    setProgress((prev) => {
      const dayProg = prev[selectedDay] ? { ...prev[selectedDay] } : {
        completedScheduleItems: [], completedWords: [], completedPatterns: [], sentenceExpansionsCount: 0, pressureAnswersCount: 0
      };
      
      const current = dayProg.completedWords;
      const isCompleted = current.includes(english);
      
      const updated = isCompleted 
        ? current.filter(x => x !== english) 
        : [...current, english];
        
      return {
        ...prev,
        [selectedDay]: {
          ...dayProg,
          completedWords: updated
        }
      };
    });
  };

  const handleTogglePattern = (id: string) => {
    setProgress((prev) => {
      const dayProg = prev[selectedDay] ? { ...prev[selectedDay] } : {
        completedScheduleItems: [], completedWords: [], completedPatterns: [], sentenceExpansionsCount: 0, pressureAnswersCount: 0
      };
      
      const current = dayProg.completedPatterns;
      const isCompleted = current.includes(id);
      
      const updated = isCompleted 
        ? current.filter(x => x !== id) 
        : [...current, id];
        
      return {
        ...prev,
        [selectedDay]: {
          ...dayProg,
          completedPatterns: updated
        }
      };
    });
  };

  const incrementExpansionCount = () => {
    setProgress((prev) => ({
      ...prev,
      [selectedDay]: {
        ...(prev[selectedDay] || { completedScheduleItems: [], completedWords: [], completedPatterns: [], sentenceExpansionsCount: 0, pressureAnswersCount: 0 }),
        sentenceExpansionsCount: (prev[selectedDay]?.sentenceExpansionsCount || 0) + 1
      }
    }));
  };

  const incrementPressureCount = () => {
    setProgress((prev) => ({
      ...prev,
      [selectedDay]: {
        ...(prev[selectedDay] || { completedScheduleItems: [], completedWords: [], completedPatterns: [], sentenceExpansionsCount: 0, pressureAnswersCount: 0 }),
        pressureAnswersCount: (prev[selectedDay]?.pressureAnswersCount || 0) + 1
      }
    }));
  };

  const handleResetAllProgress = () => {
    if (confirm("Haqiqatan ham barcha 7 kunlik o'quv tarixingizni tozalashni xohlaysizmi?")) {
      const reseted: Record<number, DailyProgress> = {};
      for (let i = 1; i <= 7; i++) {
        reseted[i] = {
          completedScheduleItems: [],
          completedWords: [],
          completedPatterns: [],
          sentenceExpansionsCount: 0,
          pressureAnswersCount: 0
        };
      }
      setProgress(reseted);
      setSelectedDay(1);
      setActiveTab('schedule');
    }
  };

  const handlePronouncePhrase = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 3. Stats Calculation
  const getOverallProgressPercentage = () => {
    const totalItems = SCHEDULE_TEMPLATES.length;
    if (totalItems === 0) return 0;
    const completedCount = dayProgress.completedScheduleItems.length;
    return Math.round((completedCount / totalItems) * 100);
  };

  const getTotalCompletedTasksAcrossAllDays = () => {
    return Object.values(progress).reduce((acc: number, curr: DailyProgress) => acc + (curr.completedScheduleItems?.length || 0), 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. Dashboard Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm" id="main-app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo & Description */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-900 flex items-center justify-center shadow-md shadow-indigo-200 text-white">
              <Award className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-gray-900 font-sans">
                7-Day English Speaking Daily Trainer
              </h1>
              <p className="text-xs text-gray-500 font-mono">
                Fluency Flow • Real-Time Vocal Retrieval Practice
              </p>
            </div>
          </div>

          {/* Quick Global Progress Tracker */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">GLOBAL STATS</span>
              <span className="text-xs font-semibold text-gray-700 bg-indigo-50 border border-indigo-150 rounded-full px-3 py-1 mt-0.5 inline-block">
                {getTotalCompletedTasksAcrossAllDays()} Drills Done Across 7 Days
              </span>
            </div>

            {/* Filler Phrases trigger */}
            <button
              id="btn-filler-phrases-trigger"
              onClick={() => setShowFillers(!showFillers)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Smile className="w-4 h-4" /> 20 Filler Phrases
            </button>
          </div>
        </div>
      </header>

      {/* 2. Primary Layout Grid */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="main-app-content">
        
        {/* Day Selectors Slider & Stats Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Day Navigation Column (1 to 7) */}
          <div className="lg:col-span-8 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4" id="card-day-selectors">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-extrabold text-gray-900 tracking-tight text-base font-sans">
                  O'quv kunini tanlang (Select Training Day)
                </h2>
                <p className="text-xs text-gray-500">
                  Select a day to target specific daily vocabulary, themes, and discussions.
                </p>
              </div>
              <button
                id="btn-progress-reset"
                onClick={handleResetAllProgress}
                className="text-xs font-mono text-red-500 hover:text-red-700 hover:underline flex items-center gap-1"
                title="Reset all schedule completions"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset History
              </button>
            </div>

            {/* 7 Days Grid buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {DAYS_DATA.map((day) => {
                const isSelected = selectedDay === day.dayNumber;
                const completedCount = progress[day.dayNumber]?.completedScheduleItems.length || 0;
                
                return (
                  <button
                    key={day.dayNumber}
                    id={`btn-select-day-${day.dayNumber}`}
                    onClick={() => {
                      setSelectedDay(day.dayNumber);
                      setActiveTab('schedule'); // reset to schedule view on day switch
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 outline-none ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-500' 
                        : 'border-gray-150 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`}>
                      KUN {day.dayNumber}
                    </span>
                    <span className="text-xs font-extrabold text-gray-900 tracking-tight mt-1 truncate">
                      {day.theme.split('/')[0]}
                    </span>
                    
                    {/* Tiny stats progress indicator */}
                    <div className="mt-2.5 flex justify-between items-center text-[9px] font-semibold text-gray-500">
                      <span>Prog:</span>
                      <span className="font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded">
                        {completedCount}/15
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Productivity Stats Tracker */}
          <div className="lg:col-span-4 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden" id="card-day-stats">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Activity className="w-48 h-48 text-white scale-150" />
            </div>

            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-widest font-mono text-indigo-300">
                  Bugungi Unumdorlik
                </span>
                <Clock className="w-4 h-4 text-indigo-300" />
              </div>
              <h3 className="text-3xl font-black font-sans tracking-tight mt-1.5">
                {getOverallProgressPercentage()}%
              </h3>
              <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                Kun {selectedDay} dagi 15 ta o'quv amaliyotlaridan {dayProgress.completedScheduleItems.length} tasi yakunlandi.
              </p>
            </div>

            {/* Visual dynamic level slider */}
            <div className="mt-6 space-y-2">
              <div className="w-full bg-indigo-950/80 rounded-full h-2 overflow-hidden border border-indigo-800">
                <div 
                  className="bg-indigo-400 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${getOverallProgressPercentage()}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-indigo-300">
                <span>0% Focus</span>
                <span className="font-bold">Goal: 100% Flow</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Interactive Main Navigation Toggles */}
        <div className="flex bg-white p-1 rounded-2xl border border-gray-200 overflow-x-auto shadow-sm" id="navigation-tabs">
          {[
            { id: 'schedule', label: '15-Step Kunlik Jadval', icon: Calendar },
            { id: 'drills', label: '🔥 Special Fluency Drills', icon: Flame },
            { id: 'vocabulary', label: 'Day Vocabulary Upgrade', icon: BookOpen },
            { id: 'patterns', label: 'Pattern Training', icon: Sliders },
            { id: 'expansion', label: 'Sentence Expansion', icon: Compass },
            { id: 'pressure', label: 'Speaking Under Pressure', icon: Cpu },
            { id: 'recorder', label: 'Voice Record Audit', icon: Mic }
          ].map((t) => {
            const Icon = t.id === 'drills' ? Sparkles : t.icon; // Flame / Sparkles or dynamic Icon
            const isTabActive = activeTab === t.id;
            
            return (
              <button
                key={t.id}
                id={`tab-selector-${t.id}`}
                onClick={() => setActiveTab(t.id as ActiveTab)}
                className={`flex-1 text-xs font-bold py-3 px-4.5 rounded-xl transition flex items-center justify-center gap-2 outline-none flex-shrink-0 ${
                  isTabActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* 4. Active Tab Content Areas */}
        <div className="min-h-[450px]" id="tab-viewport-container">
          {activeTab === 'schedule' && (
            <div className="animate-fade-in animate-duration-300">
              <DailyRoutineTracker
                completedItems={dayProgress.completedScheduleItems}
                onToggleItem={handleToggleScheduleItem}
                selectedDay={selectedDay}
                dayTheme={dayData.theme}
              />
            </div>
          )}

          {activeTab === 'vocabulary' && (
            <div className="animate-fade-in animate-duration-300">
              <VocabularyTrainer
                dayData={dayData}
                completedWords={dayProgress.completedWords}
                onToggleWord={handleToggleWord}
              />
            </div>
          )}

          {activeTab === 'patterns' && (
            <div className="animate-fade-in animate-duration-300">
              <PatternReviewer
                completedPatterns={dayProgress.completedPatterns}
                onTogglePattern={handleTogglePattern}
              />
            </div>
          )}

          {activeTab === 'expansion' && (
            <div className="animate-fade-in animate-duration-300">
              <SentenceExpansionWidget
                onSavedCountChange={incrementExpansionCount}
              />
            </div>
          )}

          {activeTab === 'pressure' && (
            <div className="animate-fade-in animate-duration-300">
              <PressureSpeakingSim
                onSavedPressureGoal={incrementPressureCount}
              />
            </div>
          )}

          {activeTab === 'recorder' && (
            <div className="animate-fade-in animate-duration-300">
              <VoiceRecorderWidget
                onSavedRecordGoal={() => {
                  // Complete the "Voice record" scheduler item automatically (id: "sch-14")
                  if (!dayProgress.completedScheduleItems.includes('sch-14')) {
                    handleToggleScheduleItem('sch-14');
                  }
                  alert("Voice records audit targets saved successfully! Drill completed!");
                }}
              />
            </div>
          )}

          {activeTab === 'drills' && (
            <div className="animate-fade-in animate-duration-300">
              <SpecialFluencyDrills />
            </div>
          )}
        </div>
      </main>

      {/* 5. Slider Drawer: 20 BONUS Filler Phrases (Sidebar) */}
      {showFillers && (
        <div className="fixed inset-0 min-h-screen bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end" id="drawer-fillers-backdrop">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between" id="drawer-fillers-panel">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-extrabold text-gray-900 tracking-tight text-sm font-sans flex items-center gap-1.5">
                  <Smile className="w-4.5 h-4.5 text-indigo-600 fill-current" /> 20 BONUS Filler Phrases
                </h3>
                <p className="text-[10px] text-gray-500 font-mono">
                  Bular seni inq-inq bo'lishdan (stuttering) qutqaradi!
                </p>
              </div>
              <button
                onClick={() => setShowFillers(false)}
                className="text-xs font-bold text-gray-400 hover:text-gray-950 bg-gray-150 rounded-lg px-2.5 py-1.5"
              >
                Close
              </button>
            </div>

            {/* List */}
            <div className="p-5 flex-1 overflow-y-auto space-y-3.5">
              <div className="bg-amber-50 p-3.5 border border-amber-150 rounded-2xl text-[11px] text-amber-900 flex items-start gap-2 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Retrieval Sirlari:</strong> Gapirayotganda so'zni eslay olmasangiz, jim qolmasdan darhol ushbu fillerlardan birini ayting! Bu miyaga kerakli so'zni topish uchun uzoq pauzalarsiz qo'shimcha 3 soniya beradi.
                </div>
              </div>

              <div className="space-y-2.5">
                {FILLER_PHRASES_DATA.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handlePronouncePhrase(item.phrase)}
                    className="p-3 bg-gray-50 border border-gray-150 hover:border-indigo-600 rounded-2xl cursor-pointer select-none transition group hover:shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-sm text-indigo-900 flex items-center gap-1">
                        "{item.phrase}" <Volume2 className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 text-indigo-500 transition" />
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold bg-white px-2 py-0.5 rounded border border-gray-100">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="text-xs text-semibold text-gray-700 mt-1">
                      {item.description}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1 italic leading-none">
                      Pacing: {item.usage}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowFillers(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3.5 rounded-xl text-center shadow"
              >
                Tushunarli • Orqaga
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500" id="main-app-footer">
        <p className="font-sans">
          © 2026 7-Day English Speaking Daily Trainer. Built for Sodiqjon • Focus on Continuous Flow.
        </p>
      </footer>

    </div>
  );
}
