import { PRODUCTS, BEST_SELLERS, CATEGORIES, type Product, type Category } from '../data/products';
import { useCartStore, useOrdersStore, type CartItem, type Order } from '../store';

// ============================================================
// TYPES & ACTION DEFINITIONS
// ============================================================

export type ChatActionType =
  | 'SEARCH_PRODUCTS'
  | 'GET_PRODUCT'
  | 'ADD_TO_CART'
  | 'REMOVE_FROM_CART'
  | 'UPDATE_CART'
  | 'GET_CART'
  | 'GET_ORDER_STATUS'
  | 'GET_RESTAURANT_INFO'
  | 'GET_BUSINESS_HOURS'
  | 'GET_CONTACT_INFO'
  | 'OPEN_MENU'
  | 'OPEN_PRODUCT'
  | 'OPEN_CART'
  | 'OPEN_CHECKOUT'
  | 'CONTACT_SUPPORT';

export interface ChatAction {
  type: ChatActionType;
  productId?: string;
  product?: Product;
  quantity?: number;
  category?: string;
  orderId?: string;
  url?: string;
  data?: any;
}

export interface SessionMemory {
  budget?: number | null;
  preferredCategory?: Category | null;
  spicePreference?: 'spicy' | 'mild' | 'any';
  lastRecommendedProductIds?: string[];
  lastMentionedProductId?: string | null;
  conversationTopic?: string;
  pendingIntent?: string | null;
}

export interface ChatRequest {
  message: string;
  conversationId: string;
  cart: CartItem[];
  sessionMemory?: SessionMemory;
}

export interface ChatResponse {
  message: string;
  actions: ChatAction[];
  recommendedProducts?: Product[];
  suggestedQuickReplies?: string[];
  sessionMemory: SessionMemory;
}

// Restaurant constants
export const RESTAURANT_INFO = {
  name: 'Sigma Foods',
  tagline: "More Than Food, It's an Experience",
  type: 'Cafe / Vegetarian Fast Food (100% Pure Veg)',
  location: 'Shop No. 4, Flat N 289, Pocket-6-2, Sector-2, Rohini, Delhi-110085',
  shortLocation: 'Sector 2, Rohini, Delhi',
  phone: '+91 7838853490',
  email: 'foodssigma@gmail.co',
  hoursWeekday: 'Monday–Saturday: 11 AM – 11 PM',
  hoursSunday: 'Sunday: 9 AM – 11 PM',
  rating: '5.0 / 5',
  reviews: '13+ Google reviews',
  deliveryPolicy: 'Free delivery on orders above ₹299 (Standard delivery ₹30 under ₹299)',
  deliveryTime: 'Approx. 25–40 minutes in Rohini & nearby areas',
  coupons: 'Use code SIGMA10 for 10% off, SIGMA20 for 20% off orders above ₹499',
};

// ============================================================
// FRONTEND CART & PRODUCT HELPER FUNCTIONS (Exposed to Chatbot)
// ============================================================

export function addToCart(productId: string, quantity = 1): Product | null {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return null;
  const store = useCartStore.getState();
  for (let i = 0; i < quantity; i++) {
    store.addItem(product);
  }
  return product;
}

export function removeFromCart(productId: string): boolean {
  const store = useCartStore.getState();
  const exists = store.items.some((i) => i.product.id === productId);
  if (exists) {
    store.removeItem(productId);
    return true;
  }
  return false;
}

export function updateCartQuantity(productId: string, quantity: number): boolean {
  const store = useCartStore.getState();
  store.updateQuantity(productId, quantity);
  return true;
}

export function getCart(): CartItem[] {
  return useCartStore.getState().items;
}

export function clearCart(): void {
  useCartStore.getState().clearCart();
}

export function getCartTotal(): { subtotal: number; delivery: number; tax: number; total: number; itemCount: number } {
  const store = useCartStore.getState();
  return {
    subtotal: store.getSubtotal(),
    delivery: store.getDeliveryFee(),
    tax: store.getTax(),
    total: store.getTotal(),
    itemCount: store.getTotalItems(),
  };
}

export function getProduct(productId: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === productId);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.ingredients.some((ing) => ing.toLowerCase().includes(q))
  );
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

// Find closest product by fuzzy match on name or alias
export function findProductByName(nameQuery: string): Product | undefined {
  const q = nameQuery.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
  if (!q) return undefined;

  // Direct exact/prefix match
  const exact = PRODUCTS.find((p) => p.name.toLowerCase() === q);
  if (exact) return exact;

  // Match keyword subsets
  const contains = PRODUCTS.find((p) => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase()));
  if (contains) return contains;

  // Keyword score matching
  const qTokens = q.split(/\s+/).filter((t) => t.length > 2);
  let bestScore = 0;
  let bestProduct: Product | undefined;

  for (const p of PRODUCTS) {
    const pTokens = p.name.toLowerCase().split(/\s+/);
    let score = 0;
    for (const qt of qTokens) {
      if (pTokens.includes(qt)) score += 3;
      else if (p.name.toLowerCase().includes(qt)) score += 2;
      else if (p.category.toLowerCase().includes(qt)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestProduct = p;
    }
  }

  return bestScore >= 2 ? bestProduct : undefined;
}

// Extract number of items: e.g. "2 veg momos", "one burger", "3"
function parseQuantityAndName(raw: string): { quantity: number; name: string } {
  const text = raw.trim();
  const numWordMap: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    a: 1,
    an: 1,
  };

  const match = text.match(/^(\d+|one|two|three|four|five|six|a|an)\s+(.+)$/i);
  if (match) {
    const qtyStr = match[1].toLowerCase();
    const qty = numWordMap[qtyStr] ?? parseInt(qtyStr, 10);
    return { quantity: isNaN(qty) ? 1 : qty, name: match[2].trim() };
  }

  return { quantity: 1, name: text };
}

// ============================================================
// LOCAL INTELLIGENT AI ENGINE (Client NLP & Contextual Reasoning)
// ============================================================

export async function processLocalChatMessage(
  userMessage: string,
  sessionMemory: SessionMemory = {},
  currentCart: CartItem[] = []
): Promise<ChatResponse> {
  const input = userMessage.trim();
  const lower = input.toLowerCase();
  const memory: SessionMemory = { ...sessionMemory };
  const actions: ChatAction[] = [];
  let recommendedProducts: Product[] = [];
  let reply = '';
  let quickReplies: string[] = ['🍔 Menu', '🔥 Best Sellers', '🛒 Cart', '📦 Track Order', '📞 Support'];

  // 1. Budget extraction: e.g., "I have 300 budget", "under 200", "under ₹150", "budget 250"
  const budgetMatch = lower.match(/(?:under|below|less than|budget of|budget|have|within)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i) ||
                      lower.match(/(?:rs\.?|inr|₹)\s*(\d+)\s*(?:budget|only)?/i);
  if (budgetMatch) {
    const b = parseInt(budgetMatch[1], 10);
    if (!isNaN(b) && b > 20 && b < 5000) {
      memory.budget = b;
    }
  }

  // 2. Spicy preference
  if (lower.includes('spicy') || lower.includes('teekha') || lower.includes('chili') || lower.includes('mirchi')) {
    memory.spicePreference = 'spicy';
  } else if (lower.includes('non spicy') || lower.includes('sweet') || lower.includes('mild') || lower.includes('bina mirchi')) {
    memory.spicePreference = 'mild';
  }

  // 3. Category preference
  for (const cat of CATEGORIES) {
    if (lower.includes(cat.toLowerCase()) || lower.includes(cat.toLowerCase().replace(/s$/, ''))) {
      memory.preferredCategory = cat;
      break;
    }
  }

  // ------------------------------------------------------------
  // CASE A: Add ordinal/indexed items ("add the second one", "add the first one", "add 3rd")
  // ------------------------------------------------------------
  const ordinalMatch = lower.match(/add (?:the )?(first|1st|second|2nd|third|3rd|fourth|4th|last) (?:one|item|product)?/i);
  if (ordinalMatch && memory.lastRecommendedProductIds && memory.lastRecommendedProductIds.length > 0) {
    const ord = ordinalMatch[1].toLowerCase();
    let index = 0;
    if (ord === 'second' || ord === '2nd') index = 1;
    else if (ord === 'third' || ord === '3rd') index = 2;
    else if (ord === 'fourth' || ord === '4th') index = 3;
    else if (ord === 'last') index = memory.lastRecommendedProductIds.length - 1;

    const prodId = memory.lastRecommendedProductIds[index];
    const product = PRODUCTS.find((p) => p.id === prodId);
    if (product) {
      actions.push({ type: 'ADD_TO_CART', productId: product.id, product, quantity: 1 });
      memory.lastMentionedProductId = product.id;
      reply = `Done! I've added **${product.name}** (₹${product.price}) to your cart 🛒\n\nWould you like anything else or ready for checkout?`;
      quickReplies = ['🛒 View Cart', '💳 Checkout', '🍔 Browse Menu', '🔥 Best Sellers'];
      return { message: reply, actions, recommendedProducts: [product], suggestedQuickReplies: quickReplies, sessionMemory: memory };
    }
  }

  // ------------------------------------------------------------
  // CASE B: Add to cart intent: "Add 2 veg momos", "Add one burger", "Add 2 veg momos and 1 burger"
  // ------------------------------------------------------------
  if (lower.startsWith('add ') || lower.startsWith('order ') || lower.includes('add to cart') || lower.includes('put in cart')) {
    // Check if compound statement with "and"
    const cleaned = lower.replace(/add to cart/gi, 'add').replace(/put in cart/gi, 'add');
    const itemsPart = cleaned.replace(/^(?:please )?(?:add|order)\s+/i, '');
    const parts = itemsPart.split(/\s+and\s+|\s*,\s*/);
    const addedList: { product: Product; qty: number }[] = [];

    for (const part of parts) {
      const { quantity, name } = parseQuantityAndName(part);
      const product = findProductByName(name) ||
        (memory.lastMentionedProductId ? PRODUCTS.find((p) => p.id === memory.lastMentionedProductId) : undefined);

      if (product) {
        actions.push({ type: 'ADD_TO_CART', productId: product.id, product, quantity });
        addedList.push({ product, qty: quantity });
        memory.lastMentionedProductId = product.id;
      }
    }

    if (addedList.length > 0) {
      const summaryLines = addedList.map((item) => `• **${item.qty} × ${item.product.name}** — ₹${item.product.price * item.qty}`);
      const cartItemsCount = currentCart.reduce((acc, i) => acc + i.quantity, 0) + addedList.reduce((acc, i) => acc + i.qty, 0);
      const cartSubtotal = currentCart.reduce((acc, i) => acc + i.product.price * i.quantity, 0) +
        addedList.reduce((acc, i) => acc + i.product.price * i.qty, 0);

      reply = `Done! I've added to your cart:\n\n${summaryLines.join('\n')}\n\n🛒 **Current Cart Total:** ₹${cartSubtotal} (${cartItemsCount} item${cartItemsCount > 1 ? 's' : ''})\n${cartSubtotal < 299 ? `*(Add ₹${299 - cartSubtotal} more for FREE delivery 🚀)*` : '*(🎉 You have FREE delivery!)*'}`;
      quickReplies = ['🛒 View Cart', '💳 Checkout', '🍔 Add More Food', '🔥 Best Sellers'];
      return {
        message: reply,
        actions,
        recommendedProducts: addedList.map((i) => i.product),
        suggestedQuickReplies: quickReplies,
        sessionMemory: memory,
      };
    }
  }

  // ------------------------------------------------------------
  // CASE C: Quantity update intent: "Make it 3 momos", "Update momos to 2", "Change to 3"
  // ------------------------------------------------------------
  const updateMatch = lower.match(/(?:make it|update|change to|set)\s*(\d+)\s*(.*)/i);
  if (updateMatch) {
    const qty = parseInt(updateMatch[1], 10);
    const targetName = updateMatch[2].trim();
    let product = targetName ? findProductByName(targetName) : undefined;
    if (!product && memory.lastMentionedProductId) {
      product = PRODUCTS.find((p) => p.id === memory.lastMentionedProductId);
    }
    if (product) {
      actions.push({ type: 'UPDATE_CART', productId: product.id, product, quantity: qty });
      reply = `Updated! Your cart now has **${qty} × ${product.name}**.`;
      quickReplies = ['🛒 View Cart', '💳 Checkout', '🍔 Browse Menu'];
      return { message: reply, actions, sessionMemory: memory, suggestedQuickReplies: quickReplies };
    }
  }

  // ------------------------------------------------------------
  // CASE D: Remove intent: "Remove the burger", "Delete momos", "Remove from cart"
  // ------------------------------------------------------------
  if (lower.startsWith('remove') || lower.startsWith('delete') || lower.includes('remove from cart')) {
    const targetName = lower.replace(/^(?:please )?(?:remove|delete)\s+(?:the\s+)?/i, '').replace(/from cart/i, '').trim();
    const product = findProductByName(targetName) ||
      (memory.lastMentionedProductId ? PRODUCTS.find((p) => p.id === memory.lastMentionedProductId) : undefined);

    if (product) {
      actions.push({ type: 'REMOVE_FROM_CART', productId: product.id, product });
      reply = `I have removed **${product.name}** from your cart.`;
      quickReplies = ['🛒 View Cart', '🍔 Explore Menu', '🔥 Best Sellers'];
      return { message: reply, actions, sessionMemory: memory, suggestedQuickReplies: quickReplies };
    }
  }

  // ------------------------------------------------------------
  // CASE E: Cart inquiries: "Show my cart", "What is in my cart", "My cart", "Cart"
  // ------------------------------------------------------------
  if (lower === 'cart' || lower.includes('my cart') || lower.includes('show cart') || lower.includes('view cart') || lower.includes("what's in my cart") || lower.includes('check cart')) {
    actions.push({ type: 'GET_CART' });
    if (currentCart.length === 0) {
      reply = `Your cart is currently empty! 🛒\n\nI can recommend some of our customer favorites like **Veg Momos** (₹99) or **Classic Burger** (₹149). What are you craving?`;
      quickReplies = ['🔥 Best Sellers', '🥟 Momos', '🍔 Burgers', '🍝 Pasta', '🍟 Fries'];
      recommendedProducts = BEST_SELLERS.slice(0, 3);
    } else {
      const itemsList = currentCart.map((i) => `• ${i.quantity} × **${i.product.name}** (₹${i.product.price * i.quantity})`).join('\n');
      const subtotal = currentCart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
      const delivery = subtotal >= 299 ? 0 : 30;
      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + delivery + tax;

      reply = `Here is what is in your cart right now:\n\n${itemsList}\n\n─────────────\n• **Subtotal:** ₹${subtotal}\n• **Delivery:** ${delivery === 0 ? 'FREE 🎉' : `₹${delivery}`}\n• **GST (5%):** ₹${tax}\n• **Estimated Total:** ₹${total}\n\nReady to place your order?`;
      quickReplies = ['💳 Proceed to Checkout', '🍔 Add More Food', '🗑️ Clear Cart'];
      actions.push({ type: 'OPEN_CART' });
    }
    return { message: reply, actions, recommendedProducts, suggestedQuickReplies: quickReplies, sessionMemory: memory };
  }

  // ------------------------------------------------------------
  // CASE F: Checkout intent: "Checkout", "Proceed to checkout", "Place order"
  // ------------------------------------------------------------
  if (lower.includes('checkout') || lower.includes('proceed to checkout') || lower.includes('place order') || lower.includes('order now')) {
    const subtotal = currentCart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
    if (currentCart.length === 0) {
      reply = `Your cart is currently empty! Add something delicious first to checkout. Here are our top sellers:`;
      recommendedProducts = BEST_SELLERS.slice(0, 3);
      quickReplies = ['🔥 Best Sellers', '🥟 Veg Momos', '🍔 Classic Burger'];
    } else {
      const total = subtotal + (subtotal >= 299 ? 0 : 30) + Math.round(subtotal * 0.05);
      actions.push({ type: 'OPEN_CHECKOUT' });
      reply = `Your cart total is **₹${total}** (${currentCart.reduce((acc, i) => acc + i.quantity, 0)} items).\n\nReady to complete your delicious vegetarian meal? Click the button below:`;
      quickReplies = ['💳 Go to Checkout', '🛒 View Cart', '🍔 Add More Items'];
    }
    return { message: reply, actions, recommendedProducts, suggestedQuickReplies: quickReplies, sessionMemory: memory };
  }

  // ------------------------------------------------------------
  // CASE G: Order Tracking: "Where is my order", "Track my order", "Order status"
  // ------------------------------------------------------------
  if (lower.includes('order status') || lower.includes('track') || lower.includes('where is my order') || lower.includes('my order')) {
    actions.push({ type: 'GET_ORDER_STATUS' });
    const orders = useOrdersStore.getState().orders;
    if (orders && orders.length > 0) {
      const latestOrder = orders[0];
      const itemsSummary = latestOrder.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ');
      reply = `📦 **Order Status Found!**\n\n• **Order ID:** #${latestOrder.id}\n• **Status:** 🟢 **${latestOrder.status}**\n• **Items:** ${itemsSummary}\n• **Total:** ₹${latestOrder.total}\n• **Delivery Address:** ${latestOrder.address.house}, ${latestOrder.address.area}, ${latestOrder.address.city}\n• **Estimated Time:** Approx. 20–30 mins\n\nNeed any modifications or support with this order?`;
      quickReplies = ['📦 View Order Tracking Page', '📞 Call Sigma Foods', '🍔 Order Again'];
    } else {
      reply = `I couldn't find an active order for this session.\n\nIf you placed an order earlier with an Order ID, you can type it (e.g. *SF123456*), or place a new order from our menu!`;
      quickReplies = ['🍔 Browse Menu', '🔥 Best Sellers', '📞 Support'];
    }
    return { message: reply, actions, sessionMemory: memory, suggestedQuickReplies: quickReplies };
  }

  // ------------------------------------------------------------
  // CASE H: Specific Product Price & Details: "How much are veg momos?", "Tell me about the burger"
  // ------------------------------------------------------------
  const matchedProd = findProductByName(lower);
  if (matchedProd && (lower.includes('price') || lower.includes('how much') || lower.includes('cost') || lower.includes('rate') || lower.includes('tell me about') || lower.includes('what is') || lower.includes('details'))) {
    actions.push({ type: 'GET_PRODUCT', productId: matchedProd.id, product: matchedProd });
    memory.lastMentionedProductId = matchedProd.id;
    recommendedProducts = [matchedProd];
    reply = `**${matchedProd.name}** is **₹${matchedProd.price}** ${matchedProd.originalPrice ? `~~₹${matchedProd.originalPrice}~~` : ''} ⭐ ${matchedProd.rating}/5 (${matchedProd.reviewCount} reviews)\n\n${matchedProd.longDescription}\n\n• **Key Ingredients:** ${matchedProd.ingredients.join(', ')}\n• **100% Vegetarian:** Yes\n• **Spice Level:** ${matchedProd.spiceLevel === 0 ? 'Mild' : matchedProd.spiceLevel === 1 ? 'Medium' : 'Hot 🌶️'}\n\nWould you like me to add this to your cart?`;
    quickReplies = [`🛒 Add 1 ${matchedProd.name}`, `🛒 Add 2 ${matchedProd.name}`, '🍔 Explore More', '🔥 Best Sellers'];
    return { message: reply, actions, recommendedProducts, suggestedQuickReplies: quickReplies, sessionMemory: memory };
  }

  // ------------------------------------------------------------
  // CASE I: Best Sellers Question: "What is the best seller?", "Most popular"
  // ------------------------------------------------------------
  if (lower.includes('best seller') || lower.includes('popular') || lower.includes('top rated') || lower.includes('famous') || lower.includes('special')) {
    actions.push({ type: 'SEARCH_PRODUCTS' });
    recommendedProducts = BEST_SELLERS.slice(0, 4);
    memory.lastRecommendedProductIds = recommendedProducts.map((p) => p.id);
    reply = `Our most popular customer favorites at Sigma Foods include:\n\n• **🥟 Veg Momos** — ₹99 (⭐ 4.9, freshly steamed/fried with homemade spicy chutney)\n• **🍔 Classic Burger** — ₹149 (⭐ 4.8, crispy patty with secret sauce)\n• **🍝 White Sauce Pasta** — ₹179 (⭐ 4.9, creamy Italian cheese delight)\n• **🌯 Cigar Rolls** — ₹129 (⭐ 4.7, golden crispy rolls with cheese dip)\n\nWhich one would you like to try?`;
    quickReplies = ['🥟 Veg Momos', '🍔 Classic Burger', '🍝 White Sauce Pasta', '🌯 Cigar Rolls'];
    return { message: reply, actions, recommendedProducts, suggestedQuickReplies: quickReplies, sessionMemory: memory };
  }

  // ------------------------------------------------------------
  // CASE J: Budget Filter Recommendation: "I have ₹300 budget", "under 200", "under ₹150"
  // ------------------------------------------------------------
  if (memory.budget || lower.includes('budget') || lower.includes('under') || lower.includes('cheap') || lower.includes('affordable')) {
    const budgetLimit = memory.budget || 200;
    actions.push({ type: 'SEARCH_PRODUCTS' });
    let eligible = PRODUCTS.filter((p) => p.price <= budgetLimit);

    if (memory.spicePreference === 'spicy') {
      eligible = eligible.filter((p) => p.spiceLevel >= 2);
    } else if (memory.preferredCategory) {
      const inCat = eligible.filter((p) => p.category === memory.preferredCategory);
      if (inCat.length > 0) eligible = inCat;
    }

    eligible.sort((a, b) => b.rating - a.rating);
    recommendedProducts = eligible.slice(0, 4);
    memory.lastRecommendedProductIds = recommendedProducts.map((p) => p.id);

    if (recommendedProducts.length > 0) {
      const listStr = recommendedProducts.map((p) => `• **${p.emoji} ${p.name}** — ₹${p.price} (⭐ ${p.rating})`).join('\n');
      reply = `Here are our best delicious options under **₹${budgetLimit}**:\n\n${listStr}\n\nWould you like me to add any of these to your cart? You can say *"Add the first one"* or click [+ Add] below!`;
      quickReplies = recommendedProducts.slice(0, 3).map((p) => `Add ${p.name}`);
    } else {
      reply = `Our items start from ₹89 (like **Steamed Veg Momos**). What would you like to explore?`;
      recommendedProducts = BEST_SELLERS.slice(0, 3);
      quickReplies = ['🥟 Momos under ₹100', '🍔 Burgers', '🍟 Fries'];
    }
    return { message: reply, actions, recommendedProducts, suggestedQuickReplies: quickReplies, sessionMemory: memory };
  }

  // ------------------------------------------------------------
  // CASE K: Food Recommendation / Mood: "What should I order?", "I'm hungry", "recommend"
  // ------------------------------------------------------------
  if (lower.includes('what should i order') || lower.includes('recommend') || lower.includes('suggestion') || lower.includes('hungry') || lower.includes('kya khao')) {
    reply = `Sure! I'd love to help you find the perfect meal. What are you in the mood for right now?`;
    quickReplies = ['🍔 Burger', '🥟 Momos', '🍝 Pasta', '🌯 Cigar Rolls', '🍟 Fries', '🥤 Beverage'];
    recommendedProducts = BEST_SELLERS.slice(0, 3);
    memory.lastRecommendedProductIds = recommendedProducts.map((p) => p.id);
    return { message: reply, actions, recommendedProducts, suggestedQuickReplies: quickReplies, sessionMemory: memory };
  }

  // ------------------------------------------------------------
  // CASE L: Category Browsing ("Momos", "Burgers", "Pasta", "Fries", etc.)
  // ------------------------------------------------------------
  for (const cat of CATEGORIES) {
    if (lower.includes(cat.toLowerCase()) || lower.includes(cat.toLowerCase().replace(/s$/, ''))) {
      actions.push({ type: 'SEARCH_PRODUCTS', category: cat });
      const catProducts = PRODUCTS.filter((p) => p.category === cat).slice(0, 4);
      recommendedProducts = catProducts;
      memory.lastRecommendedProductIds = catProducts.map((p) => p.id);
      memory.preferredCategory = cat;

      const listStr = catProducts.map((p) => `• **${p.emoji} ${p.name}** — ₹${p.price} (${p.description})`).join('\n');
      reply = `Here are our top **${cat}** options:\n\n${listStr}\n\nWhich one would you like to order?`;
      quickReplies = catProducts.slice(0, 3).map((p) => `Add ${p.name}`);
      return { message: reply, actions, recommendedProducts, suggestedQuickReplies: quickReplies, sessionMemory: memory };
    }
  }

  // ------------------------------------------------------------
  // CASE M: Spicy Food cravings: "I want something spicy"
  // ------------------------------------------------------------
  if (lower.includes('spicy') || lower.includes('teekha')) {
    actions.push({ type: 'SEARCH_PRODUCTS' });
    const spicyItems = PRODUCTS.filter((p) => p.spiceLevel >= 2).slice(0, 4);
    recommendedProducts = spicyItems;
    memory.lastRecommendedProductIds = spicyItems.map((p) => p.id);
    memory.spicePreference = 'spicy';

    const listStr = spicyItems.map((p) => `• 🌶️ **${p.name}** — ₹${p.price} (${p.badge || 'Spicy Kick'})`).join('\n');
    reply = `Sure! 🌶️ If you love spice, you will love these:\n\n${listStr}\n\nWhat would you like me to add to your cart?`;
    quickReplies = spicyItems.slice(0, 3).map((p) => `Add ${p.name}`);
    return { message: reply, actions, recommendedProducts, suggestedQuickReplies: quickReplies, sessionMemory: memory };
  }

  // ------------------------------------------------------------
  // CASE N: Restaurant Location / Where are you located?
  // ------------------------------------------------------------
  if (lower.includes('location') || lower.includes('where are you') || lower.includes('address') || lower.includes('kahan hai') || lower.includes('directions')) {
    actions.push({ type: 'GET_RESTAURANT_INFO', url: 'https://maps.app.goo.gl/sigma-foods' });
    reply = `📍 **Sigma Foods Location:**\n\n${RESTAURANT_INFO.location}\n\nWe are located right in Sector 2, Rohini, Delhi. You can dine in, take away, or order online right here!`;
    quickReplies = ['📍 Get Directions', '📞 Call Sigma Foods', '🍔 Browse Menu'];
    return { message: reply, actions, suggestedQuickReplies: quickReplies, sessionMemory: memory };
  }

  // ------------------------------------------------------------
  // CASE O: Timings / Business Hours: "What time do you close?", "Hours"
  // ------------------------------------------------------------
  if (lower.includes('hours') || lower.includes('timing') || lower.includes('open') || lower.includes('close') || lower.includes('time')) {
    actions.push({ type: 'GET_BUSINESS_HOURS' });
    reply = `🕐 **Sigma Foods Business Hours:**\n\n• **${RESTAURANT_INFO.hoursWeekday}**\n• **${RESTAURANT_INFO.hoursSunday}**\n\nWe are open 7 days a week, serving fresh vegetarian food!`;
    quickReplies = ['🍔 Order Now', '📍 Location', '📞 Call Support'];
    return { message: reply, actions, suggestedQuickReplies: quickReplies, sessionMemory: memory };
  }

  // ------------------------------------------------------------
  // CASE P: Contact / Phone / Email: "How can I contact you?"
  // ------------------------------------------------------------
  if (lower.includes('contact') || lower.includes('phone') || lower.includes('call') || lower.includes('email') || lower.includes('number') || lower.includes('support')) {
    actions.push({ type: 'CONTACT_SUPPORT' });
    reply = `📞 **You can reach Sigma Foods directly:**\n\n• **Phone:** [${RESTAURANT_INFO.phone}](tel:+917838853490)\n• **Email:** foodssigma@gmail.co\n• **Address:** ${RESTAURANT_INFO.shortLocation}\n\nOur team is always happy to assist you!`;
    quickReplies = ['📞 Call +91 7838853490', '✉️ Email Support', '📍 Get Directions'];
    return { message: reply, actions, suggestedQuickReplies: quickReplies, sessionMemory: memory };
  }

  // ------------------------------------------------------------
  // CASE Q: Veg / Non-Veg question: "Is it vegetarian?"
  // ------------------------------------------------------------
  if (lower.includes('veg') || lower.includes('vegetarian') || lower.includes('non veg') || lower.includes('halal') || lower.includes('egg')) {
    reply = `🌱 **100% Pure Vegetarian!**\n\nSigma Foods is strictly 100% pure vegetarian. All our momos, burgers, pastas, sauces, and dips are freshly prepared with hygienic vegetarian ingredients and fresh produce daily.`;
    quickReplies = ['🍔 Browse Menu', '🔥 Best Sellers', '🥟 Veg Momos'];
    return { message: reply, actions, suggestedQuickReplies: quickReplies, sessionMemory: memory };
  }

  // ------------------------------------------------------------
  // CASE R: Delivery fees & policy
  // ------------------------------------------------------------
  if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('charges')) {
    reply = `🚀 **Delivery Details:**\n\n• **Free Delivery:** On all orders above ₹299!\n• **Standard Delivery:** Only ₹30 for orders under ₹299.\n• **Estimated Time:** ${RESTAURANT_INFO.deliveryTime}.`;
    quickReplies = ['🍔 Browse Menu', '🛒 View Cart', '💳 Checkout'];
    return { message: reply, actions, suggestedQuickReplies: quickReplies, sessionMemory: memory };
  }

  // ------------------------------------------------------------
  // CASE S: Coupons & Offers
  // ------------------------------------------------------------
  if (lower.includes('coupon') || lower.includes('discount') || lower.includes('offer') || lower.includes('promo') || lower.includes('code')) {
    reply = `🎉 **Current Special Coupons for You:**\n\n• **SIGMA10** — 10% instant discount on any order\n• **SIGMA20** — 20% discount on orders above ₹499\n• **FIRSTORDER** — 15% discount for new customers\n\nYou can apply any of these coupon codes directly inside your cart!`;
    quickReplies = ['🛒 Go to Cart', '🍔 Explore Menu', '🔥 Best Sellers'];
    return { message: reply, actions, suggestedQuickReplies: quickReplies, sessionMemory: memory };
  }

  // ------------------------------------------------------------
  // CASE T: Generic Greeting / Intro
  // ------------------------------------------------------------
  if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower.includes('namaste') || lower.includes('good morning') || lower.includes('good evening')) {
    reply = `Hi! 👋 I'm **Sigma AI**, your Sigma Foods food assistant.\n\nI can help you:\n🍔 Choose delicious food\n🛒 Build your order\n📦 Track your order\n💬 Answer questions about our cafe\n\nWhat can I get for you today?`;
    quickReplies = ['🍔 Browse Menu', '🔥 Best Sellers', '🛒 My Cart', '📦 Track Order', '💬 Support'];
    return { message: reply, actions, suggestedQuickReplies: quickReplies, sessionMemory: memory };
  }

  // ------------------------------------------------------------
  // DEFAULT FALLBACK: Intelligent search & recommendation
  // ------------------------------------------------------------
  const searchResults = searchProducts(userMessage);
  if (searchResults.length > 0) {
    recommendedProducts = searchResults.slice(0, 4);
    memory.lastRecommendedProductIds = recommendedProducts.map((p) => p.id);
    const listStr = recommendedProducts.map((p) => `• **${p.emoji} ${p.name}** — ₹${p.price} (${p.category})`).join('\n');
    reply = `I found these matching items for you at Sigma Foods:\n\n${listStr}\n\nWould you like me to add any of these to your cart?`;
    quickReplies = recommendedProducts.slice(0, 3).map((p) => `Add ${p.name}`);
  } else {
    // Strict accuracy rule: If information is unavailable, provide official contact
    reply = `I'm not able to confirm that specific detail right now. You can check our full vegetarian menu, or contact Sigma Foods directly at **+91 7838853490**.\n\nWould you like to browse our best sellers instead?`;
    recommendedProducts = BEST_SELLERS.slice(0, 3);
    quickReplies = ['🍔 Browse Menu', '🔥 Best Sellers', '📞 Call Support', '🛒 View Cart'];
  }

  return {
    message: reply,
    actions,
    recommendedProducts,
    suggestedQuickReplies: quickReplies,
    sessionMemory: memory,
  };
}

// ============================================================
// CHAT SERVICE CLIENT (API LAYER WITH SEAMLESS LOCAL ENGINE FALLBACK)
// ============================================================

export class ChatService {
  private static conversationId: string = `conv_${Date.now()}`;
  private static sessionMemory: SessionMemory = {};

  public static getConversationId(): string {
    return this.conversationId;
  }

  public static resetSession(): void {
    this.conversationId = `conv_${Date.now()}`;
    this.sessionMemory = {};
  }

  public static getMemory(): SessionMemory {
    return this.sessionMemory;
  }

  /**
   * Main send function called by frontend UI.
   * Attempts POST /api/chat. If unavailable or returns error,
   * gracefully falls back to the local client AI engine so
   * user never experiences errors or dropped responses.
   */
  public static async sendMessage(userMessage: string, currentCart: CartItem[]): Promise<ChatResponse> {
    const payload: ChatRequest = {
      message: userMessage,
      conversationId: this.conversationId,
      cart: currentCart,
      sessionMemory: this.sessionMemory,
    };

    // Attempt backend API if running
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800); // 1.8s timeout for snappy local fallback

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data: ChatResponse = await response.json();
        if (data.sessionMemory) {
          this.sessionMemory = { ...this.sessionMemory, ...data.sessionMemory };
        }
        return data;
      }
    } catch {
      // Backend not running or timeout -> seamlessly use local engine
    }

    // Process via local high-accuracy AI engine
    const localResult = await processLocalChatMessage(userMessage, this.sessionMemory, currentCart);
    this.sessionMemory = localResult.sessionMemory;
    return localResult;
  }
}
