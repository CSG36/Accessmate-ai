import React from 'react';
import { 
  Sliders, 
  Type, 
  Volume2, 
  Palette, 
  Languages, 
  Eye, 
  Check, 
  Sparkles,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { AccessibilityPreferences } from '../types';
import { SUPPORTED_LANGUAGES } from '../components/LanguageSelector';

interface SettingsProps {
  preferences: AccessibilityPreferences;
  onUpdatePreferences: (updated: Partial<AccessibilityPreferences>) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  preferences,
  onUpdatePreferences,
}) => {
  const fontSizes = [
    { label: 'Normal (100%)', value: 100 },
    { label: 'Large (125%)', value: 125 },
    { label: 'Extra Large (150%)', value: 150 },
    { label: 'Maximum (175%)', value: 175 },
  ];

  const themes = [
    {
      id: 'standard',
      name: 'Default Clean',
      desc: 'Soft slate and crisp accessible blues',
      bgClass: 'bg-slate-100 text-slate-900 border-slate-300',
    },
    {
      id: 'high-contrast-dark',
      name: 'High Contrast Dark',
      desc: 'Deep black with crisp white and bright borders',
      bgClass: 'bg-black text-white border-white',
    },
    {
      id: 'yellow-on-black',
      name: 'Yellow on Black',
      desc: 'Clinical low-vision contrast for cataracts & macula',
      bgClass: 'bg-black text-yellow-300 border-yellow-300',
    },
    {
      id: 'cream-comfort',
      name: 'Cream & Sepia',
      desc: 'Calm paper tone reducing digital glare and migraine',
      bgClass: 'bg-[#fbf7ee] text-slate-800 border-[#e5dfcf]',
    },
  ];

  const testSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'This is a sample of your selected voice speed in AccessMate AI.'
      );
      utterance.rate = preferences.textToSpeechSpeed;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported on this device.');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Accessibility & Copilot Preferences
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize typography, contrast modes, voice reading speeds, and language defaults
        </p>
      </div>

      {/* Visual Acuity: Font Size Scaling */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <Type className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Text Size Scaling</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Scale all text for low vision and easy reading</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              type="button"
              onClick={() => onUpdatePreferences({ fontSizeScale: size.value })}
              className={`p-3.5 rounded-2xl border-2 text-center transition-all ${
                preferences.fontSizeScale === size.value
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-bold text-indigo-900 dark:text-indigo-200'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="text-base font-bold">{size.value}%</div>
              <div className="text-xs text-slate-500">{size.label.split(' ')[0]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* High Contrast Themes */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Visual Contrast Modes</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Designed for low vision, light sensitivity, and color accessibility</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {themes.map((t) => {
            const isSelected = preferences.theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onUpdatePreferences({ theme: t.id as any })}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t.desc}</p>
                <div className={`p-2 rounded-lg text-xs font-mono border ${t.bgClass}`}>
                  Aa Sample Contrast
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dyslexia-Friendly Typography */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dyslexia-Friendly Font</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            Switches to enhanced letterform spacing and high-distinction characters (Lexend / Atkinson Hyperlegible) to reduce visual crowding.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onUpdatePreferences({ dyslexiaFont: !preferences.dyslexiaFont })}
          className={`w-14 h-8 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            preferences.dyslexiaFont ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
          }`}
          role="switch"
          aria-checked={preferences.dyslexiaFont}
          aria-label="Toggle dyslexia font"
        >
          <span
            className={`w-6 h-6 rounded-full bg-white block transition-transform absolute top-1 ${
              preferences.dyslexiaFont ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      {/* Voice & Speech Synthesis Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Text-to-Speech Pace & Voice</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Control speech speed for auditory comprehension</p>
            </div>
          </div>

          <button
            type="button"
            onClick={testSpeech}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Test Voice</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Slow (0.8x)</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
              Current: {preferences.textToSpeechSpeed}x
            </span>
            <span>Fast (1.5x)</span>
          </div>
          <input
            type="range"
            min="0.75"
            max="1.5"
            step="0.05"
            value={preferences.textToSpeechSpeed}
            onChange={(e) => onUpdatePreferences({ textToSpeechSpeed: parseFloat(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Auto-Read Aloud on Upload</div>
            <div className="text-xs text-slate-500">Automatically begin reading plain-English breakdown when document analysis finishes</div>
          </div>
          <button
            type="button"
            onClick={() => onUpdatePreferences({ autoReadAloud: !preferences.autoReadAloud })}
            className={`w-14 h-8 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              preferences.autoReadAloud ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            role="switch"
            aria-checked={preferences.autoReadAloud}
            aria-label="Toggle auto read aloud"
          >
            <span
              className={`w-6 h-6 rounded-full bg-white block transition-transform absolute top-1 ${
                preferences.autoReadAloud ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Default Target Language */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <Languages className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Default Target Language</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Primary language used for translations and explanations</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SUPPORTED_LANGUAGES.slice(0, 9).map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => onUpdatePreferences({ defaultLanguage: lang.name })}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                preferences.defaultLanguage.toLowerCase() === lang.name.toLowerCase()
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-bold text-indigo-900 dark:text-indigo-200'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.native}</span>
              </div>
              {preferences.defaultLanguage.toLowerCase() === lang.name.toLowerCase() && (
                <Check className="w-3.5 h-3.5 text-indigo-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
