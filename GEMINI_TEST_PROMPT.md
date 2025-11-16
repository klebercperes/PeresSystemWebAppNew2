# Gemini Test Prompt - First Interaction

Use this prompt when testing Gemini with the Peres Systems frontend codebase for the first time.

---

## 🧪 Test Prompt (Copy & Paste This)

```
I'm working on the Peres Systems frontend codebase and need your help. This is my first time using you with this project, so please follow these instructions carefully.

## Step 1: Read the Documentation

Please read and understand these documentation files from the repository:

1. **docs/AI_ASSISTANT_GUIDE.md** - This is the MAIN guide. It explains:
   - The architecture and code structure
   - Critical rules (especially about the API layer)
   - How to make changes without breaking things
   - Best practices and patterns

2. **docs/API_REFERENCE.md** - Complete reference for:
   - All available API methods
   - TypeScript type definitions
   - Error handling examples
   - How to use each method

3. **docs/README.md** - Documentation index and quick start

4. **GEMINI_SETUP.md** - Setup instructions and example prompts

## Step 2: Understand the Architecture

Key points you MUST understand:

1. **API Layer Abstraction**: 
   - ALL backend communication goes through `services/api.ts`
   - Components MUST NEVER make direct `fetch()` calls
   - This is critical to prevent breaking changes

2. **File Structure**:
   - `services/api.ts` - ALL API calls (the only file that talks to backend)
   - `services/auth.ts` - Authentication only
   - `types.ts` - TypeScript type definitions
   - `components/` - UI components (use api object, no direct fetch)
   - `pages/` - Page components (use api object, no direct fetch)

3. **Pattern to Follow**:
   ```
   Component → services/api.ts → Backend API → Database
   ```

## Step 3: Test Task

After reading the documentation, please help me with this simple test:

**Task**: Review the `components/ClientManager.tsx` file and verify it follows the architecture rules:
1. Does it use the `api` object from `services/api.ts`?
2. Does it avoid direct `fetch()` calls?
3. Does it use TypeScript types from `types.ts`?
4. Does it handle errors properly?

Please provide:
- A brief analysis of the file
- Confirmation that it follows the rules
- Any suggestions for improvement (if needed)

## Step 4: Confirm Understanding

Before proceeding, please confirm you understand:
- ✅ The API layer must never be bypassed
- ✅ All components use `api` object from `services/api.ts`
- ✅ TypeScript types are in `types.ts`
- ✅ Error handling is important
- ✅ You'll follow existing patterns when making changes

## Important Notes

- The repository is at: `https://github.com/klebercperes/PeresSystemWebAppNew2`
- All documentation is in the `docs/` folder
- The main API service is in `services/api.ts`
- Never suggest or create code that bypasses the API layer

Please start by reading the documentation files listed above, then complete the test task.
```

---

## 📋 Alternative: Shorter Test Prompt

If you want a quicker test:

```
I need help with the Peres Systems frontend. Please:

1. Read docs/AI_ASSISTANT_GUIDE.md (main architecture guide)
2. Read docs/API_REFERENCE.md (API methods reference)
3. Review components/ClientManager.tsx and confirm it follows the rules

Key rule: ALL API calls must go through services/api.ts - never direct fetch() calls.

Please analyze ClientManager.tsx and confirm it's following the architecture correctly.
```

---

## 🎯 What to Expect from Gemini

After using this prompt, Gemini should:

1. ✅ **Acknowledge** it has read the documentation
2. ✅ **Confirm** understanding of the architecture
3. ✅ **Analyze** the test file correctly
4. ✅ **Identify** if the code follows the rules
5. ✅ **Provide** helpful feedback

---

## ✅ Success Indicators

A good response from Gemini will:
- Reference the documentation files
- Show understanding of the API layer abstraction
- Correctly identify that components use `api` object
- Confirm no direct `fetch()` calls exist
- Provide constructive feedback

---

## 🚨 Red Flags (If Gemini Doesn't Understand)

If Gemini:
- ❌ Suggests direct `fetch()` calls
- ❌ Doesn't mention `services/api.ts`
- ❌ Ignores the architecture rules
- ❌ Doesn't reference the documentation

Then you should:
1. Point it back to `docs/AI_ASSISTANT_GUIDE.md`
2. Emphasize the API layer rule
3. Ask it to re-read the documentation

---

## 📝 Next Steps After Testing

Once Gemini passes the test:

1. **Use it for real tasks** - Try adding features or fixing bugs
2. **Reference docs** - Always point to documentation in prompts
3. **Verify output** - Check that it follows the rules
4. **Provide feedback** - Correct Gemini if it suggests wrong patterns

---

## 🔄 Follow-up Prompts (After Initial Test)

Once Gemini understands the architecture, you can use prompts like:

```
Based on the architecture in docs/AI_ASSISTANT_GUIDE.md, help me:
[Your actual task here]

Remember to:
- Use api object from services/api.ts
- Follow patterns in existing components
- Add types to types.ts if needed
```

---

**Last Updated**: November 15, 2025


