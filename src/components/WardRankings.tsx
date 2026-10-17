import React, { useState } from 'react';
import { Lang, translations } from '../lib/i18n';
import { WardInfo } from '../types';
import { Award, Search, TrendingUp, ThumbsUp, AlertCircle } from 'lucide-react';

interface WardRankingsProps {
  wards: WardInfo[];
  lang: Lang;
  onSelectWard: (wardNo: number) => void;
}

export const WardRankings: React.FC<WardRankingsProps> = ({
  wards,
  lang,
  onSelectWard,
}) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [votedWards, setVotedWards] = useState<Record<number, boolean>>({});

  const filteredWards = wards.filter(
    (w) =>
      `ward ${w.ward_no}`.includes(searchTerm.toLowerCase()) ||
      w.councillor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.priority_issue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVote = (wardNo: number) => {
    setVotedWards((prev) => ({ ...prev, [wardNo]: true }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Intro Banner */}
      <div className="bg-[#1a1410] text-white p-6 rounded-xl border border-[#3f3b37] shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#c8102e] text-[11px] font-bold uppercase tracking-wider text-white mb-2">
            <Award className="w-3.5 h-3.5" />
            Civic Transparency Leaderboard
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {t.ward_title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed">
            {t.ward_sub} Scores are computed from real resolution speed, citizen spot confirmations, and unresolved grievance backlogs.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ward number or councillor..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#ded9cf] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#c8102e]"
          />
        </div>
        <span className="text-xs text-stone-500 font-semibold">
          {filteredWards.length} Wards Tracked
        </span>
      </div>

      {/* Rankings Table */}
      <div className="bg-white rounded-xl border border-[#ded9cf] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#fbf9f5] border-b border-[#ded9cf] text-[#78716c] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">{t.ward_col_rank}</th>
                <th className="py-3 px-4">{t.ward_col_ward}</th>
                <th className="py-3 px-4">{t.ward_col_councillor}</th>
                <th className="py-3 px-4 text-center">{t.ward_col_open}</th>
                <th className="py-3 px-4 text-center">{t.ward_col_resolved}</th>
                <th className="py-3 px-4">{t.ward_col_score}</th>
                <th className="py-3 px-4">{t.ward_col_priority}</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece5]">
              {filteredWards.map((ward) => {
                const isTop3 = ward.rank <= 3;
                return (
                  <tr
                    key={ward.ward_no}
                    className="hover:bg-[#faf8f5] transition-colors"
                  >
                    <td className="py-3 px-4 font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          ward.rank === 1
                            ? 'bg-amber-400 text-stone-900 font-extrabold shadow-xs'
                            : ward.rank === 2
                            ? 'bg-stone-300 text-stone-900 font-bold'
                            : ward.rank === 3
                            ? 'bg-amber-700/30 text-amber-900 font-bold'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {ward.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#1a1410]">
                      Ward {ward.ward_no}
                      <span className="block text-[11px] font-normal text-stone-500">
                        {ward.local_body}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-700">
                      {ward.councillor_name}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-red-600">
                      {ward.open_reports}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-600">
                      {ward.resolved_reports}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-stone-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              ward.score >= 80 ? 'bg-emerald-500' : ward.score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${ward.score}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-[#1a1410]">{ward.score}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-600">
                      <span className="inline-block bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                        {ward.priority_issue}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleVote(ward.ward_no)}
                        disabled={votedWards[ward.ward_no]}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all inline-flex items-center gap-1 ${
                          votedWards[ward.ward_no]
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                            : 'border-stone-300 hover:border-stone-400 bg-white text-stone-700'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{votedWards[ward.ward_no] ? 'Voted' : 'Vote Fix'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
