
import React from 'react';
import { 
  Zap, Flame, Shield, Smile, Sword, Package, 
  ShoppingCart, User, Settings, Search, Filter, 
  Plus, Minus, Trash2, CheckCircle, Info, 
  Anchor, Stars, Database, TrendingUp, LayoutDashboard,
  Moon, Sun, Palette
} from 'lucide-react';

export const IconMap: Record<string, React.FC<any>> = {
  zap: Zap,
  flame: Flame,
  shield: Shield,
  smile: Smile,
  sword: Sword,
  package: Package,
  cart: ShoppingCart,
  user: User,
  settings: Settings,
  search: Search,
  filter: Filter,
  plus: Plus,
  minus: Minus,
  trash: Trash2,
  check: CheckCircle,
  info: Info,
  anchor: Anchor,
  stars: Stars,
  inventory: Database,
  trends: TrendingUp,
  dashboard: LayoutDashboard,
  moon: Moon,
  sun: Sun,
  palette: Palette
};

export const Icon = ({ name, className }: { name: string; className?: string }) => {
  const LucideIcon = IconMap[name.toLowerCase()] || Package;
  return <LucideIcon className={className} />;
};
