// ============================================================
// SIGMA FOODS DATABASE SERVICE (IndexedDB + Cloud DB Sync)
// Full offline/online database for Users, Orders, Products & Chats
// ============================================================

import { PRODUCTS, type Product } from '../data/products';
import type { CartItem, Order, User, Address } from '../store';
import { cloudDb, CLOUD_TEST_ACCOUNTS } from './cloudDb';

export interface DbUser extends User {
  id: string;
  authProvider: 'google' | 'phone' | 'email';
  password?: string;
  role?: 'admin' | 'customer';
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
const DB_VERSION = 2;

class SigmaDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    this.init();
    this.seedInitialUsers();
  }

  private init(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
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

        // 3. Products Store
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

  private seedInitialUsers(): void {
    try {
      const existing = localStorage.getItem('sigma_db_users');
      if (!existing) {
        localStorage.setItem('sigma_db_users', JSON.stringify(CLOUD_TEST_ACCOUNTS));
      }
    } catch {}
  }

  // ──────────────────────────────────────────────────────────
  // USERS REPOSITORY (IndexedDB + Cloud Sync)
  // ──────────────────────────────────────────────────────────
  public async saveUser(user: DbUser): Promise<DbUser> {
    const store = await this.getStore('users', 'readwrite');
    if (store) {
      store.put(user);
    }

    try {
      const users: DbUser[] = JSON.parse(localStorage.getItem('sigma_db_users') || '[]');
      const idx = users.findIndex(
        (u) => u.id === user.id || (user.email && u.email === user.email) || (user.phone && u.phone === user.phone)
      );
      if (idx >= 0) users[idx] = { ...users[idx], ...user };
      else users.unshift(user);
      localStorage.setItem('sigma_db_users', JSON.stringify(users));
    } catch {}

    // Cloud Database Sync
    cloudDb.syncUserToCloud(user);

    return user;
  }

  public async findUserByEmail(email: string): Promise<DbUser | null> {
    if (!email) return null;
    const all = await this.getAllUsers();
    return all.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public async findUserByPhone(phone: string): Promise<DbUser | null> {
    if (!phone) return null;
    const clean = phone.replace(/\D/g, '').slice(-10);
    const all = await this.getAllUsers();
    return all.find((u) => u.phone.replace(/\D/g, '').slice(-10) === clean) || null;
  }

  public async getAllUsers(): Promise<DbUser[]> {
    try {
      const localUsers: DbUser[] = JSON.parse(localStorage.getItem('sigma_db_users') || '[]');
      const cloudUsers = await cloudDb.getCloudUsers();

      // Merge unique by email or phone
      const map = new Map<string, DbUser>();
      [...cloudUsers, ...localUsers].forEach((u) => {
        const key = u.email || u.phone || u.id;
        map.set(key, u);
      });
      return Array.from(map.values());
    } catch {}
    return CLOUD_TEST_ACCOUNTS as DbUser[];
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

    // Cloud Sync
    cloudDb.syncOrderToCloud(order);

    return order;
  }

  public async getAllOrders(): Promise<DbOrder[]> {
    try {
      const localOrders: DbOrder[] = JSON.parse(localStorage.getItem('sigma_db_orders') || '[]');
      const cloudOrders = await cloudDb.getCloudOrders();
      const map = new Map<string, DbOrder>();
      [...cloudOrders, ...localOrders].forEach((o) => map.set(o.id, o));
      return Array.from(map.values());
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
  public async getDatabaseStats(): Promise<{
    users: number;
    orders: number;
    chats: number;
    products: number;
    cloudStatus: any;
  }> {
    const users = (await this.getAllUsers()).length;
    const orders = (await this.getAllOrders()).length;
    const chats = (await this.getChatHistory()).length;
    const cloudStatus = await cloudDb.getCloudStatus();
    return {
      users,
      orders,
      chats,
      products: PRODUCTS.length,
      cloudStatus,
    };
  }
}

export const db = new SigmaDatabase();
