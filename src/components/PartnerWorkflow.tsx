import React, { useState } from 'react';
import { Lang, translations } from '../lib/i18n';
import { 
  CheckCircle2, 
  RotateCcw, 
  User, 
  Building2, 
  Wrench, 
  Camera, 
  AlertCircle, 
  Clock, 
  FileCheck 
} from 'lucide-react';

interface PartnerWorkflowProps {
  lang: Lang;
}

interface StepDef {
  key: string;
  label: string;
  who: 'citizen' | 'officer' | 'worker';
  by: string;
}

const STEPS: StepDef[] = [
  { key: 'reported', label: 'Reported', who: 'citizen', by: 'Citizen (live camera + GPS)' },
  { key: 'approved', label: 'Approved', who: 'officer', by: 'Municipal officer (SLA 7 days)' },
  { key: 'assigned', label: 'Assigned', who: 'officer', by: 'Officer assigns Firm & Order DEMO-WO-0001' },
  { key: 'in_progress', label: 'In progress', who: 'worker', by: 'Worker starts on site' },
  { key: 'work_photo', label: 'Work photo', who: 'worker', by: 'Worker live photo upload' },
  { key: 'completed', label: 'Officer sign-off', who: 'officer', by: 'Worker done, officer signs off' },
  { key: 'verified', label: 'Citizen Verified', who: 'citizen', by: 'Citizen confirms fix on site' },
  { key: 'paid', label: 'Paid (recorded)', who: 'officer', by: 'Municipal payment reference recorded' },
];

export const PartnerWorkflow: React.FC<PartnerWorkflowProps> = ({ lang }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [activeRole, setActiveRole] = useState<'citizen' | 'officer' | 'worker'>('citizen');
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [rejectedReason, setRejectedReason] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([
    '09:10  Citizen reported broken culvert drain at Ward 4 Market (live camera and GPS required)',
  ]);

  const addLog = (msg: string) => {
    const time = `09:${String(12 + logs.length * 4).padStart(2, '0')}`;
    setLogs((prev) => [...prev, `${time}  ${msg}`]);
  };

  const handleAction = (action: string) => {
    if (action === 'report') {
      addLog('Citizen filed report with verified GPS fix (23.3338, 86.3645)');
      setCurrentStepIdx(1);
    } else if (action === 'approve') {
      addLog('Municipal Officer approved report for work. SLA: 7 days.');
      setCurrentStepIdx(2);
    } else if (action === 'assign') {
      addLog('Officer assigned M/s Bengal Infra Works, issued Work Order #DEMO-WO-0001');
      setCurrentStepIdx(3);
    } else if (action === 'start') {
      addLog('Worker accepted work order and reported to site');
      setCurrentStepIdx(4);
    } else if (action === 'photo') {
      setPhotoCaptured(true);
      addLog('Worker captured repair photo with on-site GPS verification');
      setCurrentStepIdx(5);
    } else if (action === 'complete') {
      addLog('Officer inspected repair photos and granted municipal sign-off');
      setCurrentStepIdx(6);
    } else if (action === 'reject_completion') {
      setPhotoCaptured(false);
      setCurrentStepIdx(3);
      addLog('Officer sent back order: cleanup photo does not show complete clearance');
    } else if (action === 'verify') {
      addLog('Citizen confirmed on site: verified fix is satisfactory. Quorum achieved.');
      setCurrentStepIdx(7);
    } else if (action === 'dispute') {
      setPhotoCaptured(false);
      setCurrentStepIdx(3);
      addLog('Citizen disputed fix on site: problem still persists; order moved back to in-progress');
    } else if (action === 'pay') {
      addLog('Officer recorded municipal payment voucher REF #DEMO-PAY-0001 (Parishkar moves no money, records audit trail only)');
      setCurrentStepIdx(8);
    } else if (action === 'reject_report') {
      setRejectedReason('Not on municipal road or drain: forwarded to State PWD');
      addLog('Officer rejected: forwarded to State Highway Division');
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setActiveRole('citizen');
    setPhotoCaptured(false);
    setRejectedReason(null);
    setLogs(['09:10  Citizen reported broken culvert drain at Ward 4 Market (live camera and GPS required)']);
  };

  const curStep = STEPS[currentStepIdx];
  const isDone = currentStepIdx >= STEPS.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-[#c8102e] text-white p-3 sm:p-4 rounded-lg text-xs font-bold tracking-wide flex items-center justify-between">
        <span>DEMO · Municipal Partner Workflow Simulation · Sample Work Order #DEMO-WO-0001</span>
        <button
          onClick={handleReset}
          className="px-2.5 py-1 bg-black/30 hover:bg-black/50 text-white rounded flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Demo</span>
        </button>
      </div>

      {/* Role Picker */}
      <div className="bg-white p-4 rounded-xl border border-[#ded9cf] shadow-xs flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-[#78716c] uppercase tracking-wider mr-2">
          Switch Your Role:
        </span>
        <button
          onClick={() => setActiveRole('citizen')}
          className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 border transition-all ${
            activeRole === 'citizen'
              ? 'bg-[#1a1410] text-white border-[#1a1410]'
              : 'border-[#ded9cf] text-[#57534e] hover:bg-[#f6f4f0]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Citizen</span>
        </button>
        <button
          onClick={() => setActiveRole('officer')}
          className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 border transition-all ${
            activeRole === 'officer'
              ? 'bg-[#1a1410] text-white border-[#1a1410]'
              : 'border-[#ded9cf] text-[#57534e] hover:bg-[#f6f4f0]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Municipal Officer</span>
        </button>
        <button
          onClick={() => setActiveRole('worker')}
          className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 border transition-all ${
            activeRole === 'worker'
              ? 'bg-[#1a1410] text-white border-[#1a1410]'
              : 'border-[#ded9cf] text-[#57534e] hover:bg-[#f6f4f0]'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Contractor / Worker</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step Progress Checklist */}
        <div className="bg-white rounded-xl border border-[#ded9cf] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#ded9cf] pb-3">
            <h3 className="font-bold text-sm text-[#1a1410]">
              Lifecycle of a Work Order
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              Step {Math.min(currentStepIdx + 1, STEPS.length)} of {STEPS.length}
            </span>
          </div>

          <div className="space-y-2">
            {STEPS.map((s, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx && !rejectedReason;

              return (
                <div
                  key={s.key}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                    isCurrent
                      ? 'bg-red-50/50 border-[#c8102e] ring-1 ring-[#c8102e]/30'
                      : isPast
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'border-[#eae5dd] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isPast
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-[#c8102e] text-white'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {isPast ? '✓' : idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1a1410]">{s.label}</p>
                      <p className="text-[11px] text-[#78716c]">{s.by}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {s.who}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Panel and Public View */}
        <div className="space-y-6">
          {/* Action Box */}
          <div className="bg-white rounded-xl border border-[#ded9cf] shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2">
              <h3 className="font-bold text-sm text-[#1a1410]">
                Current Action: Role <span className="capitalize text-[#c8102e]">({activeRole})</span>
              </h3>
            </div>

            {isDone ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Work Order Closed and Paid
                </p>
                <p>
                  Municipal payment voucher reference REF-PAY-0001 recorded on the immutable public ledger.
                </p>
              </div>
            ) : rejectedReason ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-900 text-xs">
                <p className="font-bold">Report Rejected by Officer</p>
                <p className="mt-1">{rejectedReason}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentStepIdx === 0 && (
                  <div>
                    <p className="text-xs text-stone-600 mb-3">
                      A citizen spots an open drain hazard. Photo must be captured live on site with device GPS lock.
                    </p>
                    {activeRole === 'citizen' ? (
                      <button
                        onClick={() => handleAction('report')}
                        className="px-4 py-2 bg-[#c8102e] text-white text-xs font-bold rounded-md hover:bg-[#a60c25]"
                      >
                        File Report (Demo GPS Validated)
                      </button>
                    ) : (
                      <p className="text-xs text-amber-700 italic">Waiting for Citizen action. Switch role to Citizen above.</p>
                    )}
                  </div>
                )}

                {currentStepIdx === 1 && (
                  <div>
                    <p className="text-xs text-stone-600 mb-3">
                      Municipal officer reviews report eligibility, confirms jurisdiction, and establishes 7-day SLA.
                    </p>
                    {activeRole === 'officer' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction('approve')}
                          className="px-4 py-2 bg-[#c8102e] text-white text-xs font-bold rounded-md hover:bg-[#a60c25]"
                        >
                          Approve for Work (SLA: 7 Days)
                        </button>
                        <button
                          onClick={() => handleAction('reject_report')}
                          className="px-4 py-2 bg-stone-200 text-stone-700 text-xs font-bold rounded-md hover:bg-stone-300"
                        >
                          Reject / Forward to PWD
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-700 italic">Waiting for Municipal Officer. Switch role to Municipal Officer.</p>
                    )}
                  </div>
                )}

                {currentStepIdx === 2 && (
                  <div>
                    <p className="text-xs text-stone-600 mb-3">
                      Officer assigns contracted engineering firm and creates Work Order #DEMO-WO-0001.
                    </p>
                    {activeRole === 'officer' ? (
                      <button
                        onClick={() => handleAction('assign')}
                        className="px-4 py-2 bg-[#c8102e] text-white text-xs font-bold rounded-md hover:bg-[#a60c25]"
                      >
                        Assign Bengal Infra & Issue Work Order
                      </button>
                    ) : (
                      <p className="text-xs text-amber-700 italic">Waiting for Municipal Officer. Switch role to Municipal Officer.</p>
                    )}
                  </div>
                )}

                {currentStepIdx === 3 && (
                  <div>
                    <p className="text-xs text-stone-600 mb-3">
                      Contractor receives work order on device, mobilizes labour, and marks job started.
                    </p>
                    {activeRole === 'worker' ? (
                      <button
                        onClick={() => handleAction('start')}
                        className="px-4 py-2 bg-[#c8102e] text-white text-xs font-bold rounded-md hover:bg-[#a60c25]"
                      >
                        Accept & Start Work on Site
                      </button>
                    ) : (
                      <p className="text-xs text-amber-700 italic">Waiting for Worker. Switch role to Contractor / Worker.</p>
                    )}
                  </div>
                )}

                {currentStepIdx === 4 && (
                  <div>
                    <p className="text-xs text-stone-600 mb-3">
                      Worker captures repair completion photo on site. GPS must match within 50m of problem spot.
                    </p>
                    {activeRole === 'worker' ? (
                      <button
                        onClick={() => handleAction('photo')}
                        className="px-4 py-2 bg-[#c8102e] text-white text-xs font-bold rounded-md hover:bg-[#a60c25] flex items-center gap-1.5"
                      >
                        <Camera className="w-4 h-4" />
                        Capture Live Completion Photo
                      </button>
                    ) : (
                      <p className="text-xs text-amber-700 italic">Waiting for Worker. Switch role to Contractor / Worker.</p>
                    )}
                  </div>
                )}

                {currentStepIdx === 5 && (
                  <div>
                    <p className="text-xs text-stone-600 mb-3">
                      Municipal officer inspects completion photo against initial defect evidence.
                    </p>
                    {activeRole === 'officer' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction('complete')}
                          className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-md hover:bg-emerald-800"
                        >
                          Officer Sign-Off (Approve Fix)
                        </button>
                        <button
                          onClick={() => handleAction('reject_completion')}
                          className="px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-md hover:bg-red-200"
                        >
                          Send Back (Incomplete Work)
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-700 italic">Waiting for Municipal Officer. Switch role to Municipal Officer.</p>
                    )}
                  </div>
                )}

                {currentStepIdx === 6 && (
                  <div>
                    <p className="text-xs text-stone-600 mb-3">
                      Independent citizen confirmation: residents standing at the spot verify the fix or dispute it.
                    </p>
                    {activeRole === 'citizen' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction('verify')}
                          className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-md hover:bg-emerald-800"
                        >
                          Confirm Fixed on Site (Citizen Quorum)
                        </button>
                        <button
                          onClick={() => handleAction('dispute')}
                          className="px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-md hover:bg-red-200"
                        >
                          Dispute (Not Cleaned Properly)
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-700 italic">Waiting for Citizen. Switch role to Citizen.</p>
                    )}
                  </div>
                )}

                {currentStepIdx === 7 && (
                  <div>
                    <p className="text-xs text-stone-600 mb-3">
                      Fix verified by both officer and citizen. Officer enters municipal treasury voucher reference.
                    </p>
                    {activeRole === 'officer' ? (
                      <button
                        onClick={() => handleAction('pay')}
                        className="px-4 py-2 bg-[#1a1410] text-white text-xs font-bold rounded-md hover:bg-[#2c2724]"
                      >
                        Record Payment Voucher #DEMO-PAY-0001
                      </button>
                    ) : (
                      <p className="text-xs text-amber-700 italic">Waiting for Municipal Officer. Switch role to Municipal Officer.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Public Line (What citizens see) */}
          <div className="bg-white rounded-xl border border-[#ded9cf] shadow-xs p-5 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#78716c]">
              Public Line (What the Community Sees Live)
            </h4>
            <div className="p-3 bg-[#fbf9f5] border border-[#e8e4dc] rounded text-xs text-[#1a1410] font-medium">
              {currentStepIdx === 0 && 'Reported. Waiting for municipality response.'}
              {currentStepIdx === 1 && 'Approved for work by Purulia Municipality. SLA: 7 days target.'}
              {currentStepIdx === 2 && 'Assigned to Bengal Infra Works. Order DEMO-WO-0001.'}
              {currentStepIdx === 3 && 'Contractor worker arrived on site. Work in progress.'}
              {currentStepIdx === 4 && 'Repair works completed by worker. Awaiting officer sign-off.'}
              {currentStepIdx === 5 && 'Officer signed off. Awaiting resident on-site confirmation.'}
              {currentStepIdx === 6 && 'Verifying on site. Residents can confirm or dispute.'}
              {currentStepIdx === 7 && 'Confirmed fixed by spot neighbours + municipal sign-off.'}
              {currentStepIdx >= 8 && 'Closed & Paid. Municipal payment voucher REF #DEMO-PAY-0001 recorded.'}
            </div>
          </div>

          {/* Record Log */}
          <div className="bg-white rounded-xl border border-[#ded9cf] shadow-xs p-5 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#78716c]">
              Append-Only Verifiable Audit Log
            </h4>
            <div className="font-mono text-[11px] space-y-1 max-h-44 overflow-y-auto p-2 bg-[#121110] text-stone-300 rounded border border-[#2e2a27]">
              {logs.map((l, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-[#c8102e] font-bold">›</span> {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
