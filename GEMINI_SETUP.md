# Gemini/Google Studio Setup Instructions

This guide helps you configure Gemini (Google Studio) to work effectively with the Peres Systems frontend codebase.

## ✅ Current Status

- ✅ GitHub repository is accessible to Google Studio
- ✅ API layer is properly structured in `services/api.ts`
- ✅ Comprehensive documentation created in `docs/` folder
- ✅ Code is organized and AI-friendly

---

## 🤖 How to Use Gemini with This Codebase

### Option 1: Direct File Reference (Recommended)

When asking Gemini to help with frontend improvements, reference the documentation:

**Example Prompt:**
```
I need help improving the frontend. Please read:
1. docs/AI_ASSISTANT_GUIDE.md - for architecture and rules
2. docs/API_REFERENCE.md - for available API methods
3. services/api.ts - the API service file

Then help me [your task here], following the patterns in those files.
```

### Option 2: Context Window

If Gemini has access to the full repository:

**Example Prompt:**
```
I'm working on the Peres Systems frontend. The codebase follows these rules:
- All API calls go through services/api.ts
- Components never make direct fetch() calls
- TypeScript types are in types.ts

Help me [your task], ensuring you:
1. Use the api object from services/api.ts
2. Follow existing patterns
3. Don't break the API abstraction layer
```

---

## 📋 Quick Reference for Gemini Prompts

### Adding a New Feature

```
I want to add [feature description]. Please:
1. Check docs/AI_ASSISTANT_GUIDE.md for architecture rules
2. Review services/api.ts to see existing patterns
3. Add new API methods if needed (following the pattern)
4. Create/update components using the api object
5. Ensure TypeScript types are added to types.ts
```

### Fixing a Bug

```
There's a bug in [component/feature]. Please:
1. Check if it's using services/api.ts correctly
2. Verify error handling is in place
3. Ensure TypeScript types match
4. Fix following the patterns in docs/AI_ASSISTANT_GUIDE.md
```

### Refactoring

```
I want to refactor [component/feature]. Please:
1. Read docs/AI_ASSISTANT_GUIDE.md first
2. Ensure all API calls go through services/api.ts
3. Maintain the existing API abstraction layer
4. Update types.ts if needed
```

---

## 🔑 Key Points to Emphasize to Gemini

1. **API Layer is Sacred**: Never bypass `services/api.ts`
2. **Type Safety**: Always use types from `types.ts`
3. **Pattern Consistency**: Follow existing naming and structure
4. **Error Handling**: Always handle errors gracefully
5. **Documentation First**: Check docs before making changes

---

## 📁 Important Files for Gemini to Know

### Core Files (Must Understand)
- `services/api.ts` - ALL API calls
- `services/auth.ts` - Authentication
- `types.ts` - TypeScript definitions
- `App.tsx` - Main application

### Documentation (Must Read)
- `docs/AI_ASSISTANT_GUIDE.md` - Architecture guide
- `docs/API_REFERENCE.md` - API method reference
- `docs/README.md` - Documentation index

### Components (Examples)
- `components/ClientManager.tsx` - Example component using API
- `components/TicketManager.tsx` - Example component using API
- `components/UserManager.tsx` - Example component using API

---

## 🚨 Common Mistakes to Avoid

### ❌ Wrong Way
```typescript
// In a component - DON'T DO THIS!
const response = await fetch('/api/clients');
const clients = await response.json();
```

### ✅ Correct Way
```typescript
// In a component - DO THIS!
import { api } from '../services/api';
const clients = await api.getClients();
```

---

## 🎯 Best Practice Prompts

### For New Features
```
Add [feature] following the architecture in docs/AI_ASSISTANT_GUIDE.md.
Use the api object from services/api.ts and follow existing patterns.
```

### For Bug Fixes
```
Fix [bug] in [component]. Ensure it uses services/api.ts correctly
and follows the patterns documented in docs/AI_ASSISTANT_GUIDE.md.
```

### For Code Review
```
Review [file/component] to ensure it:
1. Uses services/api.ts (not direct fetch calls)
2. Follows TypeScript types from types.ts
3. Matches patterns in docs/AI_ASSISTANT_GUIDE.md
```

---

## 📝 Example: Adding a New Resource Type

**Your Prompt to Gemini:**
```
I want to add a new "Projects" resource. Please:
1. Read docs/AI_ASSISTANT_GUIDE.md to understand the architecture
2. Add Project interface to types.ts
3. Add project methods to services/api.ts (following the pattern)
4. Create a ProjectManager component (similar to ClientManager.tsx)
5. Update App.tsx to include the new view
```

**What Gemini Should Do:**
1. ✅ Read the documentation
2. ✅ Add `Project` interface to `types.ts`
3. ✅ Add `api.getProjects()`, `api.addProject()`, etc. to `services/api.ts`
4. ✅ Create component using `api` object (not direct fetch)
5. ✅ Follow existing component patterns

---

## 🔄 Keeping Code Safe During Updates

### Before Making Changes
1. ✅ Read `docs/AI_ASSISTANT_GUIDE.md`
2. ✅ Check `services/api.ts` for existing methods
3. ✅ Review similar components for patterns

### During Development
1. ✅ Always use `api` object
2. ✅ Use TypeScript types
3. ✅ Handle errors
4. ✅ Test locally first

### After Changes
1. ✅ Verify no direct `fetch()` calls in components
2. ✅ Check TypeScript types match
3. ✅ Test API calls work correctly
4. ✅ Follow deployment workflow

---

## 📚 Documentation Location

All documentation is in the `docs/` folder:
- `docs/README.md` - Documentation index
- `docs/AI_ASSISTANT_GUIDE.md` - Main guide for AI assistants
- `docs/API_REFERENCE.md` - Complete API reference

**GitHub Location**: `https://github.com/klebercperes/PeresSystemWebAppNew2/tree/main/docs`

---

## ✅ Checklist for Gemini-Assisted Development

- [ ] Read `docs/AI_ASSISTANT_GUIDE.md`
- [ ] Check `services/api.ts` for existing methods
- [ ] Use `api` object (never direct `fetch()`)
- [ ] Add/update types in `types.ts`
- [ ] Follow existing component patterns
- [ ] Handle errors gracefully
- [ ] Test locally before pushing
- [ ] Verify no breaking changes to API layer

---

**Last Updated**: November 15, 2025

