import { DayData, ScheduleItem, SpeechPattern } from './types';

export const DAYS_DATA: DayData[] = [
  {
    dayNumber: 1,
    theme: "Daily Life / Routine",
    words: [
      { english: "wake up", uzbek: "uyg‘onmoq" },
      { english: "brush", uzbek: "tish yuvmoq" },
      { english: "prepare", uzbek: "tayyorlamoq" },
      { english: "routine", uzbek: "kun tartibi" },
      { english: "habit", uzbek: "odat" },
      { english: "focus", uzbek: "diqqat" },
      { english: "distract", uzbek: "chalg‘itmoq" },
      { english: "improve", uzbek: "yaxshilanmoq" },
      { english: "practice", uzbek: "mashq qilmoq" },
      { english: "discipline", uzbek: "intizom" },
      { english: "productive", uzbek: "unumdor" },
      { english: "lazy", uzbek: "dangasa" },
      { english: "energy", uzbek: "energiya" },
      { english: "tired", uzbek: "charchagan" },
      { english: "active", uzbek: "faol" },
      { english: "organize", uzbek: "tartibga solmoq" },
      { english: "schedule", uzbek: "jadval" },
      { english: "delay", uzbek: "kechiktirmoq" },
      { english: "complete", uzbek: "tugatmoq" },
      { english: "continue", uzbek: "davom ettirmoq" },
      { english: "consistency", uzbek: "barqarorlik" },
      { english: "progress", uzbek: "rivojlanish" }
    ],
    phrases: [
      { english: "As soon as I woke up…", uzbek: "Uyg‘onishim bilanoq…" },
      { english: "My daily routine usually…", uzbek: "Mening kun tartibim odatda…" },
      { english: "One thing I need to improve is…", uzbek: "Yaxshilashim kerak bo‘lgan bir narsa bu…" }
    ]
  },
  {
    dayNumber: 2,
    theme: "Feelings",
    words: [
      { english: "excited", uzbek: "hayajonlangan" },
      { english: "nervous", uzbek: "asabiy" },
      { english: "confident", uzbek: "ishonchli" },
      { english: "confused", uzbek: "chalkash" },
      { english: "frustrated", uzbek: "jahli chiqqan" },
      { english: "calm", uzbek: "xotirjam" },
      { english: "relaxed", uzbek: "bo‘shashgan" },
      { english: "stressed", uzbek: "stressda" },
      { english: "anxious", uzbek: "xavotirli" },
      { english: "motivated", uzbek: "motivatsiyali" },
      { english: "discouraged", uzbek: "tushkun" },
      { english: "proud", uzbek: "faxrlangan" },
      { english: "grateful", uzbek: "minnatdor" },
      { english: "comfortable", uzbek: "qulay" },
      { english: "uncomfortable", uzbek: "noqulay" },
      { english: "curious", uzbek: "qiziquvchan" },
      { english: "surprised", uzbek: "hayron" },
      { english: "shocked", uzbek: "shokda" },
      { english: "embarrassed", uzbek: "uyalgan" },
      { english: "satisfied", uzbek: "qoniqqan" },
      { english: "scared", uzbek: "qo‘rqqan" },
      { english: "worried", uzbek: "xavotirda" }
    ],
    phrases: [
      { english: "To be honest, I feel…", uzbek: "Rostini aytsam, men o‘zimni … his qilyapman" },
      { english: "Sometimes I get…", uzbek: "Ba'zida men … bo‘lib qolaman" },
      { english: "What affects my mood is…", uzbek: "Mening kayfiyatimga ta'sir qiladigan narsa bu…" }
    ]
  },
  {
    dayNumber: 3,
    theme: "Opinion / Discussion",
    words: [
      { english: "opinion", uzbek: "fikr" },
      { english: "perspective", uzbek: "nuqtai nazar" },
      { english: "viewpoint", uzbek: "qarash" },
      { english: "agree", uzbek: "qo‘shilmoq" },
      { english: "disagree", uzbek: "qo‘shilmaslik" },
      { english: "argue", uzbek: "bahslashmoq" },
      { english: "claim", uzbek: "ta’kidlamoq" },
      { english: "support", uzbek: "qo‘llab-quvvatlamoq" },
      { english: "oppose", uzbek: "qarshi bo‘lmoq" },
      { english: "evidence", uzbek: "dalil" },
      { english: "logical", uzbek: "mantiqiy" },
      { english: "reasonable", uzbek: "asosli" },
      { english: "unfair", uzbek: "adolatsiz" },
      { english: "balanced", uzbek: "muvozanatli" },
      { english: "biased", uzbek: "bir tomonlama" },
      { english: "debate", uzbek: "munozara" },
      { english: "controversial", uzbek: "bahsli" },
      { english: "discuss", uzbek: "muhokama qilmoq" },
      { english: "mention", uzbek: "tilga olmoq" },
      { english: "explain", uzbek: "tushuntirmoq" },
      { english: "prove", uzbek: "isbotlamoq" },
      { english: "conclude", uzbek: "xulosa qilmoq" }
    ],
    phrases: [
      { english: "In my opinion…", uzbek: "Mening fikrimcha…" },
      { english: "From my perspective…", uzbek: "Mening nuqtai nazarimdan…" },
      { english: "I strongly believe…", uzbek: "Men astoydil ishonamanki…" }
    ]
  },
  {
    dayNumber: 4,
    theme: "Education",
    words: [
      { english: "education", uzbek: "ta'lim" },
      { english: "student", uzbek: "talaba / o'quvchi" },
      { english: "teacher", uzbek: "o'qituvchi" },
      { english: "lesson", uzbek: "dars" },
      { english: "subject", uzbek: "fan" },
      { english: "homework", uzbek: "uy vazifasi" },
      { english: "exam", uzbek: "imtihon" },
      { english: "knowledge", uzbek: "bilim" },
      { english: "skill", uzbek: "ko'nikma" },
      { english: "memorize", uzbek: "yodlamoq" },
      { english: "understand", uzbek: "tushunmoq" },
      { english: "analyze", uzbek: "tahlil qilmoq" },
      { english: "improve", uzbek: "yaxshilamoq" },
      { english: "fail", uzbek: "yiqilmoq (imtihondan)" },
      { english: "succeed", uzbek: "muvaffaqiyat qozonmoq" },
      { english: "effort", uzbek: "harakat" },
      { english: "result", uzbek: "natija" },
      { english: "grade", uzbek: "baho" },
      { english: "score", uzbek: "ball / natija" },
      { english: "academic", uzbek: "akademik" },
      { english: "concentrate", uzbek: "diqqatni jamlamoq" }
    ],
    phrases: [
      { english: "One challenge students face is…", uzbek: "Talabalar duch keladigan qiyinchiliklardan biri bu…" },
      { english: "Education plays a crucial role…", uzbek: "Ta'lim juda muhim rol o‘ynaydi…" },
      { english: "The main reason is…", uzbek: "Asosiy sababi…" }
    ]
  },
  {
    dayNumber: 5,
    theme: "Technology",
    words: [
      { english: "technology", uzbek: "texnologiya" },
      { english: "device", uzbek: "qurilma" },
      { english: "smartphone", uzbek: "smartfon" },
      { english: "internet", uzbek: "internet" },
      { english: "social media", uzbek: "ijtimoiy tarmoqlar" },
      { english: "application", uzbek: "ilova" },
      { english: "screen", uzbek: "ekran" },
      { english: "addiction", uzbek: "qaramlik" },
      { english: "benefit", uzbek: "foyda" },
      { english: "drawback", uzbek: "kamchilik" },
      { english: "connect", uzbek: "bog'lanmoq" },
      { english: "communicate", uzbek: "muloqot qilmoq" },
      { english: "access", uzbek: "kirish / imkoniyat" },
      { english: "information", uzbek: "ma'lumot" },
      { english: "update", uzbek: "yangilamoq" },
      { english: "innovation", uzbek: "yangilik / innovatsiya" },
      { english: "digital", uzbek: "raqamli" },
      { english: "artificial intelligence", uzbek: "sun'iy intellekt" },
      { english: "automate", uzbek: "avtomatlashtirmoq" },
      { english: "efficient", uzbek: "samarali" },
      { english: "convenient", uzbek: "qulay" }
    ],
    phrases: [
      { english: "Technology has changed…", uzbek: "Texnologiya …ni o‘zgartirdi" },
      { english: "One major advantage is…", uzbek: "Bitta asosiy afzalligi bu…" },
      { english: "On the other hand…", uzbek: "Boshqa tomondan esa…" }
    ]
  },
  {
    dayNumber: 6,
    theme: "Success / Growth",
    words: [
      { english: "success", uzbek: "muvaffaqiyat" },
      { english: "failure", uzbek: "muvaffaqiyatsizlik" },
      { english: "goal", uzbek: "maqsad" },
      { english: "dream", uzbek: "orzu" },
      { english: "ambition", uzbek: "intilish" },
      { english: "effort", uzbek: "harakat / urinish" },
      { english: "struggle", uzbek: "kurash / qiyinchilik" },
      { english: "challenge", uzbek: "qiyinchilik" },
      { english: "opportunity", uzbek: "imkoniyat" },
      { english: "responsibility", uzbek: "mas'uliyat" },
      { english: "decision", uzbek: "qaror" },
      { english: "sacrifice", uzbek: "qurbonlik" },
      { english: "patience", uzbek: "sabr-toqat" },
      { english: "consistency", uzbek: "barqarorlik" },
      { english: "improve", uzbek: "yaxshilamoq" },
      { english: "develop", uzbek: "rivojlanmoq" },
      { english: "achieve", uzbek: "erishmoq" },
      { english: "overcome", uzbek: "yengib o'tmoq" },
      { english: "growth", uzbek: "o'sish" },
      { english: "mindset", uzbek: "fikrlash tarzi" },
      { english: "discipline", uzbek: "intizom" }
    ],
    phrases: [
      { english: "Success doesn’t come overnight…", uzbek: "Muvaffaqiyat bir kechada kelmaydi…" },
      { english: "One thing I learned is…", uzbek: "Men o‘rgangan narsalardan biri bu…" },
      { english: "Failure teaches us…", uzbek: "Muvaffaqiyatsizlik bizga …ni o‘rgatadi" }
    ]
  },
  {
    dayNumber: 7,
    theme: "Advanced Speaking",
    words: [
      { english: "crucial", uzbek: "o'ta muhim" },
      { english: "essential", uzbek: "zaruriy / muhim" },
      { english: "significant", uzbek: "ahamiyatli" },
      { english: "enormous", uzbek: "ulkan / juda katta" },
      { english: "outstanding", uzbek: "ajoyib / ko'zga ko'ringan" },
      { english: "terrible", uzbek: "dahshatli / yomon" },
      { english: "challenging", uzbek: "qiyin / sinovli" },
      { english: "demanding", uzbek: "talabchan" },
      { english: "straightforward", uzbek: "oddiy / tushunarli" },
      { english: "impact", uzbek: "ta'sir" },
      { english: "influence", uzbek: "ta'sir qilmoq / ta'sir" },
      { english: "maintain", uzbek: "saqlamoq" },
      { english: "transform", uzbek: "butunlay o'zgartirmoq" },
      { english: "adapt", uzbek: "moslashmoq" },
      { english: "survive", uzbek: "tirik qolmoq" },
      { english: "inspire", uzbek: "ilhomlantirmoq" },
      { english: "motivate", uzbek: "rag'batlantirmoq" },
      { english: "encourage", uzbek: "qo'llab-quvvatlamoq" },
      { english: "leadership", uzbek: "yetakchilik" },
      { english: "communication", uzbek: "muloqot" },
      { english: "potential", uzbek: "salohiyat" }
    ],
    phrases: [
      { english: "What I mean is…", uzbek: "Aytmoqchi bo‘lganim shuki…" },
      { english: "Let me put it this way…", uzbek: "Keling, buni bunday tushuntiray…" },
      { english: "The first thing that comes to mind is…", uzbek: "Hayolga kelgan birinchi narsa bu…" }
    ]
  }
];

export const SCHEDULE_TEMPLATES: ScheduleItem[] = [
  {
    id: "sch-01",
    time: "06:00",
    title: "Uyg‘onish & Fresh Start",
    duration: "15 min",
    description: "Start your morning with fresh habits before speaking.",
    instructions: [
      "Suv ich (Drink water to hydrate your vocal cords).",
      "Yuzni yuv (Wash your face with cold water).",
      "5 min stretching (Do gentle stretching to activate blood flow)."
    ],
    tips: ["Water is fuel for your vocal control today. Don't skip!"],
    type: "routine"
  },
  {
    id: "sch-02",
    time: "06:15",
    title: "Protein Boost",
    duration: "15 min",
    description: "Fuel your body for speaking energy.",
    instructions: [
      "1 scoop protein (or a nutritious snack) with water/milk.",
      "This provides crucial cognitive energy for speaking without getting tired."
    ],
    type: "routine"
  },
  {
    id: "sch-03",
    time: "06:30",
    title: "Brain Activation (ENG MUHIM)",
    duration: "20 min",
    description: "Force your brain to switch entirely into English thinking mode.",
    instructions: [
      "Faqat inglizcha o‘yla. Faqat ovoz chiqarib gapir (Speak out loud, think ONLY in English).",
      "Use prompt questions to build continuous flow.",
      "If stuck, O'ZBEKCHA SOH'Z ISHLATISH TAQIQLANADI! (Strictly forbidden to use Uzbek words).",
      "Instead of stopping, use placeholder words: 'thing', 'stuff', 'something', 'somehow'."
    ],
    tips: [
      "Grammar mistakes are totally fine! Priority = Flow (To'xtovsiz gapirish)."
    ],
    type: "brain_activation"
  },
  {
    id: "sch-04",
    time: "07:00",
    title: "Shadowing Accent Training",
    duration: "40 min",
    description: "Adapt a native rhythm, stress, and pronunciation accent.",
    instructions: [
      "Find a professional speaker's interview or podcast.",
      "Listen for 5 seconds.",
      "Pause.",
      "EXACT COPY: Imitate the accent, rhythm, pitch, and stress immediately.",
      "Re-listen and repeat until it sounds perfectly matched."
    ],
    tips: [
      "Recommended: Steve Jobs speeches, Elon Musk interviews, TED talks, or podcast hosts."
    ],
    type: "shadowing"
  },
  {
    id: "sch-05",
    time: "08:00",
    title: "Mindful Breakfast",
    duration: "1 hour",
    description: "Peaceful morning breakfast without cell phone distractions.",
    instructions: [
      "TELEFON YO‘Q (Strictly no phone at breakfast).",
      "Eat mindfully, prepare your mental clarity for the big drills ahead."
    ],
    type: "routine"
  },
  {
    id: "sch-06",
    time: "09:00",
    title: "Pattern Training (Structure Drill)",
    duration: "1 hour",
    description: "Structure sentence layouts to express yourself fluidly in 7 functional groups.",
    instructions: [
      "Go through the 22 core conversational patterns.",
      "Memorize them, and force yourself to speak them out loud 10 times in solid sentences."
    ],
    tips: ["Opinion, Adding, Reason, Comparing, Uncertainty, Example, and Ending structures."],
    type: "pattern"
  },
  {
    id: "sch-07",
    time: "10:30",
    title: "Fast Speaking Drill (No Pauses)",
    duration: "45 min",
    description: "Overcome fear of mistakes. Perfect isn't the goal; flow is.",
    instructions: [
      "Pick one speaking topic (Education, Money, Friendship, Technology, Health).",
      "Start a timer for continuous talking.",
      "RULE: To'xtash taqiqlanadi (No pauses or silence permitted).",
      "If you forget a word, speak broken/wrong English or say 'scrolling thing' instead of phone."
    ],
    type: "speaking_topic"
  },
  {
    id: "sch-08",
    time: "12:00",
    title: "Fuel & Power Lunch",
    duration: "1 hour",
    description: "Lunch break. Take a short walk or sit in silence.",
    instructions: [
      "Enjoy your food and let your vocal cords rest."
    ],
    type: "routine"
  },
  {
    id: "sch-09",
    time: "13:00",
    title: "Vocabulary Upgrade (Strong Words)",
    duration: "1.5 hours",
    description: "Transform your speech from weak intermediate to strong academic/native terms.",
    instructions: [
      "Practice the Day's vocabulary words (40 active items including Weak -> Strong maps).",
      "DO NOT JUST MEMORIZE: Write and speak 1 real-world sentence per word.",
      "Example: 'This is crucial for my future' instead of 'This is important'."
    ],
    type: "vocab_upgrade"
  },
  {
    id: "sch-10",
    time: "15:00",
    title: "Sentence Expansion Drill (Miyani Majburlash)",
    duration: "2 hours",
    description: "Stretch small simple sentences into rich complex details to boost active retrieval.",
    instructions: [
      "Start with a tiny sentence: 'I like football.'",
      "Level 2 (Add a reason): 'I like football because it is exciting.'",
      "Level 3 (Add a benefit/action): 'I like football because it is exciting and helps me relax.'",
      "Level 4 (Add a context/time): 'I like football because it is exciting and helps me relax after a stressful day.'",
      "Perform this stretching drill on different sentences to force your brain outward."
    ],
    type: "expansion"
  },
  {
    id: "sch-11",
    time: "17:00",
    title: "Speaking Under Pressure (High Speed)",
    duration: "1 hour",
    description: "Train your brain to respond immediately under cold-call constraints.",
    instructions: [
      "Select a random challenging question from the deck.",
      "Within EXACTLY 3 seconds, you must start speaking.",
      "O'ylash yo'q (No over-thinking, just immediate vocal flow)."
    ],
    type: "pressure"
  },
  {
    id: "sch-12",
    time: "19:00",
    title: "Active Listening Phrase Theft",
    duration: "40 min",
    description: "Listen to natural English to steal actual authentic phrasing structures.",
    instructions: [
      "Listen to an English conversation, podcast, or interview.",
      "STEAL PHRASES: Write down exactly 10 golden formulas used by the native speakers."
    ],
    type: "listening"
  },
  {
    id: "sch-13",
    time: "20:00",
    title: "Mirror Speaking (Body Language)",
    duration: "20 min",
    description: "Speak with physical presence to build overall confidence and posture.",
    instructions: [
      "Stand in front of a mirror.",
      "Speak continuously on your day's topic for 20 minutes.",
      "Pay attention to eye contact, hand gestures, and confident body language."
    ],
    type: "mirror"
  },
  {
    id: "sch-14",
    time: "21:00",
    title: "Voice Record & Audio Review",
    duration: "15 min",
    description: "Self-correct bottlenecks. Record yourself, listen back, and note down hesitation areas.",
    instructions: [
      "Record yourself speaking for 2 minutes on: 'Why will my English improve?'",
      "Listen to the playback carefully.",
      "Check: Where did I get stuck? Where were the pauses? What words did I repeat?"
    ],
    type: "recording"
  },
  {
    id: "sch-15",
    time: "22:00",
    title: "Sleep & Recovery",
    duration: "8 hours",
    description: "Vocal and cognitive rest are required to solidify memory patterns.",
    instructions: [
      "Sleep at least 7-8 hours.",
      "Poor sleep directly slows down real-time word retrieval tomorrow!"
    ],
    type: "routine"
  }
];

export const WEAK_STRONG_PAIRS = [
  { weak: "good", strong: ["excellent", "outstanding"], uzbek: "yaxshi → ajoyib, ko'zga ko'ringan" },
  { weak: "bad", strong: ["terrible", "awful"], uzbek: "yomon → daxshatli" },
  { weak: "big", strong: ["massive", "enormous"], uzbek: "katta → ulkan" },
  { weak: "small", strong: ["tiny", "compact"], uzbek: "kichik → mitti, ixcham" },
  { weak: "important", strong: ["crucial", "essential"], uzbek: "muhim → o'ta muhim, zaruriy" },
  { weak: "hard", strong: ["challenging", "demanding"], uzbek: "qiyin → sinovli, talabchan" },
  { weak: "easy", strong: ["straightforward"], uzbek: "oson → oddiy, tushunarli" }
];

export const PATTERNS_DATA: SpeechPattern[] = [
  // Opinion
  { id: "pat-1", phrase: "In my opinion", uzbek: "Mening fikrimcha", category: "Opinion", example: "In my opinion, learning English is crucial for global careers.", uzbekExample: "Mening fikrimcha, ingliz tilini o'rganish xalqaro martaba uchun o'ta muhimdir." },
  { id: "pat-2", phrase: "From my perspective", uzbek: "Mening nuqtai nazarimdan", category: "Opinion", example: "From my perspective, daily consistency beats intense weekly cramming.", uzbekExample: "Mening nuqtai nazarimdan, kunlik barqarorlik haftalik qattiq tayyorgarlikdan ustun turadi." },
  { id: "pat-3", phrase: "As far as I know", uzbek: "Bilishimcha", category: "Opinion", example: "As far as I know, speaking practice is the fastest way to build fluency.", uzbekExample: "Bilishimcha, so'zlashuv amaliyoti ravonlikni rivojlantirishning eng tezkor usulidir." },
  { id: "pat-4", phrase: "If you ask me", uzbek: "Mendan so'rasangiz", category: "Opinion", example: "If you ask me, real-time word retrieval is our biggest challenge.", uzbekExample: "Mendan so'rasangiz, so'zlarni tezda eslash bizning eng katta qiyinchiligimizdir." },
  
  // Adding
  { id: "pat-5", phrase: "Besides that", uzbek: "Bundan tashqari", category: "Adding", example: "Besides that, listening to podcasts helps you steal authentic phrases.", uzbekExample: "Bundan tashqari, podkastlarni eshitish sizga haqiqiy iboralarni o'zlashtirishga yordam beradi." },
  { id: "pat-6", phrase: "On top of that", uzbek: "Bundan tashqari / Boz ustiga", category: "Adding", example: "On top of that, mirror speaking builds amazing body language.", uzbekExample: "Boz ustiga, ko'zgu oldida gapirish ajoyib tana tilini shakllantiradi." },
  { id: "pat-7", phrase: "In addition", uzbek: "Qo'shimcha ravishda", category: "Adding", example: "In addition, healthy sleep ensures rapid memory recall.", uzbekExample: "Qo'shimcha ravishda, sog'lom uyqu xotiradan tez eslashni ta'minlaydi." },
  
  // Reason
  { id: "pat-8", phrase: "The reason is", uzbek: "Sababi shundaki", category: "Reason", example: "The reason is that our brain needs pressure constraints to expand.", uzbekExample: "Sababi shundaki, miyamiz rivojlanishi uchun bosim ostida ishlash qiyinchiliklariga muhtoj." },
  { id: "pat-9", phrase: "This is because", uzbek: "Chunki", category: "Reason", example: "This is because shadowing copies native vocal pacing.", uzbekExample: "Chunki shadowing texnikasi neytiv ma'ruzachining talaffuz sur'atini aynan ko'chiradi." },
  { id: "pat-10", phrase: "One possible reason is", uzbek: "Yana bir ehtimoliy sabab bu", category: "Reason", example: "One possible reason is that we fear making grammar mistakes.", uzbekExample: "Yana bir ehtimoliy sabab bu bizning grammatik xatolar qilishdan qo'rqishimizdir." },
  
  // Comparing
  { id: "pat-11", phrase: "Compared to", uzbek: "Taqqoslaganda", category: "Comparing", example: "Compared to reading textbooks, live speaking builds actual muscle memory.", uzbekExample: "Darsliklarni o'qish bilan taqqoslaganda, amaliy so'zlashuv haqiqiy mushak xotirasini shakllantiradi." },
  { id: "pat-12", phrase: "Similar to", uzbek: "O'xshash ravishda", category: "Comparing", example: "Similar to sports, speaking gets easier with everyday workouts.", uzbekExample: "Sportga o'xshab, so'zlashuv ham har kungi mashqlar bilan osonlashib boradi." },
  { id: "pat-13", phrase: "Unlike", uzbek: "Farqli o'laroq", category: "Comparing", example: "Unlike writing, you cannot edit your spoken sentences on the fly.", uzbekExample: "Yozishdan farqli o'laroq, siz gapirayotgan gaplaringizni darhol tahrirlay olmaysiz." },
  
  // Uncertainty
  { id: "pat-14", phrase: "I’m not sure but", uzbek: "To'liq ishonchim komil emas, lekin", category: "Uncertainty", example: "I'm not sure but I think accent changes after 3 months of shadowing.", uzbekExample: "To'liq ishonchim komil emas, lekin menimcha, 3 oylik shadowing mashqlaridan so'ng aksent o'zgaradi." },
  { id: "pat-15", phrase: "If I’m not mistaken", uzbek: "Adashmayotgan bo'lsam", category: "Uncertainty", example: "If I'm not mistaken, Steve Jobs had great rhetorical pauses.", uzbekExample: "Adashmayotgan bo'lsam, Stiv Jobs daho darajasida ritorik pauzalar qilgan." },
  { id: "pat-16", phrase: "I guess", uzbek: "Taxminimcha", category: "Uncertainty", example: "I guess speaking wrong English is better than staying quiet.", uzbekExample: "Menimcha (taxminimcha), xatolar bilan inglizcha gapirish jim turishdan ancha yaxshiroq." },
  
  // Example
  { id: "pat-17", phrase: "For example", uzbek: "Masalan", category: "Example", example: "For example, you can expand 'I feel lazy' into four rich levels.", uzbekExample: "Masalan, siz 'I feel lazy' (dangasalik qilyapman) gapini 4 ta boyitilgan darajaga kengaytirishingiz mumkin." },
  { id: "pat-18", phrase: "For instance", uzbek: "Misol uchun", category: "Example", example: "For instance, use placeholder words when stuck.", uzbekExample: "Misol uchun, so'z topolmay qolganingizda to'xtatuvchi so'zlardan (placeholders) foydalaning." },
  { id: "pat-19", phrase: "To illustrate", uzbek: "Tushuntirib berish uchun / Masalan", category: "Example", example: "To illustrate, notice how children copy language by ear.", uzbekExample: "Buni tushuntirish uchun, bolalarning tilni eshitib qanday o'zlashtirishiga e'tibor bering." },
  
  // Ending
  { id: "pat-20", phrase: "Overall", uzbek: "Umuman olganda", category: "Ending", example: "Overall, consistency is the ultimate driver of personal growth.", uzbekExample: "Umuman olganda, barqarorlik shaxsiy o'sishning bosh harakatlantiruvchisidir." },
  { id: "pat-21", phrase: "In short", uzbek: "Qisqasi / Muxtasar qilib aytganda", category: "Ending", example: "In short, speak out loud for at least two hours a day.", uzbekExample: "Qisqasi, kuniga kamida ikki soat ovoz chiqarib gapiring." },
  { id: "pat-22", phrase: "To sum up", uzbek: "Xulosa qilib aytganda", category: "Ending", example: "To sum up, follow this schedule and watch your English take off.", uzbekExample: "Xulosa qilib aytganda, ushbu jadvalga rioya qiling va ingliz tilingiz o'sishini kuzating." }
];

export const FILLER_PHRASES_DATA = [
  { phrase: "Let me think", description: "Menga o'ylash uchun vaqt bering", usage: "Used to buy 2-3 seconds before answering." },
  { phrase: "That’s interesting", description: "Bu qiziqarli", usage: "Perfect first reaction to a sudden hard question." },
  { phrase: "Well…", description: "Xullas… / Shunday qilib…", usage: "An easy filler to start any sentence smoothly." },
  { phrase: "Actually…", description: "Aslini olganda…", usage: "Corrects a misconception or starts an honest opinion." },
  { phrase: "Basically…", description: "Asosan…", usage: "Simplifies a complex point." },
  { phrase: "To be honest…", description: "Ochig'ini aytsam…", usage: "Expresses feelings or admits a struggle." },
  { phrase: "As far as I know…", description: "Bilishimcha…", usage: "Flags that your answer is to the best of your knowledge." },
  { phrase: "If I’m not mistaken…", description: "Adashmayotgan bo'lsam…", usage: "Polite way to introduce a fact you guess is true." },
  { phrase: "I guess…", description: "O'ylaymanki…", usage: "Softens a claim or guess." },
  { phrase: "Probably…", description: "Ehtimol…", usage: "Adds healthy margin for probability." },
  { phrase: "It depends", description: "Bu vaziyatga bog'liq", usage: "Allows you to split the response into two perspectives." },
  { phrase: "For example…", description: "Masalan…", usage: "Launches into a supporting story." },
  { phrase: "For instance…", description: "Misol uchun…", usage: "Slightly more formal equivalent to 'for example'." },
  { phrase: "In other words…", description: "Boshqacha aytganda…", usage: "Restates a previous point split over simpler concepts." },
  { phrase: "Compared to…", description: "Taqqoslaganda…", usage: "Begins a balanced comparison." },
  { phrase: "Similar to…", description: "O'xshash…", usage: "Points to an analogy." },
  { phrase: "Overall…", description: "Umuman olganda…", usage: "Pulls multiple ideas into a single conclusion." },
  { phrase: "In short…", description: "Qisqasi…", usage: "Expresses a summary in very few words." },
  { phrase: "To sum up…", description: "Xulosa qilganda…", usage: "Signals you've reached your final statement." },
  { phrase: "The reason is…", description: "Sababi shuki…", usage: "Directly leads the listener to your motivation." }
];

export const SHADOWING_RESOURCES = [
  {
    title: "Steve Jobs Stanford Commencement Speech",
    url: "https://www.youtube.com/watch?v=UF8uR6Z6KLc",
    tags: ["Inspirational", "Clear Speech", "Classic Accent"],
    description: "Great pronunciation, beautiful rhetorical pauses, and rich storytelling styles."
  },
  {
    title: "Elon Musk Interview on Future of AI",
    url: "https://www.youtube.com/watch?v=hRYj-H1K8Uo",
    tags: ["Tech", "Interview Style", "Natural Hesitation"],
    description: "Ideal for copying natural stuttering, correction patterns, and analytical vocabulary."
  },
  {
    title: "IELTS Speaking Band 9 Exam",
    url: "https://www.youtube.com/watch?v=sRFEVvLuC9g",
    tags: ["Exam Prep", "Structured Topic", "Excellent Accent"],
    description: "Shows exactly how to respond structured under academic rubrics and templates."
  },
  {
    title: "The Joe Rogan Podcast - Conversation Flow",
    url: "https://www.youtube.com/watch?v=5t1f_yN_b30",
    tags: ["Conversational", "Slang & Idioms", "Very Fast pacing"],
    description: "Great for listening to high-speed casual banter, jokes, and fast phrase insertion."
  }
];

export const PRESSURE_QUESTIONS = [
  { english: "Should kids use mobile phones at a young age?", uzbek: "Bolalar yoshligidan mobil telefonlardan foydalanishi kerakmi?" },
  { english: "Is money the most important factor in a happy career?", uzbek: "Baxtli martaba (karyera) uchun pul eng muhim omilmi?" },
  { english: "Describe your hometown and what makes it unique.", uzbek: "O'zingiz tug'ilib o'sgan shahringiz va uni nima o'zgacha qilishini tasvirlab bering." },
  { english: "If you had to talk about deep space travel, what is your stance?", uzbek: "Agar koinot qa'riga sayohat haqida gapirishingiz kerak bo'lsa, sizning pozitsiyangiz qanday bo'lardi?" },
  { english: "Do you think artificial intelligence will replace teachers soon?", uzbek: "Sizningcha, yaqin orada sun'iy intellekt o'qituvchilar o'rnini egallaydimi?" },
  { english: "How does consistency change a person's life?", uzbek: "Tizimlilik/Muntazamlik (izchillik) inson hayotini qanday o'zgartiradi?" },
  { english: "Should people live without using social media?", uzbek: "Insonlar ijtimoiy tarmoqlardan foydalanmasdan yashashlari kerakmi?" },
  { english: "What is the best way to spend a free Sunday morning?", uzbek: "Yakshanba tongini bo'sh o'tkazishning eng yaxshi usuli qaysi?" },
  { english: "Is studying abroad always better than studying locally?", uzbek: "Chet elda o'qish har doim mahalliy o'qishdan ko'ra yaxshiroqmi?" },
  { english: "If you could have any superpower, what would it be and why?", uzbek: "Agar sizda qandaydir g'ayritabiiy kuch bo'lishi mumkin bo'lsa, u nima bo'lar edi va nima uchun?" },
  { english: "Is it better to work in a startup or a massive global company?", uzbek: "Startapda ishlash yaxshimi yoki ulkan xalqaro kompaniyadami?" },
  { english: "Describe the most delicious meal you have ever eaten.", uzbek: "Siz o'mriningizda yegan eng mazali taomni tasvirlab bering." },
  { english: "Why do many people find it extremely challenging to wake up at 6:00 AM?", uzbek: "Nima uchun ko'p odamlar ertalab soat 6:00 da uyg'onishni o'ta qiyin deb hisoblashadi?" }
];
