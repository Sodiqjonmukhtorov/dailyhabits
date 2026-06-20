import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Clock, 
  RotateCcw, 
  Sparkles, 
  Check, 
  HelpCircle, 
  Play, 
  Zap, 
  CheckCircle2, 
  ListPlus, 
  Shuffle, 
  Plus, 
  Flame, 
  HelpCircle as HelpIcon, 
  BookOpen, 
  Compass, 
  Mic, 
  Smile, 
  TrendingUp, 
  Volume2
} from 'lucide-react';

// Speech synthesis helper
const handleSpeak = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }
};

export default function SpecialFluencyDrills() {
  const [activeDrill, setActiveDrill] = useState<'idea' | 'burst' | 'cheat' | 'desc'>('idea');

  // --- 3-SECOND LAUNCH TRIGGER (SHARED COMPONENT STATE) ---
  const [launchTimer, setLaunchTimer] = useState<number | null>(null);
  const [launchActive, setLaunchActive] = useState<boolean>(false);
  const [randomStarter, setRandomStarter] = useState<string>('');
  const launchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const starterPhrases = [
    { eng: "That’s an interesting question.", uzb: "Bu juda qiziq savol." },
    { eng: "Let me think...", uzb: "Keling o'ylab ko'ray..." },
    { eng: "From my perspective...", uzb: "Mening fikrimcha / nuqtai nazarimdan..." },
    { eng: "To be honest, I haven't thought about this before, but...", uzb: "Rostini aytsam, bu haqida oldin o'ylamagan edim, lekin..." },
    { eng: "If you ask me, the first thing that comes to mind is...", uzb: "Mendan so'rasangiz, hayolga kelgan birinchi narsa bu..." }
  ];

  const trigger3SecondLaunch = () => {
    if (launchIntervalRef.current) clearInterval(launchIntervalRef.current);
    const randomPhrase = starterPhrases[Math.floor(Math.random() * starterPhrases.length)].eng;
    setRandomStarter(randomPhrase);
    setLaunchTimer(3);
    setLaunchActive(true);

    let count = 3;
    launchIntervalRef.current = setInterval(() => {
      count--;
      if (count > 0) {
        setLaunchTimer(count);
        // Soft beep countdown using speech synthesis or web audio
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(count.toString());
          u.rate = 1.5;
          window.speechSynthesis.speak(u);
        }
      } else {
        setLaunchTimer(0);
        clearInterval(launchIntervalRef.current!);
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance("Go! Start speaking with: " + randomPhrase);
          u.rate = 1.08;
          window.speechSynthesis.speak(u);
        }
        // Keep launched message for 4 seconds
        setTimeout(() => {
          setLaunchActive(false);
          setLaunchTimer(null);
        }, 8000);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (launchIntervalRef.current) clearInterval(launchIntervalRef.current);
    };
  }, []);

  // ==========================================
  // DRILL 1: IDEA MACHINE (3-Bucket Thinking)
  // ==========================================
  const ideaQuestions = [
    { q: "Why learn English?", uzb: "Nima uchun ingliz tilini o'rganish kerak?", suggested: ["Global Career (Xalqaro martaba)", "Access to Information (Ma'lumotlar manbasi)", "Travel with Confidence (Ishonch bilan sayohat)"] },
    { q: "Should kids use mobile phones?", uzb: "Bolalar mobil telefonlardan foydalanishi kerakmi?", suggested: ["Education benefit (Ta'limiy foyda)", "Social addiction (Ijtimoiy bog'liqlik/Zarar)", "Parental control constraint (Ota-ona nazorati)"] },
    { q: "Is money the most important factor?", uzb: "Pul hayotda eng muhim omilmi?", suggested: ["Basic needs & Comfort (Ehtiyojlar va qulaylik)", "Mental satisfaction (Ruhiy qoniqish)", "Freedom of choice (Tanlov erkinligi)"] },
    { q: "Why is travel beneficial?", uzb: "Sayohat qilishning qanday foydalari bor?", suggested: ["New beautiful cultures (Yangi ajoyib madaniyatlar)", "Stress relief & Rest (Stressdan xalos bo'lish va dam olish)", "Mindset expansion (Dunyoqarash kengayishi)"] },
    { q: "Why do people eat fast food?", uzb: "Nima uchun odamlar fast-fud iste'mol qilishadi?", suggested: ["Saves busy time (Vaqtni tejaydi)", "Intense delicious taste (Kuchli mazali ta'm)", "Cheap & Easy availability (Arzon va tez topilishi)"] },
    { q: "Is studying online better than offline?", uzb: "Onlayn o'qish oflaynga qaraganda yaxshiroqmi?", suggested: ["Time flexibility (Vaqt erkinligi)", "No physical campus limits (Makon chegaralari yo'qligi)", "Lack of live practice (Jonli amaliyot yo'qligi)"] }
  ];

  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number>(0);
  const [bucketInputs, setBucketInputs] = useState<string[]>(['', '', '']);
  const [userBucketList, setUserBucketList] = useState<Array<{question: string, buckets: string[]}>>(() => {
    const saved = localStorage.getItem('drill_1_buckets');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSaveBuckets = () => {
    if (bucketInputs.some(x => !x.trim())) {
      alert("Iltimos, barcha 3 ta g'oya katakchasini qisqa so'zlar bilan to'ldiring!");
      return;
    }
    const qText = ideaQuestions[selectedQuestionIdx].q;
    const newEntry = { question: qText, buckets: [...bucketInputs] };
    const updated = [newEntry, ...userBucketList.filter(item => item.question !== qText)];
    setUserBucketList(updated);
    localStorage.setItem('drill_1_buckets', JSON.stringify(updated));
    setBucketInputs(['', '', '']);
    alert("3-Bucket g'oyalaringiz saqlandi! Endi 3-Second Launch yordamida nutqingizni boshlang!");
  };

  // ==========================================
  // DRILL 2: WORD RETRIEVAL SPEED (Burst)
  // ==========================================
  const burstCategories = [
    { category: "Food (Taomlar)", examples: "rice, meat, soup, spicy, sweet, apple, bread, salt, sugar, milk, delicious, banana, beef, cheese, kitchen" },
    { category: "Technology (Texnologiya)", examples: "phone, screen, battery, internet, laptop, code, website, software, camera, robot, charge, signal, social, email, digital" },
    { category: "Education (Ta'lim)", examples: "teacher, exam, library, student, course, subject, university, homework, degree, textbook, science, schedule, knowledge, learn, skill" },
    { category: "Travel (Sayohat)", examples: "flight, hotel, tourist, luggage, passport, map, plane, beach, forest, explore, tour, station, ticket, mountain, road" },
    { category: "Sport (Sport)", examples: "gym, workout, football, running, fitness, coach, ball, game, win, health, muscle, weight, yoga, energy, team" },
    { category: "Jobs (Kasblar)", examples: "office, salary, boss, interview, career, employee, resume, project, business, meeting, client, manager, doctor, worker, engineer" },
    { category: "Weather (Ob-havo)", examples: "rain, sunny, cloud, storm, wind, snow, temperature, hot, cold, dry, season, forecast, summer, wet, umbrella" },
    { category: "Character/Mood (Xarakter/Kayfiyat)", examples: "happy, angry, confident, quiet, funny, lazy, smart, polite, serious, creative, nervous, patient, hard-working, boring, kind" },
    { category: "City/Housing (Shahar/Uy-joy)", examples: "apartment, street, traffic, building, room, window, kitchen, garden, park, center, bridge, neighbor, door, key, dynamic" },
    { category: "Shopping (Xaridlar)", examples: "price, store, market, discount, cloth, buy, pay, purse, cash, card, sale, cheap, expensive, search, shop" }
  ];

  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number>(0);
  const [burstTimer, setBurstTimer] = useState<number>(30);
  const [burstActive, setBurstActive] = useState<boolean>(false);
  const [burstWordCount, setBurstWordCount] = useState<number>(0);
  const [burstBestScores, setBurstBestScores] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('drill_2_scores');
    return saved ? JSON.parse(saved) : {};
  });
  const burstIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startBurst = () => {
    if (burstIntervalRef.current) clearInterval(burstIntervalRef.current);
    setBurstActive(true);
    setBurstWordCount(0);
    setBurstTimer(30);

    burstIntervalRef.current = setInterval(() => {
      setBurstTimer((prev) => {
        if (prev <= 1) {
          clearInterval(burstIntervalRef.current!);
          setBurstActive(false);
          // Save high score
          const catName = burstCategories[selectedCategoryIdx].category;
          setBurstBestScores(prevScores => {
            const currentBest = prevScores[catName] || 0;
            const updated = { ...prevScores };
            if (burstWordCount + 1 > currentBest) {
              updated[catName] = burstWordCount + 1; // plus the last count
            }
            localStorage.setItem('drill_2_scores', JSON.stringify(updated));
            return updated;
          });
          if ('speechSynthesis' in window) {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance("Time's up! Great job. You retrieved words effectively."));
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (burstIntervalRef.current) clearInterval(burstIntervalRef.current);
    };
  }, [burstWordCount]);

  // ==========================================
  // DRILL 3: CHEAT WORDS (Fluency Hack)
  // ==========================================
  const cheatWordsList = [
    { target: "Microscope", fallback: "a scientific thing used in labs to see very tiny cells or objects.", uzb: "Laboratoriyada o'ta mayda hujayra yoki narsalarni ko'rish uchun ishlatiladigan moslama." },
    { target: "Thermometer", fallback: "a kind of small device that you put to measure how hot or cold the body temperature is.", uzb: "Tana harorati qanchalik issiq yoki sovuqligini o'lchash uchun ishlatiladigan kichik qurilma." },
    { target: "Refrigerator / Fridge", fallback: "a big kitchen stuff where you store fresh fruits, meat, and milk so they don't spoil.", uzb: "Meva, go'sht va sut buzilib ketmasligi uchun saqlanadigan katta oshxona buyumi." },
    { target: "Stethoscope", fallback: "a tool used by a doctor to listen to someone's heartbeat and breathing sounds.", uzb: "Shifokor inson yurak urishi va nafas olishini eshitish uchun foydalanadigan moslama." },
    { target: "Elevator / Lift", fallback: "a sort of small box that moves up and down inside a tall building to carry people.", uzb: "Odamlarni baland binoning tepasiga olib chiqadigan va tushiradigan kichik quti." },
    { target: "Compass", fallback: "a small round thing with a needle that shows you north, south, and which direction to go when lost.", uzb: "Shimol va janubni ko'rsatib, adashib qolganda qayerga borishni bildiradigan kichik yumaloq buyum." },
    { target: "Vacuum Cleaner", fallback: "a noisy electrical machine used to clean and suck dust from carpets and floors.", uzb: "Gilam va pollardagi changlarni tortib tozalaydigan shovqinli elektr mashina." },
    { target: "Subway / Underground train", fallback: "a sort of fast electric train system built and running entirely beneath the ground in big cities.", uzb: "Katta shaharlarda er ostidan yuradigan tezkor elektr poezdi." }
  ];

  const [cheatWordIdx, setCheatWordIdx] = useState<number>(0);
  const [cheatDraft, setCheatDraft] = useState<string>('');
  const [cheatAttempts, setCheatAttempts] = useState<Array<{target: string, desc: string}>>(() => {
    const saved = localStorage.getItem('drill_3_cheat_attempts');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSaveCheat = () => {
    if (!cheatDraft.trim()) {
      alert("Iltimos, o'zingizning tushuntirishingizni yozing / mashq qiling!");
      return;
    }
    const currentWord = cheatWordsList[cheatWordIdx].target;
    const newAttempt = { target: currentWord, desc: cheatDraft };
    const updated = [newAttempt, ...cheatAttempts.filter(x => x.target !== currentWord)];
    setCheatAttempts(updated);
    localStorage.setItem('drill_3_cheat_attempts', JSON.stringify(updated));
    setCheatDraft('');
    alert("Ajoyib! Cheat word tushuntirishingiz muvaffaqiyatli darsga qo'shildi!");
  };

  // ==========================================
  // DRILL 4: DESCRIPTION POWER (20 Objects)
  // ==========================================
  const objectPowerList = [
    { name: "Smartphone", questionGuide: "Sizning telefoningiz", exampleDesc: "This is my smartphone. I use it for daily communication, learning English, and quick entertainment. It is extremely important because it holds my calendar and connects me to the world. A major advantage is instant access to documents, but the fallback disadvantage is that it can be highly addictive and waste my precious focus." },
    { name: "Wristwatch", questionGuide: "Qo'l soati", exampleDesc: "This is a wristwatch. We use it to stay on time and track our daily schedule. It is important because keeping track of hours prevents procrastination. The main advantage is that you do not need to look at distracting home screens of phones to check the time, but the disadvantage is that simple ones do not carry advanced modern software." },
    { name: "Coffee Cup", questionGuide: "Kofe finjoni", exampleDesc: "This is a ceramic coffee cup. I use it to hold hot coffee or tea to activate my energy in the early morning. It is important because it prevents spilling hot liquid onto my laptop keyboard. The advantage is that it keeps the drink warm for a longer time, while the disadvantage is that it can break easily if dropped." },
    { name: "Backpack", questionGuide: "Orqa sumka", exampleDesc: "This is a backpack. I use it for carrying my laptop, notebooks, and a bottle of mineral water. It is important for students and energetic office workers who travel daily. The advantage is that it distributes weight evenly across both shoulders, but the disadvantage is that a fully loaded bag can be heavy." },
    { name: "Glasses", questionGuide: "Ko'zoynak", exampleDesc: "These are medical glasses. People use them to clearly read text or see objects from far away. They are highly important for protecting eyes from blue light emitted by computer screens. The primary advantage is absolute visual correction, but the main disadvantage is they can get fogged up easily when drinking hot soup." },
    { name: "Headphones", questionGuide: "Quloqchinlar", exampleDesc: "These are headphones. I use them to listen to English audiobooks, podcasts, and shadow native speech without disturbing others. They are important for deep isolation in busy public places. The advantage is clear acoustic sound quality, but the disadvantage is that loud volume can hurt ears." },
    { name: "Physical Notebook", questionGuide: "Daftar", exampleDesc: "This is a simple paper notebook. I use it to handwrite daily goals, vocabulary phrases, and quick notes. It is important because writing things by hand locks ideas deep inside long-term memory. The advantage is zero digital screen battery needed, but the disadvantage is you can easily lose it physically." }
  ];

  const [descObjIdx, setDescObjIdx] = useState<number>(0);
  const [descPowerInput, setDescPowerInput] = useState<string>('');
  const [descAttempts, setDescAttempts] = useState<Array<{ name: string, userText: string }>>(() => {
    const saved = localStorage.getItem('drill_4_desc_attempts');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSaveDescAttempt = () => {
    if (!descPowerInput.trim()) {
      alert("Iltimos, ob'ekt bo'yicha 5 savolga javob berib, matn yozing!");
      return;
    }
    const currentName = objectPowerList[descObjIdx].name;
    const newEntry = { name: currentName, userText: descPowerInput };
    const updated = [newEntry, ...descAttempts.filter(x => x.name !== currentName)];
    setDescAttempts(updated);
    localStorage.setItem('drill_4_desc_attempts', JSON.stringify(updated));
    setDescPowerInput('');
    alert("Muvaffaqiyatli saqlandi! Kundalik 20 ob'ekt tasviri bilan nutq ravonligingiz tezda o'sadi!");
  };

  return (
    <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm space-y-6">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight font-sans flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600 fill-indigo-100 animate-bounce" /> Special Fluency Drills
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Miyadagi so'zlarni duduqlanmasdan, tezkor va tizimli nutqqa chiqarish uchun mo'ljallangan maxsus mashqlar to'plami.
          </p>
        </div>

        {/* Global 3-Second Launch Trigger */}
        <div className="flex items-center gap-2">
          {launchActive ? (
            <div className="bg-indigo-50 border border-indigo-200 py-2.5 px-3.5 rounded-2xl flex items-center gap-2 text-xs">
              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold font-mono flex items-center justify-center animate-ping">
                {launchTimer}
              </div>
              <div>
                <span className="font-bold text-indigo-900 block font-mono">LAUNCING PHRASE:</span>
                <span className="text-gray-600 italic">"{randomStarter}"</span>
              </div>
            </div>
          ) : (
            <button
              onClick={trigger3SecondLaunch}
              className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-xs font-black py-2.5 px-4.5 rounded-2xl shadow-sm hover:from-indigo-700 hover:to-indigo-900 transition flex items-center gap-2 outline-none"
            >
              <Flame className="w-4.5 h-4.5 text-amber-300 fill-amber-300" />
              <span>3-Second Launch Rule</span>
            </button>
          )}
        </div>
      </div>

      {/* Special Drills Selection Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <button
          onClick={() => setActiveDrill('idea')}
          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition outline-none ${
            activeDrill === 'idea'
              ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-500'
              : 'border-gray-150 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-indigo-600">DRILL 01</span>
            <span className="text-xs text-indigo-500">💡</span>
          </div>
          <span className="text-xs font-extrabold text-gray-950 mt-1 block">Idea Machine</span>
          <span className="text-[9px] text-gray-500 mt-0.5 line-clamp-1">3-Bucket Rule Thinking</span>
        </button>

        <button
          onClick={() => setActiveDrill('burst')}
          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition outline-none ${
            activeDrill === 'burst'
              ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-500'
              : 'border-gray-150 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-indigo-600">DRILL 02</span>
            <span className="text-xs text-orange-500">⏱️</span>
          </div>
          <span className="text-xs font-extrabold text-gray-950 mt-1 block font-sans">Retrieval Speed</span>
          <span className="text-[9px] text-gray-500 mt-0.5 line-clamp-1">30s Category Burst</span>
        </button>

        <button
          onClick={() => setActiveDrill('cheat')}
          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition outline-none ${
            activeDrill === 'cheat'
              ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-500'
              : 'border-gray-150 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-indigo-600">DRILL 03</span>
            <span className="text-xs text-green-500">🕵️</span>
          </div>
          <span className="text-xs font-extrabold text-gray-950 mt-1 block font-sans">Cheat Words</span>
          <span className="text-[9px] text-gray-500 mt-0.5 line-clamp-1">Fluency fallback logic</span>
        </button>

        <button
          onClick={() => setActiveDrill('desc')}
          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition outline-none ${
            activeDrill === 'desc'
              ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-500'
              : 'border-gray-150 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-indigo-600">DRILL 04</span>
            <span className="text-xs text-purple-500 font-bold">🔍</span>
          </div>
          <span className="text-xs font-extrabold text-gray-950 mt-1 block font-sans font-bold">Description Power</span>
          <span className="text-[9px] text-gray-500 mt-0.5 line-clamp-1">5 core questions for 20 objs</span>
        </button>
      </div>

      {/* Drill Body Panels */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-5 md:p-6" id="active-drill-view">
        
        {/* ====================================
            DRILL 1 PANEL
        ==================================== */}
        {activeDrill === 'idea' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4.5 rounded-2xl border border-gray-100">
              <div>
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">CONCEPT</span>
                <h3 className="text-sm font-extrabold text-indigo-950 tracking-tight mt-1">3-Bucket Rule (G'oya Mashinasi)</h3>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                  Har qanday savol eshitganda, miya darhol 3 ta tarkibni (Health, Mental state, Future benefits, etc) topsin. Avval to'liq gap emas, qisqa g'oyalarni bullet shaklida belgilang!
                </p>
              </div>
              <div className="flex-shrink-0 flex gap-2">
                <button
                  onClick={() => handleSpeak(ideaQuestions[selectedQuestionIdx].q)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-xl transition"
                  title="Savolni eshitish"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const next = (selectedQuestionIdx + 1) % ideaQuestions.length;
                    setSelectedQuestionIdx(next);
                  }}
                  className="bg-indigo-50 text-indigo-600 hover:bg-slate-100 p-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition"
                >
                  <Shuffle className="w-4 h-4" /> Boshqasi
                </button>
              </div>
            </div>

            {/* Current Question Display */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-extrabold text-amber-600 block tracking-wider">SAVOL SIZGA:</span>
                <h4 className="text-base font-black text-gray-950">
                  "{ideaQuestions[selectedQuestionIdx].q}"
                </h4>
                <p className="text-xs text-gray-500">
                  Tarjimasi: {ideaQuestions[selectedQuestionIdx].uzb}
                </p>
              </div>

              {/* Bucket list suggestion aid */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 text-[11px] leading-relaxed">
                <span className="text-sm select-none">💡</span>
                <div>
                  <strong className="text-indigo-950">Taklif etilgan 3 bucket g'oyalari (Suggested topics):</strong>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {ideaQuestions[selectedQuestionIdx].suggested.map((s, idx) => (
                      <span key={idx} className="bg-white text-gray-700 border border-gray-200 rounded-lg px-2 py-1 font-mono font-medium">
                        {idx + 1}. {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input for Buckets */}
              <div className="space-y-3.5">
                <span className="text-xs font-extrabold text-indigo-950 block">O'z g'oyalaringizni kiriting (Faqat qisqa so'zlar yoki so'z birikmalari):</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {bucketInputs.map((val, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Bucket {idx + 1}</label>
                      <input
                        type="text"
                        placeholder={`Masalan: ${idx === 0 ? 'Mental health' : idx === 1 ? 'Confidence' : 'Time saving'}`}
                        value={val}
                        onChange={(e) => {
                          const updated = [...bucketInputs];
                          updated[idx] = e.target.value;
                          setBucketInputs(updated);
                        }}
                        className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    onClick={handleSaveBuckets}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> G'oyalarni Saqlash (Save Buckets)
                  </button>
                  <button
                    onClick={trigger3SecondLaunch}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4" /> 3-Second Launch & Speak!
                  </button>
                </div>
              </div>
            </div>

            {/* Saved completed listings */}
            {userBucketList.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[#1e1b4b] block uppercase font-mono tracking-widest text-[10px]">TAYYORLANGAN G'OYALARINGIZ SAVDASI ({userBucketList.length}):</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {userBucketList.map((item, idx) => (
                    <div key={idx} className="bg-white p-3.5 border border-gray-100 rounded-2xl space-y-2.5">
                      <span className="text-[10px] font-mono text-gray-400 block truncate">"{item.question}"</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {item.buckets.map((b, bIdx) => (
                          <span key={bIdx} className="bg-green-50 text-green-700 text-[10px] font-bold border border-green-150 px-2.5 py-1 rounded-lg">
                            ✓ {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================
            DRILL 2 PANEL
        ==================================== */}
        {activeDrill === 'burst' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4.5 rounded-2xl border border-gray-100">
              <div>
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">CONCEPT</span>
                <h3 className="text-sm font-extrabold text-indigo-950 tracking-tight mt-1">Retrieval Speed (Word Burst)</h3>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                  Siz so'zlarni bilasiz, ammo ularni xotiradan chaqirish sekin kechadi. Category Burst miyani bir zumda muvofiqlashtiradi. 30 soniyada tanlangan doiradagi barcha so'zlarni og'zaki ayting!
                </p>
              </div>
              <div className="flex-shrink-0">
                <select
                  value={selectedCategoryIdx}
                  onChange={(e) => {
                    setSelectedCategoryIdx(parseInt(e.target.value));
                    setBurstWordCount(0);
                    if (burstIntervalRef.current) {
                      clearInterval(burstIntervalRef.current);
                      setBurstActive(false);
                      setBurstTimer(30);
                    }
                  }}
                  className="text-xs font-bold p-2.5 bg-white border border-gray-200 rounded-xl outline-none"
                >
                  {burstCategories.map((cat, i) => (
                    <option key={i} value={i}>{cat.category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interactive Game Stage */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              
              {/* Left Scoreboard */}
              <div className="md:col-span-8 bg-white p-5 rounded-2xl border border-gray-100 flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-150">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">FAOL TOIFA:</span>
                    <h4 className="text-sm font-black text-indigo-950">{burstCategories[selectedCategoryIdx].category}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-gray-400 block leading-none">HIGH SCORE</span>
                    <span className="text-xs font-black text-amber-600">
                      🏆 {burstBestScores[burstCategories[selectedCategoryIdx].category] || 0} so'z
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center py-4">
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono font-bold text-indigo-500 block">QOLGAN VAQT</span>
                    <span className="text-3xl font-black text-indigo-950 font-mono tracking-tight">
                      {burstTimer}s
                    </span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 block">AYTILGAN SO'ZLAR</span>
                    <span className="text-3xl font-black text-emerald-950 font-mono tracking-tight">
                      {burstWordCount}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {burstActive ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBurstWordCount(prev => prev + 1)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-4 px-4 rounded-xl shadow transition flex items-center justify-center gap-1.5 outline-none active:scale-95"
                      >
                        <Plus className="w-5 h-5" /> So'z Aytdim (+1 WORD)
                      </button>
                      <button
                        onClick={() => {
                          if (burstIntervalRef.current) clearInterval(burstIntervalRef.current);
                          setBurstActive(false);
                          setBurstTimer(30);
                        }}
                        className="bg-red-100 hover:bg-red-200 text-red-700 p-4 rounded-xl transition"
                        title="Reset/Stop"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startBurst}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3.5 px-4 rounded-xl shadow transition flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-4 h-4" /> 30-Sec Fast Burst Boshlash
                    </button>
                  )}
                </div>
              </div>

              {/* Right suggested visual memory card */}
              <div className="md:col-span-4 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold text-indigo-300 tracking-wider">RECALL AID (Xotira madadi)</span>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                    Agar qiynalsangiz, faqat mana bu so'zlarni zudlik bilan tarjima qilib aytishni odat qiling:
                  </p>
                  <p className="text-[11px] text-indigo-200 mt-3 font-mono leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10 italic">
                    "{burstCategories[selectedCategoryIdx].examples}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 text-[10px] text-gray-400">
                  ⚡ Har kuni kamida 10 ta turli toifalar bilan shug'ullanish miya so'z chaqirish tezligini (retrieval rate) 3 barobar tezlashtiradi!
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ====================================
            DRILL 3 PANEL
        ==================================== */}
        {activeDrill === 'cheat' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4.5 rounded-2xl border border-gray-100">
              <div>
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">CONCEPT</span>
                <h3 className="text-sm font-extrabold text-indigo-950 tracking-tight mt-1">Fluency Cheat Words Hook</h3>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                  Native'lar ham har bitta so'zning aniq atalishini eslay olmaydi. Word topa olmasangiz, fallback iboralaridan foydalaning (thing, stuff, kind of, sort of). Bu tutilishlarsiz davom etish siri!
                </p>
              </div>
              <div className="flex-shrink-0 flex gap-2">
                <button
                  onClick={() => {
                    const next = (cheatWordIdx + 1) % cheatWordsList.length;
                    setCheatWordIdx(next);
                  }}
                  className="bg-indigo-50 text-indigo-600 hover:bg-slate-100 p-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition"
                >
                  <Shuffle className="w-4 h-4" /> Boshqa So'z
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left active exercise */}
              <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-red-500 uppercase tracking-widest block">FARAZ QILING, KO'RIB TURGAN BU SO'ZINGIZ ESDAN CHIQDI:</span>
                  <h4 className="text-xl font-black text-gray-950 uppercase font-mono tracking-tight flex items-center gap-2">
                    ❌ "{cheatWordsList[cheatWordIdx].target}"
                  </h4>
                </div>

                <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 space-y-2">
                  <span className="text-[10px] font-mono font-extrabold text-emerald-800 block uppercase tracking-wider">✓ ADVANCED FALLBACK CHEAT METHOD (Qutqaruv gaplar):</span>
                  <p className="text-xs font-semibold text-emerald-950 font-sans leading-relaxed">
                    "{cheatWordsList[cheatWordIdx].fallback}"
                  </p>
                  <p className="text-[11px] text-gray-500 italic">
                    Tarjimasi: {cheatWordsList[cheatWordIdx].uzb}
                  </p>
                </div>

                {/* Input description fallback exercise */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-indigo-950 block">Ushbu so'zni boshqa aylanma yo'llar bilan inglizcha zudlik bilan ifodalab yozing / gapiring:</label>
                  <textarea
                    placeholder="Masalan: It is a thing we can use when... kind of stuff..."
                    rows={3}
                    value={cheatDraft}
                    onChange={(e) => setCheatDraft(e.target.value)}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleSaveCheat}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow transition"
                    >
                      Mashqni Saqlash (Save Description)
                    </button>
                  </div>
                </div>
              </div>

              {/* Right static fallback cheats rulebook */}
              <div className="lg:col-span-4 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-5 rounded-2xl flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold text-indigo-300">HACKS LIST (Qoliplar)</span>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Grammatika va aniq so'z bilan chalg'imasdan, mana bu 7 ta qolip so'zni gap ichiga qoring:
                  </p>
                  <ul className="space-y-2 text-xs text-indigo-100 font-semibold font-mono pl-1">
                    <li className="flex items-center gap-1.5"><span className="text-amber-400">⚡</span> "a thing used for..."</li>
                    <li className="flex items-center gap-1.5"><span className="text-amber-400">⚡</span> "some stuff that we..."</li>
                    <li className="flex items-center gap-1.5"><span className="text-amber-400">⚡</span> "kind of/sort of like..."</li>
                    <li className="flex items-center gap-1.5"><span className="text-amber-400">⚡</span> "someone who is..."</li>
                    <li className="flex items-center gap-1.5"><span className="text-amber-400">⚡</span> "somewhere where you can..."</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-indigo-800 mt-4 text-[10px] text-indigo-300">
                  Bu uslub duduqlanish va to'xtab qolishni (silence pauses) 90% ga kamaytiradi va ravonlikni ushlab turadi.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ====================================
            DRILL 4 PANEL
        ==================================== */}
        {activeDrill === 'desc' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4.5 rounded-2xl border border-gray-100">
              <div>
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">CONCEPT</span>
                <h3 className="text-sm font-extrabold text-indigo-950 tracking-tight mt-1">Description Power Booster</h3>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                  Atrofingizdagi oddiy ob'ektlarni batafsil tushuntirish kognitiv g'oyalarni darhol shakllantirishni eng yuqori darajaga ko'taruvchi universal darsdir. 5 ta ketma-ket savoldan foydalaning.
                </p>
              </div>
              <div className="flex-shrink-0 flex gap-2">
                <button
                  onClick={() => {
                    const next = (descObjIdx + 1) % objectPowerList.length;
                    setDescObjIdx(next);
                  }}
                  className="bg-indigo-50 text-indigo-600 hover:bg-slate-100 p-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition"
                >
                  <Shuffle className="w-4 h-4" /> Boshqa Buyum
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left active segment */}
              <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-600 block tracking-wider uppercase">OB'EKT:</span>
                  <h4 className="text-lg font-black text-gray-950">
                    "{objectPowerList[descObjIdx].name}" ({objectPowerList[descObjIdx].questionGuide})
                  </h4>
                </div>

                {/* Question prompts block */}
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-2">
                  <span className="text-[10px] font-mono font-black text-indigo-950 block tracking-wide uppercase">MASHQ BO'YICHA 5 CORE SAVOL:</span>
                  <ol className="text-xs text-gray-700 font-sans font-semibold space-y-1.5 pl-2.5 list-decimal">
                    <li>What is it? (Bu nima?)</li>
                    <li>What is it used for? (Nima uchun ishlatiladi?)</li>
                    <li>Why is it important in everyday life? (Kundalik hayotda nima uchun muhim?)</li>
                    <li>What is its biggest advantage? (Uning eng katta foydali tomoni nima?)</li>
                    <li>What is a simple disadvantage? (Uning sodda kamchiligi yoki zarari bormi?)</li>
                  </ol>
                </div>

                {/* Example output aid */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-bold text-gray-400 block tracking-wider">NATIVE EXAMPLE (NAMUNA GAP):</span>
                    <button
                      onClick={() => handleSpeak(objectPowerList[descObjIdx].exampleDesc)}
                      className="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" /> Ovozda Eshitish
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 italic leading-relaxed">
                    "{objectPowerList[descObjIdx].exampleDesc}"
                  </p>
                </div>

                {/* Live writing trainer state */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-extrabold text-indigo-950 block">5 ta savolning barchasiga javob beruvchi shaxsiy tasviringizni gapiring / yozing:</label>
                  <textarea
                    placeholder="Masalan: This is my watch. I use it for tracking my learning hours..."
                    rows={4}
                    value={descPowerInput}
                    onChange={(e) => setDescPowerInput(e.target.value)}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleSaveDescAttempt}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow transition"
                    >
                      Tasvirni Saqlash (Save Attempt)
                    </button>
                  </div>
                </div>
              </div>

              {/* Right side completions stats */}
              <div className="lg:col-span-4 bg-white border border-gray-150 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-black text-gray-950 tracking-tight uppercase font-mono">Bajarilgan ob'ektlar:</h4>
                  <p className="text-[11px] text-gray-500 mt-1 pb-3 border-b border-gray-100">
                    Kundalik 20 ob'ekt tasviri bilan nutq ravonligingiz tezda o'sadi!
                  </p>

                  {descAttempts.length > 0 ? (
                    <div className="space-y-2.5 mt-3 overflow-y-auto max-h-[220px] pr-1">
                      {descAttempts.map((item, id) => (
                        <div key={id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                          <span className="text-[11px] font-bold text-indigo-950 block">✓ {item.name}</span>
                          <span className="text-[10px] text-gray-600 line-clamp-2 block font-medium">"{item.userText}"</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-xs text-gray-400 font-semibold italic">
                      Hali hech qaysi ob'ekt tasvirlanmadi.
                    </div>
                  )}
                </div>

                <div className="bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-xl p-3 text-[10px] leading-relaxed">
                  <strong>Special Master Tip:</strong> Description mashqlari ingliz tilida o'ylash va nutq oqimining bir-biriga bog'lanishidagi eng faol element hisoblanadi!
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
