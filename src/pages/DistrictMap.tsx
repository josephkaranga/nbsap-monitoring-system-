// src/pages/DistrictMap.tsx
// Real interactive map of Rwanda's 30 districts using Leaflet + GeoJSON

import React, { useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type L from 'leaflet'
import { useDistricts } from '../hooks/useData'
import type { District } from '../types/database'

// Rwanda district GeoJSON — approximate boundaries (WGS84)
const RWANDA_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // Kigali City
    { type: 'Feature', properties: { name: 'Nyarugenge' }, geometry: { type: 'Polygon', coordinates: [[[30.04,-1.94],[30.07,-1.94],[30.07,-1.97],[30.04,-1.97],[30.04,-1.94]]] } },
    { type: 'Feature', properties: { name: 'Gasabo' }, geometry: { type: 'Polygon', coordinates: [[[30.07,-1.90],[30.13,-1.90],[30.13,-1.95],[30.07,-1.95],[30.07,-1.90]]] } },
    { type: 'Feature', properties: { name: 'Kicukiro' }, geometry: { type: 'Polygon', coordinates: [[[30.07,-1.97],[30.12,-1.97],[30.12,-2.01],[30.07,-2.01],[30.07,-1.97]]] } },
    // Northern Province
    { type: 'Feature', properties: { name: 'Rulindo' }, geometry: { type: 'Polygon', coordinates: [[[29.95,-1.70],[30.05,-1.70],[30.05,-1.80],[29.95,-1.80],[29.95,-1.70]]] } },
    { type: 'Feature', properties: { name: 'Gakenke' }, geometry: { type: 'Polygon', coordinates: [[[29.75,-1.65],[29.95,-1.65],[29.95,-1.75],[29.75,-1.75],[29.75,-1.65]]] } },
    { type: 'Feature', properties: { name: 'Musanze' }, geometry: { type: 'Polygon', coordinates: [[[29.55,-1.45],[29.75,-1.45],[29.75,-1.60],[29.55,-1.60],[29.55,-1.45]]] } },
    { type: 'Feature', properties: { name: 'Burera' }, geometry: { type: 'Polygon', coordinates: [[[29.75,-1.40],[29.95,-1.40],[29.95,-1.55],[29.75,-1.55],[29.75,-1.40]]] } },
    { type: 'Feature', properties: { name: 'Gicumbi' }, geometry: { type: 'Polygon', coordinates: [[[30.00,-1.55],[30.15,-1.55],[30.15,-1.70],[30.00,-1.70],[30.00,-1.55]]] } },
    // Southern Province
    { type: 'Feature', properties: { name: 'Muhanga' }, geometry: { type: 'Polygon', coordinates: [[[29.70,-2.05],[29.85,-2.05],[29.85,-2.18],[29.70,-2.18],[29.70,-2.05]]] } },
    { type: 'Feature', properties: { name: 'Kamonyi' }, geometry: { type: 'Polygon', coordinates: [[[29.85,-2.00],[30.00,-2.00],[30.00,-2.12],[29.85,-2.12],[29.85,-2.00]]] } },
    { type: 'Feature', properties: { name: 'Ruhango' }, geometry: { type: 'Polygon', coordinates: [[[29.70,-2.18],[29.85,-2.18],[29.85,-2.30],[29.70,-2.30],[29.70,-2.18]]] } },
    { type: 'Feature', properties: { name: 'Nyanza' }, geometry: { type: 'Polygon', coordinates: [[[29.85,-2.18],[30.00,-2.18],[30.00,-2.30],[29.85,-2.30],[29.85,-2.18]]] } },
    { type: 'Feature', properties: { name: 'Gisagara' }, geometry: { type: 'Polygon', coordinates: [[[29.80,-2.30],[29.95,-2.30],[29.95,-2.45],[29.80,-2.45],[29.80,-2.30]]] } },
    { type: 'Feature', properties: { name: 'Nyaruguru' }, geometry: { type: 'Polygon', coordinates: [[[29.55,-2.40],[29.75,-2.40],[29.75,-2.60],[29.55,-2.60],[29.55,-2.40]]] } },
    { type: 'Feature', properties: { name: 'Huye' }, geometry: { type: 'Polygon', coordinates: [[[29.70,-2.45],[29.85,-2.45],[29.85,-2.60],[29.70,-2.60],[29.70,-2.45]]] } },
    { type: 'Feature', properties: { name: 'Nyamagabe' }, geometry: { type: 'Polygon', coordinates: [[[29.45,-2.25],[29.65,-2.25],[29.65,-2.45],[29.45,-2.45],[29.45,-2.25]]] } },
    { type: 'Feature', properties: { name: 'Rwamagana' }, geometry: { type: 'Polygon', coordinates: [[[30.25,-1.90],[30.45,-1.90],[30.45,-2.05],[30.25,-2.05],[30.25,-1.90]]] } },
    // Eastern Province
    { type: 'Feature', properties: { name: 'Bugesera' }, geometry: { type: 'Polygon', coordinates: [[[30.10,-2.05],[30.30,-2.05],[30.30,-2.25],[30.10,-2.25],[30.10,-2.05]]] } },
    { type: 'Feature', properties: { name: 'Gatsibo' }, geometry: { type: 'Polygon', coordinates: [[[30.35,-1.60],[30.60,-1.60],[30.60,-1.80],[30.35,-1.80],[30.35,-1.60]]] } },
    { type: 'Feature', properties: { name: 'Kayonza' }, geometry: { type: 'Polygon', coordinates: [[[30.45,-1.80],[30.70,-1.80],[30.70,-2.00],[30.45,-2.00],[30.45,-1.80]]] } },
    { type: 'Feature', properties: { name: 'Kirehe' }, geometry: { type: 'Polygon', coordinates: [[[30.55,-2.05],[30.85,-2.05],[30.85,-2.25],[30.55,-2.25],[30.55,-2.05]]] } },
    { type: 'Feature', properties: { name: 'Ngoma' }, geometry: { type: 'Polygon', coordinates: [[[30.30,-2.05],[30.55,-2.05],[30.55,-2.25],[30.30,-2.25],[30.30,-2.05]]] } },
    { type: 'Feature', properties: { name: 'Nyagatare' }, geometry: { type: 'Polygon', coordinates: [[[30.15,-1.25],[30.55,-1.25],[30.55,-1.55],[30.15,-1.55],[30.15,-1.25]]] } },
    // Western Province
    { type: 'Feature', properties: { name: 'Karongi' }, geometry: { type: 'Polygon', coordinates: [[[29.25,-2.00],[29.50,-2.00],[29.50,-2.20],[29.25,-2.20],[29.25,-2.00]]] } },
    { type: 'Feature', properties: { name: 'Ngororero' }, geometry: { type: 'Polygon', coordinates: [[[29.45,-1.80],[29.65,-1.80],[29.65,-2.00],[29.45,-2.00],[29.45,-1.80]]] } },
    { type: 'Feature', properties: { name: 'Nyabihu' }, geometry: { type: 'Polygon', coordinates: [[[29.35,-1.55],[29.55,-1.55],[29.55,-1.75],[29.35,-1.75],[29.35,-1.55]]] } },
    { type: 'Feature', properties: { name: 'Nyamasheke' }, geometry: { type: 'Polygon', coordinates: [[[29.05,-2.20],[29.30,-2.20],[29.30,-2.45],[29.05,-2.45],[29.05,-2.20]]] } },
    { type: 'Feature', properties: { name: 'Rubavu' }, geometry: { type: 'Polygon', coordinates: [[[29.20,-1.55],[29.40,-1.55],[29.40,-1.70],[29.20,-1.70],[29.20,-1.55]]] } },
    { type: 'Feature', properties: { name: 'Rutsiro' }, geometry: { type: 'Polygon', coordinates: [[[29.30,-1.75],[29.50,-1.75],[29.50,-1.95],[29.30,-1.95],[29.30,-1.75]]] } },
    { type: 'Feature', properties: { name: 'Rusizi' }, geometry: { type: 'Polygon', coordinates: [[[28.90,-2.40],[29.15,-2.40],[29.15,-2.65],[28.90,-2.65],[28.90,-2.40]]] } },
  ],
}

type LayerMode = 'submission' | 'compliance' | 'forest'

function getColor(d: District | undefined, mode: LayerMode): string {
  if (!d) return '#cbd5e1'
  if (mode === 'submission') {
    return d.submission_status === 'submitted' ? '#10b981'
      : d.submission_status === 'pending' ? '#f59e0b'
      : '#f43f5e'
  }
  if (mode === 'compliance') {
    const s = d.compliance_score
    return s >= 80 ? '#10b981' : s >= 65 ? '#84cc16' : s >= 50 ? '#f59e0b' : '#f43f5e'
  }
  const f = d.forest_cover_pct
  return f >= 30 ? '#166534' : f >= 20 ? '#16a34a' : f >= 10 ? '#4ade80' : '#bbf7d0'
}

export function DistrictMap() {
  const { districts, distStats, loading } = useDistricts()
  const [layerMode, setLayerMode] = useState<LayerMode>('submission')
  const [selected, setSelected] = useState<District | null>(null)

  const districtByName = React.useMemo(() => {
    const map: Record<string, District> = {}
    districts.forEach(d => { map[d.name.toLowerCase()] = d })
    return map
  }, [districts])

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    const name = (feature.properties?.name as string) ?? ''
    const d = districtByName[name.toLowerCase()]
    const path = layer as L.Path
    path.setStyle({ fillColor: getColor(d, layerMode), fillOpacity: 0.75, color: '#fff', weight: 1.5 })
    layer.on({
      click: () => setSelected(d ?? null),
      mouseover: (e: L.LeafletMouseEvent) => (e.target as L.Path).setStyle({ fillOpacity: 0.95, weight: 2.5 }),
      mouseout: (e: L.LeafletMouseEvent) => (e.target as L.Path).setStyle({ fillOpacity: 0.75, weight: 1.5 }),
    })
    if (d) {
      layer.bindTooltip(
        `<strong>${d.name}</strong><br/>Compliance: ${d.compliance_score}%<br/>Forest: ${d.forest_cover_pct}%<br/>Status: ${d.submission_status}`,
        { sticky: true, className: 'leaflet-tooltip' }
      )
    } else {
      layer.bindTooltip(name, { sticky: true })
    }
  }

  const LAYERS: { id: LayerMode; label: string }[] = [
    { id: 'submission', label: '📋 Submission' },
    { id: 'compliance', label: '⚖️ Compliance' },
    { id: 'forest', label: '🌿 Forest Cover' },
  ]

  const LEGENDS: Record<LayerMode, { color: string; label: string }[]> = {
    submission: [{ color: '#10b981', label: 'Submitted' }, { color: '#f59e0b', label: 'Pending' }, { color: '#f43f5e', label: 'Missing' }],
    compliance: [{ color: '#10b981', label: '≥80%' }, { color: '#84cc16', label: '65–80%' }, { color: '#f59e0b', label: '50–65%' }, { color: '#f43f5e', label: '<50%' }],
    forest: [{ color: '#166534', label: '≥30%' }, { color: '#16a34a', label: '20–30%' }, { color: '#4ade80', label: '10–20%' }, { color: '#bbf7d0', label: '<10%' }],
  }

  return (
    <div>
      {/* Stats */}
      {distStats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '16px' }}>
          {[
            { label: 'Total Districts', val: distStats.total, color: '#0ea5e9' },
            { label: 'Submitted', val: distStats.submitted, color: '#10b981' },
            { label: 'Pending', val: distStats.pending, color: '#f59e0b' },
            { label: 'Missing', val: distStats.missing, color: '#f43f5e' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '.68rem', color: '#94a3b8', fontFamily: "'DM Mono',monospace", marginTop: '3px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Layer controls + legend */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '.72rem', fontWeight: 600, color: '#94a3b8', fontFamily: "'DM Mono',monospace", textTransform: 'uppercase', letterSpacing: '.06em' }}>Layer</span>
        {LAYERS.map(l => (
          <button key={l.id} onClick={() => setLayerMode(l.id)} style={{
            padding: '5px 14px', borderRadius: '20px', border: '1px solid #e2e8f0',
            fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            background: layerMode === l.id ? '#0f2744' : '#fff',
            color: layerMode === l.id ? '#fff' : '#475569',
          }}>{l.label}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {LEGENDS[layerMode].map(l => (
            <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '.72rem', color: '#475569' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: l.color, display: 'inline-block' }} />{l.label}
            </span>
          ))}
        </div>
      </div>

      {/* Map + detail */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 280px' : '1fr', gap: '12px' }}>
        <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', height: '520px' }}>
          {loading ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#94a3b8' }}>
              Loading district data…
            </div>
          ) : (
            <MapContainer center={[-1.94, 29.87]} zoom={8} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <GeoJSON key={layerMode + districts.length} data={RWANDA_GEOJSON} onEachFeature={onEachFeature} />
            </MapContainer>
          )}
        </div>

        {selected && (
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '18px', alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '.95rem', fontWeight: 700 }}>{selected.name}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
            {[
              { label: 'Province', val: (selected as any).provinces?.name ?? '—', color: undefined },
              { label: 'Compliance', val: `${selected.compliance_score}%`, color: selected.compliance_score >= 80 ? '#10b981' : selected.compliance_score >= 65 ? '#f59e0b' : '#f43f5e' },
              { label: 'Forest Cover', val: `${selected.forest_cover_pct}%`, color: '#166534' },
              { label: 'Status', val: selected.submission_status, color: selected.submission_status === 'submitted' ? '#10b981' : selected.submission_status === 'pending' ? '#f59e0b' : '#f43f5e' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc', fontSize: '.8rem' }}>
                <span style={{ color: '#64748b' }}>{r.label}</span>
                <span style={{ fontWeight: 700, color: r.color ?? '#0f172a', fontFamily: "'DM Mono',monospace", fontSize: '.75rem' }}>{r.val}</span>
              </div>
            ))}
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '.68rem', color: '#94a3b8', marginBottom: '5px' }}>Compliance</div>
              <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${selected.compliance_score}%`, borderRadius: '4px', transition: 'width .6s', background: selected.compliance_score >= 80 ? '#10b981' : selected.compliance_score >= 65 ? '#f59e0b' : '#f43f5e' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
