import { create } from 'zustand';
import { db, storage } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product, CartItem, Profile, Transaction, Terminal, Arqueo, Gasto, Sorteo, ClaimEvent, TransactionStatus, SubCategoryType } from '../types';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  products: Product[];
  transactions: Transaction[];
  terminals: Terminal[];
  claimEvents: ClaimEvent[];
  sorteos: Sorteo[];
  arqueos: Arqueo[];
  expenses: Gasto[];
  activeProfile: Profile | null;
  activeTerminalId: string | null;
  theme: 'light' | 'dark';
  notification: Notification | null;
  selectedCategoryId: string | null;
  selectedSubCategory: SubCategoryType | null;
  cart: CartItem[];
  isAddingProduct: boolean;
  editingProduct: Product | null;

  initListeners: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  showNotification: (msg: string, type?: 'success' | 'error' | 'info') => void;
  uploadImage: (file: File) => Promise<string>;
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, updates: any) => Promise<void>;
  archiveProduct: (id: string) => Promise<void>;
  restoreProduct: (id: string) => Promise<void>;
  toggleAuction: (id: string, isAuction: boolean) => Promise<void>;
  setEditingProduct: (product: Product | null) => void;
  setIsAddingProduct: (is: boolean) => void;
  setSelectedCategoryId: (id: string | null) => void;
  setSelectedSubCategory: (sub: SubCategoryType | null) => void;
  claimProduct: (product: Product) => Promise<void>;
  openTerminal: (id: string) => Promise<void>;
  closeTerminal: (id: string) => Promise<void>;
  addTerminal: (terminal: Terminal) => Promise<void>;
  completeSale: (customerName: string) => Promise<void>;
  addToCart: (product: Product) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  addSorteo: (sorteo: any) => Promise<void>;
  realizarSorteo: (id: string) => Promise<void>;
  addClaimEvent: (event: any) => Promise<void>;
  toggleClaimEvent: (id: string) => Promise<void>;
  updateClaimEvent: (id: string, updates: any) => Promise<void>;
  updateTransactionStatus: (id: string, status: TransactionStatus) => Promise<void>;
  addExpense: (gasto: any) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  placeBid: (productId: string, amount: number) => Promise<void>;
  logout: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  products: [],
  transactions: [],
  terminals: [],
  claimEvents: [],
  sorteos: [],
  arqueos: [],
  expenses: [],
  // Para pruebas rápidas: Admin habilitado por defecto. Cambiar a null para probar el PublicHub.
  activeProfile: {
    id: 'admin-001',
    nombre: 'Admin Firebase',
    email: 'admin@tcgnoa.com',
    role: 'Administrador',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  },
  activeTerminalId: null,
  theme: 'dark',
  notification: null,
  selectedCategoryId: null,
  selectedSubCategory: null,
  cart: [],
  isAddingProduct: false,
  editingProduct: null,

  initListeners: () => {
    try {
      if (!db) return;
      onSnapshot(collection(db, 'products'), (snapshot) => {
        set({ products: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product)) });
      });
      onSnapshot(query(collection(db, 'transactions'), orderBy('fecha', 'desc')), (snapshot) => {
        set({ transactions: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Transaction)) });
      });
      onSnapshot(collection(db, 'terminals'), (snapshot) => {
        set({ terminals: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Terminal)) });
      });
      onSnapshot(collection(db, 'claimEvents'), (snapshot) => {
        set({ claimEvents: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ClaimEvent)) });
      });
      onSnapshot(collection(db, 'sorteos'), (snapshot) => {
        set({ sorteos: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Sorteo)) });
      });
      onSnapshot(collection(db, 'expenses'), (snapshot) => {
        set({ expenses: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Gasto)) });
      });
      onSnapshot(query(collection(db, 'arqueos'), orderBy('fechaCierre', 'desc')), (snapshot) => {
        set({ arqueos: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Arqueo)) });
      });
    } catch (error) {
      console.error("Firestore Listeners Error:", error);
    }
  },

  setTheme: (theme) => set({ theme }),
  showNotification: (message, type = 'info') => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 3000);
  },

  uploadImage: async (file: File) => {
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      get().showNotification("Error subiendo imagen. Verifica Storage.", "error");
      throw error;
    }
  },

  setEditingProduct: (product) => set({ editingProduct: product }),
  setIsAddingProduct: (is) => set({ isAddingProduct: is }),
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  setSelectedSubCategory: (sub) => set({ selectedSubCategory: sub }),

  addProduct: async (data) => {
    try {
      await addDoc(collection(db, 'products'), data);
      get().showNotification("Producto guardado", "success");
    } catch { get().showNotification("Error al guardar", "error"); }
  },

  updateProduct: async (id, updates) => {
    try { await updateDoc(doc(db, 'products', id), updates); } catch {}
  },

  archiveProduct: async (id) => {
    try {
      await updateDoc(doc(db, 'products', id), { archived_at: new Date().toISOString() });
      set({ editingProduct: null });
    } catch {}
  },

  restoreProduct: async (id) => {
    try { await updateDoc(doc(db, 'products', id), { archived_at: null }); } catch {}
  },

  toggleAuction: async (id, isAuction) => {
    try {
      await updateDoc(doc(db, 'products', id), { 
        is_auction: isAuction,
        current_bid: isAuction ? 0 : null
      });
      get().showNotification(isAuction ? "Subasta activada" : "Subasta removida", "success");
    } catch {}
  },

  claimProduct: async (product) => {
    try {
      if (product.stock <= 0) return;
      await updateDoc(doc(db, 'products', product.id), { stock: product.stock - 1 });
      await addDoc(collection(db, 'transactions'), {
        fecha: new Date().toISOString(),
        vendedor: "Sistema Live",
        vendedorId: "system",
        cliente: "Usuario Live",
        total: product.sale_price,
        status: 'Pendiente',
        source: 'CLAIM',
        items: [{ productId: product.id, name: product.name, quantity: 1, price: product.sale_price }]
      });
      get().showNotification("¡Claim registrado!", "success");
    } catch { get().showNotification("Error en Claim. Verifica permisos.", "error"); }
  },

  addTerminal: async (terminal) => {
    try { await setDoc(doc(db, 'terminals', terminal.id), terminal); } catch {}
  },

  openTerminal: async (id) => {
    try {
      const { activeProfile } = get();
      await updateDoc(doc(db, 'terminals', id), {
        activa: true,
        userId: activeProfile?.id,
        userName: activeProfile?.nombre,
        ultimaApertura: new Date().toISOString()
      });
      set({ activeTerminalId: id });
    } catch {}
  },

  closeTerminal: async (id) => {
    try {
      const terminal = get().terminals.find(t => t.id === id);
      if (!terminal) return;
      await addDoc(collection(db, 'arqueos'), {
        terminalId: id,
        terminalNombre: terminal.nombre,
        vendedorNombre: terminal.userName,
        fechaCierre: new Date().toISOString(),
        totalVentas: 0 
      });
      await updateDoc(doc(db, 'terminals', id), { activa: false, userId: null, userName: null });
      set({ activeTerminalId: null });
    } catch {}
  },

  addToCart: (product) => {
    const { cart, activeTerminalId } = get();
    if (!activeTerminalId) return get().showNotification("Caja cerrada", "error");
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      set({ cart: cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
    } else {
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
  },

  updateCartQuantity: (id, quantity) => {
    const { cart } = get();
    if (quantity <= 0) set({ cart: cart.filter(i => i.id !== id) });
    else set({ cart: cart.map(i => i.id === id ? { ...i, quantity } : i) });
  },

  removeFromCart: (id) => set({ cart: get().cart.filter(i => i.id !== id) }),
  clearCart: () => set({ cart: [] }),

  completeSale: async (customerName) => {
    try {
      const { cart, activeProfile, activeTerminalId, clearCart } = get();
      const total = cart.reduce((acc, i) => acc + (i.sale_price * i.quantity), 0);
      await addDoc(collection(db, 'transactions'), {
        fecha: new Date().toISOString(),
        vendedor: activeProfile?.nombre || 'Admin',
        terminalId: activeTerminalId,
        cliente: customerName || 'Consumidor Final',
        total,
        status: 'Pagado',
        source: 'POS',
        items: cart.map(i => ({ productId: i.id, name: i.name, quantity: i.quantity, price: i.sale_price }))
      });
      for (const item of cart) {
        await updateDoc(doc(db, 'products', item.id), { stock: Math.max(0, item.stock - item.quantity) });
      }
      clearCart();
      get().showNotification("Venta exitosa", "success");
    } catch {}
  },

  addSorteo: async (sorteo) => {
    try { await addDoc(collection(db, 'sorteos'), { ...sorteo, fecha: new Date().toISOString() }); } catch {}
  },

  realizarSorteo: async (id) => {
    try {
      const s = get().sorteos.find(s => s.id === id);
      if (s && s.participantes.length > 0) {
        const winner = s.participantes[Math.floor(Math.random() * s.participantes.length)];
        await updateDoc(doc(db, 'sorteos', id), { ganador: winner, activo: false });
      }
    } catch {}
  },

  addClaimEvent: async (event) => {
    try {
      await addDoc(collection(db, 'claimEvents'), event);
      get().showNotification("Colección Live Creada", "success");
    } catch { get().showNotification("Error Firebase: Permission Denied", "error"); }
  },

  toggleClaimEvent: async (id) => {
    try {
      const ev = get().claimEvents.find(e => e.id === id);
      await updateDoc(doc(db, 'claimEvents', id), { activa: !ev?.activa });
    } catch {}
  },

  updateClaimEvent: async (id, updates) => {
    try { await updateDoc(doc(db, 'claimEvents', id), updates); } catch {}
  },

  updateTransactionStatus: async (id, status) => {
    try { await updateDoc(doc(db, 'transactions', id), { status }); } catch {}
  },

  addExpense: async (gasto) => {
    try { await addDoc(collection(db, 'expenses'), gasto); } catch {}
  },

  removeExpense: async (id) => {
    try { await deleteDoc(doc(db, 'expenses', id)); } catch {}
  },

  placeBid: async (productId, amount) => {
    try {
      const p = get().products.find(prod => prod.id === productId);
      if (!p) return;
      const currentPrice = p.current_bid || p.sale_price;
      if (amount <= currentPrice) {
        get().showNotification("La oferta debe ser mayor a la actual", "error");
        return;
      }
      await updateDoc(doc(db, 'products', productId), { current_bid: amount });
      get().showNotification("Oferta aceptada", "success");
    } catch {}
  },

  logout: () => set({ activeProfile: null, activeTerminalId: null, cart: [] })
}));