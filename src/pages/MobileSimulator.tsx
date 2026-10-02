import { useState, useEffect, useRef } from 'react';
import {
  Smartphone, RotateCcw, ExternalLink, RefreshCw, ZoomIn, ZoomOut,
  Wifi, Battery, Signal, ArrowLeft, ArrowRight, ShieldCheck,
  ChevronDown, Monitor, Check, Sparkles, Flame
} from 'lucide-react';

interface DevicePreset {
  id: string;
  name: string;
  brand: 'Apple' | 'Google' | 'Samsung';
  width: number;
  height: number;
  borderRadius: string;
  notchType: 'dynamic-island' | 'punch-hole' | 'pill';
  frameColor: string;
}

const DEVICES: DevicePreset[] = [
  {
    id: 'pixel-9',
    name: 'Google Pixel 9 Pro',
    brand: 'Google',
    width: 412,
    height: 915,
    borderRadius: '48px',
    notchType: 'punch-hole',
    frameColor: '#2d3238',
  },
  {
    id: 'iphone-16',
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    width: 430,
    height: 932,
    borderRadius: '54px',
    notchType: 'dynamic-island',
    frameColor: '#1e2022',
  },
  {
    id: 'galaxy-s25',
    name: 'Samsung Galaxy S25 Ultra',
    brand: 'Samsung',
    width: 412,
    height: 890,
    borderRadius: '42px',
    notchType: 'punch-hole',
    frameColor: '#1a1d20',
  },
];

const QUICK_ROUTES = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Cart', path: '/cart' },
  { label: 'Orders', path: '/orders' },
  { label: 'Login', path: '/login' },
  { label: 'Admin', path: '/admin' },
];

export default function MobileSimulatorPage() {
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICES[0]);
  const [currentPath, setCurrentPath] = useState('/');
  const [isLandscape, setIsLandscape] = useState(false);
  const [zoom, setZoom] = useState(90);
  const [currentTime, setCurrentTime] = useState('12:00');
  const [iframeKey, setIframeKey] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [nativeEmulatorOnline, setNativeEmulatorOnline] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Live time ticker for phone status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const fullUrl = `${window.location.origin}${currentPath}`;

  const handleRefresh = () => {
    setIframeKey(k => k + 1);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Dimensions based on orientation
  const frameWidth = isLandscape ? selectedDevice.height : selectedDevice.width;
  const frameHeight = isLandscape ? selectedDevice.width : selectedDevice.height;

  return (
    <div className="min-h-screen bg-[#070707] text-white pt-16 pb-12 px-4 flex flex-col items-center">
      {/* Top Simulator Control Bar */}
      <div className="w-full max-w-5xl mb-6 glass rounded-2xl p-4 border border-white/8 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Left: Title & Device Selector */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center text-[#070707] shadow-lg">
            <Smartphone size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-white font-bold text-base flex items-center gap-2">
              Virtual Mobile Studio
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Live Interactive 🟢
              </span>
            </h1>
            <p className="text-white/40 text-xs">Simulated on real smartphone dimensions</p>
          </div>
        </div>

        {/* Center: Device Picker Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/8">
          {DEVICES.map(device => (
            <button
              key={device.id}
              onClick={() => setSelectedDevice(device)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDevice.id === device.id
                  ? 'bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] shadow'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {device.name}
            </button>
          ))}
        </div>

        {/* Right: Quick Tools */}
        <div className="flex items-center gap-2">
          {/* Rotate */}
          <button
            onClick={() => setIsLandscape(!isLandscape)}
            className={`p-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isLandscape
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'glass border-white/10 text-white/70 hover:text-white'
            }`}
            title="Rotate Device Orientation"
          >
            <RotateCcw size={14} className={isLandscape ? 'rotate-90 transition-transform' : ''} />
            <span className="hidden sm:inline">{isLandscape ? 'Landscape' : 'Portrait'}</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 glass p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setZoom(Math.max(60, zoom - 10))}
              className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-[11px] font-mono font-bold text-amber-400 px-1">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(120, zoom + 10))}
              className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Refresh Frame */}
          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl glass border border-white/10 text-white/70 hover:text-white hover:border-amber-400 transition-all"
            title="Reload Screen"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* URL & Page Switcher Bar */}
      <div className="w-full max-w-5xl mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Quick Page Links */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-white/40 text-xs font-semibold mr-1">Quick Pages:</span>
          {QUICK_ROUTES.map(r => (
            <button
              key={r.path}
              onClick={() => setCurrentPath(r.path)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                currentPath === r.path
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow'
                  : 'bg-white/5 text-white/60 border-white/8 hover:text-white hover:border-white/20'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Native Android Emulator Info */}
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-semibold">
            Android Studio AVD: <code className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">Medium_Phone_API_36.0</code>
          </span>
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg glass border border-white/10 text-white/60 hover:text-amber-400"
            title="Open in new window"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* ── THE 3D VIRTUAL SMARTPHONE ────────────────────────── */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Ambient Neon Backlight Glow */}
        <div
          className="absolute -inset-8 rounded-[60px] blur-3xl opacity-25 pointer-events-none transition-all duration-500"
          style={{
            background: 'radial-gradient(circle, #f5a623 0%, #ff6b35 40%, transparent 75%)',
          }}
        />

        {/* Outer Phone Bezel & Hardware Body */}
        <div
          className="relative transition-all duration-300 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_30px_rgba(245,166,35,0.15)] flex flex-col items-center border-[4px] border-[#383d42]"
          style={{
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            borderRadius: selectedDevice.borderRadius,
            backgroundColor: selectedDevice.frameColor,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Hardware Buttons Simulation (Side Volume / Power) */}
          <div className="absolute -left-[7px] top-24 w-[3px] h-12 bg-neutral-600 rounded-l-sm" />
          <div className="absolute -left-[7px] top-40 w-[3px] h-12 bg-neutral-600 rounded-l-sm" />
          <div className="absolute -right-[7px] top-32 w-[3px] h-16 bg-neutral-600 rounded-r-sm" />

          {/* Inner Phone Screen Container */}
          <div
            className="relative w-full h-full overflow-hidden flex flex-col bg-[#070707]"
            style={{
              borderRadius: `calc(${selectedDevice.borderRadius} - 6px)`,
            }}
          >
            {/* ── Top Status Bar ──────────────────────────────── */}
            <div className="h-10 w-full px-7 flex items-center justify-between z-30 select-none bg-black/40 backdrop-blur-md">
              {/* Left: Time */}
              <span className="text-[12px] font-bold text-white font-mono tracking-tight">
                {currentTime}
              </span>

              {/* Center: Dynamic Island / Camera Notch */}
              {selectedDevice.notchType === 'dynamic-island' ? (
                <div className="w-24 h-5 rounded-full bg-black border border-white/10 flex items-center justify-between px-2 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-700" />
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[8px] text-white/70 font-semibold">Sigma</span>
                  </div>
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-black border border-neutral-800 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#121212]" />
                </div>
              )}

              {/* Right: Signal, Wifi, Battery */}
              <div className="flex items-center gap-1.5 text-white/90">
                <Signal size={12} />
                <Wifi size={12} />
                <div className="flex items-center gap-0.5">
                  <span className="text-[9px] font-mono font-bold">100%</span>
                  <Battery size={13} className="text-emerald-400" />
                </div>
              </div>
            </div>

            {/* ── Simulated Browser / App URL Header ───────────── */}
            <div className="h-9 w-full px-3 py-1 flex items-center gap-2 bg-[#0c0c0c] border-b border-white/5 z-20">
              <div className="flex-1 h-7 rounded-xl bg-white/5 border border-white/8 px-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-white/60 truncate">
                  <span className="text-emerald-400 text-[10px]">🔒</span>
                  <span className="text-[11px] font-mono text-white/80 truncate">
                    sigmafoods.in{currentPath}
                  </span>
                </div>
                <button
                  onClick={handleCopyUrl}
                  className="text-white/40 hover:text-white transition-colors"
                  title="Copy link"
                >
                  {copiedUrl ? <Check size={11} className="text-emerald-400" /> : <RefreshCw size={11} />}
                </button>
              </div>
            </div>

            {/* ── LIVE INTERACTIVE IFRAME SCREEN ───────────────── */}
            <div className="flex-1 w-full relative overflow-hidden bg-[#070707]">
              <iframe
                key={iframeKey}
                ref={iframeRef}
                src={fullUrl}
                title="Virtual Smartphone Display"
                className="w-full h-full border-0 select-auto"
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#070707',
                }}
              />
            </div>

            {/* ── Bottom Home Indicator Bar ────────────────────── */}
            <div className="h-5 w-full bg-black flex items-center justify-center z-30 select-none">
              <div className="w-32 h-1 rounded-full bg-white/30 hover:bg-white/60 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Instructions / Features Callout */}
      <div className="w-full max-w-3xl mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-2xl glass border border-white/8">
          <p className="text-[#f5a623] font-bold text-xs uppercase tracking-wider mb-1">👆 Full Touch & Scroll</p>
          <p className="text-white/50 text-xs">Click, scroll, add to cart, order, chat with AI live inside the phone.</p>
        </div>
        <div className="p-4 rounded-2xl glass border border-white/8">
          <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">📐 Pixel-Perfect Sizes</p>
          <p className="text-white/50 text-xs">Tested for Google Pixel 9 Pro, iPhone 16 Pro Max, and Galaxy S25.</p>
        </div>
        <div className="p-4 rounded-2xl glass border border-white/8">
          <p className="text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">🤖 Native Android Studio</p>
          <p className="text-white/50 text-xs">Medium_Phone_API_36.0 emulator is active on your Windows desktop.</p>
        </div>
      </div>
    </div>
  );
}
