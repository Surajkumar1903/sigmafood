import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  Minus,
  Send,
  ShoppingCart,
  Phone,
  MapPin,
  Mail,
  RotateCcw,
  Check,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ChefHat,
  MessageSquare,
  Flame,
  Star,
  Package,
  Settings,
  Sliders,
  Cpu,
} from 'lucide-react';
import {
  ChatService,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  RESTAURANT_INFO,
  type ChatAction,
  type ChatResponse,
} from '../services/chatService';
import { useCartStore, useUIStore, useOrdersStore } from '../store';
import type { Product } from '../data/products';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
  suggestedQuickReplies?: string[];
  actions?: ChatAction[];
  modelUsed?: string;
}

const INITIAL_QUICK_ACTIONS = [
  '🍔 Browse Menu',
  '🔥 Best Sellers',
  '🛒 My Cart',
  '📦 Track Order',
  '💬 Contact Support',
];

export default function Chatbot() {
  const navigate = useNavigate();
  const isOpen = useUIStore((s) => s.isChatbotOpen);
  const setOpen = useUIStore((s) => s.setChatbotOpen);
  const toggleOpen = useUIStore((s) => s.toggleChatbot);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const cartItems = useCartStore((s) => s.items);
  const totalCartCount = useCartStore((s) => s.getTotalItems());

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedProductIds, setAddedProductIds] = useState<Record<string, boolean>>({});
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(ChatService.getApiKey());
  const [model, setModel] = useState(ChatService.getModel());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Welcome Message on Mount
  useEffect(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const welcomeMsg: Message = {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Hi! 👋 I'm **Sigma AI**, your Sigma Foods AI Food Assistant.\n\nI can help you:\n🍔 **Choose delicious food**\n🛒 **Build & customize your order**\n📦 **Track order status**\n💬 **Answer restaurant questions**\n\nWhat can I get for you today?`,
      timestamp: now,
      suggestedQuickReplies: INITIAL_QUICK_ACTIONS,
    };
    setMessages([welcomeMsg]);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages, isTyping]);

  // Execute structured backend/AI actions on the UI
  const executeActions = (actions: ChatAction[]) => {
    for (const act of actions) {
      if (act.type === 'ADD_TO_CART' && act.productId) {
        addToCart(act.productId, act.quantity || 1);
        toast.success(`Added to cart! 🛒`, { id: `toast_${act.productId}` });
      } else if (act.type === 'REMOVE_FROM_CART' && act.productId) {
        removeFromCart(act.productId);
        toast.error(`Removed from cart`, { id: `toast_rm_${act.productId}` });
      } else if (act.type === 'UPDATE_CART' && act.productId && act.quantity !== undefined) {
        updateCartQuantity(act.productId, act.quantity);
      } else if (act.type === 'OPEN_CART') {
        // Can open cart drawer or keep inside chat
      } else if (act.type === 'OPEN_CHECKOUT') {
        // Handled via button
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim();
    if (!text) return;

    setHasInteracted(true);
    setInputValue('');

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Simulate realistic AI thought delay for smoothness
      const startTime = Date.now();
      const response: ChatResponse = await ChatService.sendMessage(text, cartItems);
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 450 - elapsed);

      setTimeout(() => {
        setIsTyping(false);
        const botMsg: Message = {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: response.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedProducts: response.recommendedProducts,
          suggestedQuickReplies: response.suggestedQuickReplies,
          actions: response.actions,
          modelUsed: response.modelUsed,
        };

        setMessages((prev) => [...prev, botMsg]);

        // Run client-side cart actions if any
        if (response.actions && response.actions.length > 0) {
          executeActions(response.actions);
        }
      }, delay);
    } catch {
      setIsTyping(false);
      const errorMsg: Message = {
        id: `bot_err_${Date.now()}`,
        sender: 'assistant',
        text: `I'm having trouble connecting right now. Please call Sigma Foods directly at **+91 7838853490**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuickReplies: ['📞 Call Sigma Foods', '🍔 Browse Menu'],
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleQuickReply = (text: string) => {
    // Check if the quick reply is a direct command or route
    if (text.includes('Browse Menu') || text === '🍔 Menu') {
      handleSendMessage('Show menu');
    } else if (text.includes('Best Sellers') || text === '🔥 Best Sellers') {
      handleSendMessage('What are your best sellers?');
    } else if (text.includes('My Cart') || text === '🛒 Cart' || text === '🛒 View Cart') {
      handleSendMessage('Show my cart');
    } else if (text.includes('Track Order') || text === '📦 Track Order') {
      handleSendMessage('Track my order');
    } else if (text.includes('Contact Support') || text.includes('Call Support') || text === '📞 Support') {
      handleSendMessage('How can I contact support?');
    } else if (text.includes('Checkout') || text === '💳 Checkout') {
      handleSendMessage('Checkout');
    } else if (text.includes('Get Directions')) {
      window.open('https://maps.app.goo.gl/sigma-foods', '_blank');
    } else if (text.includes('Call +91 7838853490') || text.includes('Call Sigma Foods')) {
      window.location.href = 'tel:+917838853490';
    } else if (text.includes('Email Support')) {
      window.location.href = 'mailto:foodssigma@gmail.co';
    } else if (text.startsWith('Add ')) {
      handleSendMessage(text);
    } else {
      handleSendMessage(text);
    }
  };

  const handleAddProductFromCard = (product: Product) => {
    addToCart(product.id, 1);
    setAddedProductIds((prev) => ({ ...prev, [product.id]: true }));
    toast.success(`${product.name} added! 🛒`);
    setTimeout(() => {
      setAddedProductIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleResetChat = () => {
    ChatService.resetSession();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'assistant',
        text: `Chat reset! 👋 How can I help you with your order now?`,
        timestamp: now,
        suggestedQuickReplies: INITIAL_QUICK_ACTIONS,
      },
    ]);
  };

  // Helper to format markdown bold and links cleanly
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return (
      <div className="space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }

          // Convert **bold** tags
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={idx} className="text-white/90">
              {parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={pIdx} className="font-bold text-white text-[#f5a623]">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                if (part.startsWith('~~') && part.endsWith('~~')) {
                  return (
                    <span key={pIdx} className="line-through text-white/40">
                      {part.slice(2, -2)}
                    </span>
                  );
                }
                return part;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* ──────────────────────────────────────────────────────────
          FLOATING AI CHATBOT TRIGGER BUTTON
          Placed at bottom-right, elevated on mobile to avoid dock
      ────────────────────────────────────────────────────────── */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3">
          {/* Subtle tooltip prompt when user hasn't clicked yet */}
          {!hasInteracted && (
            <div
              onClick={() => setOpen(true)}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl glass border border-[rgba(245,166,35,0.3)] text-white shadow-xl cursor-pointer hover:border-[rgba(245,166,35,0.5)] transition-all animate-bounce"
            >
              <span className="text-xs font-semibold text-[#f5a623]">Hungry? Ask Sigma AI ✨</span>
            </div>
          )}

          <button
            onClick={toggleOpen}
            aria-label="Open Sigma AI Chatbot"
            className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#f5a623] via-[#ff6b35] to-[#f5a623] flex items-center justify-center text-white shadow-2xl animate-bot-pulse hover:scale-105 active:scale-95 transition-all duration-300"
          >
            {/* Pulsing ring aura */}
            <div className="absolute inset-0 rounded-full bg-[#f5a623] blur-md opacity-40 group-hover:opacity-75 transition-opacity" />

            {/* Inner icon container */}
            <div className="relative z-10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md group-hover:rotate-12 transition-transform duration-300" />
            </div>

            {/* AI Chip Badge */}
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#070707] border border-[#f5a623] text-[#f5a623] text-[9px] font-extrabold tracking-wider shadow">
              AI
            </span>
          </button>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          PREMIUM CHATBOT WINDOW (DESKTOP MODAL / MOBILE FULL-SCREEN)
      ────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col justify-end pointer-events-none animate-scale-in">
          {/* Mobile backdrop for touch dismissal */}
          <div
            className="sm:hidden fixed inset-0 bg-black/70 backdrop-blur-md pointer-events-auto"
            onClick={() => setOpen(false)}
          />

          <div
            className="relative pointer-events-auto w-full h-[100dvh] sm:h-[650px] sm:max-h-[85vh] sm:w-[420px] rounded-none sm:rounded-3xl flex flex-col overflow-hidden bg-[rgba(12,12,12,0.96)] backdrop-blur-2xl border-0 sm:border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
            style={{
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(245,166,35,0.15)',
            }}
          >
            {/* Ambient Background Gradient Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-b from-[rgba(245,166,35,0.15)] to-transparent blur-3xl pointer-events-none" />

            {/* ── HEADER ────────────────────────────────────────── */}
            <div className="relative z-10 px-4 py-3.5 border-b border-white/10 bg-[rgba(18,18,18,0.85)] backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Bot Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center shadow-lg shadow-[rgba(245,166,35,0.3)]">
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#121212] animate-pulse" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-white font-extrabold text-sm tracking-wide">Sigma Foods AI</h3>
                    <span className="px-1.5 py-0.2 rounded-md bg-[rgba(245,166,35,0.15)] text-[#f5a623] text-[10px] font-bold">
                      PRO
                    </span>
                  </div>
                  <p className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Online • Ready to help
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 text-white/60">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  title="AI & ChatGPT Settings"
                  className={`p-2 rounded-xl transition-all ${
                    showSettings || apiKey
                      ? 'text-[#f5a623] bg-[rgba(245,166,35,0.15)] border border-[rgba(245,166,35,0.25)]'
                      : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Settings size={16} />
                </button>
                <button
                  onClick={handleResetChat}
                  title="Reset Conversation"
                  className="p-2 rounded-xl hover:text-white hover:bg-white/5 transition-all"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  title="Minimize"
                  className="hidden sm:flex p-2 rounded-xl hover:text-white hover:bg-white/5 transition-all"
                >
                  <Minus size={18} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  title="Close"
                  className="p-2 rounded-xl hover:text-white hover:bg-white/5 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── CHATGPT / AI SETTINGS DRAWER ──────────────────── */}
            {showSettings && (
              <div className="relative z-20 p-4 bg-[#141414] border-b border-white/10 animate-fade-up">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-[#f5a623]" />
                    <span className="text-white text-xs font-bold">ChatGPT & AI Engine Settings</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    apiKey ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white/60'
                  }`}>
                    {apiKey ? 'ChatGPT Active' : 'Sigma AI (Local)'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-white/50 text-[11px] mb-1">OpenAI API Key (Optional)</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-proj-..."
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-white/20 focus:outline-none focus:border-[#f5a623]"
                    />
                    <p className="text-[10px] text-white/40 mt-1">
                      Leave empty to use built-in Sigma AI Engine (Free, no key required).
                    </p>
                  </div>

                  <div>
                    <label className="block text-white/50 text-[11px] mb-1">Model Selection</label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0c0c0c] border border-white/10 text-white text-xs focus:outline-none focus:border-[#f5a623]"
                    >
                      <option value="gpt-4o-mini">GPT-4o Mini (Fast & Smart)</option>
                      <option value="gpt-4o">GPT-4o (Ultra Intelligent)</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        ChatService.setApiKey(apiKey);
                        ChatService.setModel(model);
                        setShowSettings(false);
                        toast.success(apiKey ? 'ChatGPT connected successfully! 🤖' : 'Using built-in Sigma AI Engine');
                      }}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] font-bold text-xs hover:shadow-lg transition-all"
                    >
                      Save Settings
                    </button>
                    {apiKey && (
                      <button
                        type="button"
                        onClick={() => {
                          setApiKey('');
                          ChatService.setApiKey('');
                          toast.success('Cleared OpenAI API Key');
                        }}
                        className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-red-400 text-xs transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── MESSAGES CONTAINER ────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-up`}
                  >
                    <div className={`flex gap-2 max-w-[88%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      {!isUser && (
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center shrink-0 shadow mt-1">
                          <Sparkles size={13} className="text-white" />
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-md ${
                          isUser
                            ? 'bg-gradient-to-r from-[#f5a623]/25 via-[#ff6b35]/20 to-[#f5a623]/25 border border-[#f5a623]/35 text-white rounded-br-sm'
                            : 'bg-white/5 border border-white/10 text-white rounded-bl-sm backdrop-blur-md'
                        }`}
                      >
                        {renderFormattedText(msg.text)}

                        {/* Inline Product Cards */}
                        {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                            <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">
                              Recommended for you:
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                              {msg.recommendedProducts.map((prod) => (
                                <div
                                  key={prod.id}
                                  className="group/card flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/8 hover:border-[rgba(245,166,35,0.3)] transition-all"
                                >
                                  <div
                                    className="flex items-center gap-2.5 cursor-pointer min-w-0 flex-1 mr-2"
                                    onClick={() => {
                                      setOpen(false);
                                      navigate(`/product/${prod.id}`);
                                    }}
                                  >
                                    <div className="w-10 h-10 rounded-lg bg-[rgba(245,166,35,0.1)] flex items-center justify-center text-xl shrink-0">
                                      {prod.emoji}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-white font-semibold text-xs truncate group-hover/card:text-[#f5a623] transition-colors">
                                        {prod.name}
                                      </p>
                                      <div className="flex items-center gap-1.5 text-[11px]">
                                        <span className="text-[#f5a623] font-bold">₹{prod.price}</span>
                                        <span className="text-white/40">•</span>
                                        <span className="text-white/50 flex items-center gap-0.5">
                                          <Star size={10} className="text-[#f5a623]" fill="#f5a623" />
                                          {prod.rating}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Add to cart quick button */}
                                  <button
                                    onClick={() => handleAddProductFromCard(prod)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                                      addedProductIds[prod.id]
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white hover:shadow-[0_0_15px_rgba(245,166,35,0.4)]'
                                    }`}
                                  >
                                    {addedProductIds[prod.id] ? (
                                      <>
                                        <Check size={12} /> Added
                                      </>
                                    ) : (
                                      <>
                                        <Plus size={12} /> Add
                                      </>
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interactive Action Shortcuts */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-2">
                            {msg.actions.some((a) => a.type === 'GET_CART' || a.type === 'ADD_TO_CART') && (
                              <button
                                onClick={() => {
                                  setOpen(false);
                                  setCartOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(245,166,35,0.15)] text-[#f5a623] text-xs font-semibold hover:bg-[rgba(245,166,35,0.25)] border border-[rgba(245,166,35,0.25)] transition-all"
                              >
                                <ShoppingCart size={13} /> View Cart ({totalCartCount})
                              </button>
                            )}

                            {msg.actions.some((a) => a.type === 'OPEN_CHECKOUT') && (
                              <button
                                onClick={() => {
                                  setOpen(false);
                                  navigate('/checkout');
                                }}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white text-xs font-bold hover:shadow-[0_0_15px_rgba(245,166,35,0.4)] transition-all"
                              >
                                Proceed to Checkout <ArrowRight size={13} />
                              </button>
                            )}

                            {msg.actions.some((a) => a.type === 'GET_ORDER_STATUS') && (
                              <button
                                onClick={() => {
                                  setOpen(false);
                                  navigate('/orders');
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition-all"
                              >
                                <Package size={13} /> View Orders Page
                              </button>
                            )}

                            {msg.actions.some((a) => a.type === 'GET_RESTAURANT_INFO') && (
                              <a
                                href="https://maps.app.goo.gl/sigma-foods"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition-all"
                              >
                                <MapPin size={13} className="text-[#f5a623]" /> Open Google Maps
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timestamp & Model info */}
                    <div className="flex items-center gap-2 px-9 mt-1 text-[10px] text-white/30">
                      <span>{msg.timestamp}</span>
                      {!isUser && msg.modelUsed && (
                        <span className="text-[#f5a623]/80 font-medium">• {msg.modelUsed}</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 animate-fade-up">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center shrink-0">
                    <Sparkles size={13} className="text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#f5a623] typing-dot-1" />
                    <span className="w-2 h-2 rounded-full bg-[#f5a623] typing-dot-2" />
                    <span className="w-2 h-2 rounded-full bg-[#f5a623] typing-dot-3" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── QUICK ACTIONS BAR (DYNAMIC HORIZONTAL SCROLL) ──── */}
            <div className="px-4 py-2 border-t border-white/5 bg-[rgba(15,15,15,0.7)] flex gap-2 overflow-x-auto scrollbar-none">
              {(messages[messages.length - 1]?.suggestedQuickReplies || INITIAL_QUICK_ACTIONS).map(
                (actionText, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(actionText)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 hover:border-[rgba(245,166,35,0.3)] hover:bg-[rgba(245,166,35,0.1)] text-white/80 hover:text-[#f5a623] text-xs font-medium transition-all"
                  >
                    {actionText}
                  </button>
                )
              )}
            </div>

            {/* ── INPUT BOX (FIXED BOTTOM / KEYBOARD SAFE) ───────── */}
            <div className="p-3 border-t border-white/10 bg-[rgba(18,18,18,0.95)]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about food, order, or budget..."
                    className="w-full pl-3.5 pr-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#f5a623] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(245,166,35,0.4)] active:scale-95 transition-all shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
              <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-white/30">
                <span>Sigma AI • 100% Pure Vegetarian</span>
                <span>Call +91 7838853490</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
