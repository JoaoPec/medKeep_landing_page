/**
 * Interface representing a dictionary of translations across multiple languages.
 *
 * @interface LanguageDictionary
 * @description This interface defines a structure for storing text content in multiple languages.
 * It is used throughout the application for internationalization purposes, particularly
 * with the MultiLanguageColumn decorator for database entities.
 *
 * @property {string} en - English translation
 * @property {string} es - Spanish (Español) translation
 * @property {string} fr - French (Français) translation
 * @property {string} de - German (Deutsch) translation
 * @property {string} pt - Portuguese (Português) translation
 * @property {string} hi - Hindi (हिन्दी) translation
 * @property {string} id - Indonesian (Bahasa Indonesia) translation
 * @property {string} it - Italian (Italiano) translation
 * @property {string} ru - Russian (Русский) translation
 * @property {string} zh - Chinese (中文) translation
 */
export interface LanguageDictionary {
  en: string; // English
  es: string; // Spanish (Español)
  fr: string; // French (Français)
  de: string; // German (Deutsch)
  pt: string; // Portuguese (Português)
  hi: string; // Hindi (हिन्दी)
  id: string; // Indonesian (Bahasa Indonesia)
  it: string; // Italian (Italiano)
  ru: string; // Russian (Русский)
  zh: string; // Chinese (中文)
}
