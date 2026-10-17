import React, { useState } from 'react';
import { Lang, translations } from '../lib/i18n';
import { Report } from '../types';
import { 
  X, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Share2, 
  FileText, 
  Copy, 
  Check, 
  UserCheck, 
  Building2, 
  AlertCircle 
} from 'lucide-react';

interface CaseDetailModalProps {
  report: Report | null;
  onClose: () => void;
  lang: Lang;
  onWitness: (reportId: string) => void;
  onClaimCleanup: (reportId: string, photoUrl: string) => void;
  onVerifyClaim: (reportId: string) => void;
  onDisputeClaim: (reportId: string) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  report,
  onClose,
  lang,
  onWitness,
  onClaimCleanup,
  onVerifyClaim,
  onDisputeClaim,
}) => {
  const t = translations[lang];
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimPhotoUrl, setClaimPhotoUrl] = useState('');

  if (!report) return null;

  const daysOpen = Math.max(1, Math.floor((Date.now() - new Date(report.created_at).getTime()) / 86400000));
  const isOverdue = daysOpen > report.sla_days && report.status !== 'resolved';
  const isResolved = report.status === 'resolved';
  const isClaimed = report.status === 'claimed';

  // Letter template for official escalation
  const letterText = `To,
The Executive Officer / Councillor (Ward ${report.ward_no})
${report.local_body}, West Bengal

Subject: Urgent Redressal Request for Civic Defect (${report.id})

Respected Authority,
I am writing to draw your urgent attention to an ongoing civic problem registered on the Parishkar Public Accountability Record under Reference ID: ${report.id}.

Defect Details:
- Category: ${report.category.toUpperCase()}
- Location: ${report.landmark}, Ward No. ${report.ward_no}, ${report.local_body}
- GPS Coordinates: ${report.lat.toFixed(5)}, ${report.lng.toFixed(5)}
- Description: ${report.description}
- Registered Date: ${new Date(report.created_at).toLocaleDateString()} (${daysOpen} days unresolved)
- Standard SLA Target: ${report.sla_days} days

This public hazard affects daily commuters and local residents. In accordance with the citizen charter and Right to Public Services, kindly initiate immediate repair works and update the public record.

Respectfully,
Residents & Citizens of Ward ${report.ward_no}`;

  const copyLetterToClipboard = () => {
    navigator.clipboard.writeText(letterText);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2500);
  };

  const copyShareLink = () => {
    const shareUrl = `https://purulia.mahatoanupam002.workers.dev/r/${encodeURIComponent(report.id)}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = claimPhotoUrl.trim() || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80';
    onClaimCleanup(report.id, url);
    setShowClaimForm(false);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#ded9cf] overflow-hidden my-6">
        {/* Top Header */}
        <div className="bg-[#1a1410] text-white p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#c8102e] bg-white px-1.5 py-0.5 rounded-sm">
                {report.id}
              </span>
              <span className="text-xs text-stone-300">
                {new Date(report.created_at).toLocaleDateString()}
              </span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white mt-1">
              Case Record: Ward {report.ward_no}, {report.local_body}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyShareLink}
              title="Share report"
              className="p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded transition-colors"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-5 py-2.5 bg-[#fbf9f5] border-b border-[#e5e0d8] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {isResolved ? (
              <span className="inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                CONFIRMED FIXED ON SPOT
              </span>
            ) : isClaimed ? (
              <span className="inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded bg-indigo-100 text-indigo-800">
                <Clock className="w-4 h-4 text-indigo-700" />
                CLEANUP CLAIMED · VERIFICATION REQUIRED
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded ${
                isOverdue ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-amber-100 text-amber-800'
              }`}>
                <AlertTriangle className="w-4 h-4" />
                {isOverdue ? `OVERDUE · ${daysOpen} DAYS OPEN` : `UNRESOLVED · ${daysOpen} DAYS OPEN`}
              </span>
            )}

            <span className="text-[#78716c] font-medium">
              SLA: {report.sla_days} Days
            </span>
          </div>

          <div className="flex items-center gap-3 text-[#57534e]">
            <span className="flex items-center gap-1 font-semibold">
              <Eye className="w-3.5 h-3.5 text-stone-500" /> {report.seen_on_site} Witnessed
            </span>
            <span className="flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> GPS Validated
            </span>
          </div>
        </div>

        {/* Body content */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Photos: Before & After */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716c]">
                Report Photo (Live On-Site)
              </span>
              <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-[#ded9cf] bg-stone-100">
                <img
                  src={report.photo_url}
                  alt="Original civic defect"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/75 text-white">
                  Reported: {new Date(report.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716c]">
                {isResolved ? 'Confirmed Fix Photo' : isClaimed ? 'Claimed Fix Photo' : 'Resolution Status'}
              </span>
              <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-[#ded9cf] bg-stone-100 flex items-center justify-center text-center p-4">
                {isResolved && report.resolved_photo_url ? (
                  <img
                    src={report.resolved_photo_url}
                    alt="Resolved evidence"
                    className="w-full h-full object-cover"
                  />
                ) : isClaimed && report.claim_photo_url ? (
                  <div className="relative w-full h-full">
                    <img
                      src={report.claim_photo_url}
                      alt="Claimed fix"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-900/80 text-white">
                      Awaiting {3 - (report.claim_verify_count || 0)} more verifications
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1 text-stone-400">
                    <Clock className="w-8 h-8 mx-auto text-stone-400" />
                    <p className="text-xs font-semibold text-stone-600">Pending Resolution</p>
                    <p className="text-[11px] text-stone-500">
                      Work has not yet been marked fixed by the authority or contractor.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description & Landmark */}
          <div className="bg-[#fbf9f5] border border-[#e8e4dc] rounded-lg p-3.5 space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716c]">
              Defect Description
            </h4>
            <p className="text-sm font-semibold text-[#1a1410]">
              {report.description}
            </p>
            <p className="text-xs text-[#57534e]">
              📍 <span className="font-medium">Landmark:</span> {report.landmark} (Ward {report.ward_no})
            </p>
          </div>

          {/* Who Answers - Responsible Authorities */}
          <div className="border border-[#ded9cf] rounded-lg p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1a1410] uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-[#c8102e]" />
              <span>Who Answers (Official Jurisdiction)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-[#fbf9f5] rounded border border-[#e8e4dc]">
                <p className="font-bold text-[#1a1410]">{report.local_body}</p>
                <p className="text-[11px] text-[#78716c]">
                  Purulia Municipality Engineering & Sanitation Wing
                </p>
                <p className="text-[11px] text-[#57534e] mt-1">
                  Panchayat & Municipal Affairs Dept, Govt. of West Bengal
                </p>
              </div>

              <div className="p-2.5 bg-[#fbf9f5] rounded border border-[#e8e4dc]">
                <p className="font-bold text-[#1a1410]">Ward {report.ward_no} Councillor</p>
                <p className="text-[11px] text-[#78716c]">Elected Representative</p>
                <p className="text-[11px] text-[#57534e] mt-1">
                  Responsible for ward sanitary inspection and local contractor sign-off
                </p>
              </div>
            </div>
          </div>

          {/* Verification Actions (Parishkar Citizen Verification Engine) */}
          <div className="border border-[#c8102e]/30 bg-red-50/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#1a1410] uppercase tracking-wide">
                  Spot Accountability & Peer Verification
                </h4>
                <p className="text-[11px] text-[#78716c]">
                  Parishkar rule: nothing is closed until people on the spot confirm it.
                </p>
              </div>
              <span className="text-xs font-bold text-[#c8102e] bg-white px-2 py-0.5 rounded border border-[#c8102e]/20">
                Live Engine
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onWitness(report.id)}
                className="px-3 py-1.5 bg-white border border-[#ded9cf] hover:border-[#a8a29e] text-xs font-bold text-[#1a1410] rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-stone-600" />
                <span>{t.case_witness_btn} ({report.seen_on_site})</span>
              </button>

              {!isResolved && !isClaimed && (
                <button
                  onClick={() => setShowClaimForm(true)}
                  className="px-3 py-1.5 bg-[#1a1410] hover:bg-[#2c2724] text-xs font-bold text-white rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.case_claim_btn}</span>
                </button>
              )}

              {isClaimed && !isResolved && (
                <>
                  <button
                    onClick={() => onVerifyClaim(report.id)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.case_verify_btn} ({report.claim_verify_count || 0}/3)</span>
                  </button>

                  <button
                    onClick={() => onDisputeClaim(report.id)}
                    className="px-3 py-1.5 bg-white border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{t.case_dispute_btn}</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setShowLetterModal(true)}
                className="px-3 py-1.5 bg-[#c8102e] hover:bg-[#a60c25] text-xs font-bold text-white rounded-md flex items-center gap-1.5 shadow-xs transition-colors ml-auto"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t.case_write_letter}</span>
              </button>
            </div>

            {/* Quick Claim Form if clicked */}
            {showClaimForm && (
              <form onSubmit={handleClaimSubmit} className="p-3 bg-white border border-amber-300 rounded-md space-y-2 mt-2">
                <p className="text-xs font-bold text-amber-950">
                  Submit Cleanup Proof Photo URL (simulates live camera upload):
                </p>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or leave blank for sample fix photo"
                  value={claimPhotoUrl}
                  onChange={(e) => setClaimPhotoUrl(e.target.value)}
                  className="w-full text-xs p-2 border border-[#ded9cf] rounded focus:outline-hidden"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowClaimForm(false)}
                    className="px-2.5 py-1 text-xs border border-stone-300 rounded hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs bg-amber-600 text-white font-bold rounded hover:bg-amber-700"
                  >
                    Submit Proof
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Dockets & RTI Tracker */}
          {report.dockets && report.dockets.length > 0 && (
            <div className="border border-[#ded9cf] rounded-lg p-3.5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716c]">
                Official Grievance & RTI Reference Dockets
              </h4>
              <div className="divide-y divide-[#f0ece5]">
                {report.dockets.map((doc) => (
                  <div key={doc.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#1a1410]">{doc.reference_no}</p>
                      <p className="text-[11px] text-[#78716c]">{doc.portal} · Filed on {doc.filed_on}</p>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official Letter Modal */}
      {showLetterModal && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5 space-y-3 border border-[#ded9cf]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#1a1410]">
                Official Representation Letter (Ready to Send)
              </h3>
              <button onClick={() => setShowLetterModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#78716c]">
              Copy this formal text directly into West Bengal Grievance Portal, CPGRAMS, email, or print for the councillor.
            </p>
            <pre className="p-3 bg-[#fbf9f5] border border-[#ded9cf] rounded-md text-[11px] leading-relaxed font-mono whitespace-pre-wrap max-h-64 overflow-y-auto text-[#1a1410]">
              {letterText}
            </pre>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLetterModal(false)}
                className="px-3 py-1.5 text-xs font-semibold border border-stone-300 rounded hover:bg-stone-50"
              >
                Close
              </button>
              <button
                onClick={copyLetterToClipboard}
                className="px-3 py-1.5 text-xs font-bold bg-[#c8102e] text-white rounded hover:bg-[#a60c25] flex items-center gap-1.5"
              >
                {copiedLetter ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLetter ? 'Copied to Clipboard!' : t.case_copy_letter}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
