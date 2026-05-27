import { create } from 'zustand';
import type { Ticket, PracticeCategory } from '../types';
import {
  getAllTickets,
  getAllPractice,
  putTickets,
  putPractice,
  clearTickets,
  getMeta,
  setMeta,
  wipeAllData
} from '../db';
import { seedTickets } from '../data/seedTickets';
import { seedPractice } from '../data/seedPractice';

interface AppState {
  tickets: Ticket[];
  practice: PracticeCategory[];
  loaded: boolean;
  loading: boolean;
  init: () => Promise<void>;
  replaceTickets: (tickets: Ticket[]) => Promise<void>;
  resetAll: () => Promise<void>;
}

const SEED_VERSION = 4;

export const useAppStore = create<AppState>((set) => ({
  tickets: [],
  practice: [],
  loaded: false,
  loading: false,
  async init() {
    set({ loading: true });
    const seededVersion = await getMeta<number>('seedVersion');
    if (seededVersion !== SEED_VERSION) {
      await clearTickets();
      await putTickets(seedTickets);
      await putPractice(seedPractice);
      await setMeta('seedVersion', SEED_VERSION);
    }
    const [tickets, practice] = await Promise.all([getAllTickets(), getAllPractice()]);
    tickets.sort((a, b) => a.id - b.id);
    set({ tickets, practice, loaded: true, loading: false });
  },
  async replaceTickets(tickets) {
    await putTickets(tickets);
    const all = await getAllTickets();
    all.sort((a, b) => a.id - b.id);
    set({ tickets: all });
  },
  async resetAll() {
    await wipeAllData();
    set({ tickets: [], practice: [], loaded: false });
  }
}));
