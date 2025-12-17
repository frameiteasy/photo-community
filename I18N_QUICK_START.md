# i18n Quick Start

Your Photo Community now supports **English and Polish**! 🌍

## How to Use

### For Users

- Click the **EN/PL** button in the top-right header to switch languages
- Your choice is saved automatically in your browser

### For Developers

#### In Components

```tsx
import { useTranslation } from "react-i18next";

export const MyComponent = () => {
  const { t } = useTranslation();

  return <h1>{t("namespace.key")}</h1>;
};
```

#### Translation Keys Structure

```
namespace.key
   ↓        ↓
   |    The actual text
   |
   └─ Logical grouping (common, home, gallery, etc.)
```

### Examples

| Use Case    | Code                                             |
| ----------- | ------------------------------------------------ |
| App name    | `t('common.appName')` → "Photo Community"        |
| Page title  | `t('home.title')` → "Welcome to Photo Community" |
| Button text | `t('common.save')` → "Save"                      |
| Navigation  | `t('navigation.gallery')` → "Gallery"            |

## Adding New Translations

### 1️⃣ Add to `src/locales/en.json`

```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my feature"
  }
}
```

### 2️⃣ Add to `src/locales/pl.json` (same structure, Polish text)

```json
{
  "myFeature": {
    "title": "Moja Funkcja",
    "description": "To jest moja funkcja"
  }
}
```

### 3️⃣ Use in your component

```tsx
const { t } = useTranslation();
return <h1>{t("myFeature.title")}</h1>;
```

## Current Namespaces

- **common** - App-wide strings
- **navigation** - Menu items
- **home** - Home page
- **gallery** - Gallery page
- **photoWalks** - Photo walks
- **blog** - Blog
- **messages** - Messages
- **profile** - Profile

## Adding Another Language

### Example: Add German (Deutsch)

1. **Create** `src/locales/de.json` with all translations
2. **Update** `src/i18n.ts`:

   ```typescript
   import deTranslations from './locales/de.json';

   resources: {
     en: { translation: enTranslations },
     pl: { translation: plTranslations },
     de: { translation: deTranslations },  // Add this
   }
   ```

## Where Files Are

```
client/
├── src/
│   ├── i18n.ts                 ← Configuration
│   ├── locales/
│   │   ├── en.json             ← English
│   │   └── pl.json             ← Polish
│   └── components/common/
│       └── LanguageSwitcher.tsx ← Language toggle
```

## Tips

✅ **Always** add translations to ALL language files
✅ **Test** in both languages after adding text
✅ **Use consistent** key names (lowercase, dots for hierarchy)
✅ **Keep** translations close to where they're used

❌ **Never** hardcode text in components
❌ **Don't** forget to update all language files
❌ **Avoid** HTML in translations (unless necessary)

## Docs

- Full guide: `/I18N_GUIDE.md`
- All translations: `src/locales/`
- Configuration: `src/i18n.ts`

---

**That's it!** 🎉 Your app now speaks English and Polish!
