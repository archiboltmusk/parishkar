import React from 'react';
import { Lang, translations } from '../lib/i18n';
import { Sun, Moon, AlertCircle, PlusCircle, MapPin, Award, Layers, BarChart3, FileText, CheckCircle2, Heart, Gamepad2 } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  daylight: boolean;
  onToggleDaylight: () => void;
  onOpenReport: () => void;
  pendingQueueCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  lang,
  onLangChange,
  daylight,
  onToggleDaylight,
  onOpenReport,
  pendingQueueCount,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-50 bg-[#fcfbf9]/95 backdrop-blur-md border-b border-[#e5e0d8] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onTabChange('map')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-8 h-8 rounded-full border-2 border-[#c8102e] flex items-center justify-center bg-white group-hover:scale-105 transition-transform shadow-xs">
              <span className="w-4 h-4 rounded-full border border-[#c8102e]/60 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8102e]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[#1a1410] font-sans">
                  {lang === 'bn' ? 'পরিষ্কার' : 'Parishkar'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#c8102e] text-white px-1.5 py-0.5 rounded-sm">
                  Bengal
                </span>
              </div>
              <p className="text-[10px] text-[#78716c] hidden sm:block font-medium">
                Public Civic Accountability
              </p>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            onClick={() => onTabChange('map')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'map'
                ? 'bg-[#1a1410] text-white'
                : 'text-[#57534e] hover:bg-[#eae5dd] hover:text-[#1a1410]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.nav_map}</span>
          </button>

          <button
            onClick={() => onTabChange('cases')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'cases'
                ? 'bg-[#1a1410] text-white'
                : 'text-[#57534e] hover:bg-[#eae5dd] hover:text-[#1a1410]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.nav_cases}</span>
          </button>

          <button
            onClick={() => onTabChange('wards')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'wards'
                ? 'bg-[#1a1410] text-white'
                : 'text-[#57534e] hover:bg-[#eae5dd] hover:text-[#1a1410]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{t.nav_wards}</span>
          </button>

          <button
            onClick={() => onTabChange('partner')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'partner'
                ? 'bg-[#1a1410] text-white'
                : 'text-[#57534e] hover:bg-[#eae5dd] hover:text-[#1a1410]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.nav_partner}</span>
          </button>

          <button
            onClick={() => onTabChange('insights')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'insights'
                ? 'bg-[#1a1410] text-white'
                : 'text-[#57534e] hover:bg-[#eae5dd] hover:text-[#1a1410]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t.nav_insights}</span>
          </button>

          <button
            onClick={() => onTabChange('communities')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'communities'
                ? 'bg-[#1a1410] text-white'
                : 'text-[#57534e] hover:bg-[#eae5dd] hover:text-[#1a1410]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#c8102e]" />
            <span>Adopt-a-Spot</span>
          </button>

          <button
            onClick={() => onTabChange('game')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'game'
                ? 'bg-amber-600 text-white shadow-xs font-bold'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100 hover:text-amber-900 border border-amber-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-bold">{t.nav_game}</span>
          </button>

          <button
            onClick={() => onTabChange('blueprint')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'blueprint'
                ? 'bg-[#1a1410] text-white'
                : 'text-[#57534e] hover:bg-[#eae5dd] hover:text-[#1a1410]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.nav_blueprint}</span>
          </button>
        </nav>

        {/* Actions & toggles */}
        <div className="flex items-center gap-2">
          {/* Offline queue indicator */}
          {pendingQueueCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[11px] font-semibold animate-pulse">
              <AlertCircle className="w-3 h-3 text-amber-700" />
              <span>{pendingQueueCount} queued</span>
            </div>
          )}

          {/* Language Switcher */}
          <div className="flex items-center border border-[#d6d0c4] rounded-md overflow-hidden bg-white">
            <button
              onClick={() => onLangChange('en')}
              className={`px-2 py-1 text-xs font-bold transition-colors ${
                lang === 'en' ? 'bg-[#c8102e] text-white' : 'text-[#57534e] hover:bg-[#f3eee7]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLangChange('bn')}
              className={`px-2 py-1 text-xs font-bold transition-colors ${
                lang === 'bn' ? 'bg-[#c8102e] text-white' : 'text-[#57534e] hover:bg-[#f3eee7]'
              }`}
            >
              বাং
            </button>
            <button
              onClick={() => onLangChange('hi')}
              className={`px-2 py-1 text-xs font-bold transition-colors ${
                lang === 'hi' ? 'bg-[#c8102e] text-white' : 'text-[#57534e] hover:bg-[#f3eee7]'
              }`}
            >
              हिं
            </button>
          </div>

          {/* Map style toggle */}
          <button
            onClick={onToggleDaylight}
            title={daylight ? 'Switch to dark map' : 'Switch to daylight map'}
            className="p-1.5 border border-[#d6d0c4] rounded-md text-[#57534e] hover:bg-[#eae5dd] transition-colors"
          >
            {daylight ? <Sun className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenReport}
            className="px-3 py-1.5 bg-[#c8102e] hover:bg-[#a60c25] text-white font-bold text-xs rounded-md shadow-xs flex items-center gap-1.5 transition-all transform active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.nav_report}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
