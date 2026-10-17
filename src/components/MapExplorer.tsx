import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Report, Severity, ReportStatus } from '../types';
import { Lang, translations } from '../lib/i18n';
import { getDistanceMeters } from '../lib/data';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, 
  Compass, 
  List, 
  Map as MapIcon, 
  X, 
  Eye, 
  Camera,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface MapExplorerProps {
  reports: Report[];
  lang: Lang;
  daylight: boolean;
  onSelectReport: (report: Report) => void;
  onOpenReportModal: () => void;
  onOpenGame?: () => void;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({
  reports,
  lang,
  daylight,
  onSelectReport,
  onOpenReportModal,
  onOpenGame,
}) => {
  const t = translations[lang];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filterNearMe, setFilterNearMe] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [locating, setLocating] = useState(false);
  const [selectedPinReport, setSelectedPinReport] = useState<Report | null>(null);
  const [showAreaCard, setShowAreaCard] = useState(true);
  const [showNearQueue, setShowNearQueue] = useState(false);
  const [mapSource, setMapSource] = useState<'osm' | 'nammakasa'>('osm');

  // Category list matching Namma Kasa
  const categories = [
    { id: 'all', label: t.cat_all, icon: '📋' },
    { id: 'waste', label: t.cat_waste, icon: '🗑️' },
    { id: 'drainage', label: t.cat_drainage, icon: '🌊' },
    { id: 'road', label: t.cat_road, icon: '🛣️' },
    { id: 'lighting', label: t.cat_lighting, icon: '💡' },
    { id: 'water', label: t.cat_water, icon: '🚰' },
    { id: 'toilet', label: t.cat_toilet, icon: '🚻' },
  ];

  // Request user location
  const handleNearMeClick = () => {
    if (userLocation) {
      setFilterNearMe(!filterNearMe);
      if (!filterNearMe && leafletMapRef.current) {
        leafletMapRef.current.flyTo([userLocation.lat, userLocation.lng], 15, { animate: true });
      }
      return;
    }

    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setFilterNearMe(true);
          setLocating(false);
          if (leafletMapRef.current) {
            leafletMapRef.current.flyTo([loc.lat, loc.lng], 15, { animate: true });
          }
        },
        () => {
          const fallback = { lat: 23.3320, lng: 86.3654 };
          setUserLocation(fallback);
          setFilterNearMe(true);
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setLocating(false);
    }
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      if (selectedCategory !== 'all' && rep.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && rep.status !== selectedStatus) return false;
      if (selectedSeverity !== 'all' && rep.severity !== selectedSeverity) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDesc = rep.description.toLowerCase().includes(q);
        const matchesLandmark = rep.landmark.toLowerCase().includes(q);
        const matchesWard = `ward ${rep.ward_no}`.includes(q);
        const matchesBody = rep.local_body.toLowerCase().includes(q);
        if (!matchesDesc && !matchesLandmark && !matchesWard && !matchesBody) return false;
      }

      if (filterNearMe && userLocation) {
        const dist = getDistanceMeters(userLocation.lat, userLocation.lng, rep.lat, rep.lng);
        if (dist > 5000) return false;
      }

      return true;
    });
  }, [reports, selectedCategory, selectedStatus, selectedSeverity, searchQuery, filterNearMe, userLocation]);

  const totalOpen = reports.filter((r) => r.status === 'open').length;
  const totalClaimed = reports.filter((r) => r.status === 'claimed').length;
  const totalResolved = reports.filter((r) => r.status === 'resolved').length;

  // Initialize Leaflet Map with free OpenStreetMap (no API key, 100% reliable)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (leafletMapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [23.3338, 86.3654],
      zoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    map.on('click', () => {
      setSelectedPinReport(null);
    });

    leafletMapRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update Tile Layer based on daylight and mapSource (100% Free OpenStreetMap & Carto, Zero API Key)
  useEffect(() => {
    if (!leafletMapRef.current) return;
    const map = leafletMapRef.current;

    // Remove old tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    if (!daylight) {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO';
    } else if (mapSource === 'nammakasa') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO';
    }

    const tileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19,
    });

    tileLayer.addTo(map);
  }, [daylight, mapSource]);

  // Update Markers
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;
    const group = markersLayerRef.current;
    group.clearLayers();

    filteredReports.forEach((rep) => {
      const isResolved = rep.status === 'resolved';
      const isClaimed = rep.status === 'claimed';
      const isCritical = rep.severity === 'critical';

      let bgColor = '#c8102e';
      if (isResolved) bgColor = '#16a34a';
      else if (isClaimed) bgColor = '#4f46e5';
      else if (!isCritical) bgColor = '#ea580c';

      const iconEmoji =
        rep.category === 'waste' ? '🗑️' :
        rep.category === 'drainage' ? '🌊' :
        rep.category === 'road' ? '🛣️' :
        rep.category === 'lighting' ? '💡' :
        rep.category === 'water' ? '🚰' :
        rep.category === 'toilet' ? '🚻' : '⚠️';

      const isSelected = selectedPinReport?.id === rep.id;

      const customIcon = L.divIcon({
        className: 'nammakasa-pin-wrapper',
        html: `
          <div style="background-color: ${bgColor}; width: ${isSelected ? '40px' : '32px'}; height: ${isSelected ? '40px' : '32px'}; border-radius: 9999px; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.35); font-size: ${isSelected ? '18px' : '14px'}; cursor: pointer; transition: transform 0.2s ease;">
            ${iconEmoji}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([rep.lat, rep.lng], { icon: customIcon });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedPinReport(rep);
      });

      group.addLayer(marker);
    });

    // User location marker
    if (userLocation) {
      const userMarkerIcon = L.divIcon({
        className: 'user-loc-pin',
        html: `
          <div style="background-color: #0284c7; width: 20px; height: 20px; border-radius: 9999px; border: 3px solid #ffffff; box-shadow: 0 0 0 8px rgba(2, 132, 199, 0.25);"></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userMarkerIcon });
      group.addLayer(userMarker);
    }
  }, [filteredReports, userLocation, selectedPinReport]);

  const resetView = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([23.3338, 86.3654], 14, { animate: true });
    }
    setFilterNearMe(false);
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedSeverity('all');
    setSearchQuery('');
    setSelectedPinReport(null);
  };

  return (
    <div className="relative w-full h-[calc(100vh-62px)] overflow-hidden bg-[#fbf9f5]">
      {/* ── TOP FLOATING CONTROL BAR (Namma Kasa Style) ── */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col gap-2 max-w-5xl mx-auto pointer-events-none">
        {/* Search, Filter Pills & Status Counters */}
        <div className="bg-white/95 backdrop-blur-md border border-[#ded9cf] rounded-xl p-2.5 shadow-md flex flex-wrap items-center justify-between gap-2.5 pointer-events-auto">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ward, street, problem..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f6f4f0] border border-[#e5e0d8] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#c8102e] text-[#1a1410]"
            />
          </div>

          {/* Namma Kasa Signature Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedStatus === 'all'
                  ? 'bg-[#1a1410] text-white shadow-xs'
                  : 'bg-[#f6f4f0] text-stone-600 hover:bg-[#eae5dd]'
              }`}
            >
              All ({reports.length})
            </button>
            <button
              onClick={() => setSelectedStatus('open')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                selectedStatus === 'open'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              Unresolved ({totalOpen})
            </button>
            <button
              onClick={() => setSelectedStatus('claimed')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                selectedStatus === 'claimed'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              Verifying ({totalClaimed})
            </button>
            <button
              onClick={() => setSelectedStatus('resolved')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                selectedStatus === 'resolved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Fixed ({totalResolved})
            </button>
          </div>

          {/* Quick Actions & Tile Switcher */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMapSource(mapSource === 'osm' ? 'nammakasa' : 'osm')}
              title="Toggle between OpenStreetMap and Namma Kasa light style (both 100% free)"
              className="px-2 py-1 text-[11px] font-bold rounded-lg border border-[#ded9cf] bg-white text-stone-700 hover:bg-stone-50 flex items-center gap-1"
            >
              <Layers className="w-3 h-3 text-[#c8102e]" />
              <span>{mapSource === 'osm' ? 'OSM' : 'Daylight'}</span>
            </button>

            <button
              onClick={handleNearMeClick}
              title="Show reports near my location"
              className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 transition-colors ${
                filterNearMe
                  ? 'bg-[#0284c7] text-white border-[#0284c7]'
                  : 'bg-white border-[#d6d0c4] text-stone-700 hover:bg-[#f6f4f0]'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t.btn_near_me}</span>
            </button>

            <button
              onClick={() => setShowNearQueue(!showNearQueue)}
              title="Check open reports near you on the street"
              className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 transition-colors ${
                showNearQueue
                  ? 'bg-[#c8102e] text-white border-[#c8102e]'
                  : 'bg-white border-[#d6d0c4] text-stone-700 hover:bg-[#f6f4f0]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Verify Nearby</span>
            </button>

            <button
              onClick={resetView}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-[#d6d0c4] bg-white text-stone-700 hover:bg-[#f6f4f0]"
            >
              Whole Area
            </button>

            <div className="flex items-center border border-[#d6d0c4] rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'map' ? 'bg-[#1a1410] text-white' : 'text-stone-500 hover:bg-[#f6f4f0]'
                }`}
                title="Map View"
              >
                <MapIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'list' ? 'bg-[#1a1410] text-white' : 'text-stone-500 hover:bg-[#f6f4f0]'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pointer-events-auto">
          {categories.map((cat) => {
            const count = cat.id === 'all'
              ? reports.length
              : reports.filter((r) => r.category === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap ${
                  isActive
                    ? 'bg-[#c8102e] text-white border-[#c8102e] scale-105'
                    : 'bg-white/95 backdrop-blur-xs border-[#ded9cf] text-[#44403c] hover:border-stone-400'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#efebe4] text-[#78716c]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAP CONTAINER (Free OpenStreetMap Leaflet Engine) ── */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full relative z-0 ${viewMode === 'map' ? 'block' : 'hidden md:block'}`}
      />

      {/* ── LIST VIEW DRAWER / SIDEBAR (When toggled) ── */}
      {viewMode === 'list' && (
        <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-white z-40 shadow-2xl border-l border-[#ded9cf] flex flex-col">
          <div className="p-3 bg-[#fbf9f5] border-b border-[#ded9cf] flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
              {filteredReports.length} Reports on Record
            </span>
            <button
              onClick={() => setViewMode('map')}
              className="p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#f0ece5]">
            {filteredReports.map((rep) => (
              <div
                key={rep.id}
                onClick={() => onSelectReport(rep)}
                className="p-3 hover:bg-[#faf8f5] cursor-pointer transition-colors flex gap-2.5"
              >
                <img
                  src={rep.photo_url}
                  alt="Defect"
                  className="w-16 h-16 rounded object-cover shrink-0 border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      rep.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rep.status === 'claimed'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {rep.status}
                    </span>
                    <span className="text-[10px] text-stone-500 font-bold">
                      Ward {rep.ward_no}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-stone-900 line-clamp-1">{rep.description}</p>
                  <p className="text-[11px] text-stone-500 line-clamp-1">{rep.landmark}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FLOATING NAMMA KASA 30-SECOND BANNER & AREA CARD (Bottom Left) ── */}
      {showAreaCard && !selectedPinReport && (
        <div className="absolute bottom-6 left-4 z-30 max-w-xs sm:max-w-sm w-full bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-[#ded9cf] space-y-2 pointer-events-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c8102e] animate-ping"></span>
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-stone-900">
                Purulia Municipality · OpenStreetMap
              </h3>
            </div>
            <button
              onClick={() => setShowAreaCard(false)}
              className="text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs font-semibold text-stone-700 leading-snug">
            {t.hero_l1} <span className="text-[#c8102e]">{t.hero_l2}</span>
          </p>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Free OpenStreetMap tiles. Zero API key, zero tracking. Open civic accountability for all citizens.
          </p>

          <div className="pt-2 border-t border-[#f0ece5] flex items-center justify-between text-[11px]">
            <span className="text-stone-600 font-medium">
              MLA: Sudip Mukherjee (Purulia)
            </span>
            <span className="font-bold text-[#c8102e]">
              23 Wards Ranked
            </span>
          </div>
        </div>
      )}

      {/* ── PIN DETAIL SLIDE-UP PREVIEW CARD (When a marker is clicked) ── */}
      {selectedPinReport && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 bg-white rounded-xl shadow-2xl border border-[#ded9cf] p-4 space-y-3 pointer-events-auto animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#c8102e] bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                {selectedPinReport.id}
              </span>
              <h4 className="font-extrabold text-sm text-stone-900 mt-1 line-clamp-1">
                {selectedPinReport.description}
              </h4>
            </div>
            <button
              onClick={() => setSelectedPinReport(null)}
              className="text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative aspect-16/9 rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src={selectedPinReport.photo_url}
              alt="Defect proof"
              className="w-full h-full object-cover"
            />
            <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded text-white ${
              selectedPinReport.status === 'resolved'
                ? 'bg-emerald-600'
                : selectedPinReport.status === 'claimed'
                ? 'bg-indigo-600'
                : 'bg-red-600'
            }`}>
              {selectedPinReport.status.toUpperCase()}
            </span>
          </div>

          <div className="text-xs text-stone-600 space-y-1">
            <p>📍 <span className="font-bold">Location:</span> {selectedPinReport.landmark} (Ward {selectedPinReport.ward_no})</p>
            <p>🏛️ <span className="font-bold">Authority:</span> {selectedPinReport.local_body}</p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onSelectReport(selectedPinReport)}
              className="flex-1 py-2 bg-[#1a1410] hover:bg-stone-800 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Open Case File & Verification</span>
            </button>
          </div>
        </div>
      )}

      {/* ── "CHECK REPORTS NEAR YOU" VERIFICATION QUEUE (Namma Kasa Swipe Drawer) ── */}
      {showNearQueue && (
        <div className="absolute bottom-24 left-4 right-4 sm:left-auto sm:right-6 sm:w-[420px] z-40 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-[#ded9cf] p-4 space-y-3 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 max-h-[75vh] flex flex-col">
          <div className="flex items-center justify-between border-b border-[#ded9cf] pb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c8102e] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Community Verification Queue
              </span>
              <h4 className="font-extrabold text-sm text-stone-900">
                Check Reports Near You
              </h4>
            </div>
            <button
              onClick={() => setShowNearQueue(false)}
              className="text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-stone-500">
            Are you standing near one of these spots? Confirm if it is still unresolved or if it has been cleaned.
          </p>

          <div className="flex-1 overflow-y-auto divide-y divide-[#f0ece5] space-y-2">
            {reports.filter(r => r.status !== 'resolved').slice(0, 5).map((nearRep) => (
              <div key={nearRep.id} className="pt-2 space-y-2">
                <div className="flex gap-2.5">
                  <img
                    src={nearRep.photo_url}
                    alt="Defect spot"
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-stone-500">
                      Ward {nearRep.ward_no} · {nearRep.category.toUpperCase()}
                    </span>
                    <p className="text-xs font-bold text-stone-900 line-clamp-1">{nearRep.description}</p>
                    <p className="text-[11px] text-stone-500 line-clamp-1">📍 {nearRep.landmark}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      onSelectReport(nearRep);
                      setShowNearQueue(false);
                    }}
                    className="flex-1 py-1.5 bg-[#fbf9f5] hover:bg-[#eae5dd] border border-[#ded9cf] text-[11px] font-bold text-stone-800 rounded-md flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye className="w-3 h-3 text-stone-500" />
                    <span>Still There ({nearRep.seen_on_site})</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectReport(nearRep);
                      setShowNearQueue(false);
                    }}
                    className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-[11px] font-bold text-white rounded-md flex items-center justify-center gap-1 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    <span>Looks Fixed →</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SIGNATURE NAMMA KASA FLOATING "REPORT A PROBLEM" BUTTON (Bottom Center) ── */}
      <button
        onClick={onOpenReportModal}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3.5 bg-[#c8102e] hover:bg-[#a60c25] text-white font-extrabold text-sm rounded-full shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 border-2 border-white ring-4 ring-[#c8102e]/25"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
        <Camera className="w-4 h-4 text-white" />
        <span className="tracking-wide">Report a Problem →</span>
      </button>

      {/* ── PURULIA CIVIC HERO GAME FLOATING LAUNCHER (Bottom Right) ── */}
      {onOpenGame && (
        <button
          onClick={onOpenGame}
          className="fixed bottom-6 right-4 sm:right-6 z-40 px-3.5 sm:px-4 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-full shadow-2xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 border-2 border-white ring-4 ring-amber-400/30"
          title="Play Purulia Civic Game"
        >
          <span className="text-base leading-none">🎮</span>
          <span className="hidden sm:inline font-bold">
            {lang === 'bn' ? 'পুরুলিয়া গেম খেলুন' : 'Civic Hero Game'}
          </span>
        </button>
      )}
    </div>
  );
};
