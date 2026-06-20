import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, RefreshCw, Check, AlertTriangle, Sparkles, AlertCircle, Headphones } from 'lucide-react';

interface VoiceRecorderWidgetProps {
  onSavedRecordGoal: () => void;
}

export default function VoiceRecorderWidget({
  onSavedRecordGoal
}: VoiceRecorderWidgetProps) {
  const [phase, setPhase] = useState<'idle' | 'recording' | 'review'>('idle');
  const [secondsLeft, setSecondsLeft] = useState<number>(120); // 2 Min limit
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [micPermission, setMicPermission] = useState<'idle' | 'granted' | 'denied'>('idle');

  // Self assessment checkboxes
  const [checks, setChecks] = useState({
    stuckPoints: false,
    longPauses: false,
    wordRepeated: false,
    listenedToFinish: false,
    emotionNormal: false
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRunning && secondsLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            clearInterval(timerIntervalRef.current!);
            handleStopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerRunning]);

  const handleStartRecording = async () => {
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission('granted');
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setPhase('review');
        setTimerRunning(false);
        // Turn off mic stream
        stream.getTracks().forEach(t => t.stop());
      };

      setPhase('recording');
      setSecondsLeft(120);
      setTimerRunning(true);
      mediaRecorder.start();
    } catch (e) {
      console.warn("Could not get audio input:", e);
      setMicPermission('denied');
      // local fallback simulation
      setPhase('recording');
      setSecondsLeft(120);
      setTimerRunning(true);
    }
  };

  const handleStopRecording = () => {
    setTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      setPhase('review');
    }
  };

  const handleReset = () => {
    setPhase('idle');
    setSecondsLeft(120);
    setAudioUrl('');
    setTimerRunning(false);
    setChecks({
      stuckPoints: false,
      longPauses: false,
      wordRepeated: false,
      listenedToFinish: false,
      emotionNormal: false
    });
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Recording stage cockpit */}
      <div className="lg:col-span-7">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div>
            <span className="text-[10px] font-mono tracking-widest font-bold text-violet-600 uppercase flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5" /> 21:00 — VOICE RECORDING AUDIT
            </span>
            <h3 className="font-extrabold text-gray-900 tracking-tight text-lg font-sans mt-1">
              Mavzu: "Why will my English improve?"
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Nima uchun mening ingliz tilim albatta eng yuqori natijaga chiqadi? 2 daqiqa davomida to'xtamasdan gapiring va yozib oling. Keyin eshitib, o'zingizni tahlil qiling.
            </p>
          </div>

          {/* Central timer display */}
          <div className="py-8 flex flex-col items-center justify-center">
            {phase === 'idle' && (
              <div className="text-center space-y-3">
                <button
                  onClick={handleStartRecording}
                  className="w-16 h-16 rounded-full bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition shadow-lg shadow-violet-500/20 group hover:scale-105 active:scale-95 duration-200"
                >
                  <Mic className="w-7 h-7" />
                </button>
                <span className="text-xs font-semibold text-gray-650 block">Recordingni boshlash</span>
              </div>
            )}

            {phase === 'recording' && (
              <div className="text-center space-y-4">
                <div className="flex items-center gap-2 justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-650 animate-ping"></span>
                  <span className="text-xs font-mono font-bold text-red-650 uppercase tracking-widest">Recording Active</span>
                </div>

                <div className="text-6xl font-black font-mono text-gray-900 select-none">
                  {formatTimer(secondsLeft)}
                </div>

                <button
                  onClick={handleStopRecording}
                  className="bg-red-600 text-white font-bold text-xs px-6 py-3 rounded-2xl hover:bg-red-700 transition flex items-center gap-1.5 mx-auto shadow"
                >
                  <Square className="w-3.5 h-3.5 fill-current" /> Yozishni to'xtatish
                </button>
              </div>
            )}

            {phase === 'review' && (
              <div className="space-y-4 w-full">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-gray-500">Audio Muvaffaqiyatli Yozildi!</span>
                  {audioUrl ? (
                    <audio src={audioUrl} controls className="w-full h-10 mt-2" />
                  ) : (
                    <p className="text-xs text-amber-600 italic">Microphone permission blocked, but practice finished locally!</p>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold text-gray-400 hover:text-gray-650 flex items-center gap-1 transition"
                  >
                    <RefreshCw className="w-3 h-3" /> Qaytadan Boshlash
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-violet-50/50 p-4 rounded-2xl border border-violet-150/50 text-xs text-violet-900 leading-relaxed">
            <span className="font-bold flex items-center gap-1 mb-1"><Headphones className="w-3.5 h-3.5 text-violet-600" /> Tahlil shartligi:</span>
            Muvaffaqiyatli speaking egasi bo'lish uchun o'z xatolaringiz (pause, takrorlash yoki stuck) gacha erkin tahlil qilib eshitish eng tezkor usuldir.
          </div>
        </div>
      </div>

      {/* Checklist Audit Panel */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white border border-gray-100 rounded-3xl p-5 space-y-4 shadow-sm">
          <h4 className="font-bold text-gray-900 tracking-tight text-sm font-sans flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-violet-500" /> Self-Audit Checklist
          </h4>
          <p className="text-xs text-gray-500">
            Audioingizni eshitgandan so'ng, quyidagi muhim punklarni tekshiring va belgilang:
          </p>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={checks.stuckPoints}
                onChange={() => setChecks(p => ({...p, stuckPoints: !p.stuckPoints}))}
                className="mt-0.5 rounded text-violet-600 border-gray-300 focus:ring-violet-500 h-4 w-4"
              />
              <div>
                <span className="text-xs font-bold text-gray-800 block">Qayerda stuck bo'ldim?</span>
                <span className="text-[10px] text-gray-500 leading-none">Isolate specific grammar/concepts that froze your speech.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={checks.longPauses}
                onChange={() => setChecks(p => ({...p, longPauses: !p.longPauses}))}
                className="mt-0.5 rounded text-violet-600 border-gray-300 focus:ring-violet-500 h-4 w-4"
              />
              <div>
                <span className="text-xs font-bold text-gray-800 block">Qayerda uzoq pauza (unnatural gaps)?</span>
                <span className="text-[10px] text-gray-500 leading-none">Find instances where silence exceeded 2 seconds.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={checks.wordRepeated}
                onChange={() => setChecks(p => ({...p, wordRepeated: !p.wordRepeated}))}
                className="mt-0.5 rounded text-violet-600 border-gray-300 focus:ring-violet-500 h-4 w-4"
              />
              <div>
                <span className="text-xs font-bold text-gray-800 block">Qaysi so'zni haddan tashqari takrorladim?</span>
                <span className="text-[10px] text-gray-500 leading-none">Note overused filler words like 'basically', 'actually'.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={checks.listenedToFinish}
                onChange={() => setChecks(p => ({...p, listenedToFinish: !p.listenedToFinish}))}
                className="mt-0.5 rounded text-violet-600 border-gray-300 focus:ring-violet-500 h-4 w-4"
              />
              <div>
                <span className="text-xs font-bold text-gray-800 block">Yozuvni to'liq oxirigacha eshitdim</span>
                <span className="text-[10px] text-gray-500 leading-none">Force yourself to listen objectively without skipping.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={checks.emotionNormal}
                onChange={() => setChecks(p => ({...p, emotionNormal: !p.emotionNormal}))}
                className="mt-0.5 rounded text-violet-600 border-gray-300 focus:ring-violet-500 h-4 w-4"
              />
              <div>
                <span className="text-xs font-bold text-gray-800 block">Tuyg'ular va intonatsiya normalmi?</span>
                <span className="text-[10px] text-gray-500 leading-none">Did you speak with physical rhythm, emotion and confidence?</span>
              </div>
            </label>
          </div>

          <button
            onClick={() => {
              onSavedRecordGoal();
              handleReset();
            }}
            disabled={!checks.stuckPoints || !checks.longPauses || !checks.wordRepeated || !checks.listenedToFinish}
            className={`w-full font-bold text-xs py-3 rounded-xl transition flex justify-center items-center gap-1.5 ${
              (!checks.stuckPoints || !checks.longPauses || !checks.wordRepeated || !checks.listenedToFinish)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
            }`}
          >
            <Check className="w-4 h-4" /> Auditni yakunlab, Targetni bajarildi deb etish
          </button>
        </div>
      </div>
    </div>
  );
}
