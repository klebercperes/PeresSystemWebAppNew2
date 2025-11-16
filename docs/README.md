# Frontend Documentation

This directory contains documentation for the Peres Systems frontend codebase.

## 📚 Documentation Files

### [AI Assistant Guide](./AI_ASSISTANT_GUIDE.md)
**Essential reading for AI assistants (Gemini, etc.)**

Complete guide on:
- Architecture and code structure
- How to use the API layer correctly
- Rules for making changes without breaking things
- Best practices and patterns

👉 **Start here if you're an AI assistant helping with frontend development**

---

### [API Reference](./API_REFERENCE.md)
**Complete API method reference**

Documentation for all available API methods:
- Client methods
- Ticket methods  
- Asset methods
- Authentication methods
- Type definitions
- Error handling

👉 **Use this as a reference when working with the API**

---

## 🎯 Quick Start for AI Assistants

1. **Read [AI Assistant Guide](./AI_ASSISTANT_GUIDE.md)** first
2. **Check [API Reference](./API_REFERENCE.md)** for available methods
3. **Always use `api` object** from `services/api.ts`
4. **Never make direct `fetch()` calls** in components
5. **Follow existing patterns** in the codebase

---

## 🔑 Key Principles

1. **API Layer Abstraction**: All backend calls go through `services/api.ts`
2. **Type Safety**: Use TypeScript types from `types.ts`
3. **Error Handling**: Always handle errors gracefully
4. **Consistency**: Follow existing patterns and naming conventions

---

**Questions?** Refer to the guides above or check the code comments in `services/api.ts`.

