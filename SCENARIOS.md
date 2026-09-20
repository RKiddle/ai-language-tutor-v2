# Customizing Scenarios

This guide explains how to add, modify, or remove language scenarios.

## Understanding the Scenario Format

Each scenario is defined in `scenarios.js`:

```javascript
export const scenarios = {
  bangkok: {
    id: 'bangkok',                          // Unique identifier
    name: 'Bangkok Street Food',           // Display name
    emoji: '🇹🇭',                          // Flag emoji
    description: 'Order Pork & Sticky Rice', // Short description
    lang: 'th-TH',                          // Language code for speech recognition
    voiceLang: 'th-TH',                     // Language code for text-to-speech
    prompt: `You are a street food vendor...` // Instructions for Gemini
  }
};
```

---

## Adding a New Scenario

### Step 1: Add to `scenarios.js`

Edit `scenarios.js` and add your scenario:

```javascript
export const scenarios = {
  // ... existing scenarios ...
  
  newyork: {
    id: 'newyork',
    name: 'New York Pizza Parlor',
    emoji: '🇺🇸',
    description: 'Order a pepperoni pizza',
    lang: 'en-US',
    voiceLang: 'en-US',
    prompt: `You are a pizza shop owner in New York City. The user wants to practice English by ordering a pepperoni pizza.
Rules:
1. Only speak in English. Keep it brief and natural, like a real pizza shop owner.
2. Be casual and friendly.
3. If the user successfully orders a pepperoni pizza, reply with confirmation, price, and end your message with exactly "[SUCCESS]".`
  }
};
```

### Step 2: Add to HTML Dropdown

Edit `public/index.html` and find the `<select id="scenario-select">` element. Add your new option:

```html
<select id="scenario-select">
    <option value="">-- Select a scenario --</option>
    <option value="bangkok">🇹🇭 Bangkok Street Food (Order Pork & Sticky Rice)</option>
    <option value="tokyo">🇯🇵 Tokyo 7-11 (Order Hot Coffee)</option>
    <option value="madrid">🇪🇸 Madrid Taxi (Give an address)</option>
    <option value="paris">🇫🇷 Paris Restaurant (Order a meal & wine)</option>
    <option value="beijing">🇨🇳 Beijing Train Station (Buy a ticket)</option>
    <option value="berlin">🇩🇪 Berlin Hotel (Check in)</option>
    <option value="newyork">🇺🇸 New York Pizza (Order pizza)</option>  <!-- NEW -->
</select>
```

### Step 3: Test Locally

```bash
npm run dev
```

Then open `http://localhost:3000` and test your new scenario.

---

## Language Codes

Use these language codes for `lang` and `voiceLang`:

| Language | Code |
|----------|------|
| Thai | `th-TH` |
| Japanese | `ja-JP` |
| Spanish (Spain) | `es-ES` |
| Spanish (Mexico) | `es-MX` |
| French | `fr-FR` |
| Mandarin Chinese | `zh-CN` |
| German | `de-DE` |
| English (US) | `en-US` |
| English (UK) | `en-GB` |
| Portuguese | `pt-BR` |
| Italian | `it-IT` |
| Korean | `ko-KR` |

See [MDN: BCP 47 Language Tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) for more codes.

---

## Prompt Writing Tips

### Good Prompts

✅ **Clear role:** "You are a taxi driver in Madrid"
✅ **Clear task:** "The user wants to practice Spanish by..."
✅ **Clear success criteria:** "If the user successfully [ACTION], reply with [RESPONSE] and end with [SUCCESS]"
✅ **Language enforcement:** "Only speak in Spanish. Do not provide English translations."
✅ **Natural tone:** "Keep it brief and natural"

### Example

```javascript
prompt: `You are a waiter in a Paris bistro. The user is practicing French by ordering dinner.
Rules:
1. Only speak in French. No English translations.
2. Be polite and professional (formal French).
3. Ask clarifying questions if needed (e.g., "Which main course?").
4. If the user successfully orders BOTH a main course AND a drink, reply with the order summary, estimated wait time, and end your message with exactly "[SUCCESS]".`
```

### Things to Avoid

❌ **Ambiguous success criteria** — What counts as "success"?
❌ **Too strict** — Allow natural variations ("Can I get..." vs. "I would like...")
❌ **Too lenient** — Make users actually practice the language
❌ **English bleeding through** — Remind Gemini to stay in character

---

## Modifying Existing Scenarios

### Change the Difficulty

**Easy version:**
```javascript
prompt: `... If the user asks for coffee in any way (even partial, incorrect sentences), reply with [SUCCESS]...`
```

**Hard version:**
```javascript
prompt: `... If the user asks for a specific type of coffee (e.g., "iced coffee", "cappuccino"), reply with [SUCCESS]...`
```

### Change the Win Condition

**Current (Bangkok):**
> "If the user successfully asks for BOTH Grilled Pork and Sticky Rice..."

**Modified:**
> "If the user successfully asks for Grilled Pork, Sticky Rice, AND a drink..."

---

## Removing a Scenario

### Step 1: Remove from `scenarios.js`

Delete the entire scenario object:

```javascript
// DELETE THIS:
// bangkok: { ... }
```

### Step 2: Remove from HTML

Remove the `<option>` from `public/index.html`:

```html
<!-- DELETE THIS -->
<!-- <option value="bangkok">🇹🇭 Bangkok Street Food...</option> -->
```

### Step 3: Test

```bash
npm run dev
```

Verify the scenario no longer appears in the dropdown.

---

## Testing Your Scenario

### Local Testing Checklist

- [ ] Scenario appears in dropdown
- [ ] Clicking "Start" initializes the scenario
- [ ] AI responds in the correct language
- [ ] Text input works
- [ ] Microphone works (if supported)
- [ ] Completing the objective triggers `[SUCCESS]`
- [ ] Success message appears
- [ ] Can start a new scenario after completing one

### Debugging

If something doesn't work:

1. **Check browser console** (F12) for JavaScript errors
2. **Check network tab** to see API responses
3. **Verify language code** is correct for your scenario
4. **Test the prompt manually** at [Google AI Studio](https://aistudio.google.com)

---

## Advanced: Context-Aware Scenarios

### Multi-Part Scenarios

You can create scenarios that require multiple steps:

```javascript
prompt: `You are a hotel receptionist. The user is checking in.
Rules:
1. First, ask for their name.
2. Then, ask for their room preference.
3. If they provide both, reply with room assignment and end with [SUCCESS].`
```

### Scenario Variants

Create two versions of the same scenario:

```javascript
// Easy version
easy_paris: {
  id: 'easy_paris',
  name: 'Paris Restaurant (Easy)',
  prompt: `... If the user asks for ANY food and ANY drink, reply with [SUCCESS]...`
},

// Hard version
hard_paris: {
  id: 'hard_paris',
  name: 'Paris Restaurant (Expert)',
  prompt: `... If the user asks for a SPECIFIC dish by name AND a wine, reply with [SUCCESS]...`
}
```

---

## Community Contributions

Have a great new scenario? Contribute to the project!

1. **Fork** the repository
2. **Add your scenario** to `scenarios.js`
3. **Test** it thoroughly
4. **Submit a pull request** with description and testing notes
5. **Get merged** and credited in README.md!

---

## Reference: All Current Scenarios

| Scenario | Language | Task | Win Condition |
|----------|----------|------|---------------|
| Bangkok | Thai | Order pork & sticky rice | Both items requested |
| Tokyo | Japanese | Order hot coffee | Coffee requested politely |
| Madrid | Spanish | Give taxi destination | Destination provided |
| Paris | French | Order meal & drink | Both items ordered |
| Beijing | Mandarin | Buy train ticket | Destination + ticket request |
| Berlin | German | Check into hotel | Name provided + check-in request |

---

## Questions?

- Check `SETUP.md` for local development help
- Check `DEPLOYMENT.md` for deployment help
- Review `README.md` for project overview
- Open an issue on GitHub

Happy customizing! 🎉
