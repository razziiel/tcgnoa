# Gemini Context: TCG NOA POS

This document provides context and instructions for the `tcg-noa-pos` project.

## Project Overview

**TCG NOA POS** is a Point of Sale (POS) and inventory management application designed for a Trading Card Game (TCG) store. It is a single-page application (SPA) built with React 19 and Vite, featuring a comprehensive suite of tools for managing products, sales, expenses, and store terminals.

### Core Domain
- **Business Type:** TCG Retail Store (Pokémon, Magic: The Gathering, Yu-Gi-Oh!, One Piece, Lorcana).
- **Key Entities:** Products (Cards/Sealed), Transactions (Sales/Purchases), Customers (Profiles), Terminals, and Expenses.
- **User Roles:** `Administrador` (Full access) and `Personal` (Restricted access).

## Technology Stack

- **Frontend:** React 19, TypeScript, Vite.
- **Styling:** Tailwind CSS (inferred from class usage).
- **State Management:** Zustand.
- **Icons:** Lucide React.
- **AI Integration:** Google GenAI SDK (`@google/genai`).
- **Database/Backend:** Designed for PostgreSQL (likely Supabase based on schema conventions like `auth.users`).

## Project Structure

```
C:\Users\joavi\PROYECTOS\TCGNOA\
├── components/         # UI Components (POS, Inventory, Dashboard, etc.)
├── lib/                # Utility functions and library wrappers
├── store/              # Zustand state management stores
├── types.ts            # TypeScript type definitions (Centralized)
├── App.tsx             # Main application component and routing logic
├── schema.sql          # Database schema (PostgreSQL)
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies and scripts
```

## Key Architectural Patterns

### 1. State Management
- Global state is managed using **Zustand** hooks (e.g., `useStore`).
- The `App.tsx` component initializes listeners (`initListeners`) and handles high-level view switching.

### 2. Navigation
- The application uses **Custom State-Based Routing** within `App.tsx` instead of a library like React Router.
- Views: `POS`, `INVENTARIO`, `VENTAS`, `DASHBOARD`, `CONFIGURACION`, `TERMINALES`, `LIVE_ADMIN`, `GASTOS`, `ARQUEOS`.

### 3. Data Model (`types.ts` & `schema.sql`)
- **Products:** Categorized by game (`category_id`) and type (`sub_category`). Specific card details (set, rarity, finish) are stored in a `details` JSONB field.
- **Transactions:** Can be of type `sale` or `purchase`.
- **Terminals:** Manage the physical or logical point of sale, tracking open/close sessions (`Arqueo`).

## Development Workflow

### Prerequisites
- Node.js
- Access to the `GEMINI_API_KEY` in `.env.local` (for AI features).

### Common Commands
- **Install Dependencies:** `npm install`
- **Start Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Preview Production Build:** `npm run preview`

### Conventions
- **Styling:** Use Tailwind utility classes directly in JSX. Support Dark/Light themes (`theme === 'dark'`).
- **Components:** Functional components with Hooks.
- **Types:** All shared interfaces must be defined in `types.ts`.
- **Naming:**
  - Files: PascalCase for components (`ProductCard.tsx`), camelCase for logic (`useStore.ts`).
  - Variables: camelCase.

## Database Schema (Reference)
The `schema.sql` file defines the backend structure. Key tables:
- `profiles`: Users and roles.
- `products`: TCG items with JSONB details.
- `transactions`: Sales/Purchases records.
- `transaction_items`: Line items for transactions.

*Note: The project uses Row Level Security (RLS) policies for access control.*
