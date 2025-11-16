# API Reference Documentation

Complete reference for all API methods available in the frontend.

## 📦 Import

```typescript
import { api } from '../services/api';
```

---

## 👥 Client Methods

### `api.getClients()`
Get all clients.

**Returns**: `Promise<Client[]>`

**Example**:
```typescript
const clients = await api.getClients();
```

---

### `api.getClient(clientId: string)`
Get a single client by ID.

**Parameters**:
- `clientId` (string): Client ID

**Returns**: `Promise<Client>`

**Example**:
```typescript
const client = await api.getClient('cli-12345678');
```

---

### `api.addClient(client: Omit<Client, 'id' | 'joinDate'>)`
Create a new client.

**Parameters**:
- `client` (object): Client data (without id and joinDate)

**Returns**: `Promise<Client>`

**Example**:
```typescript
const newClient = await api.addClient({
  name: 'Acme Corp',
  email: 'contact@acme.com',
  contactPerson: 'John Doe',
  phone: '123-456-7890',
  // ... other fields
});
```

---

### `api.updateClient(client: Client)`
Update an existing client.

**Parameters**:
- `client` (Client): Complete client object with id

**Returns**: `Promise<Client>`

**Example**:
```typescript
const updated = await api.updateClient({
  id: 'cli-12345678',
  name: 'Updated Name',
  // ... other fields
});
```

---

### `api.deleteClient(clientId: string)`
Delete a client.

**Parameters**:
- `clientId` (string): Client ID

**Returns**: `Promise<void>`

**Example**:
```typescript
await api.deleteClient('cli-12345678');
```

---

## 🎫 Ticket Methods

### `api.getTickets()`
Get all tickets.

**Returns**: `Promise<Ticket[]>`

**Example**:
```typescript
const tickets = await api.getTickets();
```

---

### `api.getTicket(ticketId: string)`
Get a single ticket by ID.

**Parameters**:
- `ticketId` (string): Ticket ID

**Returns**: `Promise<Ticket>`

**Example**:
```typescript
const ticket = await api.getTicket('tkt-12345678');
```

---

### `api.getTicketsByClientId(clientId: string)`
Get all tickets for a specific client.

**Parameters**:
- `clientId` (string): Client ID

**Returns**: `Promise<Ticket[]>`

**Example**:
```typescript
const clientTickets = await api.getTicketsByClientId('cli-12345678');
```

---

### `api.addTicket(ticket: Omit<Ticket, 'id' | 'createdDate'>)`
Create a new ticket.

**Parameters**:
- `ticket` (object): Ticket data (without id and createdDate)

**Returns**: `Promise<Ticket>`

**Example**:
```typescript
const newTicket = await api.addTicket({
  clientId: 'cli-12345678',
  title: 'Support Request',
  description: 'Need help with...',
  status: 'Open',
});
```

---

### `api.updateTicket(ticket: Ticket)`
Update an existing ticket.

**Parameters**:
- `ticket` (Ticket): Complete ticket object with id

**Returns**: `Promise<Ticket>`

**Example**:
```typescript
const updated = await api.updateTicket({
  id: 'tkt-12345678',
  status: 'Resolved',
  // ... other fields
});
```

---

### `api.deleteTicket(ticketId: string)`
Delete a ticket.

**Parameters**:
- `ticketId` (string): Ticket ID

**Returns**: `Promise<void>`

**Example**:
```typescript
await api.deleteTicket('tkt-12345678');
```

---

## 💻 Asset Methods

### `api.getAssets()`
Get all assets.

**Returns**: `Promise<Asset[]>`

**Example**:
```typescript
const assets = await api.getAssets();
```

---

### `api.getAsset(assetId: string)`
Get a single asset by ID.

**Parameters**:
- `assetId` (string): Asset ID

**Returns**: `Promise<Asset>`

**Example**:
```typescript
const asset = await api.getAsset('ast-12345678');
```

---

### `api.getAssetsByClientId(clientId: string)`
Get all assets for a specific client.

**Parameters**:
- `clientId` (string): Client ID

**Returns**: `Promise<Asset[]>`

**Example**:
```typescript
const clientAssets = await api.getAssetsByClientId('cli-12345678');
```

---

### `api.addAsset(asset: Omit<Asset, 'id'>)`
Create a new asset.

**Parameters**:
- `asset` (object): Asset data (without id)

**Returns**: `Promise<Asset>`

**Example**:
```typescript
const newAsset = await api.addAsset({
  clientId: 'cli-12345678',
  name: 'Laptop',
  type: 'Hardware',
  purchaseDate: '2024-01-01',
  warrantyEndDate: '2025-01-01',
});
```

---

### `api.updateAsset(asset: Asset)`
Update an existing asset.

**Parameters**:
- `asset` (Asset): Complete asset object with id

**Returns**: `Promise<Asset>`

**Example**:
```typescript
const updated = await api.updateAsset({
  id: 'ast-12345678',
  name: 'Updated Name',
  // ... other fields
});
```

---

### `api.deleteAsset(assetId: string)`
Delete an asset.

**Parameters**:
- `assetId` (string): Asset ID

**Returns**: `Promise<void>`

**Example**:
```typescript
await api.deleteAsset('ast-12345678');
```

---

## 🔐 Authentication Methods

Authentication is handled separately via `authService`:

```typescript
import { authService } from '../services/auth';
```

### Available Methods

- `authService.login(credentials)` - Login user
- `authService.getCurrentUser()` - Get current user info
- `authService.isAuthenticated()` - Check if user is logged in
- `authService.logout()` - Logout user

---

## 📝 Type Definitions

All types are defined in `types.ts`:

```typescript
import { Client, Ticket, Asset } from '../types';
```

### Client Interface
```typescript
interface Client {
  id: string;
  name: string;
  email: string;
  contactPerson: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  joinDate: string; // ISO date string
  // ... other fields
}
```

### Ticket Interface
```typescript
interface Ticket {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: TicketStatus; // 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  createdDate: string; // ISO datetime string
  resolvedDate?: string; // ISO datetime string
  // ... other fields
}
```

### Asset Interface
```typescript
interface Asset {
  id: string;
  clientId: string;
  name: string;
  type: AssetType; // 'Hardware' | 'Software' | 'Service'
  purchaseDate: string; // ISO date string
  warrantyEndDate: string; // ISO date string
  notes?: string;
  // ... other fields
}
```

---

## ⚠️ Error Handling

All API methods throw errors that should be caught:

```typescript
try {
  const clients = await api.getClients();
} catch (error) {
  if (error instanceof Error) {
    // Handle error
    console.error(error.message);
    // Show user-friendly message
  }
}
```

### Common Errors

- **401 Unauthorized**: User not authenticated or token expired
- **404 Not Found**: Resource doesn't exist
- **Network Error**: Backend not reachable
- **Timeout**: Request took too long (>10 seconds)

---

## 🔄 Data Formatting

The API service automatically handles:
- **Date formatting**: Converts between frontend (YYYY-MM-DD) and backend formats
- **Authentication**: Automatically includes auth token in headers
- **Error responses**: Converts backend errors to user-friendly messages

---

**Last Updated**: November 15, 2025

