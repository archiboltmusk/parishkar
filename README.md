# Parishkar Bengal (React Edition)

Civic Accountability Platform for West Bengal and India.

Parishkar is a civic accountability map and public record platform. Residents report civic defects (garbage dumps, choked drainage, broken roads, failing streetlights, drinking water breakdown, dirty public toilets) with live camera capture and verified GPS. Reports remain open on the public ledger until peer residents on the spot verify that the problem has been fixed.

## Features Ported to React

1. **Interactive Civic Map & Issues Explorer**
   - High-performance Leaflet-based interactive map with custom colored category & status pins (Unresolved Critical/Severe in red/amber, Verifying in indigo, Confirmed Fixed in emerald green).
   - Real-time filtering by category (Garbage, Drainage, Roads, Lighting, Water, Toilets), status (Unresolved, Verifying, Confirmed Fixed), severity, and keyword/ward search.
   - Dual-mode basemap: Daylight map (Positron light style) vs Dark map.
   - GPS "Near Me" radius filter (showing issues within 5 km).
   - Side-by-side / tabbed List View for rapid triage.

2. **Strict Problem Reporting Flow**
   - Enforces the core Parishkar rule: **Live Camera + Real GPS proof**.
   - Direct viewfinder integration with live capture fallback.
   - Category and sub-type selection from official civic categories.
   - Severity / urgency selection and automatic SLA target calculation.
   - Offline queueing with persistent localStorage synchronization.

3. **Accountability Case Files & Citizen Verification Engine**
   - Detailed case dossier with days open vs official SLA counter.
   - Before & after photo comparison slider.
   - "Who Answers": official municipal and ward councillor jurisdiction details.
   - Community verification pipeline:
     - Witness counter ("I Saw This On Site").
     - Cleanup claims with proof photo.
     - Peer quorum confirmation (requires 3 independent witnesses) and dispute handling.
   - Automated Official Representation Letter generator (with 1-click clipboard copy for filing directly to the West Bengal Grievance Cell or Ward Councillor).
   - Grievance & RTI reference dockets tracking.

4. **Ward Performance & Cleanliness Rankings**
   - Real-time ranking of municipal wards by resolution speed, cleanup rate, and active backlogs.
   - Elected councillor contacts and ward profiles.
   - Citizen priority voting ("Vote what should be fixed first").

5. **Municipal Partner Workflow Simulation**
   - Full 8-step lifecycle: Reported → Approved (SLA set) → Assigned (Order issued) → In Progress → Work Photo (GPS-locked) → Officer Sign-Off → Citizen Verified → Paid (Voucher recorded).
   - Interactive role switcher: Citizen, Municipal Officer, Contractor/Worker.
   - Verifiable append-only audit trail.

6. **District Health & Sanitation Insights (NFHS-5)**
   - Official Ministry of Health and Family Welfare NFHS-5 data comparison across West Bengal districts (Purulia, Bankura, Kolkata, Paschim Barddhaman, Darjeeling).

7. **Multilingual Support**
   - Full native localization in English, Bengali (বাংলা), and Hindi (हिंदी).

## Development

```bash
npm install
npm run dev
```

Dev server runs on `http://0.0.0.0:3000`.
Build with `npm run build`.
