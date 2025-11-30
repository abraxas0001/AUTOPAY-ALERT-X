import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, Calendar as CalendarIcon, CheckCircle2, CreditCard, 
  LayoutDashboard, Trash2, X, ChevronRight, ChevronLeft, Sparkles, 
  Loader2, BrainCircuit, ChevronDown, ChevronUp, Sword, 
  Coins, Globe, Save, Upload, List, 
  CalendarDays, Check, Siren, History, AlertOctagon, 
  Volume2, Play, Edit, Pause
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInAnonymously, onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, 
  query, orderBy, serverTimestamp, setDoc, getDoc
} from 'firebase/firestore';
import { useRotatingImages, calendarDateImages } from './imageRotation';

// --- CONFIGURATION ---

// 1. GEMINI API KEY (PASTED HERE)
const apiKey = "AIzaSyC-_6aJux4CjOEnFJGNbojRtxwvHnAX0O0"; 

// 2. FIREBASE CONFIGURATION (PASTED HERE)
const firebaseConfig = {
  apiKey: "AIzaSyAbLOoOFG1v0excLQY9FMp7cDAbt9IpqVQ",
  authDomain: "auto-pay-alert-x-167d2.firebaseapp.com",
  projectId: "auto-pay-alert-x-167d2",
  storageBucket: "auto-pay-alert-x-167d2.firebasestorage.app",
  messagingSenderId: "730892243480",
  appId: "1:730892243480:web:ed4902bc9b95663986696d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// App ID logic
const appId = 'manga-task-manager-v1';

// --- Gemini API Helper ---
const callGeminiAPI = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Details:", errorData);
      console.error("Full error:", JSON.stringify(errorData, null, 2));
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "System Malfunction. AI Offline.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI service is currently unavailable.";
  }
};

// --- Image Assets (Epic Manga Theme) ---
const mangaArt = {
  samurai_calendar: "/Img/calendar/unnamed (1).jpg", 
  eye_briefing: "/Img/dashboard/unnamed7.jpg",
  city_subs: "/Img/subscriptions/unnamed (2).jpg", 
  slash_task: "/Img/tasks/unnamed (3).jpg",
  default_avatar: "/Img/avatars/Peace of mind.jpeg"
};

// --- Translations ---
const translations: Record<string, any> = {
  en: { home: 'HOME', cal: 'CALENDAR', tasks: 'TASKS', subs: 'AUTO-PAY ALERTS', brief: 'DAILY BRIEFING' },
  jp: { home: 'ホーム (HOME)', cal: 'カレンダー (CALENDAR)', tasks: 'タスク (TASKS)', subs: '自動支払い (AUTO-PAY)', brief: '日次報告' },
  es: { home: 'INICIO', cal: 'CALENDARIO', tasks: 'TAREAS', subs: 'ALERTAS DE PAGO', brief: 'INFORME' },
  fr: { home: 'ACCUEIL', cal: 'CALENDRIER', tasks: 'TÂCHES', subs: 'PAIEMENTS AUTO', brief: 'BRIEFING' },
};

// --- Types ---
type Tab = 'dashboard' | 'calendar' | 'tasks' | 'subs';
type Priority = 'high' | 'medium' | 'low';
type TaskStatus = 'todo' | 'in-progress' | 'done';

interface UserProfile {
  name: string;
  avatar: string;
  currency: string;
  language: 'en' | 'jp' | 'es' | 'fr';
  timezone: string;
  alarmSound: string; 
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: any;
  dueDate?: string;
}

interface Subscription {
  id: string;
  name: string;
  cost: number;
  currency: string;
  cycle: 'monthly' | 'yearly' | 'quarterly' | 'biannual' | 'custom';
  customDays?: number;
  nextBillingDate: string;
  category: string;
  description?: string;
  priority: Priority; 
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  currency: string;
}

// --- Components ---

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-black text-white font-mono relative overflow-hidden">
    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
    <div className="z-10 flex flex-col items-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white mb-8 shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
        <p className="uppercase tracking-[0.5em] text-xl font-black animate-pulse">SYSTEM START</p>
    </div>
  </div>
);

const BrandIcon = ({ name, className }: { name: string, className?: string }) => {
  const [error, setError] = useState(false);
  const domain = name.toLowerCase().replace(/\s/g, '') + '.com';
  const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  if (error) {
    return <CreditCard className={className} />;
  }

  return (
    <img 
      src={iconUrl} 
      alt={name} 
      className={`${className} object-contain rounded-full bg-white p-0.5`} 
      onError={() => setError(true)}
    />
  );
};

const AlarmOverlay = ({ activeAlarms, onDismiss, alarmSound }: { activeAlarms: Subscription[], onDismiss: () => void, alarmSound: string }) => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    if (activeAlarms.length > 0 && alarmSound && alarmSound !== 'custom') {
      audioRef.current = new Audio(alarmSound);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Alarm audio error:", e));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [activeAlarms.length, alarmSound]);

  if (activeAlarms.length === 0) return null;

  const handleDismiss = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-red-600/95 flex flex-col items-center justify-center text-white animate-in fade-in duration-200 backdrop-blur-md p-6 text-center">
      <div className="flex gap-1 h-12 items-center mb-8">
         {[...Array(10)].map((_,i) => (
            <div key={i} className="w-2 bg-white animate-[pulse_0.5s_ease-in-out_infinite]" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
         ))}
      </div>

      <div className="animate-bounce mb-6">
        <Siren className="w-24 h-24 text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]" />
      </div>
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 drop-shadow-md">AUTO-PAY ALERT</h1>
      <p className="text-xl font-mono mb-8 max-w-md border-y-2 border-white/50 py-4">
        CRITICAL: {activeAlarms.length} High-Priority Bills Due.
        <br/>Authorize payment or cancel service immediately.
      </p>
      
      <div className="bg-black/30 p-4 rounded-xl w-full max-w-sm mb-8 border-2 border-white/30 backdrop-blur-sm">
        {activeAlarms.map(sub => (
          <div key={sub.id} className="flex justify-between items-center border-b border-white/20 last:border-0 py-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full p-1 flex items-center justify-center shadow-lg">
                    <BrandIcon name={sub.name} className="w-full h-full" />
                </div>
                <span className="font-bold uppercase text-lg text-left">{sub.name}</span>
            </div>
            <span className="font-mono text-yellow-300 font-bold whitespace-nowrap">{sub.nextBillingDate}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={handleDismiss}
        className="bg-white text-red-600 px-10 py-5 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform flex items-center gap-3"
      >
        <AlertOctagon className="w-6 h-6"/> DISMISS ALARM
      </button>
    </div>
  );
};

const SmartButton = ({ onClick, loading, label, className }: { onClick: () => void, loading: boolean, label: string, className?: string }) => (
  <button 
    onClick={onClick}
    disabled={loading}
    className={`
      relative group overflow-hidden bg-black text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 border-2 border-transparent 
      hover:border-purple-500 transition-all duration-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]
      disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${className}
    `}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-900 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
    <span className="relative z-10 flex items-center gap-2">
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-purple-400" />}
      {label}
    </span>
  </button>
);

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const styles = {
    high: 'bg-black text-white border-black',
    medium: 'bg-neutral-300 text-black border-black',
    low: 'bg-white text-black border-black',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 border-2 ${styles[priority]} font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]`}>
      {priority}
    </span>
  );
};

export default function App() {
  // Dynamic rotating images (changes every 30 minutes)
  const rotatingImages = useRotatingImages();
  const [currentRotation, setCurrentRotation] = useState(rotatingImages);

  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: 'User',
    avatar: currentRotation.avatar || mangaArt.default_avatar,
    currency: '$',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    alarmSound: '/music/Piano.mp3'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  // UI State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [subHistory, setSubHistory] = useState<PaymentHistory[]>([]);
  const [showRemaining, setShowRemaining] = useState(false); 
  
  // Alarm State
  const [activeAlarms, setActiveAlarms] = useState<Subscription[]>([]);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDateDetailOpen, setIsDateDetailOpen] = useState(false);

  // AI State
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [dailyBriefing, setDailyBriefing] = useState<string | null>(null);
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);

  // Image error handler - prevents crashes when images are deleted
  const handleImageError = (imageType: string) => {
    console.warn(`Image failed to load for ${imageType}, using fallback`);
    // The fallback is already handled in imageRotation.ts
    // This just prevents the error from crashing the app
  };

  // Forms
  const [taskForm, setTaskForm] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium' as Priority,
    dueDate: new Date().toISOString().split('T')[0] 
  });
  const [subForm, setSubForm] = useState<Partial<Subscription>>({ 
    name: '', 
    cost: 0, 
    currency: '$', 
    cycle: 'monthly', 
    nextBillingDate: new Date().toISOString().split('T')[0],
    category: 'Entertainment',
    description: '',
    priority: 'medium',
    customDays: 30
  });



  // --- Image Rotation (every 30 minutes) + Orientation Change ---
  useEffect(() => {
    const updateRotation = () => {
      setCurrentRotation(useRotatingImages());
    };
    
    // Update every 30 minutes
    const interval = setInterval(updateRotation, 30 * 60 * 1000);
    
    // Update on window resize/orientation change
    const handleResize = () => {
      updateRotation();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // --- Auth & Data ---
  useEffect(() => {
    const initAuth = async () => {
      await signInAnonymously(auth);
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      } catch (e) { console.error("Profile fetch error", e); }
    };
    fetchProfile();

    const tasksQuery = query(collection(db, 'artifacts', appId, 'users', user.uid, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubTasks = onSnapshot(tasksQuery, (s) => {
      setTasks(s.docs.map(d => ({ id: d.id, ...d.data() } as Task)));
      setLoading(false);
    });

    const subsQuery = query(collection(db, 'artifacts', appId, 'users', user.uid, 'subscriptions'));
    const unsubSubs = onSnapshot(subsQuery, (s) => {
      setSubscriptions(s.docs.map(d => ({ id: d.id, ...d.data() } as Subscription)));
    });

    return () => { unsubTasks(); unsubSubs(); };
  }, [user]);

  // --- Fetch History Logic ---
  const fetchSubHistory = async (subId: string) => {
    if (!user) return;
    const historyQuery = query(
        collection(db, 'artifacts', appId, 'users', user.uid, 'subscriptions', subId, 'history'),
        orderBy('date', 'desc')
    );
    return onSnapshot(historyQuery, (s) => {
        setSubHistory(s.docs.map(d => ({ id: d.id, ...d.data() } as PaymentHistory)));
    });
  };

  useEffect(() => {
    if (activeTab === 'subs' && expandedTaskId) {
        const sub = subscriptions.find(s => s.id === expandedTaskId);
        if (sub) {
            const unsub = fetchSubHistory(sub.id);
            return () => { unsub.then(fn => fn && fn()); };
        }
    }
  }, [expandedTaskId, activeTab, subscriptions]);


  // --- ALARM LOGIC ---
  useEffect(() => {
    if (subscriptions.length === 0) return;

    const checkAlarms = () => {
      const now = new Date();
      const userTimeStr = now.toLocaleString("en-US", { timeZone: profile.timezone });
      const userTime = new Date(userTimeStr);
      
      const currentHour = userTime.getHours();
      const currentMinute = userTime.getMinutes();

      const isTriggerTime = (currentHour === 11 || currentHour === 23) && currentMinute === 0; 

      const triggeredHigh: Subscription[] = [];
      const triggeredMedium: Subscription[] = [];

      subscriptions.forEach(sub => {
        const billingDate = new Date(sub.nextBillingDate);
        const diffTime = billingDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= 7) {
          if (sub.priority === 'high') {
             if (isTriggerTime) triggeredHigh.push(sub);
          } else if (sub.priority === 'medium') {
             if (isTriggerTime) triggeredMedium.push(sub);
          }
        }
      });

      if (triggeredHigh.length > 0) {
        setActiveAlarms(prev => {
            const newAlarms = triggeredHigh.filter(newA => !prev.some(p => p.id === newA.id));
            return [...prev, ...newAlarms];
        }); 
      }
      
      if (triggeredMedium.length > 0 && isTriggerTime) {
        setNotificationMsg(`Warning: ${triggeredMedium.length} Medium Priority subs due soon.`);
        setTimeout(() => setNotificationMsg(null), 8000);
      }
    };

    checkAlarms();
    const interval = setInterval(checkAlarms, 60000); 
    return () => clearInterval(interval);
  }, [subscriptions, profile.timezone]);


  // --- Logic ---
  const totalMonthlyCost = useMemo(() => subscriptions.reduce((acc, s) => {
    let factor = 1;
    if(s.cycle === 'yearly') factor = 1/12;
    if(s.cycle === 'quarterly') factor = 1/4; 
    if(s.cycle === 'biannual') factor = 1/6; 
    return acc + (s.cost * factor);
  }, 0), [subscriptions]);

  const remainingDue = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return subscriptions.reduce((acc, sub) => {
        const billingDate = new Date(sub.nextBillingDate);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        if (billingDate <= endOfMonth) {
            return acc + sub.cost;
        }
        return acc;
    }, 0);
  }, [subscriptions]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for(let i=0; i<firstDay; i++) days.push(null);
    for(let i=1; i<=daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  }, [currentMonth]);

  const groupedTasks = useMemo(() => {
    const general = tasks.filter(t => !t.dueDate);
    const scheduled = tasks.filter(t => t.dueDate).sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1));
    return { general, scheduled };
  }, [tasks]);

  const t = translations[profile.language];

  // --- Actions ---
  const saveProfile = async () => {
    if (!user) return;
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), profile);
    setIsProfileModalOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile(prev => ({ ...prev, alarmSound: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const playPreviewSound = () => {
      // If already playing, stop it
      if (isPreviewPlaying && previewAudioRef.current) {
          previewAudioRef.current.pause();
          previewAudioRef.current = null;
          setIsPreviewPlaying(false);
          return;
      }

      // Play new sound
      if (profile.alarmSound && profile.alarmSound !== 'custom') {
          // Stop any existing audio
          if (previewAudioRef.current) {
              previewAudioRef.current.pause();
              previewAudioRef.current = null;
          }

          previewAudioRef.current = new Audio(profile.alarmSound);
          previewAudioRef.current.volume = 0.5;
          previewAudioRef.current.onended = () => setIsPreviewPlaying(false);
          previewAudioRef.current.play()
              .then(() => setIsPreviewPlaying(true))
              .catch(e => {
                  console.log("Audio play error", e);
                  setIsPreviewPlaying(false);
              });
      } else {
          alert(`Please select an alarm sound first`);
      }
  };

  const handleAiPlan = async () => {
    if(!taskForm.title.trim()) return;
    setIsAiGenerating(true);
    const hasContext = taskForm.description.trim().length > 0;
    const prompt = hasContext ? `Enhance and translate into ${profile.language}: "${taskForm.description}"` : `Create a concise checklist for the task: "${taskForm.title}". Language: ${profile.language}`;
    const text = await callGeminiAPI(prompt);
    setTaskForm(p => ({...p, description: text}));
    setIsAiGenerating(false);
  };

  const handleAiSubAnalysis = async () => {
    if(!subForm.name?.trim()) return;
    setIsAiGenerating(true);
    const text = await callGeminiAPI(`Analyze subscription "${subForm.name}" at ${subForm.cost}. Worth it? Alternatives? Brief. Language: ${profile.language}`);
    setSubForm(p => ({...p, description: text}));
    setIsAiGenerating(false);
  };

  const handleDailyBriefing = async () => {
    setIsGeneratingBriefing(true);
    const pendingCount = tasks.filter(t => t.status !== 'done').length;
    const subTotal = totalMonthlyCost.toFixed(0);
    const prompt = `Briefing: ${pendingCount} tasks, ${profile.currency}${subTotal} monthly burn. 2 sentences. Anime commander style. Language: ${profile.language}`;
    const text = await callGeminiAPI(prompt);
    setDailyBriefing(text);
    setIsGeneratingBriefing(false);
  };

  const handleTestAlarm = () => {
    const dummySub: Subscription = {
        id: 'test-alarm',
        name: 'TEST PROTOCOL',
        cost: 9999,
        currency: profile.currency,
        cycle: 'monthly',
        nextBillingDate: new Date().toISOString().split('T')[0],
        category: 'System',
        priority: 'high'
    };
    setActiveAlarms([dummySub]);
    setIsProfileModalOpen(false);
    playPreviewSound();
  };

  const saveTask = async (keepOpen = false) => {
    if (!taskForm.title.trim() || !user) return;
    const taskData = { ...taskForm, dueDate: taskForm.dueDate || "" };
    if (editingTask) {
      await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'tasks', editingTask.id), taskData);
      setEditingTask(null); setIsTaskModalOpen(false); 
    } else {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'tasks'), { ...taskData, status: 'todo', createdAt: serverTimestamp() });
      if (!keepOpen) setIsTaskModalOpen(false);
      setTaskForm(p => ({ ...p, title: '', description: '' }));
    }
  };

  const saveSub = async () => {
    if (!subForm.name?.trim() || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'subscriptions'), { 
        ...subForm, 
        cost: parseFloat(subForm.cost?.toString() || '0') 
    });
    setIsSubModalOpen(false);
    setSubForm({ name: '', cost: 0, currency: '$', cycle: 'monthly', nextBillingDate: new Date().toISOString().split('T')[0], category: 'Entertainment', description: '', priority: 'medium', customDays: 30 });
  };

  const toggleStatus = async (t: Task) => { await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'tasks', t.id), { status: t.status === 'done' ? 'todo' : 'done' }); };
  const deleteSub = async (id: string) => deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'subscriptions', id));
  
  const deleteHistoryItem = async (subId: string, historyId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'subscriptions', subId, 'history', historyId));
  };

  const renewSub = async (sub: Subscription) => {
    if (!user) return;
    
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'subscriptions', sub.id, 'history'), {
        date: new Date().toISOString(),
        amount: sub.cost,
        currency: sub.currency
    });

    const d = new Date(sub.nextBillingDate);
    if(sub.cycle === 'monthly') d.setMonth(d.getMonth() + 1);
    else if(sub.cycle === 'yearly') d.setFullYear(d.getFullYear() + 1);
    else if(sub.cycle === 'quarterly') d.setMonth(d.getMonth() + 4);
    else if(sub.cycle === 'biannual') d.setMonth(d.getMonth() + 6);
    else if(sub.cycle === 'custom' && sub.customDays) d.setDate(d.getDate() + sub.customDays);
    
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'subscriptions', sub.id), { nextBillingDate: d.toISOString().split('T')[0] });
    
    setActiveAlarms(prev => prev.filter(a => a.id !== sub.id));
  };

  const getRowColor = (nextDate: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(nextDate);
    const diffTime = target.getTime() - today.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days > 20) return 'bg-green-50 border-green-200';
    if (days > 7) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-400';
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex flex-col h-screen min-w-[320px] min-h-[400px] bg-neutral-100 text-neutral-900 font-sans selection:bg-black selection:text-white overflow-hidden relative">
      
      {/* Alarm Overlay */}
      <AlarmOverlay activeAlarms={activeAlarms} onDismiss={() => setActiveAlarms([])} alarmSound={profile.alarmSound} />

      {/* Notifications */}
      {notificationMsg && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9990] bg-black text-white px-6 py-3 rounded-full font-bold shadow-xl border-2 border-white animate-in slide-in-from-top-10">
          {notificationMsg}
        </div>
      )}

      {/* Full Page Background Images - Colorful & Rotating */}
      {activeTab === 'dashboard' && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img 
            src={currentRotation.dashboard} 
            alt="" 
            className="w-full h-full object-cover opacity-75 transition-opacity duration-1000"
            onError={() => handleImageError('dashboard')}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-100/20 via-neutral-100/30 to-neutral-100/50"></div>
        </div>
      )}
      {activeTab === 'tasks' && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img 
            src={currentRotation.tasks} 
            alt="" 
            className="w-full h-full object-cover opacity-75 transition-opacity duration-1000"
            onError={() => handleImageError('tasks')}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-100/20 via-neutral-100/30 to-neutral-100/50"></div>
        </div>
      )}
      {activeTab === 'calendar' && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img 
            src={currentRotation.calendar} 
            alt="" 
            className="w-full h-full object-cover opacity-75 transition-opacity duration-1000"
            onError={() => handleImageError('calendar')}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-100/20 via-neutral-100/30 to-neutral-100/50"></div>
        </div>
      )}
      {activeTab === 'subs' && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img 
            src={currentRotation.subscriptions} 
            alt="" 
            className="w-full h-full object-cover opacity-75 transition-opacity duration-1000"
            onError={() => handleImageError('subscriptions')}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-100/20 via-neutral-100/30 to-neutral-100/50"></div>
        </div>
      )}

      {/* Global Texture */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-multiply"></div>

      {/* Top Bar */}
      <header className="relative z-20 bg-white border-b-4 border-black px-6 py-5 flex justify-between items-center shadow-[0_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/Img/patterns/964122.png" 
            alt="" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        
        <div className="relative z-10 flex flex-col">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none transform -skew-x-6 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] text-white">
            {activeTab === 'dashboard' && t.home}
            {activeTab === 'calendar' && t.cal}
            {activeTab === 'tasks' && t.tasks}
            {activeTab === 'subs' && t.subs}
          </h1>
          <div className="w-12 h-1.5 bg-white mt-1 shadow-md"></div>
        </div>
        <button onClick={() => setIsProfileModalOpen(true)} className="relative z-10 w-14 h-14 rounded-full border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all bg-neutral-200 p-0 group">
          <img src={profile.avatar} alt="User" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
        </button>
      </header>

      <main className="relative z-20 flex-1 overflow-y-auto pb-24 sm:pb-24 md:pb-28 lg:pb-32 px-4 pt-6 scrollbar-hide">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Briefing */}
            <div className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] relative overflow-hidden group min-h-[200px] flex flex-col justify-between">
               <div className="absolute inset-0 z-0 opacity-60 transition-opacity duration-1000"><img src="/Img/dashboard/banners/294071.jpg" alt="Insight" className="w-full h-full object-cover grayscale" onError={() => handleImageError('dashboardBanner')} /></div>
               <div className="relative z-10 p-5 flex justify-between items-start">
                 <div className="flex items-center gap-2 text-white"><BrainCircuit className="w-6 h-6" /><h3 className="font-black uppercase tracking-[0.2em] text-lg">{t.brief}</h3></div>
                 {dailyBriefing && <button onClick={() => setDailyBriefing(null)}><X className="w-5 h-5"/></button>}
               </div>
               <div className="relative z-10 p-5 pt-0">
                 {dailyBriefing ? (<p className="font-mono text-sm leading-relaxed whitespace-pre-line animate-in fade-in slide-in-from-bottom-2 border-l-4 border-white pl-4">{dailyBriefing}</p>) : (
                   <button onClick={handleDailyBriefing} disabled={isGeneratingBriefing} className="w-full bg-white text-black py-3 font-black uppercase flex items-center justify-center gap-2 border-2 border-transparent transition-all active:scale-[0.98]">{isGeneratingBriefing ? <Loader2 className="w-5 h-5 animate-spin"/> : <Sparkles className="w-5 h-5"/>}{isGeneratingBriefing ? "ANALYZING..." : "INITIALIZE REPORT"}</button>
                 )}
               </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => setActiveTab('tasks')} className="bg-white texture-pattern-paper border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:scale-[0.98] transition-transform hover:bg-neutral-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Tasks</p>
                <div className="flex items-baseline gap-1"><span className="text-5xl font-black">{tasks.filter(t => t.status !== 'done').length}</span><span className="text-sm font-bold text-black border-b-2 border-black">PENDING</span></div>
              </div>
              <div onClick={() => setShowRemaining(!showRemaining)} className="bg-white texture-pattern-paper border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:scale-[0.98] transition-transform hover:bg-neutral-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">{showRemaining ? "DUE NOW" : "TOTAL MONTHLY"}</p>
                <div className="flex items-baseline gap-1"><span className="text-5xl font-black">{profile.currency}{showRemaining ? remainingDue.toFixed(0) : totalMonthlyCost.toFixed(0)}</span><span className="text-sm font-bold text-black border-b-2 border-black">/MO</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks */}
        {activeTab === 'tasks' && (
          <div className="space-y-8">
            {groupedTasks.general.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-4 border-black pb-2"><List className="w-5 h-5" /><h2 className="text-xl font-black uppercase italic">GENERAL ORDERS</h2></div>
                {groupedTasks.general.map(task => (
                  <div key={task.id} className="group">
                    <div onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)} className={`border-4 border-black p-4 cursor-pointer transition-transform active:scale-[0.99] ${expandedTaskId === task.id ? 'bg-neutral-50' : 'bg-white hover:border-neutral-600'} flex items-center justify-between relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                      <div className="flex items-center gap-4 relative z-10">
                        <button onClick={(e) => { e.stopPropagation(); toggleStatus(task); }}>{task.status === 'done' ? <div className="w-8 h-8 bg-black flex items-center justify-center border-2 border-black"><CheckCircle2 className="text-white"/></div> : <div className="w-8 h-8 border-2 border-black bg-white"></div>}</button>
                        <div><h3 className={`font-black uppercase text-lg ${task.status === 'done' ? 'line-through text-neutral-400' : ''}`}>{task.title}</h3><div className="flex items-center gap-2 mt-1"><PriorityBadge priority={task.priority} /></div></div>
                      </div>
                      <div className="z-10 relative flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setEditingTask(task); setTaskForm({ title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate || '' }); setIsTaskModalOpen(true); }} className="p-2 hover:bg-neutral-100 border-2 border-black transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95"><Edit className="w-4 h-4" /></button>
                        {expandedTaskId === task.id ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                      </div>
                    </div>
                    {expandedTaskId === task.id && (<div className="mx-2 border-x-4 border-b-4 border-black bg-neutral-900 text-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"><p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">{task.description || "No description."}</p></div>)}
                  </div>
                ))}
              </div>
            )}
            {groupedTasks.scheduled.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-4 border-black pb-2"><CalendarDays className="w-5 h-5" /><h2 className="text-xl font-black uppercase italic">TIMELINE OPERATIONS</h2></div>
                {groupedTasks.scheduled.map(task => (
                  <div key={task.id} className="group">
                    <div onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)} className={`border-4 border-black p-4 cursor-pointer transition-transform active:scale-[0.99] ${expandedTaskId === task.id ? 'bg-neutral-50' : 'bg-white hover:border-neutral-600'} flex items-center justify-between relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                      <div className="flex items-center gap-4 relative z-10">
                        <button onClick={(e) => { e.stopPropagation(); toggleStatus(task); }}>{task.status === 'done' ? <div className="w-8 h-8 bg-black flex items-center justify-center border-2 border-black"><CheckCircle2 className="text-white"/></div> : <div className="w-8 h-8 border-2 border-black bg-white"></div>}</button>
                        <div><h3 className={`font-black uppercase text-lg ${task.status === 'done' ? 'line-through text-neutral-400' : ''}`}>{task.title}</h3><div className="flex items-center gap-2 mt-1"><PriorityBadge priority={task.priority} />{task.dueDate && <span className="text-[10px] font-bold bg-neutral-200 px-1 border border-black">{task.dueDate}</span>}</div></div>
                      </div>
                      <div className="z-10 relative flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setEditingTask(task); setTaskForm({ title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate || '' }); setIsTaskModalOpen(true); }} className="p-2 hover:bg-neutral-100 border-2 border-black transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95"><Edit className="w-4 h-4" /></button>
                        {expandedTaskId === task.id ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                      </div>
                    </div>
                    {expandedTaskId === task.id && (<div className="mx-2 border-x-4 border-b-4 border-black bg-neutral-900 text-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"><p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">{task.description || "No description."}</p></div>)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Calendar */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-white texture-pattern-subtle-lines border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden min-h-[450px]">
              <div className="absolute inset-0 z-0"><img src={currentRotation.calendarSubBackground} alt="Background" className="w-full h-full object-cover object-top opacity-[0.98]" onError={() => handleImageError('calendarSubBackground')} /><div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent"></div></div>
              <div className="relative z-10 flex items-center justify-between mb-6 bg-black text-white p-3 shadow-lg transform -skew-x-2">
                <button onClick={() => { const d = new Date(currentMonth); d.setMonth(d.getMonth()-1); setCurrentMonth(d); }}><ChevronLeft className="w-6 h-6" /></button>
                <h2 className="text-2xl font-black uppercase tracking-[0.2em]">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={() => { const d = new Date(currentMonth); d.setMonth(d.getMonth()+1); setCurrentMonth(d); }}><ChevronRight className="w-6 h-6" /></button>
              </div>
              <div className="relative z-10 grid grid-cols-7 gap-2">
                {['S','M','T','W','T','F','S'].map((d,i) => ( <div key={i} className="text-center text-xs font-black uppercase text-black bg-white texture-pattern-dots border border-black pb-1">{d}</div> ))}
                {calendarDays.map((date, idx) => {
                  if (!date) return <div key={idx}></div>;
                  const dateStr = date.toISOString().split('T')[0];
                  const dayTasks = tasks.filter(t => t.dueDate === dateStr);
                  const isToday = new Date().toDateString() === date.toDateString();
                  const bgImage = isToday ? currentRotation.todayImage : calendarDateImages[date.getDate() % calendarDateImages.length];
                  return (
                    <button key={idx} onClick={() => { setSelectedDate(dateStr); setIsDateDetailOpen(true); }}
                      className={`aspect-[4/5] relative border-2 border-black transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group overflow-hidden ${isToday ? 'shadow-[0_0_12px_2px_rgba(156,163,175,0.6)]' : 'text-black'}`}
                    >
                      <img src={bgImage} alt="" className={`absolute inset-0 w-full h-full object-cover transition-all ${isToday ? 'opacity-70' : 'opacity-40 grayscale group-hover:opacity-60 group-hover:grayscale-0'}`} />
                      <span className="absolute top-1 left-1.5 text-xs font-black z-10 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">{date.getDate()}</span>
                      {dayTasks.length > 0 && (<div className="absolute bottom-1 right-1 flex flex-col items-end gap-0.5 z-10">{dayTasks.slice(0, 3).map((t) => (<div key={t.id} className={`w-1.5 h-1.5 border border-black ${t.status === 'done' ? 'bg-neutral-600' : 'bg-white'}`}></div>))}</div>)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Subs */}
        {activeTab === 'subs' && (
          <div className="space-y-6">
            <div className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
               <div className="absolute inset-0 opacity-60 transition-opacity duration-1000"><img src={currentRotation.subscriptionsBanner} alt="Background" className="w-full h-full object-cover grayscale" /></div>
               <p className="relative z-10 text-xs font-black text-neutral-300 uppercase tracking-[0.3em] mb-1">Total Burn</p>
               <h2 className="relative z-10 text-6xl font-black tracking-tighter text-white drop-shadow-lg">{profile.currency}{totalMonthlyCost.toFixed(0)}</h2>
            </div>
            <div className="space-y-3">
              {subscriptions.map(sub => (
                <div key={sub.id} className="group">
                  <div 
                    className={`border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] flex justify-between items-center hover:bg-neutral-50 transition-all cursor-pointer ${getRowColor(sub.nextBillingDate)}`} 
                    onClick={() => setExpandedTaskId(expandedTaskId === sub.id ? null : sub.id)}
                  >
                     <div className="flex items-center gap-3">
                       <div className="w-12 h-12 border-2 border-black bg-white flex items-center justify-center p-1">
                         <BrandIcon name={sub.name} className="w-full h-full" />
                       </div>
                       <div><h4 className="font-black uppercase text-sm">{sub.name}</h4><p className="text-[10px] font-mono text-neutral-500 uppercase">{sub.cycle}</p></div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="text-right flex flex-col items-end">
                            <p className="font-black text-xl">{profile.currency}{sub.cost}</p>
                            <div className="text-[9px] font-bold uppercase bg-white/80 px-1 inline-block border border-black">
                                <span className="text-neutral-500 mr-1">DUE:</span>
                                {sub.nextBillingDate}
                            </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); renewSub(sub); }} className="p-2 bg-green-100 border-2 border-black hover:bg-green-200" title="Mark Paid"><Check className="w-4 h-4 text-green-700" /></button>
                        <button onClick={(e) => { e.stopPropagation(); deleteSub(sub.id); }} className="p-2 bg-red-100 border-2 border-black hover:bg-red-200" title="Remove"><Trash2 className="w-4 h-4 text-red-700" /></button>
                     </div>
                  </div>
                  
                  {expandedTaskId === sub.id && (
                    <div className="mx-2 border-x-2 border-b-2 border-black bg-white texture-pattern-dots p-4 text-xs font-mono animate-in slide-in-from-top-2 shadow-inner">
                      <div className="mb-4 border-b border-black/20 pb-2">
                        <div className="flex items-center gap-2 mb-2 text-black font-black uppercase tracking-widest"><History className="w-3 h-3"/> Payment History</div>
                        {subHistory.length > 0 ? (
                            subHistory.map(h => (
                                <div key={h.id} className="flex justify-between items-center text-neutral-600 mb-2 bg-neutral-100 p-2 rounded border border-neutral-200">
                                    <span>{new Date(h.date).toLocaleDateString()}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold">{h.currency}{h.amount}</span>
                                        <button onClick={() => deleteHistoryItem(sub.id, h.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-3 h-3"/></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-neutral-400 italic">No history recorded yet.</p>
                        )}
                      </div>
                      {sub.description && (
                        <><div className="flex items-center gap-2 mb-1 text-purple-600 font-bold uppercase tracking-widest"><BrainCircuit className="w-3 h-3"/> AI Analysis</div><p className="leading-relaxed bg-purple-50 p-2 border border-purple-200 text-purple-900">{sub.description}</p></>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- MODALS --- */}
      
      {/* PROFILE MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md border-4 border-white p-1">
            <div className="bg-white texture-pattern-paper border-4 border-black p-6">
              <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-2">
                <h2 className="font-black text-2xl uppercase italic tracking-tighter transform -skew-x-6">Operator Config</h2>
                <button onClick={() => setIsProfileModalOpen(false)}><X className="w-8 h-8 stroke-[3]"/></button>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="w-20 h-20 border-4 border-black flex-shrink-0 overflow-hidden bg-neutral-200 relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <img src={profile.avatar} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Upload className="w-6 h-6 text-white"/></div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div><label className="block text-[10px] font-black uppercase tracking-widest mb-1">Codename</label><input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-neutral-100 border-2 border-black p-2 font-bold uppercase"/></div>
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-[10px] font-black uppercase border-2 border-black px-2 py-1 hover:bg-neutral-100"><Upload className="w-3 h-3"/> Upload Image</button>
                  </div>
                </div>
                
                {/* Sound Selection */}
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Volume2 className="w-3 h-3"/> Alarm Sound</label>
                    <div className="flex gap-2">
                        <select value={profile.alarmSound} onChange={e => setProfile({...profile, alarmSound: e.target.value})} className="flex-1 bg-neutral-100 border-2 border-black p-2 font-bold text-xs">
                            <option value="/music/Piano.mp3">Piano</option>
                            <option value="/music/Hugo Boss.mp3">Hugo Boss</option>
                            <option value="/music/Mi gente ringtone .mp3">Mi Gente</option>
                            <option value="/music/One dance.mp3">One Dance</option>
                            <option value="/music/Talk dirty to me.mp3">Talk Dirty</option>
                            <option value="/music/Turkish Music.mp3">Turkish Music</option>
                            <option value="custom">Custom Upload...</option>
                        </select>
                        {profile.alarmSound === 'custom' && (
                            <button onClick={() => audioInputRef.current?.click()} className="bg-black text-white px-3 border-2 border-black"><Upload className="w-4 h-4"/></button>
                        )}
                        <button onClick={playPreviewSound} className={`${isPreviewPlaying ? 'bg-red-500' : 'bg-green-500'} text-white px-3 border-2 border-black transition-colors`}>
                            {isPreviewPlaying ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
                        </button>
                        <input type="file" ref={audioInputRef} className="hidden" accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg,audio/aac,audio/flac,audio/m4a,audio/*" onChange={handleAudioSelect} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Coins className="w-3 h-3"/> Currency</label>
                    <select value={profile.currency} onChange={e => setProfile({...profile, currency: e.target.value})} className="w-full bg-neutral-100 border-2 border-black p-2 font-bold"><option value="$">USD ($)</option><option value="€">EUR (€)</option><option value="¥">JPY (¥)</option><option value="₹">INR (₹)</option><option value="£">GBP (£)</option></select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Globe className="w-3 h-3"/> Language</label>
                    <select value={profile.language} onChange={e => setProfile({...profile, language: e.target.value as any})} className="w-full bg-neutral-100 border-2 border-black p-2 font-bold"><option value="en">English</option><option value="jp">Japanese</option><option value="es">Spanish</option><option value="fr">French</option></select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                   <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Globe className="w-3 h-3"/> Timezone</label>
                      <select value={profile.timezone} onChange={e => setProfile({...profile, timezone: e.target.value})} className="w-full bg-neutral-100 border-2 border-black p-2 font-bold text-xs">
                        {Intl.supportedValuesOf('timeZone').map(tz => (<option key={tz} value={tz}>{tz}</option>))}
                      </select>
                   </div>
                </div>
                <div className="pt-2 border-t border-black">
                    <button onClick={handleTestAlarm} className="w-full bg-red-600 text-white border-2 border-black py-2 font-black uppercase tracking-widest hover:bg-red-700 flex items-center justify-center gap-2"><Siren className="w-4 h-4"/> TEST ALARM SYSTEM</button>
                </div>
                <button onClick={saveProfile} className="w-full bg-black text-white border-2 border-black py-3 font-black uppercase tracking-widest hover:bg-neutral-800 flex items-center justify-center gap-2 mt-2"><Save className="w-4 h-4" /> Save Config</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Creator FAB */}
      <button onClick={() => { 
        setEditingTask(null); 
        if (activeTab === 'subs') {
          setIsSubModalOpen(true);
        } else if (activeTab === 'calendar') {
          setTaskForm({ title: '', description: '', priority: 'medium', dueDate: new Date().toISOString().split('T')[0] });
          setIsTaskModalOpen(true);
        } else {
          setTaskForm({ title: '', description: '', priority: 'medium', dueDate: new Date().toISOString().split('T')[0] });
          setIsTaskModalOpen(true);
        }
      }} className="fixed z-[90] w-16 h-16 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 bottom-28 sm:bottom-28 md:bottom-32 lg:bottom-36 right-6 sm:right-6 md:right-8 lg:right-12 xl:right-[calc(50vw-32rem)] bg-black border-4 border-white text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 active:bg-neutral-800"><Plus className="w-8 h-8 stroke-[3]" /></button>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] py-4 px-4 sm:py-4 sm:px-6 md:py-5 md:px-8 lg:max-w-screen-lg lg:mx-auto xl:max-w-screen-xl flex justify-center items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 transition-all duration-300 pointer-events-none">
        <div className="pointer-events-auto flex gap-2 sm:gap-4 md:gap-6 lg:gap-8">
        {[ { id: 'dashboard', icon: LayoutDashboard, label: t.home }, { id: 'calendar', icon: CalendarIcon, label: t.cal }, { id: 'tasks', icon: Sword, label: t.tasks }, { id: 'subs', icon: Coins, label: t.subs } ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id as Tab)} 
            className={`flex flex-col items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3.5 rounded-lg transition-all duration-300 ease-out group ${
              activeTab === item.id 
                ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-105' 
                : 'text-neutral-500 hover:text-black hover:bg-neutral-100 hover:scale-105 active:scale-95'
            }`}
          >
            <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] transition-transform duration-300 ${activeTab === item.id ? '' : 'group-hover:scale-110'}`} />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider mt-1">{item.label}</span>
          </button>
        ))}
        </div>
      </nav>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md border-4 border-white p-1">
             <div className="bg-white texture-pattern-paper border-4 border-black p-6">
               <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-2"><h2 className="font-black text-2xl uppercase italic">{editingTask ? 'Edit Task' : 'New Task'}</h2><button onClick={() => setIsTaskModalOpen(false)}><X className="w-8 h-8 stroke-[3]"/></button></div>
               <div className="space-y-4">
                 <div><label className="block text-[10px] font-black uppercase tracking-widest mb-1">Identify Target</label><input value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="w-full h-12 bg-neutral-100 border-2 border-black p-3 font-bold uppercase" placeholder="MISSION OBJECTIVE..." /></div>
                 <div className="grid grid-cols-2 gap-4">
                   <div><label className="block text-[10px] font-black uppercase tracking-widest mb-1">Execution Date</label><input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} className="w-full h-12 bg-neutral-100 border-2 border-black p-2 font-mono text-sm"/></div>
                   <div><label className="block text-[10px] font-black uppercase tracking-widest mb-1">Class</label><select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value as Priority})} className="w-full h-12 bg-neutral-100 border-2 border-black p-2 font-bold uppercase"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
                 </div>
                 <div className="flex justify-between items-center mb-1"><label className="block text-[10px] font-black uppercase tracking-widest">Tactical Briefing</label><SmartButton onClick={handleAiPlan} loading={isAiGenerating} label={taskForm.description.trim().length > 0 ? "Enhance Intel" : "Auto-Plan"} /></div>
                 <textarea value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} className="w-full h-24 bg-neutral-100 border-2 border-black p-3 font-mono text-xs" placeholder="Enter mission details..."/>
                 <div className="flex gap-3"><button onClick={() => saveTask(true)} className="flex-1 border-2 border-black py-3 font-black uppercase">Save & Next</button><button onClick={() => saveTask(false)} className="flex-[2] bg-black text-white border-2 border-black py-3 font-black uppercase hover:bg-neutral-800">Save</button></div>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Sub Modal */}
      {isSubModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white texture-pattern-paper w-full max-w-md border-4 border-black p-6">
             <div className="flex justify-between items-center mb-6"><h2 className="font-black text-xl uppercase">New Alert</h2><button onClick={() => setIsSubModalOpen(false)}><X className="w-6 h-6"/></button></div>
             <div className="space-y-4">
                <div><label className="block text-[10px] font-black uppercase tracking-widest mb-1">Asset Name</label><input value={subForm.name} onChange={e => setSubForm({...subForm, name: e.target.value})} placeholder="SERVICE NAME (e.g. Netflix)" className="w-full h-12 border-2 border-black p-3 font-bold uppercase"/></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-[10px] font-black uppercase tracking-widest mb-1">Cost</label><input type="number" value={subForm.cost} onChange={e => setSubForm({...subForm, cost: parseFloat(e.target.value) || 0})} placeholder="0.00" className="w-full h-12 border-2 border-black p-3 font-bold"/></div>
                    <div><label className="block text-[10px] font-black uppercase tracking-widest mb-1">Cycle</label><select value={subForm.cycle} onChange={e => setSubForm({...subForm, cycle: e.target.value as any})} className="w-full h-12 border-2 border-black p-3 font-bold uppercase"><option value="monthly">Monthly</option><option value="quarterly">Quarterly (4mo)</option><option value="biannual">Biannual (6mo)</option><option value="yearly">Yearly</option><option value="custom">Custom</option></select></div>
                </div>
                {subForm.cycle === 'custom' && (<div><label className="block text-[10px] font-black uppercase tracking-widest mb-1">Days Interval</label><input type="number" value={subForm.customDays || ''} onChange={e => setSubForm({...subForm, customDays: parseInt(e.target.value) || 30})} className="w-full h-12 border-2 border-black p-3 font-bold" placeholder="e.g. 45"/></div>)}
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-[10px] font-black uppercase tracking-widest mb-1">Next Deduction</label><input type="date" value={subForm.nextBillingDate} onChange={e => setSubForm({...subForm, nextBillingDate: e.target.value})} className="w-full h-12 border-2 border-black p-3 font-mono"/></div>
                    <div><label className="block text-[10px] font-black uppercase tracking-widest mb-1">Stop Priority</label><select value={subForm.priority} onChange={e => setSubForm({...subForm, priority: e.target.value as Priority})} className="w-full h-12 border-2 border-black p-3 font-bold uppercase"><option value="low">Low (Info)</option><option value="medium">Medium (Notify)</option><option value="high">High (Alarm)</option></select></div>
                </div>
                <div className="flex justify-between items-center mb-1"><label className="block text-[10px] font-black uppercase tracking-widest">Intel / Notes</label><SmartButton onClick={handleAiSubAnalysis} loading={isAiGenerating} label="Analyze Value" /></div>
                <textarea value={subForm.description || ''} onChange={e => setSubForm({...subForm, description: e.target.value})} className="w-full h-24 bg-neutral-100 border-2 border-black p-3 font-mono text-xs" placeholder="Service details..."/>
                <button onClick={saveSub} className="w-full h-12 bg-black text-white border-2 border-black py-3 font-black uppercase">Save Subscription</button>
             </div>
           </div>
        </div>
      )}

      {/* Date Detail Modal */}
      {isDateDetailOpen && selectedDate && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white texture-pattern-paper w-full max-w-2xl border-4 border-black p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-2">
              <h2 className="font-black text-2xl uppercase italic">Tasks for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h2>
              <button onClick={() => setIsDateDetailOpen(false)}><X className="w-8 h-8 stroke-[3]"/></button>
            </div>
            <div className="space-y-4">
              {tasks.filter(t => t.dueDate === selectedDate).length > 0 ? (
                tasks.filter(t => t.dueDate === selectedDate).map(task => (
                  <div key={task.id} className="border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button onClick={() => toggleStatus(task)}>
                          {task.status === 'done' ? 
                            <div className="w-8 h-8 bg-black flex items-center justify-center border-2 border-black"><CheckCircle2 className="text-white"/></div> : 
                            <div className="w-8 h-8 border-2 border-black bg-white"></div>
                          }
                        </button>
                        <div>
                          <h3 className={`font-black uppercase text-lg ${task.status === 'done' ? 'line-through text-neutral-400' : ''}`}>{task.title}</h3>
                          <p className="text-sm text-neutral-600 font-mono">{task.description || "No description"}</p>
                          <PriorityBadge priority={task.priority} />
                        </div>
                      </div>
                      <button onClick={() => { setEditingTask(task); setTaskForm({ title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate || '' }); setIsDateDetailOpen(false); setIsTaskModalOpen(true); }} className="p-2 hover:bg-neutral-100 border-2 border-black transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95"><Edit className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-neutral-400 font-mono">No tasks scheduled for this date</div>
              )}
              <button 
                onClick={() => { setTaskForm(p => ({ ...p, dueDate: selectedDate })); setEditingTask(null); setIsDateDetailOpen(false); setIsTaskModalOpen(true); }}
                className="w-full bg-black text-white border-2 border-black py-3 font-black uppercase hover:bg-neutral-800 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add Task for This Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}