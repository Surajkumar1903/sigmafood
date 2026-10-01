// ============================================================
// SIGMA FOODS DATABASE SERVICE (IndexedDB + Persistent Storage)
// Full offline/online database for Users, Orders, Products, Cart & Chats
// ============================================================

import { PRODUCTS, type Product } from '../data/products';
import type { CartItem, Order, User, Address } from '../store';

export interface DbUser extends User {
  id: string;
  authProvider: 'google' | 'phone' | 'email';
  createdAt: string;
  lastLogin: string;
}

export interface DbOrder extends Order {
  userId?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface DbChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  metadata?: any;
}

const DB_NAME = 'SigmaFoodsDB';
const DB_VERSION = 1;

class SigmaDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    this.init();
  }

  private init(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        // Fallback for non-browser environments
        resolve({} as IDBDatabase);
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Users Store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: false });
          userStore.createIndex('phone', 'phone', { unique: false });
        }

        // 2. Orders Store
        if (!db.objectStoreNames.contains('orders')) {
          const orderStore = db.createObjectStore('orders', { keyPath: 'id' });
          orderStore.createIndex('date', 'date', { unique: false });
          orderStore.createIndex('userId', 'userId', { unique: false });
        }

        // 3. Products Store (Custom / Cached)
        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id' });
        }

        // 4. Chat Messages Store
        if (!db.objectStoreNames.contains('chat_messages')) {
          const chatStore = db.createObjectStore('chat_messages', { keyPath: 'id' });
          chatStore.createIndex('conversationId', 'conversationId', { unique: false });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('IndexedDB open error:', request.error);
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  private async getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore | null> {
    try {
      const db = await this.init();
      if (!db.transaction) return null;
      const tx = db.transaction(storeName, mode);
      return tx.objectStore(storeName);
    } catch {
      return null;
    }
  }

  // ──────────────────────────────────────────────────────────
  // USERS REPOSITORY
  // ──────────────────────────────────────────────────────────
  public async saveUser(user: DbUser): Promise<DbUser> {
    const store = await this.getStore('users', 'readwrite');
    if (store) {
      store.put(user);
    }
    // Also sync to localStorage as instant fallback
    try {
      const users: DbUser[] = JSON.parse(localStorage.getItem('sigma_db_users') || '[]');
      const idx = users.findIndex((u) => u.id === user.id || (user.email && u.email === user.email) || (user.phone && u.phone === user.phone));
      if (idx >= 0) users[idx] = { ...users[idx], ...user };
      else users.push(user);
      localStorage.setItem('sigma_db_users', JSON.stringify(users));
    } catch {}
    return user;
  }

  public async findUserByEmail(email: string): Promise<DbUser | null> {
    if (!email) return null;
    try {
      const users: DbUser[] = JSON.parse(localStorage.getItem('sigma_db_users') || '[]');
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) return found;
    } catch {}

    const store = await this.getStore('users');
    if (!store) return null;

    return new Promise((resolve) => {
      const index = store.index('email');
      const req = index.get(email);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  }

  public async findUserByPhone(phone: string): Promise<DbUser | null> {
    if (!phone) return null;
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    try {
      const users: DbUser[] = JSON.parse(localStorage.getItem('sigma_db_users') || '[]');
      const found = users.find((u) => u.phone.replace(/\D/g, '').slice(-10) === cleanPhone);
      if (found) return found;
    } catch {}

    return null;
  }

  public async getAllUsers(): Promise<DbUser[]> {
    try {
      const users: DbUser[] = JSON.parse(localStorage.getItem('sigma_db_users') || '[]');
      if (users.length > 0) return users;
    } catch {}
    return [];
  }

  // ──────────────────────────────────────────────────────────
  // ORDERS REPOSITORY
  // ──────────────────────────────────────────────────────────
  public async saveOrder(order: DbOrder): Promise<DbOrder> {
    const store = await this.getStore('orders', 'readwrite');
    if (store) store.put(order);

    try {
      const orders: DbOrder[] = JSON.parse(localStorage.getItem('sigma_db_orders') || '[]');
      const idx = orders.findIndex((o) => o.id === order.id);
      if (idx >= 0) orders[idx] = order;
      else orders.unshift(order);
      localStorage.setItem('sigma_db_orders', JSON.stringify(orders));
    } catch {}
    return order;
  }

  public async getAllOrders(): Promise<DbOrder[]> {
    try {
      const orders: DbOrder[] = JSON.parse(localStorage.getItem('sigma_db_orders') || '[]');
      return orders;
    } catch {
      return [];
    }
  }

  public async getOrderById(id: string): Promise<DbOrder | null> {
    const orders = await this.getAllOrders();
    return orders.find((o) => o.id.toLowerCase() === id.toLowerCase()) || null;
  }

  // ──────────────────────────────────────────────────────────
  // CHAT MESSAGES REPOSITORY
  // ──────────────────────────────────────────────────────────
  public async saveChatMessage(msg: DbChatMessage): Promise<void> {
    const store = await this.getStore('chat_messages', 'readwrite');
    if (store) store.put(msg);

    try {
      const history: DbChatMessage[] = JSON.parse(localStorage.getItem('sigma_db_chats') || '[]');
      history.push(msg);
      // Keep last 100 messages
      if (history.length > 100) history.shift();
      localStorage.setItem('sigma_db_chats', JSON.stringify(history));
    } catch {}
  }

  public async getChatHistory(conversationId?: string): Promise<DbChatMessage[]> {
    try {
      const history: DbChatMessage[] = JSON.parse(localStorage.getItem('sigma_db_chats') || '[]');
      if (conversationId) {
        return history.filter((m) => m.conversationId === conversationId);
      }
      return history;
    } catch {
      return [];
    }
  }

  // ──────────────────────────────────────────────────────────
  // DATABASE STATUS / STATS
  // ──────────────────────────────────────────────────────────
  public async getDatabaseStats(): Promise<{ users: number; orders: number; chats: number; products: number }> {
    const users = (await this.getAllUsers()).length;
    const orders = (await this.getAllOrders()).length;
    const chats = (await this.getChatHistory()).length;
    return {
      users,
      orders,
      chats,
      products: PRODUCTS.length,
    };
  }
}

export const db = new SigmaDatabase();
