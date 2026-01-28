
import { Category, Product, Profile } from '../types';

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'admin-001',
    nombre: 'Administrador de TCG NOA',
    email: 'admin@tcgnoa.com',
    role: 'Administrador',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  }
];

// Solo Pokémon por ahora, pero extensible
export const MOCK_CATEGORIES: Category[] = [
  { id: 'poke', name: 'Pokémon', icon: 'zap' }
];

const generateBulk = (count: number, prefix: string, cat: string): Product[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}-${i}`,
    category_id: cat,
    sub_category: 'Cartas Sueltas',
    name: `Pokémon Especial #${i + 1}`,
    condition: 'Casi Nueva (NM)',
    purchase_price: 10 + i * 5,
    sale_price: 25 + i * 10,
    stock: 1,
    details: { set_name: 'TCG NOA Live', card_number: `${i + 1}/100`, rarity: 'Rara', finish: i % 2 === 0 ? 'Foil' : 'No-Foil', year: 2024 },
    image_url: `https://api.dicebear.com/7.x/initials/svg?seed=${prefix}${i}`
  }));
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    category_id: 'poke',
    sub_category: 'Cartas Sueltas',
    name: 'Charizard',
    condition: 'Casi Nueva (NM)',
    purchase_price: 280,
    sale_price: 420,
    stock: 2,
    details: { set_name: 'Base Set', card_number: '4/102', rarity: 'Rara Holo', finish: 'Foil', year: 1999 },
    image_url: 'https://images.pokemontcg.io/base1/4_hires.png'
  },
  {
    id: 'p3',
    category_id: 'poke',
    sub_category: 'Cartas Sueltas',
    name: 'Umbreon VMAX',
    condition: 'Menta',
    purchase_price: 550,
    sale_price: 850,
    stock: 1,
    details: { set_name: 'Evolving Skies', card_number: '215/203', rarity: 'Secret Rare', finish: 'Texturizada', year: 2021 },
    image_url: 'https://images.pokemontcg.io/swsh7/215_hires.png'
  },
  ...generateBulk(30, 'pk', 'poke'),
];