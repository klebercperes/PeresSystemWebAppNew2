# AI Assistant Guide for Frontend Development

This guide helps AI assistants (like Gemini) understand and work with the Peres Systems frontend codebase without breaking existing functionality.

## 🏗️ Architecture Overview

### Core Principle: **API Layer Abstraction**

**CRITICAL**: All database/backend interactions MUST go through the `services/api.ts` file. Components should NEVER make direct `fetch()` calls to backend endpoints.

```
Component → services/api.ts → Backend API → Database
```

### Why This Matters

1. **Single Source of Truth**: All API calls are centralized in one place
2. **Type Safety**: TypeScript interfaces ensure data consistency
3. **Error Handling**: Centralized error handling and authentication
4. **Future-Proof**: Backend changes only require updates in `services/api.ts`
5. **AI-Friendly**: AI assistants can understand the entire API surface by reading one file

---

## 📁 File Structure

```
/tmp/PeresSystemWebAppNew2/
├── services/
│   ├── api.ts          ← ALL API CALLS GO HERE
│   ├── auth.ts         ← Authentication only
│   └── geminiService.ts ← Gemini AI integration
├── components/         ← UI Components (NO direct API calls)
├── pages/             ← Page components (NO direct API calls)
├── types.ts           ← TypeScript type definitions
└── App.tsx            ← Main app (uses services/api.ts)
```

---

## 🔌 API Service (`services/api.ts`)

### Structure

The `api` object contains all backend communication methods, organized by resource:

```typescript
export const api = {
  // ========== CLIENT METHODS ==========
  getClients(): Promise<Client[]>
  getClient(id): Promise<Client>
  addClient(data): Promise<Client>
  updateClient(data): Promise<Client>
  deleteClient(id): Promise<void>

  // ========== TICKET METHODS ==========
  getTickets(): Promise<Ticket[]>
  getTicket(id): Promise<Ticket>
  addTicket(data): Promise<Ticket>
  updateTicket(data): Promise<Ticket>
  deleteTicket(id): Promise<void>

  // ========== ASSET METHODS ==========
  getAssets(): Promise<Asset[]>
  getAsset(id): Promise<Asset>
  addAsset(data): Promise<Asset>
  updateAsset(data): Promise<Asset>
  deleteAsset(id): Promise<void>
}
```

### Key Features

1. **Automatic Authentication**: All calls include auth token via `authService.getAuthHeader()`
2. **Error Handling**: Handles 401 (unauthorized), network errors, timeouts
3. **Type Safety**: Full TypeScript typing for all requests/responses
4. **Date Formatting**: Automatically converts between frontend/backend date formats

### Internal Helper: `apiCall<T>()`

- Handles authentication headers
- Manages request/response
- Provides error handling
- 10-second timeout protection

---

## ✅ Rules for AI Assistants

### DO ✅

1. **Always use `api` object** from `services/api.ts`:
   ```typescript
   // ✅ CORRECT
   import { api } from '../services/api';
   const clients = await api.getClients();
   ```

2. **Check existing methods first** before adding new ones:
   ```typescript
   // Check if api.getClients() exists before creating a new method
   ```

3. **Follow the naming pattern**:
   - `get{Resource}` - Fetch single item
   - `get{Resource}s` - Fetch list
   - `add{Resource}` - Create new
   - `update{Resource}` - Update existing
   - `delete{Resource}` - Delete

4. **Use TypeScript types** from `types.ts`:
   ```typescript
   import { Client, Ticket, Asset } from '../types';
   ```

5. **Handle errors gracefully**:
   ```typescript
   try {
     await api.addClient(clientData);
   } catch (error) {
     // Show user-friendly error message
   }
   ```

### DON'T ❌

1. **NEVER make direct fetch() calls** in components:
   ```typescript
   // ❌ WRONG - Don't do this!
   const response = await fetch('/api/clients');
   ```

2. **NEVER bypass the api service**:
   ```typescript
   // ❌ WRONG
   fetch(`${API_BASE_URL}/api/clients`, { ... })
   ```

3. **NEVER modify `apiCall()` helper** without understanding the full impact

4. **NEVER hardcode API URLs** - use `import.meta.env.VITE_API_URL`

---

## 🔄 Adding New API Endpoints

### Step-by-Step Process

1. **Check if endpoint already exists** in `services/api.ts`

2. **If adding a new resource**, add methods to `api` object:
   ```typescript
   // In services/api.ts
   export const api = {
     // ... existing methods ...
     
     // ========== NEW RESOURCE METHODS ==========
     getNewResources: async (): Promise<NewResource[]> => {
       return await apiCall<NewResource[]>(`/api/new-resources`);
     },
     
     addNewResource: async (data: Omit<NewResource, 'id'>): Promise<NewResource> => {
       return await apiCall<NewResource>(`/api/new-resources`, {
         method: 'POST',
         body: JSON.stringify(data),
       });
     },
   };
   ```

3. **Add TypeScript types** to `types.ts`:
   ```typescript
   export interface NewResource {
     id: string;
     name: string;
     // ... other fields
   }
   ```

4. **Use in components**:
   ```typescript
   import { api } from '../services/api';
   const resources = await api.getNewResources();
   ```

---

## 🔐 Authentication

### Auth Service (`services/auth.ts`)

- **Login**: `authService.login(credentials)`
- **Get Current User**: `authService.getCurrentUser()`
- **Check Auth**: `authService.isAuthenticated()`
- **Logout**: `authService.logout()`

### Usage in Components

```typescript
import { authService } from '../services/auth';

// Check if user is authenticated
if (authService.isAuthenticated()) {
  const user = await authService.getCurrentUser();
  // user.is_superuser - check admin status
}
```

---

## 📝 Type Definitions (`types.ts`)

All data types are defined in `types.ts`. When adding new features:

1. **Add interface** to `types.ts`
2. **Export it** for use in components
3. **Use in API methods** for type safety

Example:
```typescript
// types.ts
export interface Client {
  id: string;
  name: string;
  email: string;
  // ...
}

// services/api.ts
getClients: async (): Promise<Client[]> => { ... }
```

---

## 🧩 Component Structure

### Standard Component Pattern

```typescript
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Client } from '../types';

const MyComponent: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.getClients();
        setClients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Component JSX...
};
```

---

## 🚀 Deployment Workflow

### When Making Changes

1. **Test locally** first:
   ```bash
   cd /tmp/PeresSystemWebAppNew2
   npm run dev
   ```

2. **Commit changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

3. **Push to GitHub**:
   ```bash
   TOKEN=$(grep "^GITHUB_TOKEN=" /home/kleber/peres_systems/.env | cut -d'=' -f2)
   git push https://${TOKEN}@github.com/klebercperes/PeresSystemWebAppNew2.git main
   ```

4. **Rebuild production**:
   ```bash
   cd /home/kleber/peres_systems
   docker-compose -f docker-compose.https-domain.github.yml build --no-cache frontend
   docker stop msp_frontend && docker rm msp_frontend
   docker-compose -f docker-compose.https-domain.github.yml up -d --no-deps frontend
   ```

---

## 🔍 Debugging Tips

### Check API Calls

1. **Browser Console** (F12):
   - Look for network errors
   - Check API responses
   - Verify authentication tokens

2. **Backend Logs**:
   ```bash
   docker logs -f msp_backend
   ```

3. **Frontend Logs**:
   ```bash
   docker logs -f msp_frontend
   ```

### Common Issues

1. **401 Unauthorized**: Token expired - user needs to login again
2. **Network Error**: Backend not running or wrong API URL
3. **Type Errors**: Check `types.ts` matches backend schema

---

## 📚 Reference: Backend API Endpoints

### Base URL
- **Development**: `http://10.0.1.122:8000`
- **Production**: `https://peres.systems`

### Endpoints (all prefixed with `/api`)

#### Clients
- `GET /api/clients` - List all clients
- `GET /api/clients/{id}` - Get single client
- `POST /api/clients` - Create client
- `PUT /api/clients/{id}` - Update client
- `DELETE /api/clients/{id}` - Delete client

#### Tickets
- `GET /api/tickets` - List all tickets
- `GET /api/tickets/{id}` - Get single ticket
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/{id}` - Update ticket
- `DELETE /api/tickets/{id}` - Delete ticket

#### Assets
- `GET /api/assets` - List all assets
- `GET /api/assets/{id}` - Get single asset
- `POST /api/assets` - Create asset
- `PUT /api/assets/{id}` - Update asset
- `DELETE /api/assets/{id}` - Delete asset

#### Authentication
- `POST /api/auth/login` - Login (form-data)
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

---

## 🎯 Best Practices Summary

1. ✅ **Always use `api` object** - Never direct fetch() calls
2. ✅ **Check existing methods first** - Don't duplicate functionality
3. ✅ **Use TypeScript types** - From `types.ts`
4. ✅ **Handle errors gracefully** - Show user-friendly messages
5. ✅ **Test locally first** - Before pushing to production
6. ✅ **Follow naming patterns** - get/add/update/delete
7. ✅ **Keep API layer centralized** - All in `services/api.ts`

---

## 🤖 Instructions for AI Assistants

When helping improve the frontend:

1. **Read `services/api.ts` first** - Understand available API methods
2. **Check `types.ts`** - Understand data structures
3. **Review existing components** - See how they use the API
4. **Propose changes** - Following the patterns above
5. **Never bypass the API layer** - Always use `api` object

### Example AI Prompt Template

```
I want to add a new feature that [description]. 
Please:
1. Check if API methods exist in services/api.ts
2. Add new methods if needed (following the pattern)
3. Add TypeScript types to types.ts
4. Create/update components using the api object
5. Ensure error handling is in place
```

---

**Last Updated**: November 15, 2025
**Maintained By**: Peres Systems Development Team

