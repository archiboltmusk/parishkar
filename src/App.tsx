import React, { useState, useEffect } from 'react';
import { Lang } from './lib/i18n';
import { Report, WardInfo } from './types';
import { INITIAL_REPORTS, INITIAL_WARDS } from './lib/data';
import { supabase, STORAGE_KEYS } from './lib/supabase';
import { Header } from './components/Header';
import { MapExplorer } from './components/MapExplorer';
import { ReportModal } from './components/ReportModal';
import { CaseDetailModal } from './components/CaseDetailModal';
import { WardRankings } from './components/WardRankings';
import { PartnerWorkflow } from './components/PartnerWorkflow';
import { DistrictInsights } from './components/DistrictInsights';
import { BlueprintView } from './components/BlueprintView';
import { CommunitiesView } from './components/CommunitiesView';
import { PuruliaCivicGame } from './components/PuruliaCivicGame';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('map');
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG);
      if (saved === 'bn' || saved === 'hi' || saved === 'en') return saved;
    } catch {}
    return 'en';
  });

  const [daylight, setDaylight] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DAYLIGHT) !== '0';
    } catch {}
    return true;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_REPORTS;
  });

  const [wards, setWards] = useState<WardInfo[]>(INITIAL_WARDS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [pendingQueue, setPendingQueue] = useState<Partial<Report>[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Save to localStorage when reports change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    } catch {}
  }, [reports]);

  // Save daylight preference
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DAYLIGHT, daylight ? '1' : '0');
    } catch {}
  }, [daylight]);

  // Save language
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch {}
  }, [lang]);

  // Check URL hash on load for deep linking e.g. #report=REP-WB-2026-0891
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('report=')) {
      const id = hash.split('report=')[1]?.replace(/&.*/, '');
      if (id) {
        const found = reports.find((r) => r.id === id);
        if (found) {
          setSelectedReport(found);
        }
      }
    }
  }, [reports]);

  // Sync with Supabase backend when online
  useEffect(() => {
    async function syncSupabase() {
      try {
        const { data, error } = await (supabase.from('reports') as any).select('*').limit(100);
        if (!error && data && data.length > 0) {
          setReports((prev) => {
            const ids = new Set(prev.map((r) => r.id));
            const fresh = data.filter((item: any) => !ids.has(item.id));
            return [...fresh, ...prev];
          });
        }
      } catch {
        // Operates seamlessly offline on local storage
      }
    }
    syncSupabase();
  }, []);

  const handleCreateReport = (newRepData: Partial<Report>) => {
    const completeReport: Report = {
      id: newRepData.id || `REP-WB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: newRepData.created_at || new Date().toISOString(),
      lat: newRepData.lat || 23.3338,
      lng: newRepData.lng || 86.3654,
      category: newRepData.category || 'waste',
      severity: newRepData.severity || 'severe',
      status: 'open',
      description: newRepData.description || 'Civic defect reported on site',
      landmark: newRepData.landmark || 'Ward 4, Purulia',
      photo_url: newRepData.photo_url || 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80',
      ward_no: newRepData.ward_no || 4,
      local_body: newRepData.local_body || 'Purulia Municipality',
      area_kind: 'municipality',
      upvotes: 1,
      seen_on_site: 1,
      flags: 0,
      sla_days: newRepData.sla_days || 5,
      gps_verified: true,
    };

    setReports((prev) => [completeReport, ...prev]);
    setSelectedReport(completeReport);
  };

  const handleWitnessReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, seen_on_site: r.seen_on_site + 1 } : r
      )
    );
    if (selectedReport?.id === reportId) {
      setSelectedReport((prev) =>
        prev ? { ...prev, seen_on_site: prev.seen_on_site + 1 } : null
      );
    }
  };

  const handleClaimCleanup = (reportId: string, photoUrl: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'claimed',
              claim_id: `CLM-${Date.now().toString().slice(-4)}`,
              claim_photo_url: photoUrl,
              claim_created_at: new Date().toISOString(),
              claim_verify_count: 1,
              claim_dispute_count: 0,
            }
          : r
      )
    );
    if (selectedReport?.id === reportId) {
      setSelectedReport((prev) =>
        prev
          ? {
              ...prev,
              status: 'claimed',
              claim_photo_url: photoUrl,
              claim_verify_count: 1,
            }
          : null
      );
    }
  };

  const handleVerifyClaim = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        const newCount = (r.claim_verify_count || 0) + 1;
        const reachedQuorum = newCount >= 3;
        return {
          ...r,
          claim_verify_count: newCount,
          status: reachedQuorum ? 'resolved' : 'claimed',
          resolved_at: reachedQuorum ? new Date().toISOString() : r.resolved_at,
          resolved_photo_url: reachedQuorum ? r.claim_photo_url : r.resolved_photo_url,
          resolution_method: reachedQuorum ? 'Verified on spot by 3 independent resident witnesses' : undefined,
        };
      })
    );

    if (selectedReport?.id === reportId) {
      setSelectedReport((prev) => {
        if (!prev) return null;
        const newCount = (prev.claim_verify_count || 0) + 1;
        const reachedQuorum = newCount >= 3;
        return {
          ...prev,
          claim_verify_count: newCount,
          status: reachedQuorum ? 'resolved' : 'claimed',
          resolved_photo_url: reachedQuorum ? prev.claim_photo_url : prev.resolved_photo_url,
        };
      });
    }
  };

  const handleDisputeClaim = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'open',
              claim_photo_url: undefined,
              claim_verify_count: 0,
              claim_dispute_count: (r.claim_dispute_count || 0) + 1,
            }
          : r
      )
    );
    if (selectedReport?.id === reportId) {
      setSelectedReport((prev) =>
        prev
          ? {
              ...prev,
              status: 'open',
              claim_photo_url: undefined,
              claim_verify_count: 0,
            }
          : null
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9] text-[#1a1410]">
      {/* Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        lang={lang}
        onLangChange={setLang}
        daylight={daylight}
        onToggleDaylight={() => setDaylight(!daylight)}
        onOpenReport={() => setIsReportModalOpen(true)}
        pendingQueueCount={pendingQueue.length}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'map' && (
          <MapExplorer
            reports={reports}
            lang={lang}
            daylight={daylight}
            onSelectReport={(r) => setSelectedReport(r)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenGame={() => setCurrentTab('game')}
          />
        )}

        {currentTab === 'cases' && (
          <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
            <div className="bg-[#1a1410] text-white p-6 rounded-xl border border-[#3f3b37]">
              <h2 className="text-xl font-bold">Public Case Record Dossiers</h2>
              <p className="text-xs text-stone-300 mt-1">
                Every civic defect registered across West Bengal with immutable GPS proof, evidence photos, and resolution tracking.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className="bg-white border border-[#ded9cf] rounded-xl overflow-hidden hover:shadow-md cursor-pointer transition-all flex flex-col"
                >
                  <div className="relative aspect-16/9 bg-stone-100">
                    <img
                      src={rep.photo_url}
                      alt={rep.description}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 text-white">
                      {rep.id}
                    </span>
                    <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      rep.status === 'resolved'
                        ? 'bg-emerald-600 text-white'
                        : rep.status === 'claimed'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-xs text-[#1a1410] line-clamp-2">
                        {rep.description}
                      </h3>
                      <p className="text-[11px] text-[#78716c] mt-1">
                        📍 {rep.landmark} (Ward {rep.ward_no})
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#f0ece5] flex items-center justify-between text-[11px] text-stone-500">
                      <span>Target: {rep.sla_days}d</span>
                      <span className="text-[#c8102e] font-bold">View Case File →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'wards' && (
          <WardRankings
            wards={wards}
            lang={lang}
            onSelectWard={(wardNo) => {
              setCurrentTab('map');
            }}
          />
        )}

        {currentTab === 'partner' && <PartnerWorkflow lang={lang} />}

        {currentTab === 'insights' && <DistrictInsights lang={lang} />}

        {currentTab === 'communities' && <CommunitiesView lang={lang} />}

        {currentTab === 'game' && <PuruliaCivicGame lang={lang} />}

        {currentTab === 'blueprint' && <BlueprintView lang={lang} />}
      </main>

      {/* New Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleCreateReport}
        lang={lang}
      />

      {/* Case Details Modal */}
      <CaseDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        lang={lang}
        onWitness={handleWitnessReport}
        onClaimCleanup={handleClaimCleanup}
        onVerifyClaim={handleVerifyClaim}
        onDisputeClaim={handleDisputeClaim}
      />
    </div>
  );
}
