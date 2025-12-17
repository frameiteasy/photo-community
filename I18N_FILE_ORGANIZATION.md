# i18n File Organization

This document shows how translations are organized for maximum flexibility and scalability.

## Folder Structure

```
client/
├── src/
│   ├── i18n.ts                          ← i18n Configuration (CORE)
│   │
│   ├── locales/                         ← Translation Files (TRANSLATIONS)
│   │   ├── en.json                      ← English translations
│   │   └── pl.json                      ← Polish translations
│   │   └── [de.json]                    ← Future: German, French, etc.
│   │
│   ├── components/
│   │   └── common/
│   │       └── LanguageSwitcher.tsx     ← Language Toggle Button
│   │
│   └── pages/
│       ├── Home/
│       ├── Gallery/
│       ├── PhotoWalk/
│       ├── Blog/
│       ├── Messages/
│       └── Profile/
│           └── All use: const { t } = useTranslation();
```

## How It Works

### 1. Configuration (`src/i18n.ts`)

Initializes i18next with:

- Supported languages (en, pl)
- Translation files
- Auto-detect user language
- Persist language to localStorage

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "./locales/en.json";
import plTranslations from "./locales/pl.json";

i18n.init({
  resources: {
    en: { translation: enTranslations },
    pl: { translation: plTranslations },
  },
  // ... other config
});
```

### 2. Translation Files (`src/locales/*.json`)

JSON files organized by feature/namespace:

**en.json:**

```json
{
  "common": { ... },
  "navigation": { ... },
  "home": { ... },
  "gallery": { ... }
}
```

**pl.json:** Same structure, different language

### 3. Components Use Translations

```tsx
import { useTranslation } from "react-i18next";

export const Header = () => {
  const { t } = useTranslation();

  return <h1>{t("common.appName")}</h1>;
};
```

## Translation Key Hierarchy

```
namespace.key
   ↓         ↓
   |      Specific item
   |
   └─ Feature/Section
```

### Examples:

| Key               | Path                        | Value                |
| ----------------- | --------------------------- | -------------------- |
| `common.appName`  | en.json → common → appName  | "Photo Community"    |
| `gallery.title`   | pl.json → gallery → title   | "Galeria Fotografii" |
| `navigation.home` | en.json → navigation → home | "Home"               |

## Namespace Organization

Organized by **logical feature**, not by page:

```
common/              Apps-wide strings
├── appName
├── loading
├── save
├── delete
└── ...

navigation/          Menu & links
├── home
├── gallery
├── photoWalks
├── blog
├── messages
└── profile

home/                Home page
├── title
├── subtitle
├── viewGallery
└── ...

gallery/             Gallery pages
├── title
├── landscape
├── portrait
└── ...
```

## Adding New Features

### Step 1: Plan Translation Keys

```
myFeature/
├── title
├── description
├── button
└── ...
```

### Step 2: Add to Both Language Files

**en.json:**

```json
{
  "myFeature": {
    "title": "My Feature Title",
    "description": "Feature description",
    "button": "Click Me"
  }
}
```

**pl.json:**

```json
{
  "myFeature": {
    "title": "Tytuł Mojej Funkcji",
    "description": "Opis funkcji",
    "button": "Kliknij Mnie"
  }
}
```

### Step 3: Use in Component

```tsx
const { t } = useTranslation();

return (
  <div>
    <h2>{t("myFeature.title")}</h2>
    <p>{t("myFeature.description")}</p>
    <button>{t("myFeature.button")}</button>
  </div>
);
```

## Adding a New Language

### 1. Create Translation File

**src/locales/de.json**

```json
{
  "common": {
    "appName": "Fotografie-Gemeinschaft",
    ...
  },
  // ... all other namespaces
}
```

### 2. Update i18n Configuration

Edit `src/i18n.ts`:

```typescript
import deTranslations from "./locales/de.json";

i18n.init({
  resources: {
    en: { translation: enTranslations },
    pl: { translation: plTranslations },
    de: { translation: deTranslations }, // Add new language
  },
  // ...
});
```

### 3. (Optional) Update Language Switcher

Modify `src/components/common/LanguageSwitcher.tsx` to show more languages if desired.

## Best Practices

### ✅ DO

- **Consistent naming**: `page.section.element`
- **Organize by namespace**: Group related strings
- **Keep hierarchy shallow**: 2-3 levels max
- **Test both languages**: Before deploying
- **Use context**: Make keys self-documenting

```json
{
  "gallery": {
    "emptyState": "No categories available yet.",
    "categoryName": "Category: {{name}}"
  }
}
```

### ❌ DON'T

- Mix namespaces randomly
- Hardcode English/Polish anywhere
- Use special chars in keys: `my-key` ✗ use `my_key` or `myKey`
- Forget ANY language file
- Store translations in components

## File Size Consideration

Current setup:

- en.json: ~1.5 KB
- pl.json: ~1.5 KB
- i18n.ts: ~0.5 KB
- Overhead: ~30 KB (i18next library)

**Total impact: < 35 KB** ✅

For larger apps, consider lazy-loading languages.

## Scaling to Multiple Languages

### Current Approach (Simple)

- All translations in memory
- Good for 2-5 languages
- Load time: ~35 KB

### Future Approach (Scalable)

- Lazy-load translations per language
- Split translation files by namespace
- API integration for dynamic translations

## Automation Ideas

Future enhancements:

- [ ] Translation management UI
- [ ] Missing key detection
- [ ] Auto-sync with Crowdin/Lokalise
- [ ] Fallback language system
- [ ] Translation memory

## Resources

- **i18next** - https://www.i18next.com/
- **react-i18next** - https://react.i18next.com/
- **Browser Language Detector** - https://github.com/i18next/i18next-browser-languageDetector

## Summary

```
Translation Flow:

  Component → useTranslation() → t('key')
                   ↓
             i18n Configuration
                   ↓
         Load Appropriate Language File
                   ↓
           Return Translated Text
                   ↓
              Render in UI
```

**Result**: Flexible, scalable, production-ready i18n! 🚀
