
export type Role = 'Administrador' | 'Personal';
export type TCGGame = 'Pokémon' | 'Magic: The Gathering' | 'Yu-Gi-Oh!' | 'One Piece' | 'Lorcana';
export type SubCategoryType = 'Cartas Sueltas' | 'Sobres' | 'Sellados' | 'Carpetas' | 'Protectores';
export type TransactionStatus = 'Pendiente' | 'Pagado' | 'Cancelado';
export type TransactionSource = 'POS' | 'CLAIM' | 'SUBASTA';

export interface Profile {
  id: string;
  nombre: string;
  email: string;
  role: Role;
  avatar_url: string;
}

export interface Category {
  id: string;
  name: TCGGame;
  icon: string;
}

export interface CardDetails {
  set_name: string;
  card_number: string;
  rarity: string;
  finish: 'Foil' | 'No-Foil' | 'Reverse Holo' | 'Texturizada';
  year: number;
}

export type Condition = 'Menta' | 'Casi Nueva (NM)' | 'Poco Uso (LP)' | 'Uso Moderado (MP)' | 'Muy Usada (HP)' | 'Dañada';

export interface Product {
  id: string;
  category_id: string;
  sub_category: SubCategoryType;
  name: string;
  condition: Condition;
  purchase_price: number;
  sale_price: number;
  stock: number;
  details: CardDetails;
  image_url: string;
  is_drop?: boolean;
  is_auction?: boolean;
  current_bid?: number;
  auction_end?: string;
  archived_at?: string;
}

export interface ClaimEvent {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  activa: boolean;
  productIds: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  fecha: string;
  vendedor: string;
  vendedorId: string;
  terminalId?: string;
  cliente: string;
  total: number;
  status: TransactionStatus;
  source: TransactionSource;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

export interface Terminal {
  id: string;
  nombre: string;
  ubicacion: string;
  activa: boolean;
  ultimaApertura?: string;
  userId?: string; // ID del usuario que tiene abierta la terminal
  userName?: string; // Nombre para visualización rápida (Denormalización tipo Firebase)
}

export interface Arqueo {
  id: string;
  terminalId: string;
  terminalNombre: string;
  vendedorId: string;
  vendedorNombre: string;
  fechaApertura: string;
  fechaCierre: string;
  totalVentas: number;
  cantidadVentas: number;
}

export interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  fecha: string;
  categoria: 'Logística' | 'Marketing' | 'Personal' | 'Alquiler/Stand' | 'Otros';
}

export interface Sorteo {
  id: string;
  titulo: string;
  participantes: string[];
  ganador?: string;
  fecha: string;
  activo: boolean;
}
