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
  myTicket: number[];
  loaded: boolean;
  loading: boolean;
  init: () => Promise<void>;
  replaceTickets: (tickets: Ticket[]) => Promise<void>;
  resetAll: () => Promise<void>;
  toggleMyTicket: (id: number) => Promise<void>;
  clearMyTicket: () => Promise<void>;
}

const SEED_VERSION = 4;

export const useAppStore = create<AppState>((set, get) => ({
  tickets: [],
  practice: [],
  myTicket: [],
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
    const [tickets, practice, myTicket] = await Promise.all([
      getAllTickets(),
      getAllPractice(),
      getMeta<number[]>('myTicket')
    ]);
    tickets.sort((a, b) => a.id - b.id);
    set({
      tickets,
      practice,
      myTicket: myTicket ?? [],
      loaded: true,
      loading: false
    });
  },
  async replaceTickets(tickets) {
    await putTickets(tickets);
    const all = await getAllTickets();
    all.sort((a, b) => a.id - b.id);
    set({ tickets: all });
  },
  async resetAll() {
    await wipeAllData();
    set({ tickets: [], practice: [], myTicket: [], loaded: false });
  },
  async toggleMyTicket(id) {
    const current = get().myTicket;
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id].sort((a, b) => a - b);
    set({ myTicket: next });
    await setMeta('myTicket', next);
  },
  async clearMyTicket() {
    set({ myTicket: [] });
    await setMeta('myTicket', []);
  }
}));
