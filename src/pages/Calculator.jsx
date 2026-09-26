import React, { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator as CalcIcon, 
  Layers, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  PackageCheck,
  RotateCcw
} from 'lucide-react';

const STANDARD_BRICKS = {
  standard_modular: {
    name: 'Modular Red Clay (IS Standard)',
    lengthMm: 190,
    widthMm: 90,
    heightMm: 90,
    defaultPrice: 9.5
  },
  fly_ash_standard: {
    name: 'High-Density Fly Ash Brick',
    lengthMm: 230,
    widthMm: 110,
    heightMm: 70,
    defaultPrice: 7.2
  },
  refractory_fire: {
    name: 'Refractory Fire Brick (Grade A)',
    lengthMm: 230,
    widthMm: 114,
    heightMm: 65,
    defaultPrice: 32.0
  }
};

const Calculator = () => {
  const navigate = useNavigate();

  const [selectedBrick, setSelectedBrick] = useState('standard_modular');
  const [wallLength, setWallLength] = useState(30); // in feet
  const [wallHeight, setWallHeight] = useState(10); // in feet
  const [wallThickness, setWallThickness] = useState('single'); // 'single' (4.5") or 'double' (9")
  const [mortarRatio, setMortarRatio] = useState('1:6'); // '1:4' or '1:6'
  const [wastagePercent, setWastagePercent] = useState(5); // 5% default

  const lengthM = wallLength * 0.3048;
  const heightM = wallHeight * 0.3048;
  const thicknessM = wallThickness === 'single' ? 0.115 : 0.230; // 4.5 in vs 9 in
  const wallVolumeM3 = lengthM * heightM * thicknessM;

  const brick = STANDARD_BRICKS[selectedBrick];
  const brickLengthM = brick.lengthMm / 1000;
  const brickWidthM = brick.widthMm / 1000;
  const brickHeightM = brick.heightMm / 1000;
  const mortarJointM = 0.01; 

  const nominalL = brickLengthM + mortarJointM;
  const nominalH = brickHeightM + mortarJointM;
  const nominalW = brickWidthM + mortarJointM;

  const nominalBrickVol = nominalL * nominalH * nominalW;
  const actualBrickVol = brickLengthM * brickWidthM * brickHeightM;

  const rawBricksCount = Math.ceil(wallVolumeM3 / nominalBrickVol);
  const totalBricksCount = Math.ceil(rawBricksCount * (1 + wastagePercent / 100));

  const wetMortarVolM3 = Math.max(0, wallVolumeM3 - (rawBricksCount * actualBrickVol));
  const dryMortarVolM3 = wetMortarVolM3 * 1.33;

  const parts = mortarRatio === '1:4' ? 5 : 7; // 1+4=5 or 1+6=7
  const cementVolM3 = dryMortarVolM3 * (1 / parts);
  const sandVolM3 = dryMortarVolM3 * ((parts - 1) / parts);

  const cementBags = Math.ceil(cementVolM3 * 28.8);
  const sandCuFt = Math.ceil(sandVolM3 * 35.3147);

  const estimatedPallets = Math.ceil(totalBricksCount / 500);

  const resetDefaults = () => {
    setSelectedBrick('standard_modular');
    setWallLength(30);
    setWallHeight(10);
    setWallThickness('single');
    setMortarRatio('1:6');
    setWastagePercent(5);
  };

  const handleTransferToQuote = () => {
    navigate('/quote', {
      state: {
        productName: brick.name,
        quantity: totalBricksCount,
        notes: `Calculated via Estimator: Wall ${wallLength}ft x ${wallHeight}ft (${wallThickness === 'single' ? '4.5"' : '9"'} thickness) with ${wastagePercent}% wastage allowance.`
      }
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem', fontFamily: 'sans-serif' }}>
      
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid #EAEAEA', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#A63D2F', padding: '10px', borderRadius: '8px', color: '#FFF' }}>
            <CalcIcon size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, color: '#4A2C23', fontSize: '1.9rem' }}>Brick & Masonry Estimator</h1>
            <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.95rem' }}>
              Precision IS-compliant material quantity estimator for wall masonry and mortar volume.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        <div style={{ background: '#FFF', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #ECECEC' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#4A2C23', margin: 0 }}>Wall Parameters</h2>
            <button 
              onClick={resetDefaults}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="brick-type-select" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#333' }}>
                Select Brick Specification
              </label>
              <select
                id="brick-type-select"
                value={selectedBrick}
                onChange={(e) => setSelectedBrick(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #DDD', fontSize: '0.9rem', outline: 'none' }}
              >
                {Object.entries(STANDARD_BRICKS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.name} ({item.lengthMm} × {item.widthMm} × {item.heightMm} mm)
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="wall-length-input" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#333' }}>
                  Length (Feet)
                </label>
                <input
                  id="wall-length-input"
                  type="number"
                  min="1"
                  value={wallLength}
                  onChange={(e) => setWallLength(Math.max(1, Number(e.target.value)))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #DDD', fontSize: '0.95rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label htmlFor="wall-height-input" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#333' }}>
                  Height (Feet)
                </label>
                <input
                  id="wall-height-input"
                  type="number"
                  min="1"
                  value={wallHeight}
                  onChange={(e) => setWallHeight(Math.max(1, Number(e.target.value)))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #DDD', fontSize: '0.95rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#333' }}>
                Wall Thickness (Structure Type)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setWallThickness('single')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: wallThickness === 'single' ? '2px solid #A63D2F' : '1px solid #DDD',
                    background: wallThickness === 'single' ? '#FFF6F5' : '#FFF',
                    color: wallThickness === 'single' ? '#A63D2F' : '#555',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Single Brick (4.5")
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, color: '#888' }}>Partition Wall</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWallThickness('double')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: wallThickness === 'double' ? '2px solid #A63D2F' : '1px solid #DDD',
                    background: wallThickness === 'double' ? '#FFF6F5' : '#FFF',
                    color: wallThickness === 'double' ? '#A63D2F' : '#555',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Double Brick (9")
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, color: '#888' }}>Load-Bearing Wall</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="mortar-ratio-select" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#333' }}>
                  Mortar Mix
                </label>
                <select
                  id="mortar-ratio-select"
                  value={mortarRatio}
                  onChange={(e) => setMortarRatio(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #DDD', fontSize: '0.9rem' }}
                >
                  <option value="1:4">1:4 (Heavy Duty)</option>
                  <option value="1:6">1:6 (Standard)</option>
                </select>
              </div>
              <div>
                <label htmlFor="wastage-allowance-select" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#333' }}>
                  Wastage Allowance
                </label>
                <select
                  id="wastage-allowance-select"
                  value={wastagePercent}
                  onChange={(e) => setWastagePercent(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #DDD', fontSize: '0.9rem' }}
                >
                  <option value={3}>3% (Precise handling)</option>
                  <option value={5}>5% (Recommended)</option>
                  <option value={10}>10% (Site breakage)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#4A2C23', color: '#FFF', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>
              Total Required Units (with {wastagePercent}% breakage buffer)
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 800, margin: '0.5rem 0', color: '#F5A623' }}>
              {totalBricksCount.toLocaleString()}
              <span style={{ fontSize: '1.2rem', fontWeight: 400, color: '#FFF', marginLeft: '8px' }}>Bricks</span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ opacity: 0.7 }}>Net Required:</span> <strong>{rawBricksCount.toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ opacity: 0.7 }}>Wastage Units:</span> <strong>{(totalBricksCount - rawBricksCount).toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ opacity: 0.7 }}>Estimated Pallets:</span> <strong>~{estimatedPallets}</strong>
              </div>
            </div>
          </div>

          <div style={{ background: '#FFF', padding: '1.75rem', borderRadius: '8px', border: '1px solid #ECECEC', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#4A2C23', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#A63D2F" /> Estimated Mortar & Binding Materials
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#FAF9F6', padding: '1rem', borderRadius: '6px', borderLeft: '3px solid #A63D2F' }}>
                <span style={{ fontSize: '0.8rem', color: '#777', textTransform: 'uppercase' }}>Cement (50 kg Bags)</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#222', marginTop: '4px' }}>
                  {cementBags} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#666' }}>Bags</span>
                </div>
              </div>

              <div style={{ background: '#FAF9F6', padding: '1rem', borderRadius: '6px', borderLeft: '3px solid #795548' }}>
                <span style={{ fontSize: '0.8rem', color: '#777', textTransform: 'uppercase' }}>Fine Sand Volume</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#222', marginTop: '4px' }}>
                  {sandCuFt} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#666' }}>cu. ft</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} color="#2E7D32" />
              <span>Standard 10 mm bed and perpendicular joints calculated.</span>
            </div>
          </div>

          <button
            onClick={handleTransferToQuote}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              backgroundColor: '#A63D2F',
              color: '#FFF',
              border: 'none',
              padding: '1.1rem',
              borderRadius: '6px',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(166, 61, 47, 0.25)',
              transition: 'background 0.2s'
            }}
          >
            <span>Transfer to Commercial Quote Request</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;