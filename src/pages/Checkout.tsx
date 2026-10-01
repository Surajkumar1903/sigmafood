import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, MapPin, Package, CreditCard, Smartphone, Banknote, ChevronRight } from 'lucide-react';
import { useCartStore, useAuthStore, useOrdersStore } from '../store';
import type { Address } from '../store';
import { firebaseSaveOrder } from '../services/firebase';
import toast from 'react-hot-toast';

const STEPS = ['Delivery Address', 'Order Summary', 'Payment'] as const;
type Step = 0 | 1 | 2;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(0);
  const { items, getTotal, getSubtotal, getDeliveryFee, getTax, discount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const addOrder = useOrdersStore(s => s.addOrder);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState<Address>({
    id: '', fullName: '', phone: '', house: '', street: '', area: '', city: 'Delhi', state: 'Delhi', pin: '', isDefault: false
  });

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = getTotal();
  const discountAmt = Math.round((subtotal * discount) / 100);

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.phone || !address.house) {
      toast.error('Please fill in your delivery address');
      return;
    }
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1200));

    // Save in local Zustand store
    const orderId = addOrder({ items, total, status: 'Confirmed', address, paymentMethod });

    // Save to Firebase Cloud Firestore
    try {
      await firebaseSaveOrder({
        orderId,
        items,
        total,
        subtotal,
        deliveryFee,
        tax,
        discount: discountAmt,
        status: 'Confirmed',
        address,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid',
        customerName: address.fullName,
        customerEmail: user?.email || `${address.phone}@customer.sigmafoods.com`,
        customerPhone: address.phone,
        createdAt: new Date().toISOString(),
        notes: deliveryNote,
      });
      toast.success('Order synced to Firebase Cloud! ☁️📦');
    } catch {
      console.warn('Firebase order sync fallback');
    }

    clearCart();
    setPlacing(false);
    navigate(`/order-success/${orderId}`);
  };

  const renderStepContent = () => {
    if (step === 0) return (
      <div className="glass rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-6">Delivery Address</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[['fullName', 'Full Name', 'text'], ['phone', 'Phone Number', 'tel'], ['house', 'House / Flat No.', 'text'], ['street', 'Street', 'text'], ['area', 'Area / Locality', 'text'], ['city', 'City', 'text'], ['state', 'State', 'text'], ['pin', 'PIN Code', 'text']].map(([field, label, type]) => (
            <div key={field} className={field === 'street' || field === 'area' ? 'sm:col-span-2' : ''}>
              <label className="block text-white/50 text-xs mb-1.5">{label}</label>
              <input
                type={type as string}
                value={(address as unknown as Record<string, string>)[field as string]}
                onChange={e => setAddress(prev => ({ ...prev, [field as string]: e.target.value }))}
                placeholder={label}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[rgba(245,166,35,0.4)] transition-colors"
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-white/50 text-xs mb-1.5">Delivery Instructions (Optional)</label>
          <textarea
            value={deliveryNote}
            onChange={e => setDeliveryNote(e.target.value)}
            placeholder="Any special instructions for delivery?"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[rgba(245,166,35,0.4)] resize-none h-24"
          />
        </div>
      </div>
    );

    if (step === 1) return (
      <div className="glass rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-6">Order Summary</h3>
        <div className="space-y-3 mb-6">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
              <span className="text-2xl">{product.emoji}</span>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{product.name}</p>
                <p className="text-white/40 text-xs">Qty: {quantity}</p>
              </div>
              <p className="text-[#f5a623] font-semibold">₹{product.price * quantity}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2 pt-4 border-t border-white/8">
          <div className="flex justify-between text-sm text-white/50"><span>Subtotal</span><span className="text-white">₹{subtotal}</span></div>
          {discountAmt > 0 && <div className="flex justify-between text-sm"><span className="text-green-400">Discount</span><span className="text-green-400">-₹{discountAmt}</span></div>}
          <div className="flex justify-between text-sm text-white/50"><span>Delivery</span><span className={deliveryFee === 0 ? 'text-green-400' : 'text-white'}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
          <div className="flex justify-between text-sm text-white/50"><span>GST</span><span className="text-white">₹{tax}</span></div>
          <div className="flex justify-between font-bold text-white pt-2 border-t border-white/8 text-lg">
            <span>Total</span><span className="text-[#f5a623]">₹{total}</span>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-white/3 border border-white/5">
          <p className="text-white/50 text-xs mb-1">Delivering to:</p>
          <p className="text-white text-sm">{address.fullName}, {address.house}, {address.street}, {address.area}, {address.city} - {address.pin}</p>
        </div>
      </div>
    );

    if (step === 2) return (
      <div className="glass rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-6">Payment Method</h3>
        <div className="space-y-3 mb-8">
          {([['UPI', 'UPI / PhonePe / GPay', Smartphone], ['Card', 'Credit / Debit Card', CreditCard], ['COD', 'Cash on Delivery', Banknote]] as const).map(([method, label, Icon]) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                paymentMethod === method
                  ? 'border-[rgba(245,166,35,0.4)] bg-[rgba(245,166,35,0.08)] text-white'
                  : 'border-white/8 glass text-white/60 hover:border-white/20 hover:text-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                paymentMethod === method ? 'bg-[rgba(245,166,35,0.2)]' : 'bg-white/5'
              }`}>
                <Icon size={18} className={paymentMethod === method ? 'text-[#f5a623]' : 'text-white/50'} />
              </div>
              <span className="font-medium">{label}</span>
              <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === method ? 'border-[#f5a623] bg-[#f5a623]' : 'border-white/20'
              }`}>
                {paymentMethod === method && <Check size={11} className="text-[#070707]" />}
              </div>
            </button>
          ))}
        </div>
        {paymentMethod === 'UPI' && (
          <div>
            <label className="block text-white/50 text-xs mb-1.5">UPI ID</label>
            <input placeholder="yourname@upi" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 focus:outline-none focus:border-[rgba(245,166,35,0.4)]" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#070707' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-extrabold text-white mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                step > i ? 'text-green-400' : step === i ? 'text-[#f5a623] bg-[rgba(245,166,35,0.1)]' : 'text-white/30'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  step > i ? 'bg-green-500 border-green-500' : step === i ? 'border-[#f5a623] bg-[rgba(245,166,35,0.15)]' : 'border-white/20'
                }`}>
                  {step > i ? <Check size={12} className="text-white" /> : <span className="text-xs">{i + 1}</span>}
                </div>
                <span className="hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight size={16} className="text-white/20 shrink-0" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="mb-6">{renderStepContent()}</div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep((step - 1) as Step)} className="px-6 py-3.5 rounded-xl glass border border-white/10 text-white/60 hover:text-white transition-all">
              Back
            </button>
          )}
          {step < 2 ? (
            <button
              onClick={() => {
                if (step === 0 && !address.fullName) { toast.error('Please enter your name'); return; }
                setStep((step + 1) as Step);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-bold hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] transition-all btn-shine"
            >
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-bold hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed btn-shine"
            >
              {placing ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</>
              ) : (
                <>Place Order ₹{total}</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
