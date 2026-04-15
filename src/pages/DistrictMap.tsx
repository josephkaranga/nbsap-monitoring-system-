import React, { useState } from 'react'
import { DISTRICT_DATA } from '../data/constants'

type Layer = 'submission' | 'compliance' | 'forest'

const STATUS_COLOR: Record<string, string> = {
  submitted: '#10b981',
  pending: '#f59e0b',
  missing: '#f43f5e',
}

// Schematic Rwanda district grid (5 provinces)
const PROVINCE_GRID = [
  { province: 'North', color: '#dbeafe', border: '#93c5fd', districts: ['Gakenke', 'Musanze', 'Burera', 'Rulindo', 'Gicumbi'] },
  { province: 'Kigali', color: '#f3e8ff', border: '#c4b5fd', districts: ['Nyarugenge', 'Gasabo', 'Kicukiro'] },
  { province: 'West', color: '#dcfce7', border: '#86efac', districts: ['Rubavu', 'Nyabihu', 'Ngororero', 'Karongi', 'Rutsiro', 'Rusizi', 'Nyamasheke'] },
  { province: 'South', color: '#fef9c3', border: '#fde047', districts: ['Nyanza', 'Gisagara', 'Nyaruguru', 'Huye', 'Kamonyi', 'Ruhango', 'Muhanga'] },
  { province: 'East', color: '#ffedd5', border: '#fdba74', districts: ['Rwamagana', 'Nyagatare', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Bugesera'] },
]

function getDistrictData(name: string) {
  return DISTRICT_DATA.find(d => d.name === name || d.name.includes(name.split(' ')[0]))
}

function getLayerColor(d: typeof DISTRICT_DATA[0] | undefined, layer: Layer): string {
  if (!d) return '#e2e8f0'
  if (layer === 'submission') return STATUS_COLOR[d.status] ?? '#e2e8f0'
  if (layer === 'compliance') {
    if (d.compliance >= 85) return '#10b981'
    if (d.compliance >= 70) return '#f59e0b'
    return '#f43f5e'
  }
  if (layer === 'forest') {
    if (d.forest >= 35) return '#166534'
    if (d.forest >= 25) return '#16a34a'
    if (d.forest >= 15) return '#4ade80'
    return '#bbf7d0'
  }
  return '#e2e8f0'
}

export function DistrictMap() {
  const [layer, setLayer] = useState<Layer>('submission')
  const [hovered, setHovered] = useState<string | null>(null)

  const topDistricts = [...DISTRICT_DATA]
    .sort((a, b) => b.compliance - a.compliance)
    .slice(0, 10)

  return (
    <div>
      {/* Layer selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
        <span style={{ fontSize: '.78rem', fontWeight: 600, color: '#64748b' }}>Layer:</span>
        <div className="filter-chips">
          {([['submission', 'Submission Status'], ['compliance', 'Compliance Score'], ['forest', 'Forest Cover']] as [Layer, string][]).map(([l, label]) => (
            <button key={l} className={`chip${layer === l ? ' active' : ''}`} onClick={() => setLayer(l)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="grid-2-1">
        {/* Map */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-header">
            <div className="section-title">🗺️ Rwanda District Map</div>
            <span className="section-badge badge-live">Live</span>
          </div>
          <div className="map-container" style={{ minHeight: 360, flexDirection: 'column', gap: 8, padding: 16, alignItems: 'stretch' }}>
            {PROVINCE_GRID.map(prov => (
              <div key={prov.province} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: '.65rem', fontWeight: 700, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>{prov.province}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {prov.districts.map(dname => {
                    const d = getDistrictData(dname)
                    const bg = getLayerColor(d, layer)
                    const isHov = hovered === dname
                    return (
                      <div
                        key={dname}
                        onMouseEnter={() => setHovered(dname)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 7,
                          background: bg,
                          border: `1.5px solid ${isHov ? '#0f2744' : prov.border}`,
                          fontSize: '.65rem',
                          fontWeight: 600,
                          color: '#0f172a',
                          cursor: 'pointer',
                          transition: 'all .15s',
                          transform: isHov ? 'scale(1.05)' : 'scale(1)',
                          boxShadow: isHov ? '0 4px 12px rgba(0,0,0,.15)' : 'none',
                          position: 'relative',
                        }}
                        title={d ? `${dname}: ${layer === 'submission' ? d.status : layer === 'compliance' ? d.compliance + '%' : d.forest + '%'}` : dname}
                      >
                        {dname}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="map-legend">
              {layer === 'submission' && (
                <>
                  {[['submitted', '#10b981', 'Submitted'], ['pending', '#f59e0b', 'Pending'], ['missing', '#f43f5e', 'Missing']].map(([k, c, l]) => (
                    <div key={k} className="legend-row"><div className="legend-swatch" style={{ background: c as string }} /><span>{l}</span></div>
                  ))}
                </>
              )}
              {layer === 'compliance' && (
                <>
                  {[['#10b981', '≥85%'], ['#f59e0b', '70–84%'], ['#f43f5e', '<70%']].map(([c, l]) => (
                    <div key={l} className="legend-row"><div className="legend-swatch" style={{ background: c as string }} /><span>{l}</span></div>
                  ))}
                </>
              )}
              {layer === 'forest' && (
                <>
                  {[['#166534', '≥35%'], ['#16a34a', '25–34%'], ['#4ade80', '15–24%'], ['#bbf7d0', '<15%']].map(([c, l]) => (
                    <div key={l} className="legend-row"><div className="legend-swatch" style={{ background: c as string }} /><span>{l}</span></div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Hovered district info */}
          {hovered && (() => {
            const d = getDistrictData(hovered)
            return d ? (
              <div style={{ marginTop: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '.78rem' }}>
                <strong>{hovered}</strong> · {d.province} Province · Compliance: <strong>{d.compliance}%</strong> · Forest: <strong>{d.forest}%</strong> · Status: <span style={{ color: STATUS_COLOR[d.status] }}>{d.status}</span>
              </div>
            ) : null
          })()}
        </div>

        {/* District Summary */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-header">
            <div className="section-title">🏆 Top 10 by Compliance</div>
          </div>
          {topDistricts.map((d, i) => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ width: 20, fontSize: '.7rem', fontWeight: 700, color: '#94a3b8', fontFamily: "'DM Mono',monospace" }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '.78rem', fontWeight: 600 }}>{d.name}</div>
                <div style={{ fontSize: '.65rem', color: '#94a3b8' }}>{d.province}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '.78rem', fontWeight: 700, color: d.compliance >= 85 ? '#10b981' : '#f59e0b' }}>{d.compliance}%</div>
                <div style={{ width: 60, height: 4, background: '#f1f5f9', borderRadius: 2, marginTop: 2 }}>
                  <div style={{ height: '100%', width: `${d.compliance}%`, background: d.compliance >= 85 ? '#10b981' : '#f59e0b', borderRadius: 2 }} />
                </div>
              </div>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[d.status], flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Province chart */}
      <div className="card" style={{ padding: 20, marginTop: 16 }}>
        <div className="section-header">
          <div className="section-title">📊 District Reporting by Province</div>
        </div>
        <div style={{ height: 160, background: 'linear-gradient(135deg,#f0f9ff,#e0f2fe)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '.8rem', border: '1px dashed #bae6fd' }}>
          📊 Province comparison chart — Chart.js integration pending
        </div>
      </div>
    </div>
  )
}
