import React, { useState, useEffect, useRef } from 'react';
import { Lang } from '../lib/i18n';
import { sounds } from '../lib/sound';
import { 
  Trophy, 
  Sparkles, 
  Trash2, 
  Droplets, 
  Wrench, 
  Trees, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Coins, 
  Heart, 
  Truck, 
  Flame, 
  Share2, 
  Download, 
  UserCheck, 
  ChevronRight,
  Sun
} from 'lucide-react';

interface PuruliaCivicGameProps {
  lang: Lang;
}

// Waste segregation game items
interface TrashItem {
  id: string;
  nameEn: string;
  nameBn: string;
  category: 'wet' | 'dry' | 'hazard';
  icon: string;
  factEn: string;
  factBn: string;
}

const TRASH_ITEMS: TrashItem[] = [
  { id: '1', nameEn: 'Banana Peels & Fruit Waste', nameBn: 'কলার খোসা ও ফলের অবশিষ্টাংশ', category: 'wet', icon: '🍌', factEn: 'Decomposes in 2-4 weeks into rich compost for Purulia farms.', factBn: '২-৪ সপ্তাহে পচে পুরুলিয়ার কৃষিজমিতে সার তৈরি করে।' },
  { id: '2', nameEn: 'Plastic Water Bottle', nameBn: 'প্লাস্টিকের জলের বোতল', category: 'dry', icon: '🧴', factEn: 'Takes 450 years to degrade if thrown into Saheb Bandh lake!', factBn: 'সাহেব বাঁধে ফেললে ৪৫০ বছর লেগে যাবে ধ্বংস হতে!' },
  { id: '3', nameEn: 'Used AAA Battery', nameBn: 'পুরোনো ব্যাটারি', category: 'hazard', icon: '🔋', factEn: 'Contains lead & cadmium; leaks into Purulia groundwater if not isolated.', factBn: 'সীসা ও ক্যাডমিয়াম থাকে, ভূগর্ভস্থ জলে মিশলে মারাত্মক দূষণ ঘটায়।' },
  { id: '4', nameEn: 'Chai Clay Cup (Kullad)', nameBn: 'মাটির চায়ের ভাঁড়', category: 'wet', icon: '☕', factEn: 'Natural baked earth! Returns to soil harmlessly.', factBn: 'প্রাকৃতিক পোড়ামাটি! সহজে মাটিতে মিশে যায়।' },
  { id: '5', nameEn: 'Cardboard Box & Old Papers', nameBn: 'পুরোনো পিচবোর্ড ও খবরের কাগজ', category: 'dry', icon: '📦', factEn: '100% recyclable into new notebooks and packing material.', factBn: 'পুনর্ব্যবহার করে নতুন খাতা ও কাগজের ঠোঙ্গা তৈরি হয়।' },
  { id: '6', nameEn: 'Broken Fluorescent Bulb', nameBn: 'ভাঙা সিএফএল বা টিউবলাইট', category: 'hazard', icon: '💡', factEn: 'Contains toxic mercury vapor. Needs specialized handling.', factBn: 'বিষাক্ত পারদ বাষ্প থাকে, তাই বিশেষ সতর্কতায় ফেলা উচিত।' },
  { id: '7', nameEn: 'Fallen Palash & Sal Leaves', nameBn: 'শুকনো শাল ও পলাশ পাতা', category: 'wet', icon: '🍂', factEn: 'Tradition of Purulia: Used to make bio-plates or compost.', factBn: 'পুরুলিয়ার সংস্কৃতি: শালপাতার থালা তৈরি বা পাতা পচা সার হয়।' },
  { id: '8', nameEn: 'Aluminium Beverage Can', nameBn: 'ঠান্ডা পানীয়ের অ্যালুমিনিয়াম ক্যান', category: 'dry', icon: '🥫', factEn: 'Can be melted and remade infinitely, saving 95% energy.', factBn: 'বারবার গলিয়ে নতুন সামগ্রী তৈরি করা যায়, ৯৫% বিদ্যুৎ বাঁচে।' },
  { id: '9', nameEn: 'Discarded Syringe / Medicine Strip', nameBn: 'ব্যবহৃত ওষুধ বা ইনজেকশনের স্ট্রিপ', category: 'hazard', icon: '💊', factEn: 'Biomedical risk; must never be dumped in municipal open bins.', factBn: 'বায়োমেডিকেল বর্জ্য; কখনোই সাধারণ খোলা ডাস্টবিনে ফেলা উচিত নয়।' },
  { id: '10', nameEn: 'Green Coconut Shell (Daab)', nameBn: 'ডাবের খোলা ও ছোবড়া', category: 'wet', icon: '🥥', factEn: 'High organic fiber; ideal for coco-peat and mulching.', factBn: 'উচ্চ জৈব আঁশ; গাছের গোড়ায় আর্দ্রতা ধরে রাখতে দারুণ উপযোগী।' }
];

// Drainage puzzle nodes
interface DrainSegment {
  id: number;
  label: string;
  hasClog: boolean;
  clogType?: 'plastic' | 'silt' | 'branch';
  cleared: boolean;
}

// Purulia Wards for Mayor simulation
interface WardSim {
  id: number;
  nameEn: string;
  nameBn: string;
  cleanliness: number; // 0-100
  drainage: number; // 0-100
  roads: number; // 0-100
  greenery: number; // 0-100
  alert?: {
    type: 'waste' | 'drain' | 'road' | 'lighting' | 'park';
    titleEn: string;
    titleBn: string;
    cost: number;
    resolved: boolean;
  };
}

const INITIAL_PURULIA_WARDS: WardSim[] = [
  { id: 1, nameEn: 'Ward 1: Nilkandhi & By-pass', nameBn: '১ নং ওয়ার্ড: নীলকান্ধি ও বাইপাস', cleanliness: 72, drainage: 65, roads: 80, greenery: 60, alert: { type: 'waste', titleEn: 'Market waste piled near crossing', titleBn: 'মোড়ের মাথায় বাজারের আবর্জনা জমেছে', cost: 12000, resolved: false } },
  { id: 2, nameEn: 'Ward 3: Saheb Bandh North', nameBn: '৩ নং ওয়ার্ড: সাহেব বাঁধ উত্তর পার', cleanliness: 88, drainage: 75, roads: 85, greenery: 90 },
  { id: 3, nameEn: 'Ward 4: Court Road & Kachhari', nameBn: '৪ নং ওয়ার্ড: কোর্ট রোড ও কাচারি', cleanliness: 68, drainage: 55, roads: 70, greenery: 65, alert: { type: 'drain', titleEn: 'Monsoon drain overflow near court entrance', titleBn: 'কোর্ট গেটের সামনে ড্রেনের জল উপচে পড়ছে', cost: 18000, resolved: false } },
  { id: 4, nameEn: 'Ward 7: Bhatbandh Residential', nameBn: '৭ নং ওয়ার্ড: ভাটবাঁধ পাড়া', cleanliness: 75, drainage: 70, roads: 58, greenery: 70, alert: { type: 'road', titleEn: 'Dangerous potholes along primary school lane', titleBn: 'প্রাথমিক বিদ্যালয়ের রাস্তায় বিপজ্জনক গর্ত', cost: 25000, resolved: false } },
  { id: 5, nameEn: 'Ward 9: Purulia Station Chowk', nameBn: '৯ নং ওয়ার্ড: পুরুলিয়া স্টেশন চত্বর', cleanliness: 60, drainage: 62, roads: 72, greenery: 50, alert: { type: 'waste', titleEn: 'Plastic cups and bottles scattered after train rush', titleBn: 'ট্রেনের ভিড়ের পর চায়ের ভাঁড় ও প্লাস্টিক বোতল ছড়িয়েছে', cost: 15000, resolved: false } },
  { id: 6, nameEn: 'Ward 12: Munsif Danga', nameBn: '১২ নং ওয়ার্ড: মুন্সিফ ডাঙ্গা', cleanliness: 80, drainage: 78, roads: 82, greenery: 75 },
  { id: 7, nameEn: 'Ward 15: Subhas Park & Lakefront', nameBn: '১৫ নং ওয়ার্ড: সুভাষ পার্ক ও লেক রোড', cleanliness: 85, drainage: 82, roads: 88, greenery: 92, alert: { type: 'park', titleEn: 'Sapling plantation & eco-benches needed', titleBn: 'নতুন গাছের চারা রোপণ ও পরিবেশবান্ধব বেঞ্চ প্রয়োজন', cost: 14000, resolved: false } },
  { id: 8, nameEn: 'Ward 21: Nimtand & Dulmi Culvert', nameBn: '২১ নং ওয়ার্ড: নিমতাঁড় ও দুলমি কালভার্ট', cleanliness: 65, drainage: 50, roads: 64, greenery: 58, alert: { type: 'lighting', titleEn: 'Dark culvert stretch needs 6 Solar LED lights', titleBn: 'অন্ধকার কালভার্ট সংলগ্ন রাস্তায় ৬টি সৌরবাতি স্থাপন প্রয়োজন', cost: 20000, resolved: false } }
];

export const PuruliaCivicGame: React.FC<PuruliaCivicGameProps> = ({ lang }) => {
  const [activeMode, setActiveMode] = useState<'arcade' | 'mayor' | 'certificate'>('arcade');
  const [arcadeMinigame, setArcadeMinigame] = useState<'waste' | 'drain' | 'road' | 'tree'>('waste');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Global Player Progress
  const [playerScore, setPlayerScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('purulia_game_score') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [playerName, setPlayerName] = useState<string>(() => {
    try {
      return localStorage.getItem('purulia_player_name') || 'Citizen of Purulia';
    } catch {
      return 'Citizen of Purulia';
    }
  });

  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('purulia_game_badges');
      return saved ? JSON.parse(saved) : ['first_step'];
    } catch {
      return ['first_step'];
    }
  });

  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('purulia_game_score', playerScore.toString());
      localStorage.setItem('purulia_game_badges', JSON.stringify(unlockedBadges));
      localStorage.setItem('purulia_player_name', playerName);
    } catch {}
  }, [playerScore, unlockedBadges, playerName]);

  const addScore = (points: number, badgeId?: string) => {
    setPlayerScore((prev) => prev + points);
    if (badgeId && !unlockedBadges.includes(badgeId)) {
      setUnlockedBadges((prev) => [...prev, badgeId]);
      sounds.playVictory();
    }
  };

  // ----------------------------------------------------
  // MINIGAME 1: WASTE SEGREGATION DASH (Saheb Bandh)
  // ----------------------------------------------------
  const [wasteGameRunning, setWasteGameRunning] = useState(false);
  const [wasteTimeLeft, setWasteTimeLeft] = useState(40);
  const [currentWasteIndex, setCurrentWasteIndex] = useState(0);
  const [wasteCombo, setWasteCombo] = useState(0);
  const [wasteScore, setWasteScore] = useState(0);
  const [wasteFeedback, setWasteFeedback] = useState<{ message: string; correct: boolean } | null>(null);

  useEffect(() => {
    let timer: any;
    if (wasteGameRunning && wasteTimeLeft > 0) {
      timer = setInterval(() => {
        setWasteTimeLeft((prev) => {
          if (prev <= 1) {
            setWasteGameRunning(false);
            sounds.playVictory();
            addScore(wasteScore, 'waste_warrior');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [wasteGameRunning, wasteTimeLeft, wasteScore]);

  const startWasteGame = () => {
    setWasteScore(0);
    setWasteCombo(0);
    setWasteTimeLeft(40);
    setCurrentWasteIndex(0);
    setWasteFeedback(null);
    setWasteGameRunning(true);
    sounds.playPop();
  };

  const handleSortWaste = (category: 'wet' | 'dry' | 'hazard') => {
    if (!wasteGameRunning) return;
    const currentItem = TRASH_ITEMS[currentWasteIndex % TRASH_ITEMS.length];
    const isCorrect = currentItem.category === category;

    if (isCorrect) {
      const newCombo = wasteCombo + 1;
      setWasteCombo(newCombo);
      const pointsGained = 100 * Math.min(newCombo, 5);
      setWasteScore((s) => s + pointsGained);
      sounds.playCorrect();
      setWasteFeedback({
        message: lang === 'bn' 
          ? `চমৎকার! সঠিক বাছাই (+${pointsGained})!` 
          : `Perfect! Correct Sort (+${pointsGained})!`,
        correct: true,
      });
    } else {
      setWasteCombo(0);
      sounds.playError();
      const correctName = currentItem.category === 'wet' ? (lang === 'bn' ? 'জৈব পচনশীল (সবুজ)' : 'Wet/Bio (Green)')
        : currentItem.category === 'dry' ? (lang === 'bn' ? 'শুকনো পুনর্ব্যবহারযোগ্য (নীল)' : 'Dry Recyclable (Blue)')
        : (lang === 'bn' ? 'বিপজ্জনক বর্জ্য (লাল)' : 'Hazardous (Red)');
      setWasteFeedback({
        message: lang === 'bn' 
          ? `ভুল বিন! এটি যাবে: ${correctName}` 
          : `Wrong Bin! Belongs in: ${correctName}`,
        correct: false,
      });
    }

    setTimeout(() => {
      setWasteFeedback(null);
      setCurrentWasteIndex((idx) => (idx + 1) % TRASH_ITEMS.length);
    }, 700);
  };

  // ----------------------------------------------------
  // MINIGAME 2: COURT ROAD DRAIN DE-CLOG (Flood Buster)
  // ----------------------------------------------------
  const [drainNodes, setDrainNodes] = useState<DrainSegment[]>([
    { id: 1, label: 'Court Road Inlet', hasClog: true, clogType: 'plastic', cleared: false },
    { id: 2, label: 'Nilkandhi Junction', hasClog: true, clogType: 'silt', cleared: false },
    { id: 3, label: 'Main Municipality Canal', hasClog: true, clogType: 'branch', cleared: false },
    { id: 4, label: 'Saheb Bandh Outfall', hasClog: true, clogType: 'plastic', cleared: false },
    { id: 5, label: 'Dulmi Overflow Box', hasClog: true, clogType: 'silt', cleared: false },
  ]);
  const [selectedDrainTool, setSelectedDrainTool] = useState<'rake' | 'jet' | 'vacuum'>('rake');
  const [drainWaterLevel, setDrainWaterLevel] = useState(85); // 0-100%
  const [drainSuccess, setDrainSuccess] = useState(false);

  const handleClearDrain = (segmentId: number) => {
    const seg = drainNodes.find((n) => n.id === segmentId);
    if (!seg || seg.cleared) return;

    let matched = false;
    if (seg.clogType === 'plastic' && selectedDrainTool === 'rake') matched = true;
    if (seg.clogType === 'silt' && selectedDrainTool === 'jet') matched = true;
    if (seg.clogType === 'branch' && selectedDrainTool === 'vacuum') matched = true;

    if (matched) {
      sounds.playWaterSplash();
      const updated = drainNodes.map((n) => (n.id === segmentId ? { ...n, cleared: true } : n));
      setDrainNodes(updated);
      setDrainWaterLevel((prev) => Math.max(15, prev - 18));
      addScore(150);

      const allCleared = updated.every((n) => n.cleared);
      if (allCleared) {
        setDrainSuccess(true);
        sounds.playVictory();
        addScore(500, 'drain_master');
      }
    } else {
      sounds.playError();
    }
  };

  const resetDrainGame = () => {
    setDrainNodes([
      { id: 1, label: 'Court Road Inlet', hasClog: true, clogType: 'plastic', cleared: false },
      { id: 2, label: 'Nilkandhi Junction', hasClog: true, clogType: 'silt', cleared: false },
      { id: 3, label: 'Main Municipality Canal', hasClog: true, clogType: 'branch', cleared: false },
      { id: 4, label: 'Saheb Bandh Outfall', hasClog: true, clogType: 'plastic', cleared: false },
      { id: 5, label: 'Dulmi Overflow Box', hasClog: true, clogType: 'silt', cleared: false },
    ]);
    setDrainWaterLevel(85);
    setDrainSuccess(false);
  };

  // ----------------------------------------------------
  // MINIGAME 3: ROAD POTHOLE & ROLLER (Bhatbandh)
  // ----------------------------------------------------
  const [roadStep, setRoadStep] = useState<number>(1);
  const [pourProgress, setPourProgress] = useState(0);
  const [rollerProgress, setRollerProgress] = useState(0);
  const [isHoldingPour, setIsHoldingPour] = useState(false);
  const [roadCompleted, setRoadCompleted] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isHoldingPour && roadStep === 2 && pourProgress < 100) {
      interval = setInterval(() => {
        setPourProgress((p) => {
          sounds.playPop();
          const next = p + 4;
          if (next >= 100) {
            setIsHoldingPour(false);
            setRoadStep(3);
            sounds.playCorrect();
            return 100;
          }
          return next;
        });
      }, 70);
    }
    return () => clearInterval(interval);
  }, [isHoldingPour, roadStep, pourProgress]);

  const handleRollSteamroller = () => {
    if (roadStep !== 3) return;
    sounds.playFixComplete();
    setRollerProgress((prev) => {
      const next = prev + 25;
      if (next >= 100) {
        setRoadCompleted(true);
        sounds.playVictory();
        addScore(400, 'road_builder');
        return 100;
      }
      return next;
    });
  };

  const resetRoadGame = () => {
    setRoadStep(1);
    setPourProgress(0);
    setRollerProgress(0);
    setRoadCompleted(false);
  };

  // ----------------------------------------------------
  // MINIGAME 4: GREEN PURULIA & SOLAR (Ajodhya/Subhas Park)
  // ----------------------------------------------------
  const [plantedSpots, setPlantedSpots] = useState<number[]>([1]);
  const [solarSpots, setSolarSpots] = useState<number[]>([2]);
  const totalSpots = 8;

  const handlePlantTree = (spotId: number) => {
    if (plantedSpots.includes(spotId)) return;
    sounds.playCorrect();
    setPlantedSpots((prev) => [...prev, spotId]);
    addScore(120);
    if (plantedSpots.length + 1 >= 5) {
      addScore(200, 'green_guardian');
    }
  };

  const handleInstallSolar = (spotId: number) => {
    if (solarSpots.includes(spotId)) return;
    sounds.playFixComplete();
    setSolarSpots((prev) => [...prev, spotId]);
    addScore(150);
  };

  // ----------------------------------------------------
  // MAYOR SIMULATION MODE (Purulia 23 Wards)
  // ----------------------------------------------------
  const [wards, setWards] = useState<WardSim[]>(INITIAL_PURULIA_WARDS);
  const [civicBudget, setCivicBudget] = useState(250000);
  const [civicKarma, setCivicKarma] = useState(80);

  const handleDispatchMayorTeam = (wardId: number) => {
    const ward = wards.find((w) => w.id === wardId);
    if (!ward || !ward.alert || ward.alert.resolved) return;

    if (civicBudget < ward.alert.cost) {
      sounds.playError();
      alert(lang === 'bn' ? 'পর্যাপ্ত তহবিল নেই! অন্যান্য কাজ করে ফান্ড বৃদ্ধি করুন।' : 'Insufficient Municipal Funds! Complete other civic tasks first.');
      return;
    }

    sounds.playFixComplete();
    setCivicBudget((b) => b - ward.alert!.cost);
    setCivicKarma((k) => Math.min(100, k + 8));

    setWards((prev) =>
      prev.map((w) => {
        if (w.id === wardId && w.alert) {
          return {
            ...w,
            cleanliness: Math.min(100, w.cleanliness + 15),
            drainage: Math.min(100, w.drainage + 15),
            roads: Math.min(100, w.roads + 15),
            greenery: Math.min(100, w.greenery + 15),
            alert: { ...w.alert, resolved: true },
          };
        }
        return w;
      })
    );

    addScore(300, 'mayor_star');
  };

  // Overall City Metrics
  const avgCleanliness = Math.round(wards.reduce((acc, w) => acc + w.cleanliness, 0) / wards.length);
  const avgDrainage = Math.round(wards.reduce((acc, w) => acc + w.drainage, 0) / wards.length);
  const activeAlertsCount = wards.filter((w) => w.alert && !w.alert.resolved).length;

  // Level computation
  const playerLevel = 
    playerScore < 500 ? { titleEn: 'Apprentice Citizen', titleBn: 'শিক্ষানবিস নাগরিক', rank: 1 }
    : playerScore < 1200 ? { titleEn: 'Ward Civic Volunteer', titleBn: 'ওয়ার্ড সিভিক কর্মী', rank: 2 }
    : playerScore < 2500 ? { titleEn: 'Swachh Purulia Inspector', titleBn: 'স্বচ্ছ পুরুলিয়া পরিদর্শক', rank: 3 }
    : playerScore < 4000 ? { titleEn: 'Chief Civic Engineer', titleBn: 'প্রধান পৌর প্রকৌশলী', rank: 4 }
    : { titleEn: 'Honorary Purulia Mayor', titleBn: 'সম্মানীয় পুরুলিয়া মেয়র', rank: 5 };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Game Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#1a1410] via-[#2c1d11] to-[#3a2618] text-white p-6 sm:p-8 shadow-xl border border-amber-900/40">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-black">
                {lang === 'bn' ? '🎮 পুরুলিয়া সিভিক গেম' : '🎮 Purulia Civic Hero'}
              </span>
              <span className="text-xs text-amber-200/80 font-mono">
                {lang === 'bn' ? 'সাহেব বাঁধ থেকে অযোধ্যা পাহাড়' : 'Saheb Bandh to Ajodhya'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{lang === 'bn' ? 'পরিচ্ছন্ন পুরুলিয়া সিভিক মিশন' : 'Purulia Swachh & Green Civic Quest'}</span>
              <span className="text-2xl">🌱</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              {lang === 'bn'
                ? 'ড্রেন পরিষ্কার, বর্জ্য পৃথকীকরণ, রাস্তা মেরামত ও বৃক্ষরোপণ — বাস্তব পুরুলিয়ার নাগরিক সমস্যার সমাধান করুন খেলার ছলে!'
                : 'De-clog storm drains, master waste sorting at Saheb Bandh, pave roads, and manage municipal wards in a fun interactive game!'}
            </p>
          </div>

          {/* Player stats box */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-black/40 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
            <div className="px-3 border-r border-white/15 text-center">
              <div className="text-[10px] uppercase font-bold text-amber-400">Karma Points</div>
              <div className="text-xl font-black text-white flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{playerScore}</span>
              </div>
            </div>
            <div className="px-3 border-r border-white/15 text-center">
              <div className="text-[10px] uppercase font-bold text-emerald-400">Civic Rank</div>
              <div className="text-xs font-bold text-stone-200 truncate max-w-[130px]">
                {lang === 'bn' ? playerLevel.titleBn : playerLevel.titleEn}
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-lg border transition-colors flex items-center justify-center ${
                soundEnabled 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' 
                  : 'bg-stone-800 text-stone-500 border-stone-700'
              }`}
              title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/10 overflow-x-auto">
          <button
            onClick={() => {
              setActiveMode('arcade');
              sounds.playPop();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeMode === 'arcade'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>{lang === 'bn' ? '১. দ্রুত নাগরিক অ্যাকশন (৪টি গেম)' : '1. Arcade Civic Ops (4 Games)'}</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('mayor');
              sounds.playPop();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeMode === 'mayor'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>{lang === 'bn' ? '২. পুরুলিয়া ওয়ার্ড মেয়র সিমুলেশন' : '2. Purulia Ward Mayor Sim'}</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('certificate');
              sounds.playPop();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeMode === 'certificate'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>{lang === 'bn' ? '৩. নাগরিক শংসাপত্র ও ব্যাজ' : '3. Civic Certificate & Badges'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MODE 1: ARCADE CIVIC OPERATIONS (4 MINIGAMES) */}
      {/* ==================================================== */}
      {activeMode === 'arcade' && (
        <div className="space-y-6">
          {/* Minigame Category Picker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => {
                setArcadeMinigame('waste');
                sounds.playPop();
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                arcadeMinigame === 'waste'
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">
                  {lang === 'bn' ? 'বর্জ্য পৃথকীকরণ' : 'Waste Sorter'}
                </div>
                <div className="text-[10px] text-stone-500">
                  {lang === 'bn' ? 'সাহেব বাঁধ চত্বর' : 'Saheb Bandh Lake'}
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setArcadeMinigame('drain');
                sounds.playPop();
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                arcadeMinigame === 'drain'
                  ? 'bg-cyan-50 border-cyan-500 ring-2 ring-cyan-500/20'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">
                  {lang === 'bn' ? 'ড্রেন উদ্ধার' : 'Drain De-Clog'}
                </div>
                <div className="text-[10px] text-stone-500">
                  {lang === 'bn' ? 'কোর্ট রোড নিকাশি' : 'Court Road Culvert'}
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setArcadeMinigame('road');
                sounds.playPop();
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                arcadeMinigame === 'road'
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">
                  {lang === 'bn' ? 'রাস্তা মেরামত' : 'Pothole Patcher'}
                </div>
                <div className="text-[10px] text-stone-500">
                  {lang === 'bn' ? 'ভাটবাঁধ মেন রোড' : 'Bhatbandh Road'}
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setArcadeMinigame('tree');
                sounds.playPop();
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                arcadeMinigame === 'tree'
                  ? 'bg-green-50 border-green-500 ring-2 ring-green-500/20'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                <Trees className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">
                  {lang === 'bn' ? 'সবুজ পুরুলিয়া' : 'Green Canopy'}
                </div>
                <div className="text-[10px] text-stone-500">
                  {lang === 'bn' ? 'সুভাষ পার্ক ও সোলার' : 'Subhas Park Solar'}
                </div>
              </div>
            </button>
          </div>

          {/* Minigame 1: Waste Segregation Dash */}
          {arcadeMinigame === 'waste' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h2 className="text-lg font-bold text-stone-900">
                      {lang === 'bn' ? 'সাহেব বাঁধ বর্জ্য পৃথকীকরণ চ্যালেঞ্জ' : 'Saheb Bandh Segregation Sprint'}
                    </h2>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    {lang === 'bn'
                      ? 'দ্রুত সঠিক ডাস্টবিনে বর্জ্য ফেলুন: সবুজ (জৈব), নীল (শুকনো পুনর্ব্যবহারযোগ্য), লাল (বিপজ্জনক)!'
                      : 'Sort each item into Green (Wet/Bio), Blue (Dry/Recyclable), or Red (Hazardous) before time expires!'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-stone-100 rounded-lg font-mono text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>{wasteTimeLeft}s</span>
                  </div>
                  <div className="px-3 py-1.5 bg-amber-100 text-amber-900 rounded-lg font-mono text-xs font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                    <span>{wasteCombo}x Combo</span>
                  </div>
                  <div className="px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-lg font-mono text-xs font-bold">
                    Score: {wasteScore}
                  </div>
                </div>
              </div>

              {!wasteGameRunning && wasteTimeLeft === 40 && (
                <div className="py-12 text-center space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-3xl shadow-xs">
                    🌊
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">
                    {lang === 'bn' ? 'সাহেব বাঁধের পরিচ্ছন্নতা আপনার হাতে!' : 'Saheb Bandh Cleanliness Mission'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {lang === 'bn'
                      ? 'প্রতিদিন সকালে বহু মানুষ সাহেব বাঁধে ভ্রমণ করেন। ৪টি বর্জ্য সঠিকভাবে আলাদা করে পুরুলিয়াকে সুন্দর রাখুন।'
                      : 'Keep Purulia’s historic lakefront pristine. Sort wet kitchen waste, dry recyclables, and toxic batteries into respective bins.'}
                  </p>
                  <button
                    onClick={startWasteGame}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 mx-auto"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{lang === 'bn' ? 'খেলা শুরু করুন' : 'Start Sorting Sprint'}</span>
                  </button>
                </div>
              )}

              {!wasteGameRunning && wasteTimeLeft === 0 && (
                <div className="py-10 text-center space-y-4 max-w-md mx-auto bg-emerald-50/60 rounded-2xl p-6 border border-emerald-200">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-md">
                    <Trophy className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">
                    {lang === 'bn' ? 'মিশন সম্পন্ন!' : 'Mission Completed!'}
                  </h3>
                  <p className="text-xs text-stone-600">
                    {lang === 'bn'
                      ? `আপনি অর্জন করেছেন ${wasteScore} পয়েন্ট! পুরুলিয়ার সাহেব বাঁধ এখন আরও পরিষ্কার।`
                      : `You earned ${wasteScore} points! Saheb Bandh promenade is cleaner thanks to your quick civic action.`}
                  </p>
                  <button
                    onClick={startWasteGame}
                    className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'আবার খেলুন' : 'Play Again'}</span>
                  </button>
                </div>
              )}

              {wasteGameRunning && (
                <div className="space-y-8">
                  {/* Active Item Card */}
                  <div className="relative max-w-sm mx-auto bg-stone-50 border-2 border-stone-200 rounded-2xl p-6 text-center space-y-3 shadow-md animate-fade-in">
                    <div className="text-6xl my-2">
                      {TRASH_ITEMS[currentWasteIndex % TRASH_ITEMS.length].icon}
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-stone-900">
                        {lang === 'bn' 
                          ? TRASH_ITEMS[currentWasteIndex % TRASH_ITEMS.length].nameBn 
                          : TRASH_ITEMS[currentWasteIndex % TRASH_ITEMS.length].nameEn}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-1 italic">
                        💡 {lang === 'bn'
                          ? TRASH_ITEMS[currentWasteIndex % TRASH_ITEMS.length].factBn
                          : TRASH_ITEMS[currentWasteIndex % TRASH_ITEMS.length].factEn}
                      </p>
                    </div>

                    {wasteFeedback && (
                      <div className={`p-2 rounded-lg text-xs font-bold transition-all ${
                        wasteFeedback.correct 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {wasteFeedback.message}
                      </div>
                    )}
                  </div>

                  {/* 3 Bins to Drop */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {/* Green Bin */}
                    <button
                      onClick={() => handleSortWaste('wet')}
                      className="group bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl p-5 text-center transition-all shadow-md hover:scale-102 flex flex-col items-center justify-between gap-3 border-2 border-emerald-600 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">
                        🥬
                      </div>
                      <div>
                        <div className="text-sm font-black uppercase tracking-wide">
                          {lang === 'bn' ? 'সবুজ ডাস্টবিন' : 'Green Bin'}
                        </div>
                        <div className="text-[11px] text-emerald-100 font-medium">
                          {lang === 'bn' ? 'জৈব পচনশীল / ভেজা' : 'Wet & Organic Waste'}
                        </div>
                      </div>
                      <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold">
                        {lang === 'bn' ? 'এখানে ফেলুন' : 'Drop Here [1]'}
                      </span>
                    </button>

                    {/* Blue Bin */}
                    <button
                      onClick={() => handleSortWaste('dry')}
                      className="group bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 text-center transition-all shadow-md hover:scale-102 flex flex-col items-center justify-between gap-3 border-2 border-blue-700 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">
                        🧴
                      </div>
                      <div>
                        <div className="text-sm font-black uppercase tracking-wide">
                          {lang === 'bn' ? 'নীল ডাস্টবিন' : 'Blue Bin'}
                        </div>
                        <div className="text-[11px] text-blue-100 font-medium">
                          {lang === 'bn' ? 'শুকনো পুনর্ব্যবহারযোগ্য' : 'Dry & Recyclable'}
                        </div>
                      </div>
                      <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold">
                        {lang === 'bn' ? 'এখানে ফেলুন' : 'Drop Here [2]'}
                      </span>
                    </button>

                    {/* Red Bin */}
                    <button
                      onClick={() => handleSortWaste('hazard')}
                      className="group bg-rose-600 hover:bg-rose-700 text-white rounded-2xl p-5 text-center transition-all shadow-md hover:scale-102 flex flex-col items-center justify-between gap-3 border-2 border-rose-700 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">
                        ⚠️
                      </div>
                      <div>
                        <div className="text-sm font-black uppercase tracking-wide">
                          {lang === 'bn' ? 'লাল ডাস্টবিন' : 'Red Bin'}
                        </div>
                        <div className="text-[11px] text-rose-100 font-medium">
                          {lang === 'bn' ? 'বিপজ্জনক ও ই-বর্জ্য' : 'Hazardous & E-Waste'}
                        </div>
                      </div>
                      <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold">
                        {lang === 'bn' ? 'এখানে ফেলুন' : 'Drop Here [3]'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Minigame 2: Court Road Drain De-Clog */}
          {arcadeMinigame === 'drain' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                    <h2 className="text-lg font-bold text-stone-900">
                      {lang === 'bn' ? 'কোর্ট রোড নিকাশি উদ্ধার মিশন' : 'Court Road Drain De-Clog & Flow Fix'}
                    </h2>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    {lang === 'bn'
                      ? 'বৃষ্টির জমা জল সরাতে সঠিক সরঞ্জাম (হুক, প্রেসার জেট, ভ্যাকুয়াম) বেছে নিয়ে পাইপের ব্লকেজ ভাঙুন!'
                      : 'Choose the matching civic tool (Rake, Pressure Jet, Suction Rig) to clear underground stormwater clogs!'}
                  </p>
                </div>

                {/* Flood Gauge */}
                <div className="flex items-center gap-3 bg-stone-100 px-3.5 py-2 rounded-xl">
                  <div className="text-[11px] font-bold text-stone-700">
                    {lang === 'bn' ? 'জল স্তর:' : 'Flood Water Level:'}
                  </div>
                  <div className="w-32 bg-stone-300 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        drainWaterLevel > 60 ? 'bg-rose-500' : drainWaterLevel > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${drainWaterLevel}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-stone-800">{drainWaterLevel}%</span>
                </div>
              </div>

              {/* Tool Selector */}
              <div className="bg-cyan-50/70 p-4 rounded-xl border border-cyan-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-extrabold text-cyan-950 uppercase tracking-wide">
                  {lang === 'bn' ? 'সরঞ্জাম নির্বাচন করুন:' : 'Select Municipal Tool:'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedDrainTool('rake');
                      sounds.playPop();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedDrainTool === 'rake'
                        ? 'bg-cyan-700 text-white shadow-xs'
                        : 'bg-white text-cyan-900 border border-cyan-300 hover:bg-cyan-100'
                    }`}
                  >
                    <span>🪝</span>
                    <span>{lang === 'bn' ? 'প্লাস্টিক হুক (প্লাস্টিকের জন্য)' : 'Rake Tool (For Plastic)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedDrainTool('jet');
                      sounds.playPop();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedDrainTool === 'jet'
                        ? 'bg-cyan-700 text-white shadow-xs'
                        : 'bg-white text-cyan-900 border border-cyan-300 hover:bg-cyan-100'
                    }`}
                  >
                    <span>🌊</span>
                    <span>{lang === 'bn' ? 'প্রেসার ওয়াটার জেট (পলির জন্য)' : 'Water Jet (For Mud/Silt)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedDrainTool('vacuum');
                      sounds.playPop();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedDrainTool === 'vacuum'
                        ? 'bg-cyan-700 text-white shadow-xs'
                        : 'bg-white text-cyan-900 border border-cyan-300 hover:bg-cyan-100'
                    }`}
                  >
                    <span>🚜</span>
                    <span>{lang === 'bn' ? 'ভ্যাকুয়াম লিফটার (ভারী ডালপালার জন্য)' : 'Suction Rig (For Branches)'}</span>
                  </button>
                </div>
              </div>

              {/* Drain Pipes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {drainNodes.map((node) => (
                  <div
                    key={node.id}
                    onClick={() => handleClearDrain(node.id)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between h-36 ${
                      node.cleared
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-300 hover:border-cyan-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-stone-500">Node #{node.id}</span>
                      {node.cleared ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {lang === 'bn' ? 'জল প্রবাহ স্বাভাবিক' : 'Flow Restored'}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {lang === 'bn' ? 'ব্লকেজ' : 'Choked'}
                        </span>
                      )}
                    </div>

                    <div className="text-center py-2">
                      <div className="text-3xl">
                        {node.cleared
                          ? '💧🌊'
                          : node.clogType === 'plastic'
                          ? '🛍️🥤'
                          : node.clogType === 'silt'
                          ? '🧱🟫'
                          : '🪵🌿'}
                      </div>
                      <div className="text-xs font-bold text-stone-800 mt-1">{node.label}</div>
                    </div>

                    <div className="text-[10px] text-center text-stone-500 font-medium">
                      {node.cleared
                        ? (lang === 'bn' ? '✓ সম্পূর্ণ পরিষ্কার' : '✓ Cleared')
                        : node.clogType === 'plastic'
                        ? (lang === 'bn' ? '👉 প্লাস্টিক হুক ব্যবহার করুন' : '👉 Use Rake')
                        : node.clogType === 'silt'
                        ? (lang === 'bn' ? '👉 ওয়াটার জেট ব্যবহার করুন' : '👉 Use Water Jet')
                        : (lang === 'bn' ? '👉 ভ্যাকুয়াম ব্যবহার করুন' : '👉 Use Suction Rig')}
                    </div>
                  </div>
                ))}
              </div>

              {drainSuccess && (
                <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-xs text-emerald-950">
                        {lang === 'bn' ? 'দারুণ! কোর্ট রোডের ড্রেনেজ সম্পূর্ণ সচল।' : 'Outstanding! Court Road drainage completely restored!'}
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        {lang === 'bn' ? 'পুরুলিয়ার জমা জল সাহেব বাঁধ সংলগ্ন মূল খালে নেমে গেছে।' : 'Rainwater discharged safely into municipality catchment basin.'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={resetDrainGame}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    {lang === 'bn' ? 'পুনরায় খেলুন' : 'Play Again'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Minigame 3: Bhatbandh Road Pothole & Roller */}
          {arcadeMinigame === 'road' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h2 className="text-lg font-bold text-stone-900">
                      {lang === 'bn' ? 'ভাটবাঁধ রাস্তা সংস্কার ও রোলার ড্রাইভ' : 'Bhatbandh Road Pothole Repair & Steamroller'}
                    </h2>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    {lang === 'bn'
                      ? '৩টি ধাপে গর্ত মেরামত করুন: ১. ধুলো পরিষ্কার -> ২. গরম বিটুমিন ঢালা -> ৩. রোড রোলার চালানো!'
                      : 'Fix the dangerous roadway in 3 steps: Clean surface cavity -> Pour hot asphalt aggregate -> Smooth with Steamroller!'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    roadStep === 1 ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-500'
                  }`}>
                    Step 1: Clean
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    roadStep === 2 ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-500'
                  }`}>
                    Step 2: Bitumen
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    roadStep === 3 ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-500'
                  }`}>
                    Step 3: Roller
                  </span>
                </div>
              </div>

              {/* Road Simulation Canvas / Visual Area */}
              <div className="relative h-48 bg-stone-700 rounded-2xl overflow-hidden border-4 border-stone-800 flex items-center justify-center p-4">
                {/* Yellow road markings */}
                <div className="absolute inset-x-0 h-1 border-t-2 border-dashed border-amber-400 opacity-60" />

                {/* The Pothole */}
                <div className={`relative w-44 h-24 rounded-full transition-all duration-300 flex items-center justify-center ${
                  roadCompleted
                    ? 'bg-stone-900 border-2 border-emerald-500 shadow-inner'
                    : pourProgress > 50
                    ? 'bg-stone-900 border-2 border-amber-600'
                    : roadStep > 1
                    ? 'bg-stone-950 border-2 border-stone-600'
                    : 'bg-stone-950 border-4 border-red-500/80 shadow-inner'
                }`}>
                  {roadCompleted ? (
                    <div className="text-center">
                      <span className="text-2xl">✨</span>
                      <div className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                        Smooth Tarmac
                      </div>
                    </div>
                  ) : roadStep === 1 ? (
                    <div className="text-center animate-bounce">
                      <span className="text-2xl">🕳️</span>
                      <div className="text-[10px] font-bold text-red-300">Crack & Silt</div>
                    </div>
                  ) : roadStep === 2 ? (
                    <div className="text-center w-full px-4">
                      <div className="text-[10px] font-bold text-amber-300">Hot Bitumen: {pourProgress}%</div>
                      <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden mt-1">
                        <div className="bg-amber-500 h-full" style={{ width: `${pourProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-2xl animate-spin">🚜</span>
                      <div className="text-[10px] font-bold text-amber-300">Compacted: {rollerProgress}%</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {roadStep === 1 && (
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setRoadStep(2);
                    }}
                    className="px-6 py-3 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <span>🧹</span>
                    <span>{lang === 'bn' ? '১. ধুলোবালি ও আলগা পাথর পরিষ্কার করুন' : '1. Clear Loose Gravel & Dirt'}</span>
                  </button>
                )}

                {roadStep === 2 && (
                  <button
                    onMouseDown={() => setIsHoldingPour(true)}
                    onMouseUp={() => setIsHoldingPour(false)}
                    onTouchStart={() => setIsHoldingPour(true)}
                    onTouchEnd={() => setIsHoldingPour(false)}
                    className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl transition-all shadow-lg select-none flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <span>♨️</span>
                    <span>{lang === 'bn' ? 'চেপে ধরে গরম পিচ ঢালুন (Hold to Pour)' : 'Hold to Pour Hot Bitumen Mix'}</span>
                  </button>
                )}

                {roadStep === 3 && !roadCompleted && (
                  <button
                    onClick={handleRollSteamroller}
                    className="px-8 py-3.5 bg-cyan-700 hover:bg-cyan-800 text-white font-black text-xs rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-95"
                  >
                    <span>🚜</span>
                    <span>{lang === 'bn' ? 'রোলার দিয়ে সমতল করুন (Tap to Roll)' : 'Tap to Drive Steamroller'}</span>
                  </button>
                )}

                {roadCompleted && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                      {lang === 'bn' ? '✓ রাস্তা পুরোপুরি মসৃণ ও নিরাপদ!' : '✓ Road Safely Restored for Traffic!'}
                    </span>
                    <button
                      onClick={resetRoadGame}
                      className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-black"
                    >
                      {lang === 'bn' ? 'আরেকটি মেরামত করুন' : 'Fix Another'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Minigame 4: Green Purulia & Solar Lights */}
          {arcadeMinigame === 'tree' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <h2 className="text-lg font-bold text-stone-900">
                      {lang === 'bn' ? 'সুভাষ পার্ক ও অযোধ্যা সংলগ্ন সবুজায়ন' : 'Subhas Park & Ajodhya Green Canopy'}
                    </h2>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    {lang === 'bn'
                      ? 'খালি জমিতে পলাশ, শাল ও নিম গাছ রোপণ করুন এবং অন্ধকার গলিতে সৌরবাতি স্থাপন করুন।'
                      : 'Plant native Palash, Sal, and Neem trees or install solar LED streetlights on vacant plots.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-900 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Trees className="w-3.5 h-3.5 text-green-700" />
                    <span>{plantedSpots.length} Trees</span>
                  </span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-700" />
                    <span>{solarSpots.length} Solar Lights</span>
                  </span>
                </div>
              </div>

              {/* Park grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: totalSpots }).map((_, idx) => {
                  const spotId = idx + 1;
                  const hasTree = plantedSpots.includes(spotId);
                  const hasSolar = solarSpots.includes(spotId);

                  return (
                    <div
                      key={spotId}
                      className="bg-stone-50 border-2 border-stone-200 rounded-2xl p-4 text-center space-y-3 flex flex-col justify-between"
                    >
                      <div className="text-4xl min-h-[48px] flex items-center justify-center">
                        {hasTree ? '🌺🌳' : hasSolar ? '☀️💡' : '🟫'}
                      </div>
                      <div className="text-xs font-bold text-stone-800">
                        {hasTree 
                          ? (lang === 'bn' ? 'পলাশ বৃক্ষ' : 'Red Palash Tree')
                          : hasSolar
                          ? (lang === 'bn' ? 'সৌর সড়ক বাতি' : 'Solar LED Pole')
                          : (lang === 'bn' ? `প্লট #${spotId} (খালি)` : `Plot #${spotId} (Vacant)`)}
                      </div>

                      {!hasTree && !hasSolar ? (
                        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-stone-200">
                          <button
                            onClick={() => handlePlantTree(spotId)}
                            className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold"
                          >
                            🌱 Plant
                          </button>
                          <button
                            onClick={() => handleInstallSolar(spotId)}
                            className="p-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold"
                          >
                            ☀️ Solar
                          </button>
                        </div>
                      ) : (
                        <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 py-1 rounded">
                          {lang === 'bn' ? '✓ এলাকা উন্নত' : '✓ Improved'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* MODE 2: PURULIA WARD MAYOR SIMULATION */}
      {/* ==================================================== */}
      {activeMode === 'mayor' && (
        <div className="space-y-6">
          {/* Mayor Dashboard Top Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                {lang === 'bn' ? 'পৌর তহবিল' : 'Civic Budget'}
              </div>
              <div className="text-xl font-black text-emerald-700 mt-1 flex items-center gap-1">
                <span>₹{(civicBudget / 1000).toFixed(0)}k</span>
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">Purulia Municipal Fund</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                {lang === 'bn' ? 'স্বচ্ছতা সূচক' : 'Swachh Purulia Index'}
              </div>
              <div className="text-xl font-black text-stone-900 mt-1 flex items-center gap-1.5">
                <span>{avgCleanliness}%</span>
                <span className="text-xs text-emerald-600 font-bold">↑ High</span>
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">Average across wards</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                {lang === 'bn' ? 'ড্রেনেজ প্রবাহ' : 'Drainage Flow Rate'}
              </div>
              <div className="text-xl font-black text-cyan-700 mt-1">
                {avgDrainage}%
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">Zero monsoon overflow</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                {lang === 'bn' ? 'নাগরিক সন্তুষ্টি' : 'Citizen Happiness'}
              </div>
              <div className="text-xl font-black text-amber-600 mt-1 flex items-center gap-1">
                <Heart className="w-4 h-4 fill-amber-500" />
                <span>{civicKarma}%</span>
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">Resident Trust Level</div>
            </div>
          </div>

          {/* Active Wards List with Live Emergency Alerts */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {lang === 'bn' ? 'পুরুলিয়ার ওয়ার্ড পরিস্থিতি ও সমস্যা সমাধান' : 'Purulia Municipal Wards & Civic Operations'}
                </h3>
                <p className="text-xs text-stone-500">
                  {lang === 'bn'
                    ? 'তহবিল বরাদ্দ করে ওয়ার্ডের সমস্যা সমাধানে মিউনিসিপ্যাল টিম পাঠান।'
                    : 'Dispatch sanitation, drainage, or road repair units to handle ward emergencies.'}
                </p>
              </div>

              {activeAlertsCount > 0 ? (
                <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold animate-pulse">
                  {activeAlertsCount} {lang === 'bn' ? 'টি সমস্যা সমাধান প্রয়োজন' : 'Issues Pending Action'}
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  {lang === 'bn' ? '✓ সব ওয়ার্ড নিরাপদ ও পরিচ্ছন্ন' : '✓ All Wards Stable & Clean'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {wards.map((ward) => (
                <div
                  key={ward.id}
                  className={`p-4 rounded-xl border-2 transition-all space-y-3 ${
                    ward.alert && !ward.alert.resolved
                      ? 'bg-amber-50/50 border-amber-300'
                      : 'bg-stone-50/70 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900">
                      {lang === 'bn' ? ward.nameBn : ward.nameEn}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-stone-200 font-bold">
                      Cleanliness: {ward.cleanliness}%
                    </span>
                  </div>

                  {/* Meter bars */}
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-stone-600">
                    <div>
                      <div>Drainage</div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full mt-0.5 overflow-hidden">
                        <div className="bg-cyan-600 h-full" style={{ width: `${ward.drainage}%` }} />
                      </div>
                    </div>
                    <div>
                      <div>Roads</div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full mt-0.5 overflow-hidden">
                        <div className="bg-amber-600 h-full" style={{ width: `${ward.roads}%` }} />
                      </div>
                    </div>
                    <div>
                      <div>Greening</div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full mt-0.5 overflow-hidden">
                        <div className="bg-green-600 h-full" style={{ width: `${ward.greenery}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Ward Alert & Dispatch Action */}
                  {ward.alert && !ward.alert.resolved ? (
                    <div className="bg-white p-3 rounded-lg border border-amber-300 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold text-stone-900">
                          ⚠️ {lang === 'bn' ? ward.alert.titleBn : ward.alert.titleEn}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          Cost: ₹{(ward.alert.cost / 1000).toFixed(0)}k from municipal treasury
                        </div>
                      </div>
                      <button
                        onClick={() => handleDispatchMayorTeam(ward.id)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg transition-colors shrink-0 flex items-center gap-1 shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'টিম পাঠান' : 'Dispatch Team'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-700 bg-emerald-50/70 p-2 rounded-lg font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{lang === 'bn' ? 'ওয়ার্ডের নাগরিক পরিষেবা স্বাভাবিক' : 'Ward civic services in top shape'}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODE 3: CIVIC CERTIFICATE & BADGES */}
      {/* ==================================================== */}
      {activeMode === 'certificate' && (
        <div className="space-y-6">
          {/* Printable Purulia Civic Champion Certificate */}
          <div className="bg-white border-8 border-amber-700/80 rounded-2xl p-6 sm:p-10 shadow-xl max-w-3xl mx-auto space-y-6 text-center relative overflow-hidden">
            {/* Purulia Emblem Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-[180px] font-black">🏛️</span>
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase font-black tracking-widest text-amber-800">
                Government of West Bengal • Purulia Municipality
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900">
                Purulia Civic Action Champion
              </h2>
              <p className="text-xs font-serif text-stone-600 italic">
                Certificate of Civic Excellence & Community Guardianship
              </p>
            </div>

            <div className="py-2">
              <div className="text-xs text-stone-500">This honor is proudly awarded to:</div>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="mt-2 text-xl sm:text-2xl font-black text-center text-stone-900 border-b-2 border-stone-300 focus:border-amber-600 outline-hidden px-4 py-1 max-w-md w-full bg-transparent"
              />
            </div>

            <p className="text-xs sm:text-sm text-stone-700 max-w-xl mx-auto leading-relaxed font-serif">
              For exemplary dedication towards public cleanliness at <strong>Saheb Bandh</strong>, proactive drainage clearance on <strong>Court Road</strong>, pothole repairs at <strong>Bhatbandh</strong>, and championing the greening of Purulia with over <strong>{playerScore} Civic Points</strong>.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200 text-left">
              <div>
                <div className="text-[10px] text-stone-400 uppercase font-bold">Registration No.</div>
                <div className="font-mono text-xs font-bold text-stone-800">PUR-CIVIC-2026-X8</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-stone-400 uppercase font-bold">Civic Grade</div>
                <div className="text-xs font-bold text-amber-700">{playerLevel.titleEn}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-stone-400 uppercase font-bold">Verification</div>
                <div className="text-xs font-bold text-emerald-700">✓ Parishkar Certified</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'bn' ? 'শহীদ শংসাপত্র প্রিন্ট / সেভ করুন' : 'Print / Save Certificate'}</span>
              </button>
            </div>
          </div>

          {/* Badges Collection */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>{lang === 'bn' ? 'অর্জিত সিভিক মেডেল ও ব্যাজ' : 'Civic Medals & Achievements'}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl border-2 text-center space-y-2 ${
                unlockedBadges.includes('first_step') ? 'bg-amber-50 border-amber-300' : 'bg-stone-50 border-stone-200 opacity-50'
              }`}>
                <div className="text-3xl">🎖️</div>
                <div className="text-xs font-bold text-stone-900">First Step</div>
                <div className="text-[10px] text-stone-500">Joined Purulia civic action</div>
              </div>

              <div className={`p-4 rounded-xl border-2 text-center space-y-2 ${
                unlockedBadges.includes('waste_warrior') ? 'bg-emerald-50 border-emerald-300' : 'bg-stone-50 border-stone-200 opacity-50'
              }`}>
                <div className="text-3xl">🌊</div>
                <div className="text-xs font-bold text-stone-900">Saheb Bandh Protector</div>
                <div className="text-[10px] text-stone-500">Mastered waste segregation</div>
              </div>

              <div className={`p-4 rounded-xl border-2 text-center space-y-2 ${
                unlockedBadges.includes('drain_master') ? 'bg-cyan-50 border-cyan-300' : 'bg-stone-50 border-stone-200 opacity-50'
              }`}>
                <div className="text-3xl">💧</div>
                <div className="text-xs font-bold text-stone-900">Flood Buster</div>
                <div className="text-[10px] text-stone-500">De-clogged Court Road storm drain</div>
              </div>

              <div className={`p-4 rounded-xl border-2 text-center space-y-2 ${
                unlockedBadges.includes('road_builder') ? 'bg-amber-50 border-amber-300' : 'bg-stone-50 border-stone-200 opacity-50'
              }`}>
                <div className="text-3xl">🚜</div>
                <div className="text-xs font-bold text-stone-900">Master Road Engineer</div>
                <div className="text-[10px] text-stone-500">Paved Bhatbandh roadway</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
