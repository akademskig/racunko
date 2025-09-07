# Računko - Smart Invoice Management System

A modern invoicing platform with tax intelligence for Croatian businesses.

## Features

- **Invoice Management**: Create, edit, and manage professional invoices
- **Client Database**: Store and manage client information
- **PDF Export**: Generate professional PDF invoices
- **VAT Calculations**: Automatic Croatian VAT calculations
- **Tax Intelligence**: Real-time tax updates from Croatian tax authority

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **PDF Generation**: Puppeteer with Handlebars templates
- **Monorepo**: Turborepo

## Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development environment**:

   ```bash
   ./start-dev.sh
   ```

3. **Access the application**:
   - Web app: http://localhost:3000
   - API server: http://localhost:3001

## Manual Setup

1. **Start database**:

   ```bash
   docker-compose up -d postgres
   ```

2. **Setup database**:

   ```bash
   cd packages/db
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

3. **Start services**:

   ```bash
   # Web app
   npm run dev:web

   # API server
   cd packages/api && npm run dev
   ```

## Project Structure

```
racunko/
├── apps/
│   ├── web/              # Next.js frontend
│   └── scraper/          # Tax scraping service
├── packages/
│   ├── api/              # Express.js API
│   ├── db/               # Prisma database
│   ├── pdf-generator/    # PDF generation
│   └── ui/               # Shared components
```

## Croatian Localization

- VAT Rates: Standard (25%), Reduced (13%), Super-reduced (5%)
- Currency: HRK (Croatian Kuna)
- Language: Croatian interface
- Tax Authority: Porezna uprava integration

## License

MIT License
