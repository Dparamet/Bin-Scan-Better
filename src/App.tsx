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

// --- Types ---
interface UserState {
  name: string;
  email: string;
  bio: string;
  joined: string;
  avatar: string;
  isPro: boolean;
  streak: number;
  league: string;
  points: number;
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
          : "text-slate-400 hover:text-emerald-600 scale-95"
      )}
    >
      <div className={cn(
        "p-1 rounded-xl transition-colors",
        active && "bg-emerald-50"
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
    <header className="sticky top-0 z-50 w-full glass border-b border-slate-100 px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
            <Recycle size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">EcoTrack</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
               className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full border border-slate-100 hover:bg-slate-100 transition-colors font-bold text-[10px] uppercase tracking-widest"
             >
               <Globe size={14} />
               {lang === 'en' ? 'ไทย' : 'ENG'}
             </button>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100">
               <Flame size={16} fill="currentColor" />
               <span className="font-bold text-xs">{user.streak} {t.dayStreak}</span>
             </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">{t.dashboard}</Link>
            <Link to="/league" className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">{t.league}</Link>
            <Link to="/guide" className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors">{t.guide}</Link>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <Link to="/settings" className="flex items-center gap-3 group">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 leading-none uppercase tracking-widest">{t.level} 12</p>
              <p className="text-sm font-bold text-slate-900 leading-none mt-1">{user.name.split(' ')[0]}</p>
            </div>
            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
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

function LoginPage({ onLogin, lang }: { onLogin: () => void, lang: Language }) {
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
          <Recycle size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">EcoTrack</h1>
        <p className="text-slate-500 mb-10 font-medium">{t.everyActionCounts}</p>
        
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); navigate('/'); }}>
          <div className="text-left">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">{t.email}</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="hello@example.com" 
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-slate-900"
                required
              />
            </div>
          </div>
          <div className="text-left">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
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
            {t.signIn}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
        
        <p className="mt-10 text-sm text-slate-500 font-medium italic">
          No account yet? <Link to="/register" className="text-primary font-bold hover:underline not-italic">{t.register}</Link>
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
    <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 card-shadow transition-all hover:border-primary/20 group">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", color)}>
        <Icon size={20} />
      </div>
      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function Dashboard({ lang }: { lang: Language }) {
  const navigate = useNavigate();
  const t = translations[lang];
  return (
    <PageWrapper>
      <section className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 mb-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 card-shadow">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-6">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">New Challenges Available</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">{t.oneScanAtATime.split(',')[0]}, <span className="text-primary italic">{lang === 'en' ? 'greener' : 'เขียวขจี'}</span> {t.oneScanAtATime.split(',')[1]}</h1>
          <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-md">Our AI helps you sort waste instantly. Earn points, compete in leagues, and make a real impact.</p>
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
            <button 
              onClick={() => navigate('/scan')}
              className="bg-primary text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-3 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95 text-lg"
            >
              <QrCode size={22} />
              {t.startScanning}
            </button>
            <button className="px-8 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all">
              Tutorial
            </button>
          </div>
        </div>
        <div className="relative z-10 w-full md:w-1/3 aspect-square max-w-[320px] group">
          <div className="absolute inset-0 bg-primary/20 rounded-[40px] rotate-6 group-hover:rotate-0 transition-transform duration-500" />
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" 
            alt="Sustainability" 
            className="w-full h-full object-cover rounded-[40px] shadow-2xl relative z-10"
          />
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        <StatCard icon={CheckCircle2} label={t.scans} value="1,248" color="bg-rose-50 text-rose-500" />
        <StatCard icon={Leaf} label={t.co2Saved} value="342kg" color="bg-emerald-50 text-emerald-500" />
        <StatCard icon={Trophy} label={t.rank} value="Silver II" color="bg-amber-50 text-amber-500" />
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white col-span-2 md:col-span-1 border border-slate-800">
           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{t.nextRank}</p>
           <div className="flex justify-between items-end mb-3">
             <span className="text-2xl font-bold italic text-amber-400">Gold</span>
             <span className="text-xs font-medium text-slate-400">85% complete</span>
           </div>
           <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '85%' }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-full bg-primary" 
             />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 card-shadow">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-900">{t.recentActivity}</h2>
            <Link to="/history" className="text-primary text-sm font-bold hover:underline">{t.seeHistory}</Link>
          </div>
          <div className="space-y-3">
            {RECENT_SCANS.slice(0, 4).map((scan) => (
              <div key={scan.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm group-hover:text-primary transition-all">
                    <Droplets size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{scan.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{scan.category}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-sm font-bold text-slate-900">+{scan.points || 15} pts</p>
                   <p className="text-[10px] font-medium text-slate-400">2h ago</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary/5 rounded-3xl border border-primary/10 p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-primary mb-2">{t.dailyGoal}</h2>
            <p className="text-sm text-primary/70 font-medium mb-6">Scan 5 more items today to keep your streak!</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-primary/5 flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                  <Flame size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Current Streak</p>
                  <p className="text-xs font-semibold text-slate-500">12 {lang === 'en' ? 'days' : 'วัน'} {lang === 'en' ? 'and counting' : 'และกำลังเพิ่มขึ้น'}</p>
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

function ScanPage({ lang }: { lang: Language }) {
  const navigate = useNavigate();
  const t = translations[lang];
  const [isScanning, setIsScanning] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
      setResult({
        name: lang === 'en' ? 'Plastic Water Bottle' : 'ขวดน้ำพลาสติก',
        category: lang === 'en' ? 'Recyclable' : 'รีไซเคิลได้',
        points: 15,
        tip: lang === 'en' ? 'Remove the cap if it is a different type of plastic.' : 'ถอดฝาออกหากเป็นพลาสติกคนละชนิดกัน'
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, [lang]);

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-slate-400 font-bold hover:text-primary transition-colors text-sm"
        >
          <ChevronLeft size={18} />
          {t.back}
        </button>

        <div className="relative aspect-[3/4] bg-slate-950 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
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
                <div className="bg-white rounded-[32px] p-8 shadow-2xl text-center">
                  <div className="w-16 h-16 bg-emerald-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{t.success}</h2>
                  <p className="text-lg font-bold text-primary mb-6">{result.name}</p>
                  
                  <div className="bg-slate-50 p-5 rounded-2xl mb-8 text-left space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{lang === 'en' ? 'Category' : 'หมวดหมู่'}</span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg font-bold text-[10px] uppercase tracking-wider">{result.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{lang === 'en' ? 'Points Gained' : 'คะแนนที่ได้รับ'}</span>
                      <span className="text-lg font-bold text-slate-900">+{result.points}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{result.tip}"</p>
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
                      className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all active:scale-95"
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

function LeaguePage({ lang }: { lang: Language }) {
  const t = translations[lang];
  const [activeLeague] = useState('Silver');
  const LEAGUE_PLAYERS = [
    { id: 1, name: 'EcoHero_99', points: 4250, streak: 15, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Sarah Jenkins', points: 3840, streak: 12, isSelf: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
    { id: 3, name: 'LeafLover', points: 3120, streak: 8, avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, name: 'GreenMachine', points: 2900, streak: 4, avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 5, name: 'OceanSaver', points: 2450, streak: 20, avatar: 'https://i.pravatar.cc/150?u=5' },
    { id: 6, name: 'TreePlanter', points: 2100, streak: 2, avatar: 'https://i.pravatar.cc/150?u=6' },
  ];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 md:p-10 mb-10 card-shadow flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 opacity-50" />
          <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center text-white shadow-xl shrink-0">
            <Trophy size={48} />
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
               <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-700 rounded-full uppercase tracking-widest">{activeLeague} {lang === 'en' ? 'League' : 'ลีก'}</span>
               <span className="text-xs font-bold text-slate-400">• {lang === 'en' ? 'Season 4' : 'ฤดูกาลที่ 4'}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{lang === 'en' ? "You're in 2nd place!" : "คุณอยู่อันดับที่ 2!"}</h1>
            <p className="text-slate-500 font-medium leading-tight">{lang === 'en' ? 'Stay in the top 3 until Sunday to promote to' : 'รักษาอันดับให้อยู่ใน 3 อันดับแรกจนถึงวันอาทิตย์เพื่อเลื่อนระดับไปสู่'} <span className="text-amber-600 font-bold underline decoration-amber-200">{lang === 'en' ? 'Gold League' : 'ลีกระดับทอง'}</span>.</p>
          </div>
          <div className="flex items-center gap-2 text-slate-900 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
             <Timer size={20} className="text-primary" />
             <span className="font-bold text-sm tabular-nums">2d 14h 22m</span>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 card-shadow overflow-hidden">
          <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{lang === 'en' ? 'Leaderboard' : 'ตารางผู้นำ'}</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono">{lang === 'en' ? 'Promotion Zone' : 'โซนเลื่อนระดับ'}</span>
          </div>
          <div className="divide-y divide-slate-100">
            {LEAGUE_PLAYERS.map((p, idx) => (
              <div key={p.id} className={cn(
                "p-5 flex items-center justify-between transition-colors",
                p.isSelf ? "bg-primary/5" : "hover:bg-slate-50/50"
              )}>
                <div className="flex items-center gap-5">
                  <div className="w-10 text-center font-bold text-slate-300 flex items-center justify-center gap-1">
                    {p.isSelf && idx < 3 && <Trophy size={14} className="text-amber-500 animate-bounce" />}
                    {idx === 0 ? <Crown size={20} className="text-amber-500 mx-auto" strokeWidth={2.5} /> : idx + 1}
                  </div>
                  <div className="relative group">
                    <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-105" />
                    {idx < 3 && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center p-1 border-2 border-white shadow-md"><Award size={10} /></div>}
                  </div>
                  <div>
                    <p className={cn("font-bold text-slate-900 leading-none", p.isSelf && "text-primary")}>{p.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[10px] font-bold">
                         <Flame size={10} fill="currentColor" />
                         {p.streak}d
                       </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 tabular-nums">{p.points.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono leading-none">PTS</p>
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
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">{t.guide}</h1>
        <p className="text-lg text-slate-500 font-medium">{lang === 'en' ? 'Master the art of sorting. Proper disposal reduces landfill waste by up to 60%.' : 'เก่งเรื่องการคัดแยกขยะ การกำจัดอย่างถูกวิธีช่วยลดขยะในหลุมฝังกลบได้ถึง 60%'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {WASTE_CATEGORIES.map((cat) => (
          <motion.div 
            key={cat.id}
            className="rounded-[32px] p-8 border border-slate-100 bg-white card-shadow relative overflow-hidden"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", 
                cat.id === 'recyclable' ? "bg-primary" : 
                cat.id === 'organic' ? "bg-primary" : 
                cat.id === 'general' ? "bg-slate-400" : "bg-rose-400"
              )}>
                 <Recycle size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{(t.categories as any)[cat.id] || cat.title}</h2>
            </div>
            
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">{cat.description}</p>
            
            <div className="space-y-2 mb-8">
              {cat.items.map((item: any, idx: number) => {
                const ItemIcon = (Icons as any)[item.icon] || Info;
                return (
                  <div key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-xl group/item">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover/item:text-primary transition-colors">
                      <ItemIcon size={16} strokeWidth={2.5} />
                    </div>
                    {item.name}
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-50 flex items-start gap-2">
              <span className="text-xs font-medium text-slate-400 leading-tight italic">"{cat.noLimit}"</span>
            </div>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
}

function History({ lang }: { lang: Language }) {
  const t = translations[lang];
  return (
    <PageWrapper>
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{t.recentActivity}</h1>
          <p className="text-slate-500 mt-2 font-medium">{lang === 'en' ? 'Tracking your real-world contribution.' : 'ติดตามการมีส่วนร่วมของคุณในโลกความเป็นจริง'}</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder={lang === 'en' ? 'Search your logs...' : 'ค้นหาบันทึกของคุณ...'} 
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 card-shadow flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full -mr-12 -mt-12 opacity-50" />
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{lang === 'en' ? 'Lifetime Score' : 'คะแนนตลอดชีพ'}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900 tracking-tight">2,450</span>
            <span className="text-xs font-bold text-primary">+{lang === 'en' ? '120 today' : '120 วันนี้'}</span>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-100 card-shadow flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 opacity-50" />
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{lang === 'en' ? 'Global Rank' : 'อันดับโลก'}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900 tracking-tight">#42</span>
            <span className="text-xs font-bold text-primary">Top 1%</span>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-primary/10 -skew-x-12 translate-x-1/2" />
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{lang === 'en' ? 'Impact Tier' : 'ระดับผลกระทบ'}</p>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary">
              <Leaf size={24} />
            </div>
            <span className="text-2xl font-bold italic tracking-tight">Earth Guard</span>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-3xl border border-slate-100 card-shadow p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-8">{t.recentActivity}</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Calendar size={12} />
            {lang === 'en' ? 'Today' : 'วันนี้'}
          </div>
          <HistoryItem icon={Droplets} name="PET Plastic Bottle" category="Beverage Container" points={15} time="10:42 AM" />
          <HistoryItem icon={BookOpen} name="Cardboard Box" category="Packaging" points={20} time="09:15 AM" />
          
          <div className="pt-4 flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Calendar size={12} />
            {lang === 'en' ? 'Yesterday' : 'เมื่อวาน'}
          </div>
          <HistoryItem icon={Leaf} name="Coffee Cup" category="Compostable Material" points={10} time="02:30 PM" />
          <HistoryItem icon={Recycle} name="Egg Carton" category="Molded Pulp" points={25} time="11:05 AM" />
        </div>
        
        <div className="mt-12 text-center">
          <button className="text-primary text-sm font-bold px-10 py-4 bg-primary/5 rounded-2xl hover:bg-primary/10 transition-all active:scale-95">
            {lang === 'en' ? 'Load More Activity' : 'โหลดกิจกรรมเพิ่มเติม'}
          </button>
        </div>
      </section>
    </PageWrapper>
  );
}

function HistoryItem({ icon: Icon, name, category, points, time }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-all group border border-slate-100/50">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm group-hover:text-primary transition-colors">
          <Icon size={24} />
        </div>
        <div>
          <p className="font-bold text-slate-900 group-hover:text-primary transition-colors leading-none mb-1.5">{name}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-slate-900 leading-none">+{points}</p>
        <p className="text-[10px] font-medium text-slate-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

function EditProfilePage({ user, onUpdate, onCancel, lang }: { user: UserState, onUpdate: (data: Partial<UserState>) => void, onCancel: () => void, lang: Language }) {
  const [formData, setFormData] = useState({ name: user.name, bio: user.bio, email: user.email });
  const t = translations[lang];
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
          <ChevronLeft size={20} className="text-slate-500" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t.editProfile}</h1>
      </div>

      <section className="bg-white rounded-3xl border border-slate-100 p-8 card-shadow space-y-10">
        <div className="flex flex-col items-center gap-6 pb-10 border-b border-slate-50">
           <div className="relative group">
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl group-hover:rotate-3 transition-transform"
            />
            <button className="absolute -bottom-2 -right-2 p-2.5 bg-primary text-white rounded-xl shadow-lg border-2 border-white active:scale-90 transition-all">
              <Camera size={16} />
            </button>
          </div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">{lang === 'en' ? 'Tap to change photo' : 'แตะเพื่อเปลี่ยนรูปภาพ'}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">{t.fullName}</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary outline-none transition-all font-bold text-slate-900"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">{t.bio}</label>
            <textarea 
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary outline-none transition-all font-bold text-slate-900 resize-none text-sm"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">{t.email}</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary outline-none transition-all font-bold text-slate-900"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            onClick={() => onUpdate(formData)}
            className="flex-1 bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <Save size={18} />
            {t.saveChanges}
          </button>
          <button 
            onClick={onCancel}
            className="flex-1 bg-slate-100 text-slate-500 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all active:scale-95"
          >
            {t.cancel}
          </button>
        </div>
      </section>
    </motion.div>
  );
}

function SettingsMain({ user, onLogout, lang }: { user: UserState, onLogout: () => void, lang: Language }) {
  return (
    <div className="space-y-8">
      <section className="bg-white rounded-3xl border border-slate-100 p-8 card-shadow flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <div className="relative group">
          <img 
            src={user.avatar} 
            alt="Profile" 
            className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl group-hover:rotate-3 transition-transform"
          />
          <Link to="/settings/edit" className="absolute -bottom-2 -right-2 p-2.5 bg-primary text-white rounded-xl shadow-lg border-2 border-white active:scale-90 transition-all">
            <Camera size={16} />
          </Link>
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{user.name}</h1>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-widest">Pro</span>
          </div>
          <p className="text-slate-400 font-medium text-sm mb-4">{user.email}</p>
          <p className="text-slate-500 text-sm max-w-sm leading-relaxed">{user.bio}</p>
          <div className="mt-6 pt-6 border-t border-slate-50">
             <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{lang === 'en' ? 'Member since' : 'เป็นสมาชิกตั้งแต่'} {user.joined}</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-100 card-shadow overflow-hidden">
        <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{lang === 'en' ? 'Account Management' : 'การจัดการบัญชี'}</span>
        </div>
        <div className="divide-y divide-slate-100">
          <Link to="/settings/edit" className="block">
             <SettingsItem icon={LayoutDashboard} title={lang === 'en' ? "Personal Info" : "ข้อมูลส่วนตัว"} sub={lang === 'en' ? "Name, avatar, and bio" : "ชื่อ รูปโปรไฟล์ และประวัติ"} />
          </Link>
          <SettingsItem icon={AlertTriangle} title={lang === 'en' ? "Security" : "ความปลอดภัย"} sub={lang === 'en' ? "Password and passkeys" : "รหัสผ่านและพาสคีย์"} />
          <SettingsItem icon={QrCode} title={lang === 'en' ? "Eco Subscription" : "สมาชิก Eco"} sub={lang === 'en' ? "Manage your plan" : "จัดการแผนของคุณ"} />
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
          
          <div className="px-8 py-6 flex items-center justify-between group">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <Moon size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900 group-hover:text-primary transition-colors leading-none mb-1.5">{lang === 'en' ? 'Dark Mode' : 'โหมดมืด'}</p>
                <p className="text-xs font-medium text-slate-400">{lang === 'en' ? 'Adaptive interface' : 'ส่วนต่อประสานที่ปรับเปลี่ยนได้'}</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-slate-200 rounded-full relative p-1 cursor-pointer">
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm" />
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

function Settings({ user, setUser, lang }: { user: UserState, setUser: any, lang: Language }) {
  const navigate = useNavigate();
  const onLogout = () => { localStorage.removeItem('eco_auth'); window.location.href = '/login'; };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto">
        <Routes>
          <Route index element={<SettingsMain user={user} onLogout={onLogout} lang={lang} />} />
          <Route path="edit" element={<EditProfilePage user={user} lang={lang} onUpdate={(data) => { setUser({...user, ...data}); navigate('/settings'); }} onCancel={() => navigate('/settings')} />} />
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
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<UserState | null>(null);

  useEffect(() => {
    const authToken = localStorage.getItem('eco_auth');
    if (authToken) {
      setIsAuth(true);
      setUser({
        name: "Sarah Jenkins",
        email: "sarah.j@example.com",
        bio: "Passionate about zero-waste living and sustainable urban development. 🌱",
        joined: "Jan 2023",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        isPro: true,
        streak: 12,
        league: "Silver",
        points: 3840
      });
    }
  }, []);

  const [lang, setLang] = useState<Language>('en');

  const handleLogin = () => {
    localStorage.setItem('eco_auth', 'true');
    setIsAuth(true);
    setUser({
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      bio: "Passionate about zero-waste living and sustainable urban development. 🌱",
      joined: "Jan 2023",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      isPro: true,
      streak: 12,
      league: "Silver",
      points: 3840
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('eco_auth');
    setIsAuth(false);
    setUser(null);
  };

  return (
    <Router basename="/Bin-Scan-Better">
      <div className="min-h-screen bg-background text-on-surface selection:bg-emerald-200 selection:text-emerald-900">
        <Header user={user} lang={lang} setLang={setLang} />
        
        <main className="relative">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={isAuth ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} lang={lang} />} />
              <Route path="/register" element={isAuth ? <Navigate to="/" /> : <RegisterPage onLogin={handleLogin} lang={lang} />} />
              
              <Route path="/" element={isAuth ? <Dashboard lang={lang} /> : <Navigate to="/login" />} />
              <Route path="/scan" element={isAuth ? <ScanPage lang={lang} /> : <Navigate to="/login" />} />
              <Route path="/league" element={isAuth ? <LeaguePage lang={lang} /> : <Navigate to="/login" />} />
              <Route path="/guide" element={isAuth ? <Guide lang={lang} /> : <Navigate to="/login" />} />
              <Route path="/history" element={isAuth ? <History lang={lang} /> : <Navigate to="/login" />} />
              <Route path="/settings/*" element={isAuth ? (user ? <Settings user={user} setUser={setUser} lang={lang} /> : <Navigate to="/login" />) : <Navigate to="/login" />} />
            </Routes>
          </AnimatePresence>
        </main>

        <MobileNav user={user} lang={lang} />
      </div>
    </Router>
  );
}
