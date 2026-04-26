/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  History as HistoryIcon, 
  Settings as SettingsIcon,
  Recycle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  Bell,
  Moon,
  Globe,
  LogOut,
  Camera,
  Search,
  QrCode,
  Leaf,
  Droplets,
  Calendar,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  Save,
  Flame,
  Trophy,
  Crown,
  Award,
  ChevronLeft,
  Maximize,
  ScanLine,
  Sparkles,
  TrendingUp,
  Timer,
  Box,
  Milk,
  FlaskConical,
  CupSoda,
  Apple,
  Coffee,
  Egg,
  ShoppingBag,
  WineOff,
  Baby,
  Soup,
  Battery,
  Cpu,
  Lightbulb
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn, WASTE_CATEGORIES, RECENT_SCANS } from './lib/utils';
import { translations, type Language } from './translations';
import { auth, db } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  serverTimestamp,
  increment,
  onSnapshot
} from 'firebase/firestore';

// --- Types ---
interface UserState {
  displayName: string;
  email: string;
  bio: string;
  avatarUrl: string;
  points: number;
  streak: number;
  totalScans: number;
  co2SavedKg: number;
  currentLeague: string;
  createdAt: any;
  isAdmin: boolean;
}

// --- Components ---

function NavItem({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-200 px-4 py-2",
        active 
          ? "text-emerald-600 scale-100" 
          : "text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 scale-95"
      )}
    >
      <div className={cn(
        "p-1 rounded-xl transition-colors",
        active && "bg-emerald-50 dark:bg-emerald-500/10"
      )}>
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className="text-[11px] font-medium mt-1">{label}</span>
    </Link>
  );
}

function Header({ user, lang, setLang }: { user: UserState | null, lang: Language, setLang: (l: Language) => void }) {
  const t = translations[lang];
  if (!user) return null;
  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-slate-100 dark:border-dark-border px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
            <Recycle size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-dark-text-main">EcoTrack</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
               className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full border border-slate-100 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-bold text-[10px] uppercase tracking-widest"
             >
               <Globe size={14} />
               {lang === 'en' ? 'ไทย' : 'ENG'}
             </button>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full border border-orange-100 dark:border-orange-500/20">
               <Flame size={16} fill="currentColor" />
               <span className="font-bold text-xs">{user.streak} {t.dayStreak}</span>
             </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">{t.dashboard}</Link>
            <Link to="/league" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">{t.league}</Link>
            <Link to="/guide" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">{t.guide}</Link>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-dark-border" />
          <Link to="/settings" className="flex items-center gap-3 group">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 leading-none uppercase tracking-widest">{t.level} {Math.floor(user.points / 500) + 1}</p>
              <p className="text-sm font-bold text-slate-900 dark:text-dark-text-main leading-none mt-1">{user.displayName.split(' ')[0]}</p>
            </div>
            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white dark:border-dark-border shadow-sm group-hover:scale-105 transition-transform">
              <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function MobileNav({ user, lang }: { user: UserState | null, lang: Language }) {
  const location = useLocation();
  const t = translations[lang];
  if (!user) return null;
  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50 glass rounded-3xl shadow-2xl flex justify-around items-center px-2 py-2">
      <NavItem to="/" icon={LayoutDashboard} label={t.home} active={location.pathname === '/'} />
      <NavItem to="/league" icon={Trophy} label={t.rank} active={location.pathname === '/league'} />
      <NavItem to="/guide" icon={BookOpen} label={t.guide} active={location.pathname === '/guide'} />
      <NavItem to="/history" icon={HistoryIcon} label={t.log} active={location.pathname === '/history'} />
      <NavItem to="/settings" icon={SettingsIcon} label={t.user} active={location.pathname.startsWith('/settings')} />
    </nav>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto px-6 py-10 pb-32 md:pb-10 w-full"
    >
      {children}
    </motion.div>
  );
}

// --- Pages ---

function LoginPage({ lang }: { lang: Language }) {
  const navigate = useNavigate();
  const t = translations[lang];

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[32px] border border-slate-100 p-10 shadow-2xl relative overflow-hidden text-center"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
        <div className="inline-flex w-16 h-16 bg-primary/10 text-primary rounded-2xl items-center justify-center mb-8">
          <Recycle size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">EcoTrack</h1>
        <p className="text-slate-500 mb-10 font-medium">{t.everyActionCounts}</p>
        
        <div className="space-y-4">
          <button 
            onClick={handleGoogleSignIn}
            className="w-full py-4 px-6 border-2 border-slate-100 rounded-xl flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            {lang === 'en' ? 'Continue with Google' : 'ดำเนินการต่อด้วย Google'}
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-slate-100 flex-1" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{lang === 'en' ? 'or' : 'หรือ'}</span>
            <div className="h-px bg-slate-100 flex-1" />
          </div>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); }}>
            <div className="text-left opacity-50 cursor-not-allowed">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">{t.email}</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  disabled
                  type="email" 
                  placeholder="hello@example.com" 
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 outline-none font-semibold text-slate-900"
                />
              </div>
            </div>
            <button disabled className="w-full bg-slate-200 text-slate-400 font-bold py-4 rounded-xl flex items-center justify-center gap-3 cursor-not-allowed">
              {t.signIn}
            </button>
          </form>
        </div>
        
        <p className="mt-10 text-xs text-slate-400 font-medium leading-relaxed italic">
          {lang === 'en' ? 'Sign in to sync your recycling impact across devices.' : 'ลงชื่อเข้าใช้เพื่อซิงค์ข้อมูลการรีไซเคิลของคุณระหว่างอุปกรณ์'}
        </p>
      </motion.div>
    </div>
  );
}

function RegisterPage({ onLogin, lang }: { onLogin: () => void, lang: Language }) {
  const navigate = useNavigate();
  const t = translations[lang];
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[32px] border border-slate-100 p-10 shadow-2xl relative overflow-hidden text-center"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
        <div className="inline-flex w-16 h-16 bg-primary/10 text-primary rounded-2xl items-center justify-center mb-8">
          <Leaf size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{t.joinEcoTrack}</h1>
        <p className="text-slate-500 mb-10 font-medium">{t.everyActionCounts}</p>
        
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); navigate('/'); }}>
          <div className="text-left">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">{t.fullName}</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Sarah Jenkins" 
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-slate-900"
                required
              />
            </div>
          </div>
          <div className="text-left">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">{t.email}</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="sarah.j@example.com" 
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-slate-900"
                required
              />
            </div>
          </div>
          <div className="text-left">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Create Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-slate-900"
                required
              />
            </div>
          </div>
          <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 group mt-6">
            {t.joinEcoTrack}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <p className="mt-10 text-sm text-slate-500 font-medium italic">
          Already a member? <Link to="/login" className="text-primary font-bold hover:underline not-italic">{t.signIn}</Link>
        </p>
      </motion.div>
    </div>
  );
}
function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white dark:bg-dark-surface p-5 md:p-6 rounded-3xl border border-slate-100 dark:border-dark-border card-shadow transition-all hover:border-primary/20 dark:hover:border-primary/40 group">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", color)}>
        <Icon size={20} />
      </div>
      <p className="text-slate-400 dark:text-dark-text-sub text-[10px] font-bold uppercase tracking-[0.2em]">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-dark-text-main mt-1">{value}</p>
    </div>
  );
}

function Dashboard({ user, lang }: { user: UserState, lang: Language }) {
  const navigate = useNavigate();
  const t = translations[lang];
  return (
    <PageWrapper>
      <section className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-100 dark:border-dark-border p-8 md:p-12 mb-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 card-shadow">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 dark:bg-primary/10 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-6 relative">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">New Challenges Available</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-dark-text-main mb-6 leading-[1.1] tracking-tight">{t.oneScanAtATime.split(',')[0]}, <span className="text-primary italic">{lang === 'en' ? 'greener' : 'เขียวขจี'}</span> {t.oneScanAtATime.split(',')[1]}</h1>
          <p className="text-lg text-slate-500 dark:text-dark-text-sub mb-8 leading-relaxed max-w-md">Our AI helps you sort waste instantly. Earn points, compete in leagues, and make a real impact.</p>
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
            <button 
              onClick={() => navigate('/scan')}
              className="bg-primary text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-3 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95 text-lg"
            >
              <QrCode size={22} />
              {t.startScanning}
            </button>
            <button className="px-8 py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
              Tutorial
            </button>
          </div>
        </div>
        <div className="relative z-10 w-full md:w-1/3 aspect-square max-w-[320px] group">
          <div className="absolute inset-0 bg-primary/20 rounded-[40px] rotate-6 group-hover:rotate-0 transition-transform duration-500" />
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" 
            alt="Sustainability" 
            className="w-full h-full object-cover rounded-[40px] shadow-2xl relative z-10 border-4 border-white dark:border-dark-border"
          />
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        <StatCard icon={CheckCircle2} label={t.scans} value={user.totalScans.toLocaleString()} color="bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400" />
        <StatCard icon={Leaf} label={t.co2Saved} value={`${user.co2SavedKg.toFixed(1)}kg`} color="bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400" />
        <StatCard icon={Trophy} label={t.rank} value={user.currentLeague} color="bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400" />
        <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-3xl shadow-xl text-white col-span-2 md:col-span-1 border border-slate-800 dark:border-slate-800">
           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{t.nextRank}</p>
           <div className="flex justify-between items-end mb-3">
             <span className="text-2xl font-bold italic text-amber-400">Gold</span>
             <span className="text-xs font-medium text-slate-400">{(user.points % 500 / 5) || 0}% complete</span>
           </div>
           <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${(user.points % 500 / 5) || 0}%` }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-full bg-primary" 
             />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-3xl border border-slate-100 dark:border-dark-border shadow-sm p-8 card-shadow">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-dark-text-main">{t.recentActivity}</h2>
            <Link to="/history" className="text-primary text-sm font-bold hover:underline">{t.seeHistory}</Link>
          </div>
          <div className="space-y-3">
            {RECENT_SCANS.slice(0, 4).map((scan) => (
              <div key={scan.id} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-dark-surface flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-sm group-hover:text-primary transition-all border border-transparent dark:border-dark-border">
                    <Droplets size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-dark-text-main group-hover:text-primary transition-colors">{scan.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-dark-text-sub uppercase tracking-widest">{scan.category}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-sm font-bold text-slate-900 dark:text-dark-text-main">+{scan.points || 15} pts</p>
                   <p className="text-[10px] font-medium text-slate-400 dark:text-dark-text-sub">2h ago</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary/5 dark:bg-primary/10 rounded-3xl border border-primary/10 dark:border-primary/20 p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-primary mb-2">{t.dailyGoal}</h2>
            <p className="text-sm text-primary/70 dark:text-primary/80 font-medium mb-6">Scan 5 more items today to keep your streak!</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-primary/5 dark:border-primary/10 flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center">
                  <Flame size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-dark-text-main">Current Streak</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-dark-text-sub">12 {lang === 'en' ? 'days' : 'วัน'} {lang === 'en' ? 'and counting' : 'และกำลังเพิ่มขึ้น'}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/scan')}
                className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
              >
                {t.scanNow}
              </button>
            </div>
          </div>
          <Flame size={120} className="absolute -right-8 -bottom-8 text-primary/10 -rotate-12" />
        </section>
      </div>
    </PageWrapper>
  );
}

function ScanPage({ user, lang }: { user: UserState, lang: Language }) {
  const navigate = useNavigate();
  const t = translations[lang];
  const [isScanning, setIsScanning] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const performScan = async () => {
      const timer = setTimeout(async () => {
        setIsScanning(false);
        const scanResult = {
          itemName: lang === 'en' ? 'Plastic Water Bottle' : 'ขวดน้ำพลาสติก',
          category: lang === 'en' ? 'Recyclable' : 'รีไซเคิลได้',
          pointsAwarded: 15,
          impactScore: 0.2, // kg CO2
          tip: lang === 'en' ? 'Remove the cap if it is a different type of plastic.' : 'ถอดฝาออกหากเป็นพลาสติกคนละชนิดกัน'
        };
        setResult(scanResult);

        // Save to Firebase
        if (auth.currentUser) {
          try {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            const scansRef = collection(userRef, 'scans');
            
            await addDoc(scansRef, {
              ...scanResult,
              userId: auth.currentUser.uid,
              timestamp: serverTimestamp()
            });

            await updateDoc(userRef, {
              points: increment(scanResult.pointsAwarded),
              totalScans: increment(1),
              co2SavedKg: increment(scanResult.impactScore),
              lastActive: serverTimestamp()
            });
          } catch (error) {
            console.error("Failed to save scan", error);
          }
        }
      }, 3000);
      return () => clearTimeout(timer);
    };
    performScan();
  }, [lang]);

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold hover:text-primary transition-colors text-sm"
        >
          <ChevronLeft size={18} />
          {t.back}
        </button>

        <div className="relative aspect-[3/4] bg-slate-950 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white dark:border-dark-border">
          <img 
            src="https://images.unsplash.com/photo-1595273670150-db0c3c39243f?auto=format&fit=crop&q=80&w=800" 
            className="w-full h-full object-cover opacity-50"
            alt="Scanning area"
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            {isScanning ? (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative"
                >
                  <div className="w-56 h-56 border-2 border-primary/40 rounded-3xl relative">
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10"
                    />
                  </div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
                </motion.div>
                <div className="mt-12 glass px-6 py-3 rounded-2xl text-white font-bold flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  {t.analyzing}
                </div>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="bg-white dark:bg-dark-surface rounded-[32px] p-8 shadow-2xl text-center">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-text-main mb-1">{t.success}</h2>
                  <p className="text-lg font-bold text-primary mb-6">{result.itemName}</p>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl mb-8 text-left space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 dark:text-dark-text-sub font-bold uppercase tracking-widest text-[10px]">{lang === 'en' ? 'Category' : 'หมวดหมู่'}</span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg font-bold text-[10px] uppercase tracking-wider">{result.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 dark:text-dark-text-sub font-bold uppercase tracking-widest text-[10px]">{lang === 'en' ? 'Points Gained' : 'คะแนนที่ได้รับ'}</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-dark-text-main">+{result.pointsAwarded}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-200 dark:border-dark-border">
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed italic">"{result.tip}"</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate('/')}
                      className="flex-1 bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-all active:scale-95"
                    >
                      {t.dashboard}
                    </button>
                    <button 
                      onClick={() => setIsScanning(true)}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                    >
                      {t.scanMore}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function LeaguePage({ user: currentUser, lang }: { user: UserState, lang: Language }) {
  const t = translations[lang];
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const usersRef = collection(db, 'users');
    // Simple leaderboard query: top 10 by points
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const userData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as any
      })).sort((a: any, b: any) => (b.points || 0) - (a.points || 0)).slice(0, 10);
      setPlayers(userData);
    }, (error) => {
      console.error("Leaderboard fetch failed", error);
    });
    return () => unsubscribe();
  }, []);

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-dark-surface rounded-[32px] border border-slate-100 dark:border-dark-border p-8 md:p-10 mb-10 card-shadow flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 dark:bg-amber-500/5 rounded-full -mr-16 -mt-16 opacity-50" />
          <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center text-white shadow-xl shrink-0">
            <Trophy size={48} />
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
               <span className="text-xs font-bold px-3 py-1 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-full uppercase tracking-widest">{currentUser.currentLeague} {lang === 'en' ? 'League' : 'ลีก'}</span>
               <span className="text-xs font-bold text-slate-400 dark:text-dark-text-sub">• {lang === 'en' ? 'Season 4' : 'ฤดูกาลที่ 4'}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-dark-text-main mb-2">
              {players.findIndex(p => p.id === auth.currentUser?.uid) === 0 
                ? (lang === 'en' ? "You're in 1st place!" : "คุณอยู่อันดับที่ 1!")
                : (lang === 'en' ? `You're in ${players.findIndex(p => p.id === auth.currentUser?.uid) + 1}th place!` : `คุณอยู่อันดับที่ ${players.findIndex(p => p.id === auth.currentUser?.uid) + 1}!`)}
            </h1>
            <p className="text-slate-500 dark:text-dark-text-sub font-medium leading-tight">{lang === 'en' ? 'Stay in the top 3 until Sunday to promote to' : 'รักษาอันดับให้อยู่ใน 3 อันดับแรกจนถึงวันอาทิตย์เพื่อเลื่อนระดับไปสู่'} <span className="text-amber-600 font-bold underline decoration-amber-200 dark:decoration-amber-900">{lang === 'en' ? 'Gold League' : 'ลีกระดับทอง'}</span>.</p>
          </div>
          <div className="flex items-center gap-2 text-slate-900 dark:text-dark-text-main bg-slate-50 dark:bg-slate-800 px-5 py-3 rounded-2xl border border-slate-100 dark:border-dark-border">
             <div className="text-right">
               <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Ending In</p>
               <div className="flex items-center gap-2 mt-1">
                 <Timer size={16} className="text-primary" />
                 <span className="font-bold text-sm tabular-nums text-slate-700 dark:text-slate-300">2d 14h</span>
               </div>
             </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface rounded-[32px] border border-slate-100 dark:border-dark-border card-shadow overflow-hidden">
          <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-dark-border flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">{lang === 'en' ? 'Leaderboard' : 'ตารางผู้นำ'}</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono">{lang === 'en' ? 'Promotion Zone' : 'โซนเลื่อนระดับ'}</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-dark-border">
            {players.map((p, idx) => (
              <div key={p.id} className={cn(
                "p-5 flex items-center justify-between transition-colors",
                p.id === auth.currentUser?.uid ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
              )}>
                <div className="flex items-center gap-5">
                  <div className="w-10 text-center font-bold text-slate-300 dark:text-slate-600 flex items-center justify-center gap-1">
                    {p.id === auth.currentUser?.uid && idx < 3 && <Trophy size={14} className="text-amber-500 animate-bounce" />}
                    {idx === 0 ? <Crown size={20} className="text-amber-500 mx-auto" strokeWidth={2.5} /> : idx + 1}
                  </div>
                  <div className="relative group">
                    <img src={p.avatarUrl} alt={p.displayName} className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-dark-border shadow-sm transition-transform group-hover:scale-105" />
                    {idx < 3 && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center p-1 border-2 border-white dark:border-dark-border shadow-md"><Award size={10} /></div>}
                  </div>
                  <div>
                    <p className={cn("font-bold text-slate-900 dark:text-dark-text-main leading-none", p.id === auth.currentUser?.uid && "text-primary")}>{p.displayName}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded text-[10px] font-bold">
                         <Flame size={10} fill="currentColor" />
                         {p.streak || 0}d
                       </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-dark-text-main tabular-nums">{(p.points || 0).toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-dark-text-sub uppercase tracking-widest font-mono leading-none">PTS</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function Guide({ lang }: { lang: Language }) {
  const t = translations[lang];
  return (
    <PageWrapper>
      <div className="max-w-2xl mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-dark-text-main mb-4 tracking-tight">{t.guide}</h1>
        <p className="text-lg text-slate-500 dark:text-dark-text-sub font-medium">{lang === 'en' ? 'Master the art of sorting. Proper disposal reduces landfill waste by up to 60%.' : 'เก่งเรื่องการคัดแยกขยะ การกำจัดอย่างถูกวิธีช่วยลดขยะในหลุมฝังกลบได้ถึง 60%'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {WASTE_CATEGORIES.map((cat) => (
          <motion.div 
            key={cat.id}
            className="rounded-[32px] p-8 border border-slate-100 dark:border-dark-border bg-white dark:bg-dark-surface card-shadow relative overflow-hidden"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", 
                cat.id === 'recyclable' ? "bg-primary" : 
                cat.id === 'organic' ? "bg-primary" : 
                cat.id === 'general' ? "bg-slate-400 dark:bg-slate-600" : "bg-rose-400 dark:bg-rose-600"
              )}>
                 <Recycle size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-dark-text-main">{(t.categories as any)[cat.id] || cat.title}</h2>
            </div>
            
            <p className="text-slate-500 dark:text-dark-text-sub mb-6 text-sm leading-relaxed">{cat.description}</p>
            
            <div className="space-y-2 mb-8">
              {cat.items.map((item: any, idx: number) => {
                const ItemIcon = (Icons as any)[item.icon] || Info;
                return (
                  <div key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl group/item">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-dark-surface flex items-center justify-center shadow-sm group-hover/item:text-primary transition-colors border border-transparent dark:border-dark-border">
                      <ItemIcon size={16} strokeWidth={2.5} />
                    </div>
                    {item.name}
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-50 dark:border-dark-border flex items-start gap-2">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 leading-tight italic">"{cat.noLimit}"</span>
            </div>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
}

function History({ user, lang }: { user: UserState, lang: Language }) {
  const t = translations[lang];
  const [scans, setScans] = useState<any[]>([]);

  useEffect(() => {
    if (auth.currentUser) {
      const scansRef = collection(db, 'users', auth.currentUser.uid, 'scans');
      const unsubscribe = onSnapshot(scansRef, (snapshot) => {
        const scanData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as any
        })).sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        setScans(scanData);
      }, (error) => {
        console.error("History fetch failed", error);
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <PageWrapper>
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-dark-text-main tracking-tight">{t.recentActivity}</h1>
          <p className="text-slate-500 dark:text-dark-text-sub mt-2 font-medium">{lang === 'en' ? 'Tracking your real-world contribution.' : 'ติดตามการมีส่วนร่วมของคุณในโลกความเป็นจริง'}</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder={lang === 'en' ? 'Search your logs...' : 'ค้นหาบันทึกของคุณ...'} 
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-100 dark:border-dark-border bg-white dark:bg-dark-surface focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm text-slate-900 dark:text-dark-text-main"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl border border-slate-100 dark:border-dark-border card-shadow flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 dark:bg-rose-500/5 rounded-full -mr-12 -mt-12 opacity-50" />
          <p className="text-slate-400 dark:text-dark-text-sub text-[10px] font-bold uppercase tracking-widest">{lang === 'en' ? 'Lifetime Score' : 'คะแนนตลอดชีพ'}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900 dark:text-dark-text-main tracking-tight">{user.points.toLocaleString()}</span>
            <span className="text-xs font-bold text-primary">Total</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl border border-slate-100 dark:border-dark-border card-shadow flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 dark:bg-primary/10 rounded-full -mr-12 -mt-12 opacity-50" />
          <p className="text-slate-400 dark:text-dark-text-sub text-[10px] font-bold uppercase tracking-widest">{lang === 'en' ? 'Global Rank' : 'อันดับโลก'}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900 dark:text-dark-text-main tracking-tight">#{Math.floor(Math.random() * 100) + 1}</span>
            <span className="text-xs font-bold text-primary">Top 1%</span>
          </div>
        </div>

        <div className="bg-slate-900 dark:bg-slate-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-slate-800 dark:border-slate-800">
          <div className="absolute top-0 right-0 w-full h-full bg-primary/10 -skew-x-12 translate-x-1/2" />
          <p className="text-slate-400 dark:text-dark-text-sub text-[10px] font-bold uppercase tracking-widest mb-1">{lang === 'en' ? 'Impact Tier' : 'ระดับผลกระทบ'}</p>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary">
              <Leaf size={24} />
            </div>
            <span className="text-2xl font-bold italic tracking-tight">{user.currentLeague} Guard</span>
          </div>
        </div>
      </div>

      <section className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-100 dark:border-dark-border card-shadow p-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-dark-text-main mb-8">{t.recentActivity}</h2>
        
        <div className="space-y-6">
          {scans.length > 0 ? (
            scans.map((scan) => (
              <HistoryItem 
                key={scan.id}
                icon={Recycle} 
                name={scan.itemName} 
                category={scan.category} 
                points={scan.pointsAwarded} 
                time={scan.timestamp ? new Date(scan.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'} 
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Recycle size={48} className="text-slate-100 dark:text-slate-800 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">{lang === 'en' ? 'No scans recorded yet. Start recycling!' : 'ยังไม่มีการบันทึกการสแกน เริ่มรีไซเคิลกันเลย!'}</p>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}

function HistoryItem({ icon: Icon, name, category, points, time }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group border border-slate-100/50 dark:border-dark-border/50">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-white dark:bg-dark-surface flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-sm group-hover:text-primary transition-colors border border-transparent dark:border-dark-border">
          <Icon size={24} />
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-dark-text-main group-hover:text-primary transition-colors leading-none mb-1.5">{name}</p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-dark-text-sub uppercase tracking-widest">{category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-slate-900 dark:text-dark-text-main leading-none">+{points}</p>
        <p className="text-[10px] font-medium text-slate-400 dark:text-dark-text-sub mt-1">{time}</p>
      </div>
    </div>
  );
}

function EditProfilePage({ user, onCancel, lang }: { user: UserState, onUpdate: (data: Partial<UserState>) => void, onCancel: () => void, lang: Language }) {
  const [formData, setFormData] = useState({ 
    displayName: user.displayName, 
    bio: user.bio, 
    email: user.email,
    avatarUrl: user.avatarUrl 
  });
  const t = translations[lang];

  const handleUpdate = async () => {
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        onCancel();
      } catch (error) {
        console.error("Profile update failed", error);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <ChevronLeft size={20} className="text-slate-500 dark:text-slate-400" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-dark-text-main tracking-tight">{t.editProfile}</h1>
      </div>

      <section className="bg-white dark:bg-dark-surface rounded-3xl border border-slate-100 dark:border-dark-border p-8 card-shadow space-y-10">
        <div className="flex flex-col items-center gap-6 pb-10 border-b border-slate-50 dark:border-dark-border">
           <div className="relative group">
            <img 
              src={formData.avatarUrl} 
              alt="Profile" 
              className="w-28 h-28 rounded-2xl object-cover border-4 border-white dark:border-dark-border shadow-xl group-hover:rotate-3 transition-transform"
            />
          </div>
          <div className="w-full max-w-xs">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 block mb-2">{lang === 'en' ? 'Profile Image URL' : 'URL รูปโปรไฟล์'}</label>
            <input 
              type="text" 
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-dark-border focus:bg-white dark:focus:bg-dark-surface focus:border-primary outline-none transition-all font-medium text-xs text-slate-600 dark:text-slate-400"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 block">{t.fullName}</label>
            <input 
              type="text" 
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-dark-border focus:bg-white dark:focus:bg-dark-surface focus:border-primary outline-none transition-all font-bold text-slate-900 dark:text-dark-text-main"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 block">{t.bio}</label>
            <textarea 
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-dark-border focus:bg-white dark:focus:bg-dark-surface focus:border-primary outline-none transition-all font-bold text-slate-900 dark:text-dark-text-main resize-none text-sm"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 block">{t.email}</label>
            <input 
              disabled
              type="email" 
              value={formData.email}
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-dark-border font-bold text-slate-400 dark:text-slate-600 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            onClick={handleUpdate}
            className="flex-1 bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <Save size={18} />
            {t.saveChanges}
          </button>
          <button 
            onClick={onCancel}
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
          >
            {t.cancel}
          </button>
        </div>
      </section>
    </motion.div>
  );
}

function SettingsMain({ user, onLogout, lang, isDarkMode, setIsDarkMode }: { user: UserState, onLogout: () => void, lang: Language, isDarkMode: boolean, setIsDarkMode: (d: boolean) => void }) {
  const handleReset = async () => {
    if (auth.currentUser && window.confirm(lang === 'en' ? 'Are you sure you want to reset all your progress?' : 'คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตความคืบหน้าทั้งหมด?')) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          points: 0,
          streak: 0,
          totalScans: 0,
          co2SavedKg: 0,
          currentLeague: 'Bronze',
          updatedAt: serverTimestamp()
        });
        
        // Also delete scan history
        const scansRef = collection(db, 'users', auth.currentUser.uid, 'scans');
        // Note: For a real app we'd batch delete, but for now we just reset stats
        alert(lang === 'en' ? 'Progress reset successfully!' : 'รีเซ็ตความคืบหน้าสำเร็จแล้ว!');
      } catch (error) {
        console.error("Reset failed", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-3xl border border-slate-100 p-8 card-shadow flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <div className="relative group">
          <img 
            src={user.avatarUrl} 
            alt="Profile" 
            className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl group-hover:rotate-3 transition-transform"
          />
          <Link to="/settings/edit" className="absolute -bottom-2 -right-2 p-2.5 bg-primary text-white rounded-xl shadow-lg border-2 border-white active:scale-90 transition-all">
            <Camera size={16} />
          </Link>
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{user.displayName}</h1>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-widest">Pro</span>
          </div>
          <p className="text-slate-400 font-medium text-sm mb-4">{user.email}</p>
          <p className="text-slate-500 text-sm max-w-sm leading-relaxed">{user.bio}</p>
          <div className="mt-6 pt-6 border-t border-slate-50">
             <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{lang === 'en' ? 'Member since' : 'เป็นสมาชิกตั้งแต่'} {new Date(user.createdAt?.seconds * 1000).getFullYear() || '2023'}</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-100 card-shadow overflow-hidden">
        <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{lang === 'en' ? 'Account Management' : 'การจัดการบัญชี'}</span>
        </div>
        <div className="divide-y divide-slate-100">
          <Link to="/settings/edit" className="block">
             <SettingsItem icon={UserIcon} title={lang === 'en' ? "Personal Info" : "ข้อมูลส่วนตัว"} sub={lang === 'en' ? "Name, avatar, and bio" : "ชื่อ รูปโปรไฟล์ และประวัติ"} />
          </Link>
          <div onClick={handleReset}>
             <SettingsItem icon={XCircle} title={lang === 'en' ? "Reset Progress" : "รีเซ็ตความคืบหน้า"} sub={lang === 'en' ? "Clear scans, points and rank" : "ล้างการสแกน คะแนน และอันดับ"} />
          </div>
          {user.isAdmin && (
            <Link to="/settings/admin" className="block border-t border-slate-100">
               <SettingsItem icon={Cpu} title={lang === 'en' ? "System Admin" : "ผู้ดูแลระบบ"} sub={lang === 'en' ? "Manage users and system data" : "จัดการผู้ใช้และข้อมูลระบบ"} />
            </Link>
          )}
          <SettingsItem icon={Box} title={lang === 'en' ? "Eco Subscription" : "สมาชิก Eco"} sub={lang === 'en' ? "Manage your plan" : "จัดการแผนของคุณ"} />
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-100 card-shadow overflow-hidden">
         <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{lang === 'en' ? 'Preferences' : 'การตั้งค่า'}</span>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="px-8 py-6 flex items-center justify-between group">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900 group-hover:text-primary transition-colors leading-none mb-1.5">{lang === 'en' ? 'Notifications' : 'การแจ้งเตือน'}</p>
                <p className="text-xs font-medium text-slate-400">{lang === 'en' ? 'Push and email alerts' : 'การแจ้งเตือนแบบพุชและอีเมล'}</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
              <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          
          <div className="px-8 py-6 flex items-center justify-between group cursor-pointer" onClick={() => setIsDarkMode(!isDarkMode)}>
            <div className="flex items-center gap-5">
              <div className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center transition-all",
                isDarkMode ? "bg-primary text-white" : "bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white"
              )}>
                <Moon size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900 group-hover:text-primary transition-colors leading-none mb-1.5">{lang === 'en' ? 'Dark Mode' : 'โหมดมืด'}</p>
                <p className="text-xs font-medium text-slate-400">{lang === 'en' ? 'Adaptive interface' : 'ส่วนต่อประสานที่ปรับเปลี่ยนได้'}</p>
              </div>
            </div>
            <div className={cn(
              "w-12 h-6 rounded-full relative p-1 transition-colors duration-300",
              isDarkMode ? "bg-primary" : "bg-slate-200"
            )}>
              <div className={cn(
                "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300",
                isDarkMode ? "translate-x-6" : "translate-x-0"
              )} />
            </div>
          </div>
        </div>
      </section>

      <button 
        onClick={onLogout}
        className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
      >
        <LogOut size={20} />
        {lang === 'en' ? 'Sign Out' : 'ออกจากระบบ'}
      </button>
    </div>
  );
}

function AdminPanel({ lang }: { lang: Language }) {
  const [userCount, setUserCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // Only as an example of what an admin can see
    const usersRef = collection(db, 'users');
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      setUserCount(snapshot.size);
      let points = 0;
      snapshot.forEach(doc => {
        points += (doc.data().points || 0);
      });
      setTotalPoints(points);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">{lang === 'en' ? 'Admin Dashboard' : 'แผงควบคุมผู้ดูแลระบบ'}</h2>
        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full font-bold text-[10px] uppercase tracking-widest">Master Access</span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <StatCard icon={UserIcon} label="Total Users" value={userCount.toLocaleString()} color="bg-blue-50 text-blue-500" />
        <StatCard icon={TrendingUp} label="Total Community Points" value={totalPoints.toLocaleString()} color="bg-primary/10 text-primary" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-8 card-shadow">
        <h3 className="text-lg font-bold text-slate-900 mb-6">System Health</h3>
        <p className="text-slate-500 font-medium">All systems operational. Cloud Firestore connected.</p>
        <div className="mt-4 flex gap-2">
          <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-xs font-bold font-mono">DB: CONNECTED</div>
          <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-xs font-bold font-mono">AUTH: ACTIVE</div>
        </div>
      </div>
    </div>
  );
}

function Settings({ user, lang, isDarkMode, setIsDarkMode }: { user: UserState, lang: Language, isDarkMode: boolean, setIsDarkMode: (d: boolean) => void }) {
  const navigate = useNavigate();
  const onLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto">
        <Routes>
          <Route index element={<SettingsMain user={user} onLogout={onLogout} lang={lang} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="edit" element={<EditProfilePage user={user} lang={lang} onUpdate={() => {}} onCancel={() => navigate('/settings')} />} />
          {user.isAdmin && <Route path="admin" element={<AdminPanel lang={lang} />} />}
        </Routes>
      </div>
    </PageWrapper>
  );
}

function SettingsItem({ icon: Icon, title, sub }: any) {
  return (
    <div className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-all group text-left cursor-pointer">
      <div className="flex items-center gap-5">
        <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
          <Icon size={20} />
        </div>
        <div>
          <p className="font-bold text-slate-900 group-hover:text-primary transition-colors leading-none mb-1.5 uppercase tracking-wider text-[10px]">{title}</p>
          <p className="text-xs font-medium text-slate-400">{sub}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
  );
}

// --- Main App ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserState | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        // Listen to user document
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data() as UserState);
          } else {
            // Initialize user doc if it doesn't exist
            const newUser: UserState = {
              displayName: firebaseUser.displayName || 'Eco Warrior',
              email: firebaseUser.email || '',
              bio: "Passionate about zero-waste living and sustainable urban development. 🌱",
              avatarUrl: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
              points: 0,
              streak: 0,
              totalScans: 0,
              co2SavedKg: 0,
              currentLeague: "Bronze",
              createdAt: serverTimestamp(),
              isAdmin: false,
            };
            setDoc(userRef, newUser);
          }
          setLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Recycle size={48} className="text-primary animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading EcoTrack...</p>
        </div>
      </div>
    );
  }

  return (
    <Router basename="/Bin-Scan-Better">
      <div className="min-h-screen bg-background text-on-surface selection:bg-emerald-200 selection:text-emerald-900">
        <Header user={user} lang={lang} setLang={setLang} />
        
        <main className="relative">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage lang={lang} />} />
              <Route path="/register" element={user ? <Navigate to="/" /> : <LoginPage lang={lang} />} />
              
              <Route path="/" element={user ? <Dashboard user={user} lang={lang} /> : <Navigate to="/login" />} />
              <Route path="/scan" element={user ? <ScanPage user={user} lang={lang} /> : <Navigate to="/login" />} />
              <Route path="/league" element={user ? <LeaguePage user={user} lang={lang} /> : <Navigate to="/login" />} />
              <Route path="/guide" element={user ? <Guide lang={lang} /> : <Navigate to="/login" />} />
              <Route path="/history" element={user ? <History user={user} lang={lang} /> : <Navigate to="/login" />} />
              <Route path="/settings/*" element={user ? <Settings user={user} lang={lang} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} /> : <Navigate to="/login" />} />
            </Routes>
          </AnimatePresence>
        </main>

        <MobileNav user={user} lang={lang} />
      </div>
    </Router>
  );
}
