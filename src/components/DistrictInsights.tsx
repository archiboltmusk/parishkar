import React, { useState } from 'react';
import { Lang, translations } from '../lib/i18n';
import { DISTRICT_HEALTH_METRICS } from '../lib/data';
import { BarChart3, AlertTriangle, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';

interface DistrictInsightsProps {
  lang: Lang;
}

export const DistrictInsights: React.FC<DistrictInsightsProps> = ({ lang }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Puruliya');
  const [compareDistrict, setCompareDistrict] = useState<string>('Bankura');

  const districts = Object.keys(DISTRICT_HEALTH_METRICS);
  const dataA = DISTRICT_HEALTH_METRICS[selectedDistrict] || DISTRICT_HEALTH_METRICS['Puruliya'];
  const dataB = DISTRICT_HEALTH_METRICS[compareDistrict] || DISTRICT_HEALTH_METRICS['Bankura'];

  const metrics = [
    { key: 'child_anaemia', label: 'Children Anaemic (6–59 months)', unit: '%', higherIsBetter: false },
    { key: 'stunted', label: 'Children Stunted Under 5', unit: '%', higherIsBetter: false },
    { key: 'women_10yrs', label: 'Women with 10+ Years Schooling', unit: '%', higherIsBetter: true },
    { key: 'sanitation', label: 'Improved Sanitation Facility', unit: '%', higherIsBetter: true },
    { key: 'clean_fuel', label: 'Clean Fuel for Cooking', unit: '%', higherIsBetter: true },
    { key: 'inst_births', label: 'Institutional Births', unit: '%', higherIsBetter: true },
    { key: 'insurance', label: 'Health Insurance Coverage', unit: '%', higherIsBetter: true },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Headline */}
      <div className="bg-[#1a1410] text-white p-6 rounded-xl border border-[#3f3b37] shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#c8102e] text-[11px] font-bold uppercase tracking-wider text-white mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          Official Sourced Data (NFHS-5)
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          The Numbers That Demand Civic Accountability
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 mt-1.5 max-w-3xl leading-relaxed">
          From the Ministry of Health and Family Welfare NFHS-5 (2019–21) survey. Every district health, water, and sanitation metric is cited and cross-referenced with local civic governance.
        </p>
      </div>

      {/* Selectors */}
      <div className="bg-white p-4 rounded-xl border border-[#ded9cf] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700">Primary District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs font-bold p-2 border border-[#ded9cf] rounded bg-[#fbf9f5] focus:outline-hidden"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-stone-400 font-bold">vs</span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700">Compare With:</span>
            <select
              value={compareDistrict}
              onChange={(e) => setCompareDistrict(e.target.value)}
              className="text-xs font-bold p-2 border border-[#ded9cf] rounded bg-[#fbf9f5] focus:outline-hidden"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <a
          href="https://rchiips.org/nfhs/districtfactsheet_NFHS-5.shtml"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-[#c8102e] hover:underline flex items-center gap-1"
        >
          <span>NFHS-5 Survey Source Link</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m) => {
          const valA = (dataA as any)[m.key] as number;
          const valB = (dataB as any)[m.key] as number;
          const diff = valA - valB;
          const aIsBetter = m.higherIsBetter ? valA > valB : valA < valB;

          return (
            <div
              key={m.key}
              className="bg-white rounded-xl border border-[#ded9cf] p-4 shadow-xs space-y-3"
            >
              <h4 className="text-xs font-bold text-stone-800 line-clamp-1">
                {m.label}
              </h4>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#f0ece5]">
                <div className="p-2.5 rounded bg-[#fbf9f5] border border-[#e8e4dc]">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    {selectedDistrict}
                  </span>
                  <span className="text-lg font-extrabold text-[#1a1410]">
                    {valA}{m.unit}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#fbf9f5] border border-[#e8e4dc]">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    {compareDistrict}
                  </span>
                  <span className="text-lg font-extrabold text-stone-600">
                    {valB}{m.unit}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-stone-500 font-medium">Difference:</span>
                <span className={`font-bold ${aIsBetter ? 'text-emerald-700' : 'text-red-700'}`}>
                  {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}{m.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
