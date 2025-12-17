# Internationalization (i18n) Setup Guide

Your Photo Community app now supports **English and Polish** with a flexible, scalable system!

## How It Works

### Architecture

```
src/
├── i18n.ts                 # i18n configuration
├── locales/
│   ├── en.json            # English translations
│   └── pl.json            # Polish translations
├── components/
│   └── common/
│       └── LanguageSwitcher.tsx  # Language toggle button
└── pages/                 # All pages use translations
```

### Technologies Used

- **i18next**: Industry-standard i18n framework
- **react-i18next**: React integration
- **i18next-browser-languagedetector**: Auto-detect user's language preference
- **localStorage**: Persists language choice across sessions

## Using Translations in Your Code

### In React Components (TSX)

```tsx
import { useTranslation } from "react-i18next";

export const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("common.appName")}</h1>
      <p>{t("home.title")}</p>
      <button>{t("common.save")}</button>
    </div>
  );
};
```

### The `t()` function

- Takes a translation key like `'namespace.key'`
- Returns translated text based on current language
- Automatically reactive: component re-renders when language changes

## Translation File Structure

Translation files are organized by feature/section:

**en.json:**

```json
{
  "common": {
    "appName": "Photo Community",
    "save": "Save",
    "delete": "Delete"
  },
  "home": {
    "title": "Welcome to Photo Community",
    "subtitle": "A private space..."
  },
  "gallery": {
    "title": "Photo Gallery",
    "landscape": "Landscape"
  }
}
```

**pl.json** (same structure, different language):

```json
{
  "common": {
    "appName": "Społeczność Fotografów",
    "save": "Zapisz",
    "delete": "Usuń"
  },
  "home": {
    "title": "Witaj w Społeczności Fotografów",
    "subtitle": "Prywatna przestrzeń..."
  },
  "gallery": {
    "title": "Galeria Fotografii",
    "landscape": "Pejzaż"
  }
}
```

## Adding New Translations

### Step 1: Add to Both Language Files

**src/locales/en.json:**

```json
{
  "myFeature": {
    "greeting": "Hello!",
    "farewell": "Goodbye!"
  }
}
```

**src/locales/pl.json:**

```json
{
  "myFeature": {
    "greeting": "Cześć!",
    "farewell": "Do widzenia!"
  }
}
```

### Step 2: Use in Your Component

```tsx
import { useTranslation } from "react-i18next";

export const MyFeature = () => {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("myFeature.greeting")}</h1>
      <p>{t("myFeature.farewell")}</p>
    </>
  );
};
```

## Adding a New Language (e.g., German)

### Step 1: Create Translation File

Create `src/locales/de.json`:

```json
{
  "common": {
    "appName": "Fotografie-Gemeinschaft"
    // ... all other translations
  }
}
```

### Step 2: Update Configuration

Edit `src/i18n.ts`:

```typescript
import deTranslations from "./locales/de.json";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  resources: {
    en: { translation: enTranslations },
    pl: { translation: plTranslations },
    de: { translation: deTranslations }, // Add this
  },
  // ...
});
```

### Step 3: Update Language Switcher (Optional)

Modify `src/components/common/LanguageSwitcher.tsx` to show all languages:

```tsx
const languages = [
  { code: "en", name: "English" },
  { code: "pl", name: "Polski" },
  { code: "de", name: "Deutsch" },
];

// Then create a dropdown or button for each language
```

## Language Detection

The app automatically detects the user's language preference in this order:

1. **localStorage** - Previously selected language (persistent)
2. **Navigator** - Browser's language setting (first visit)
3. **Fallback** - English (if language not supported)

Users can manually switch using the language button in the header (**EN** or **PL**).

## Language Switcher Component

Located at: `src/components/common/LanguageSwitcher.tsx`

Features:

- Shows current language code (EN/PL)
- Toggles between English and Polish
- Changes persist across sessions
- Simple, clean button design

### Using It in Components

```tsx
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

export const MyComponent = () => {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
};
```

The language switcher is already included in your **Header** component.

## Current Translations

### Namespaces (Sections)

- **common** - App-wide strings (loading, save, delete, etc.)
- **navigation** - Menu items
- **home** - Home page content
- **gallery** - Gallery page content
- **photoWalks** - Photo walks page content
- **blog** - Blog page content
- **messages** - Messages page content
- **profile** - Profile page content

### Adding Translations to Existing Namespaces

1. Find the namespace in `src/locales/en.json`
2. Add your key-value pair
3. Add the same key to `src/locales/pl.json`
4. Use `t('namespace.key')` in your component

## Best Practices

### ✅ Do

- Keep translation keys consistent across files
- Use lowercase with dots for hierarchy: `page.section.text`
- Keep translations close to component usage
- Add new translations to ALL language files
- Test in both languages after adding translations

### ❌ Don't

- Hardcode text in components
- Use special characters in translation keys
- Forget to update all language files when adding a key
- Store translations in components
- Use HTML in translations (unless using interpolation)

## Performance Tips

- Translations are cached at startup
- Language switching is fast (no reload needed)
- Only JSON files are loaded (minimal overhead)
- Consider lazy-loading translations for large apps (future enhancement)

## Troubleshooting

### Missing Translation

If you see a key like `home.myKey` instead of translated text:

- Check that the key exists in both en.json and pl.json
- Verify you're using the correct namespace

### Language Not Changing

- Check browser's localStorage for i18nextLng key
- Verify language code is correct (en, pl)
- Clear cache/localStorage and try again

### TypeScript Errors

Add type definitions (optional, for type safety):

```typescript
import { useTranslation } from "react-i18next";

export const MyComponent = () => {
  const { t } = useTranslation<"translation">();
  // Now t() has full autocomplete support
};
```

## Next Steps

1. ✅ All existing pages updated with translations
2. When building new features:

   - Add translations to locales first
   - Use `t()` in components
   - Test in both languages

3. Consider adding:
   - More languages (German, French, etc.)
   - Language switcher as a page (settings)
   - Right-to-left (RTL) language support
   - Professional translation service integration

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Guide](https://react.i18next.com/)
- [Translation Best Practices](https://www.i18next.com/guides/the-translation-function)
