import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Shuffle, AlertCircle, Volume2, Mic, Check, RotateCcw, Award } from 'lucide-react';
import { PRESSURE_QUESTIONS } from '../data';

interface PressureSpeakingSimProps {
  onSavedPressureGoal: () => void;
}

export default function PressureSpeakingSim({
  onSavedPressureGoal
}: PressureSpeakingSimProps) {
  const [question, setQuestion] = useState<{ english: string; uzbek: string }>(PRESSURE_QUESTIONS[0]);
  const [phase, setPhase] = useState<'idle' | 'countdown' | 'speaking' | 'review'>('idle');
  const [countdown, setCountdown] = useState<number>(3);
  const [timer, setTimer] = useState<number>(60);
  
  // Media Recorder references
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [micState, setMicState] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [selfNotes, setSelfNotes] = useState<string>('');
  const [completedRuns, setCompletedRuns] = useState<{question: string, date: string, audioUrl: string}[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load completed runs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('fluency_flow_pressure_runs');
    if (saved) {
      setCompletedRuns(JSON.parse(saved));
    }
  }, []);

  // Handle 3 second rapid countdown
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | null = null;
    if (phase === 'countdown') {
      setCountdown(3);
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval!);
            setPhase('speaking');
            setTimer(60);
            startVoiceRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [phase]);

  // Handle 60 second speaking timer
  useEffect(() => {
    if (phase === 'speaking') {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            handleStopSpeaking();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [phase]);

  const handleShuffle = () => {
    const currentIndex = PRESSURE_QUESTIONS.findIndex(q => q.english === question.english);
    let nextIndex = currentIndex;
    while (nextIndex === currentIndex) {
      nextIndex = Math.floor(Math.random() * PRESSURE_QUESTIONS.length);
    }
    setQuestion(PRESSURE_QUESTIONS[nextIndex]);
    setPhase('idle');
    setAudioBlob(null);
    setAudioUrl('');
  };

  const startVoiceRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicState('granted');
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setIsRecording(false);
        setPhase('review');
        
        // Stop all tracks in stream to release microphone icon
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn("Microphone access failed/denied:", err);
      setMicState('denied');
      // If mic fails, we still allow continuous speaking simulator without saving actual audio
      setIsRecording(false);
    }
  };

  const handleStopSpeaking = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      setPhase('review');
    }
  };

  const startPressureChallenge = () => {
    setAudioBlob(null);
    setAudioUrl('');
    setSelfNotes('');
    setPhase('countdown');
  };

  const saveChallengeRun = () => {
    const newRun = {
      question: question.english,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      audioUrl: audioUrl || ''
    };
    
    const updated = [newRun, ...completedRuns].slice(0, 5); // Keep last 5 runs
    setCompletedRuns(updated);
    localStorage.setItem('fluency_flow_pressure_runs', JSON.stringify(updated));
    onSavedPressureGoal();
    setPhase('idle');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Active Pressure Cockpit */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[420px]">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-50">
            <div>
              <span className="text-[10px] font-mono tracking-widest font-bold text-red-500 uppercase flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 animate-pulse" /> Speaking Under Pressure (3s Limit)
              </span>
              <h3 className="font-bold text-gray-900 tracking-tight text-sm font-sans mt-0.5">
                No hesitations allowed. Speed of response is key.
              </h3>
            </div>
            
            <button
              onClick={handleShuffle}
              disabled={phase === 'countdown' || phase === 'speaking'}
              className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center gap-1 text-xs font-bold border border-gray-100"
            >
              <Shuffle className="w-4 h-4" /> Randomize Question
            </button>
          </div>

          {/* Prompt Display Area */}
          <div className="py-8 text-center flex flex-col items-center justify-center flex-1">
            <span className="text-[11px] uppercase font-mono tracking-widest text-gray-400 font-bold mb-3 block">
              CHALLENGING DISCUSSION TOPIC:
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-indigo-950 font-sans tracking-tight max-w-lg leading-relaxed select-text">
              "{question.english}"
            </h2>
            <p className="text-sm text-gray-500 font-sans mt-2.5 font-medium leading-relaxed max-w-md select-text">
              Tarjimasi: "{question.uzbek}"
            </p>
          </div>

          {/* Interactive State Panels */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center justify-center min-h-[160px]">
            {phase === 'idle' && (
              <div className="text-center space-y-3">
                <p className="text-xs text-gray-600">
                  Click 'Start' below. You will have exactly <strong className="text-red-500 font-bold">3 seconds</strong> before speech timer and microphone recording automatically activate!
                </p>
                <button
                  onClick={startPressureChallenge}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 mx-auto"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Pressure Challenge
                </button>
              </div>
            )}

            {phase === 'countdown' && (
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest animate-pulse">
                  PREPARE YOUR VOICE IMMEDIATELY:
                </span>
                <div className="text-6xl font-black text-red-600 font-sans animate-bounce">
                  {countdown}
                </div>
                <p className="text-[10px] text-gray-500 italic">No thinking. Just start vocalizing on 0!</p>
              </div>
            )}

            {phase === 'speaking' && (
              <div className="text-center space-y-4 w-full">
                <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest animate-ping block">
                  ● SPEAK NOW (NO STOPPING)
                </span>
                
                <div className="text-5xl font-extrabold font-mono text-gray-900 tracking-wider">
                  0:{(timer < 10 ? '0' : '') + timer}
                </div>

                <div className="flex gap-2 justify-center items-center">
                  <button
                    onClick={handleStopSpeaking}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition flex items-center gap-1.5"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" /> Stop Recording & Complete
                  </button>
                </div>

                {micState === 'denied' && (
                  <p className="text-[10px] text-amber-600 flex items-center justify-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3" /> Mic permission denied or block context. Keep speaking locally!
                  </p>
                )}
              </div>
            )}

            {phase === 'review' && (
              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center bg-green-50 p-3 rounded-xl border border-green-200">
                  <span className="text-xs font-bold text-green-800 flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-700 bg-white rounded-full p-0.5" /> Speak challenge completed!
                  </span>
                  <span className="text-[10px] bg-green-150 text-green-700 font-mono px-2 py-0.5 rounded">60s speaking</span>
                </div>

                {audioUrl ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-gray-400 block uppercase">
                      LISTEN BACK TO YOUR AUDIO:
                    </label>
                    <audio src={audioUrl} controls className="w-full h-10" />
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-500 font-mono italic">
                    Audio capture not saved because mic was denied. Local speaking finished!
                  </p>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gray-400 block uppercase">
                    SELF CORRECTION NOTES (DID YOU PAUSE OR STUTTER?):
                  </label>
                  <input
                    type="text"
                    value={selfNotes}
                    onChange={(e) => setSelfNotes(e.target.value)}
                    placeholder="e.g., 'Got stuck on word phone, repeated basically 3 times...'"
                    className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => { setPhase('idle'); setAudioBlob(null); setAudioUrl(''); }}
                    className="text-xs font-bold text-gray-600 hover:text-gray-800 px-3 py-2 transition"
                  >
                    Retry
                  </button>
                  <button
                    onClick={saveChallengeRun}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    Save Activity & Complete Drill
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advice and Runs Column */}
      <div className="lg:col-span-5 space-y-6">
        {/* Advice Panel */}
        <div className="bg-red-50/50 border border-red-100 p-5 rounded-3xl space-y-3">
          <h4 className="text-xs font-bold text-red-900 uppercase tracking-widest font-mono flex items-center gap-1">
            <Award className="w-4 h-4" /> Pressure Rules (Qoidalar)
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-700 leading-relaxed list-decimal pl-4.5">
            <li>
              <strong>3-soniyadan oshmang:</strong> Savol tushishi bilan 3 soniya ichida birinchi gapni boshlashingiz shart.
            </li>
            <li>
              <strong>To'xtash taqiqlanadi:</strong> Fikr kelmay qolsa ham to'xtamang. Noto'g'ri grammatika bering! Flowing English &gt; Perfect English.
            </li>
            <li>
              <strong>Oynada o'ylab qolmang:</strong> Miya tezligini retrieval blocklardan xalos qilishning siri mana shu drilldir.
            </li>
          </ul>
        </div>

        {/* History of Completed Pressure Drills */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 space-y-3 shadow-sm">
          <h4 className="font-bold text-gray-900 tracking-tight font-sans text-sm flex items-center gap-1.5">
            Amalga oshirilgan urinishlar (Past Runs)
          </h4>

          {completedRuns.length > 0 ? (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {completedRuns.map((run, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-120 text-xs text-gray-700">
                  <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                    <span>{run.date}</span>
                    <span className="text-green-600 font-bold uppercase">Success</span>
                  </div>
                  <p className="font-semibold line-clamp-1">"{run.question}"</p>
                  {run.audioUrl && (
                    <audio src={run.audioUrl} controls className="w-full h-8 mt-2" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-gray-400">
              Hozircha hech qanday urinish amalga oshirilmagan. Tayyormisiz? Start bosing!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
