# Demo Full-Stack App

A super simple full-stack application that actually works!

## Tech Stack

- **Frontend**: Next.js 14 + React
- **Backend**: Express.js (Node.js)
- **Database**: MySQL 8
- **No ORM**: Direct SQL queries (simple and clear)
- **No TypeScript**: Plain JavaScript (less complexity)

## Quick Start

```bash
cd 20260107-demo
docker compose up
```

Wait 1-2 minutes for npm install, then visit:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/health

## Features

- ✅ Create items
- ✅ List items
- ✅ Delete items
- ✅ Auto-reconnect to database
- ✅ Hot reload for development

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/items` - Get all items
- `POST /api/items` - Create item
- `DELETE /api/items/:id` - Delete item

## Stop

```bash
docker compose down
```

## Why This Works

- No Prisma (no version conflicts)
- No TypeScript (no compilation issues)
- No NestJS (no complex setup)
- Direct SQL (you see exactly what's happening)
- Simple dependencies (fewer things to break)

**Just works!** 🎉
