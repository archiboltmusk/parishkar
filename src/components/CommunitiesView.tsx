import React, { useState } from 'react';
import { Lang, translations } from '../lib/i18n';
import { Users, Heart, MapPin, CheckCircle2, Plus, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface CommunityGroup {
  id: string;
  name: string;
  focus: string;
  members: number;
  area: string;
  lead: string;
  contact: string;
  activeDrives: number;
}

interface AdoptedSpot {
  id: string;
  spotName: string;
  wardNo: number;
  adoptedBy: string;
  type: 'shop' | 'rwa' | 'school' | 'citizen';
  status: 'clean' | 'attention_needed';
  openIssuesWithin50m: number;
  pledgeDate: string;
}

export const CommunitiesView: React.FC<{ lang: Lang }> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'communities' | 'adopt'>('adopt');
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [spotName, setSpotName] = useState('');
  const [adoptedBy, setAdoptedBy] = useState('');
  const [wardNo, setWardNo] = useState(4);

  const [adoptedSpots, setAdoptedSpots] = useState<AdoptedSpot[]>([
    {
      id: 'ADP-01',
      spotName: 'Ward 4 Old Market Chowk Corner',
      wardNo: 4,
      adoptedBy: 'Purulia Traders Association',
      type: 'shop',
      status: 'clean',
      openIssuesWithin50m: 0,
      pledgeDate: '2026-09-15',
    },
    {
      id: 'ADP-02',
      spotName: 'Primary Health Centre Approach Gate',
      wardNo: 8,
      adoptedBy: 'Neighbourhood Resident Forum',
      type: 'rwa',
      status: 'attention_needed',
      openIssuesWithin50m: 1,
      pledgeDate: '2026-10-01',
    },
    {
      id: 'ADP-03',
      spotName: 'Station Road High School Perimeter',
      wardNo: 11,
      adoptedBy: 'Girls High School Eco Club',
      type: 'school',
      status: 'clean',
      openIssuesWithin50m: 0,
      pledgeDate: '2026-08-20',
    },
  ]);

  const [communityGroups, setCommunityGroups] = useState<CommunityGroup[]>([
    {
      id: 'GRP-01',
      name: 'Purulia Green Citizens Collective',
      focus: 'Plastic-free roads & public park sanitation',
      members: 48,
      area: 'Purulia Municipality (All Wards)',
      lead: 'Debasis Mukherjee',
      contact: '+91 94340 XXXXX',
      activeDrives: 14,
    },
    {
      id: 'GRP-02',
      name: 'Chhau Land Swachhata Warriors',
      focus: 'Market waste clearance & drain desilting awareness',
      members: 32,
      area: 'Ward 3, 4, 7 & Station Area',
      lead: 'Anjali Soren',
      contact: '+91 98321 XXXXX',
      activeDrives: 9,
    },
    {
      id: 'GRP-03',
      name: 'Youth Civic Force Bengal',
      focus: 'Pothole reporting & streetlight audits',
      members: 65,
      area: 'Purulia Sadar & Ranchi Road',
      lead: 'Sourav Mahato',
      contact: '+91 89000 XXXXX',
      activeDrives: 22,
    },
  ]);

  const handlePledgeAdopt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotName.trim() || !adoptedBy.trim()) return;

    const newSpot: AdoptedSpot = {
      id: `ADP-${Date.now().toString().slice(-2)}`,
      spotName,
      wardNo,
      adoptedBy,
      type: 'citizen',
      status: 'clean',
      openIssuesWithin50m: 0,
      pledgeDate: new Date().toISOString().split('T')[0],
    };

    setAdoptedSpots([newSpot, ...adoptedSpots]);
    setShowAdoptModal(false);
    setSpotName('');
    setAdoptedBy('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Banner */}
      <div className="bg-[#1a1410] text-white p-6 rounded-xl border border-[#3f3b37] shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#c8102e] text-[11px] font-bold uppercase tracking-wider text-white mb-2">
            <Heart className="w-3.5 h-3.5" />
            Citizen Community Action
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Adopt-a-Spot & Volunteer Communities
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed">
            Namma Kasa civic ethos: clean neighborhoods happen when residents, local shopkeepers, and youth take collective ownership of their streets.
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('adopt')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'adopt'
                ? 'bg-[#1a1410] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#c8102e]" />
            <span>Adopt-a-Spot Pledges ({adoptedSpots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('communities')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'communities'
                ? 'bg-[#1a1410] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Users className="w-4 h-4 text-[#c8102e]" />
            <span>Volunteer Groups ({communityGroups.length})</span>
          </button>
        </div>

        {activeTab === 'adopt' && (
          <button
            onClick={() => setShowAdoptModal(true)}
            className="px-3 py-1.5 bg-[#c8102e] hover:bg-[#a60c25] text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adopt a Spot</span>
          </button>
        )}
      </div>

      {/* Adopt-a-Spot Grid */}
      {activeTab === 'adopt' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adoptedSpots.map((spot) => (
            <div
              key={spot.id}
              className="bg-white rounded-xl border border-[#ded9cf] p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider block">
                    Ward {spot.wardNo}
                  </span>
                  <h4 className="font-extrabold text-sm text-[#1a1410] mt-0.5">
                    {spot.spotName}
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    spot.status === 'clean'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {spot.status === 'clean' ? '✓ Kept Clean' : '⚠️ Defect Nearby'}
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#fbf9f5] border border-[#e8e4dc] text-xs space-y-1">
                <p className="font-bold text-stone-800">
                  Care Pledged By: <span className="font-normal">{spot.adoptedBy}</span>
                </p>
                <p className="text-[11px] text-stone-500">
                  Open issues within 50m: <span className="font-bold text-stone-700">{spot.openIssuesWithin50m}</span>
                </p>
                <p className="text-[10px] text-stone-400">
                  Pledged on {spot.pledgeDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Volunteer Groups Grid */}
      {activeTab === 'communities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communityGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-xl border border-[#ded9cf] p-4 shadow-xs space-y-3"
            >
              <div>
                <h4 className="font-extrabold text-sm text-[#1a1410]">
                  {group.name}
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  {group.focus}
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#fbf9f5] border border-[#e8e4dc] text-xs space-y-1">
                <p className="text-stone-700">📍 <span className="font-semibold">Area:</span> {group.area}</p>
                <p className="text-stone-700">👤 <span className="font-semibold">Coordinator:</span> {group.lead}</p>
                <p className="text-stone-700">📞 <span className="font-semibold">Contact:</span> {group.contact}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#f0ece5] text-stone-600">
                <span>{group.members} Active Volunteers</span>
                <span className="font-bold text-emerald-700">{group.activeDrives} Cleanups Completed</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Adopt Modal */}
      {showAdoptModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4 border border-[#ded9cf]">
            <h3 className="font-bold text-sm text-stone-900">
              Adopt a Spot (Pledge Neighborhood Care)
            </h3>
            <p className="text-xs text-stone-600">
              Whether you are a resident, shopkeeper, or student club, pledge to monitor a public spot and report/verify defects promptly.
            </p>
            <form onSubmit={handlePledgeAdopt} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Spot / Corner Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ward 4 Post Office Lane Corner"
                  value={spotName}
                  onChange={(e) => setSpotName(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Your Name / Business / Association *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sen Medical Stores / Ward 4 Residents"
                  value={adoptedBy}
                  onChange={(e) => setAdoptedBy(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Ward Number
                </label>
                <select
                  value={wardNo}
                  onChange={(e) => setWardNo(Number(e.target.value))}
                  className="w-full text-xs p-2 border border-stone-300 rounded focus:outline-hidden"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((w) => (
                    <option key={w} value={w}>Ward {w}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdoptModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold border rounded hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-[#c8102e] text-white rounded hover:bg-[#a60c25]"
                >
                  Register Pledge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
