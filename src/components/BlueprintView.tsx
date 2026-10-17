import React from 'react';
import { Lang, translations } from '../lib/i18n';
import { ShieldCheck, MapPin, Camera, Users, AlertOctagon, CheckCircle2, Lock } from 'lucide-react';

interface BlueprintViewProps {
  lang: Lang;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({ lang }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#ded9cf] pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1a1410] text-[11px] font-bold uppercase tracking-wider text-white mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c8102e]" />
          Founding Constitution & Rules
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a1410] tracking-tight">
          Why “Resolved” in Parishkar Truly Means Resolved
        </h1>
        <p className="text-sm text-stone-600 mt-2 leading-relaxed">
          No municipal official or contractor can unilaterally close a report by clicking a button.
          The public record is protected by immutable verification rules running across client and server.
        </p>
      </div>

      {/* 5 Core Protocols */}
      <div className="space-y-4">
        {[
          {
            num: '01',
            title: 'Live Camera & Verified GPS Required',
            icon: <Camera className="w-5 h-5 text-[#c8102e]" />,
            desc: 'Every report must originate directly from an active viewfinder with device hardware GPS lock. Gallery uploads and artificial spoofing are rejected to eliminate spam and manufactured disputes.',
          },
          {
            num: '02',
            title: 'Public from the Moment of Submission',
            icon: <MapPin className="w-5 h-5 text-amber-600" />,
            desc: 'Reports do not disappear into a private bureaucratic inbox. Every defect appears immediately on the public map with timestamp, ward assignment, and official SLA targets.',
          },
          {
            num: '03',
            title: 'Proof of Cleanup within Spot Radius',
            icon: <Lock className="w-5 h-5 text-indigo-600" />,
            desc: 'Whoever fixes the problem must submit an on-site photo taken within 50 metres of the recorded GPS coordinates. Claiming cleanup merely initiates verification; it does not close the case.',
          },
          {
            num: '04',
            title: 'Independent Peer Quorum Verification',
            icon: <Users className="w-5 h-5 text-emerald-600" />,
            desc: '3 separate independent citizen verifiers on site must confirm that the road is paved, drain desilted, or garbage cleared. The person who claimed the cleanup cannot verify their own work.',
          },
          {
            num: '05',
            title: 'Challenge Window & Anti-Fraud Blacklisting',
            icon: <AlertOctagon className="w-5 h-5 text-red-600" />,
            desc: 'A 12-hour challenge period remains open after quorum. If residents submit a dispute, the case reopens and the fraudulent claimant is blocked from claiming further works.',
          },
        ].map((rule) => (
          <div
            key={rule.num}
            className="p-5 rounded-xl border border-[#ded9cf] bg-white shadow-xs flex items-start gap-4"
          >
            <div className="shrink-0 w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-extrabold text-sm text-[#1a1410]">
              {rule.num}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {rule.icon}
                <h3 className="text-sm font-bold text-[#1a1410]">{rule.title}</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">{rule.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Escalation Matrix */}
      <div className="p-6 bg-[#fbf9f5] border border-[#ded9cf] rounded-xl space-y-3">
        <h3 className="text-sm font-bold text-[#1a1410]">
          Civic Escalation Framework
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          If a defect exceeds its SLA target without municipal progress, Parishkar enables automated preparation of:
        </p>
        <ul className="text-xs space-y-1.5 list-disc pl-5 text-stone-700">
          <li><strong>Right to Information (RTI Section 6(1))</strong> formal query templates for work orders and contractor expenditure.</li>
          <li><strong>Ward Representation Letters</strong> addressed directly to the Chairman, BDO, and District Magistrate.</li>
          <li><strong>CPGRAMS / West Bengal Grievance Portal</strong> cross-docketing references.</li>
        </ul>
      </div>
    </div>
  );
};
