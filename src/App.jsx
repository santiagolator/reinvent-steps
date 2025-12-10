import React, { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';

const RANKS = [
  { min: 0, max: 30000, name: "Cloud Seedling", emoji: "🌱", color: "#6B7280", description: "Your journey begins!" },
  { min: 30000, max: 50000, name: "Cloud Wanderer", emoji: "🧭", color: "#3B82F6", description: "Finding your path" },
  { min: 50000, max: 75000, name: "Trail Blazer", emoji: "🔥", color: "#10B981", description: "Forging new routes" },
  { min: 75000, max: 100000, name: "Summit Seeker", emoji: "⛰️", color: "#8B5CF6", description: "Eyes on the peak" },
  { min: 100000, max: 125000, name: "Cloud Strider", emoji: "🌤️", color: "#F59E0B", description: "Walking among clouds" },
  { min: 125000, max: 150000, name: "Legend Walker", emoji: "🗺️", color: "#EF4444", description: "Your name echoes in halls" },
  { min: 150000, max: 175000, name: "Cloud Titan", emoji: "👑", color: "#FF9900", description: "A force of nature" },
  { min: 175000, max: Infinity, name: "Werner Vogels Mode", emoji: "🚀", color: "#FF6B35", description: "Everything fails all the time... except your legs!" }
];

const VENUES = [
  "The Venetian", "MGM Grand", "Wynn", "Caesars Forum", 
  "Mandalay Bay", "Encore", "LINQ", "Aria"
];

const DAY_LABELS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

function getRank(totalSteps) {
  return RANKS.find(r => totalSteps >= r.min && totalSteps < r.max) || RANKS[RANKS.length - 1];
}

function formatNumber(num) {
  return num.toLocaleString('es-AR');
}

function stepsToKm(steps) {
  return (steps * 0.000762).toFixed(2);
}

export default function ReInventStepsGenerator() {
  const [linkedinUser, setLinkedinUser] = useState("");
  const [days, setDays] = useState([
    { label: "DOM", steps: 0, active: true },
    { label: "LUN", steps: 0, active: true },
    { label: "MAR", steps: 0, active: true },
    { label: "MIÉ", steps: 0, active: true },
    { label: "JUE", steps: 0, active: true },
    { label: "VIE", steps: 0, active: true },
  ]);
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef(null);

  const totalSteps = days.filter(d => d.active).reduce((sum, d) => sum + (parseInt(d.steps) || 0), 0);
  const activeDays = days.filter(d => d.active && d.steps > 0).length;
  const avgSteps = activeDays > 0 ? Math.round(totalSteps / activeDays) : 0;
  const totalKm = stepsToKm(totalSteps);
  const avgKm = stepsToKm(avgSteps);
  const maxSteps = Math.max(...days.map(d => parseInt(d.steps) || 0));
  const rank = getRank(totalSteps);

  const updateDaySteps = (index, value) => {
    const newDays = [...days];
    newDays[index].steps = value;
    setDays(newDays);
  };

  const toggleDay = (index) => {
    const newDays = [...days];
    newDays[index].active = !newDays[index].active;
    setDays(newDays);
  };

  const addDay = () => {
    if (days.length < 7) {
      setDays([...days, { label: DAY_LABELS[days.length], steps: 0, active: true }]);
    }
  };

  const removeDay = (index) => {
    if (days.length > 1) {
      setDays(days.filter((_, i) => i !== index));
    }
  };

  const toggleVenue = (venue) => {
    if (selectedVenues.includes(venue)) {
      setSelectedVenues(selectedVenues.filter(v => v !== venue));
    } else {
      setSelectedVenues([...selectedVenues, venue]);
    }
  };

  const generateCard = () => {
    setShowCard(true);
  };

  const downloadAsImage = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: '#1a2332',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });

      const link = document.createElement('a');
      link.download = `reinvent-2025-${formatNumber(totalSteps).replace(/\./g, '')}-steps.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error al generar la imagen. Por favor intenta de nuevo.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6" style={{
      background: 'linear-gradient(135deg, #0a0e14 0%, #161b22 50%, #0d1117 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#f1f8ff'
    }}>
      {/* Header */}
      <div className="text-center mb-8 pt-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <svg width="60" viewBox="0 0 304 182">
            <path d="M86.4 66.4c0 3.7.4 6.7 1.1 8.9.8 2.2 1.8 4.6 3.2 7.2.5.8.7 1.6.7 2.3 0 1-.6 2-1.9 3l-6.3 4.2c-.9.6-1.8.9-2.6.9-1 0-2-.5-3-1.4-1.4-1.5-2.6-3.1-3.6-4.7-1-1.7-2-3.6-3.1-5.9-7.8 9.2-17.6 13.8-29.4 13.8-8.4 0-15.1-2.4-20-7.2-4.9-4.8-7.4-11.2-7.4-19.2 0-8.5 3-15.4 9.1-20.6 6.1-5.2 14.2-7.8 24.5-7.8 3.4 0 6.9.3 10.6.8 3.7.5 7.5 1.3 11.5 2.2v-7.3c0-7.6-1.6-12.9-4.7-16-3.2-3.1-8.6-4.6-16.3-4.6-3.5 0-7.1.4-10.8 1.3-3.7.9-7.3 2-10.8 3.4-1.6.7-2.8 1.1-3.5 1.3-.7.2-1.2.3-1.6.3-1.4 0-2.1-1-2.1-3.1v-4.9c0-1.6.2-2.8.7-3.5.5-.7 1.4-1.4 2.8-2.1 3.5-1.8 7.7-3.3 12.6-4.5 4.9-1.3 10.1-1.9 15.6-1.9 11.9 0 20.6 2.7 26.2 8.1 5.5 5.4 8.3 13.6 8.3 24.6v32.4zM45.8 81.6c3.3 0 6.7-.6 10.3-1.8 3.6-1.2 6.8-3.4 9.5-6.4 1.6-1.9 2.8-4 3.4-6.4.6-2.4 1-5.3 1-8.7v-4.2c-2.9-.7-6-1.3-9.2-1.7-3.2-.4-6.3-.6-9.4-.6-6.7 0-11.6 1.3-14.9 4-3.3 2.7-4.9 6.5-4.9 11.5 0 4.7 1.2 8.2 3.7 10.6 2.4 2.5 5.9 3.7 10.5 3.7zm80.3 10.8c-1.8 0-3-.3-3.8-1-.8-.6-1.5-2-2.1-3.9L96.7 10.2c-.6-2-.9-3.3-.9-4 0-1.6.8-2.5 2.4-2.5h9.8c1.9 0 3.2.3 3.9 1 .8.6 1.4 2 2 3.9l16.8 66.2 15.6-66.2c.5-2 1.1-3.3 1.9-3.9.8-.6 2.2-1 4-1h8c1.9 0 3.2.3 4 1 .8.6 1.5 2 1.9 3.9l15.8 67 17.3-67c.6-2 1.3-3.3 2-3.9.8-.6 2.1-1 3.9-1h9.3c1.6 0 2.5.8 2.5 2.5 0 .5-.1 1-.2 1.6-.1.6-.3 1.4-.7 2.5l-24.1 77.3c-.6 2-1.3 3.3-2.1 3.9-.8.6-2.1 1-3.8 1h-8.6c-1.9 0-3.2-.3-4-1-.8-.7-1.5-2-1.9-4l-15.5-64.5-15.4 64.4c-.5 2-1.1 3.3-1.9 4-.8.7-2.2 1-4 1h-8.6zm128.5 2.7c-5.2 0-10.4-.6-15.4-1.8-5-1.2-8.9-2.5-11.5-4-1.6-.9-2.7-1.9-3.1-2.8-.4-.9-.6-1.9-.6-2.8v-5.1c0-2.1.8-3.1 2.3-3.1.6 0 1.2.1 1.8.3.6.2 1.5.6 2.5 1 3.4 1.5 7.1 2.7 11 3.5 4 .8 7.9 1.2 11.9 1.2 6.3 0 11.2-1.1 14.6-3.3 3.4-2.2 5.2-5.4 5.2-9.5 0-2.8-.9-5.1-2.7-7-1.8-1.9-5.2-3.6-10.1-5.2L246 52c-7.3-2.3-12.7-5.7-16-10.2-3.3-4.4-5-9.3-5-14.5 0-4.2.9-7.9 2.7-11.1 1.8-3.2 4.2-6 7.2-8.2 3-2.3 6.4-4 10.4-5.2 4-1.2 8.2-1.7 12.6-1.7 2.2 0 4.5.1 6.7.4 2.3.3 4.4.7 6.5 1.1 2 .5 3.9 1 5.7 1.6 1.8.6 3.2 1.2 4.2 1.8 1.4.8 2.4 1.6 3 2.5.6.8.9 1.9.9 3.3v4.7c0 2.1-.8 3.2-2.3 3.2-.8 0-2.1-.4-3.8-1.2-5.7-2.6-12.1-3.9-19.2-3.9-5.7 0-10.2.9-13.3 2.8-3.1 1.9-4.7 4.8-4.7 8.9 0 2.8 1 5.2 3 7.1 2 1.9 5.7 3.8 11 5.5l14.2 4.5c7.2 2.3 12.4 5.5 15.5 9.6 3.1 4.1 4.6 8.8 4.6 14 0 4.3-.9 8.2-2.6 11.6-1.8 3.4-4.2 6.4-7.3 8.8-3.1 2.5-6.8 4.3-11.1 5.6-4.5 1.4-9.2 2.1-14.3 2.1z" fill="#252F3E"/>
            <path d="M273.5 143.7c-32.9 24.3-80.7 37.2-121.8 37.2-57.6 0-109.5-21.3-148.7-56.7-3.1-2.8-.3-6.6 3.4-4.4 42.4 24.6 94.7 39.5 148.8 39.5 36.5 0 76.6-7.6 113.5-23.2 5.5-2.5 10.2 3.6 4.8 7.6z" fill="#FF9900"/>
            <path d="M287.2 128.1c-4.2-5.4-27.8-2.6-38.5-1.3-3.2.4-3.7-2.4-.8-4.5 18.8-13.2 49.7-9.4 53.3-5 3.6 4.5-1 35.4-18.6 50.2-2.7 2.3-5.3 1.1-4.1-1.9 4-9.9 12.9-32.2 8.7-37.5z" fill="#FF9900"/>
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2" style={{
          background: 'linear-gradient(135deg, #FF9900, #ffcc66)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          re:Invent 2025 Step Counter
        </h1>
        <p style={{ color: '#8b949e' }}>
          Generá tu tarjeta personalizada con tus pasos del evento
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-6" style={{
        gridTemplateColumns: showCard ? 'minmax(300px, 1fr) minmax(300px, 420px)' : '1fr',
        maxWidth: showCard ? '1000px' : '500px'
      }}>
        {/* Form Section */}
        <div style={{
          background: 'linear-gradient(160deg, #1a2332 0%, #0f1419 100%)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 153, 0, 0.1)'
        }}>
          <h2 className="mb-5 text-lg flex items-center gap-2">
            <span className="text-xl">📊</span> Ingresá tus datos
          </h2>

          {/* LinkedIn User */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-semibold" style={{ color: '#8b949e' }}>
              <span className="inline-flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Tu perfil de LinkedIn
              </span>
            </label>
            <div className="flex rounded-xl overflow-hidden" style={{
              background: 'rgba(35, 47, 62, 0.8)',
              border: '1px solid rgba(255, 153, 0, 0.2)'
            }}>
              <span className="px-3 py-3 text-sm font-medium flex items-center" style={{ 
                background: 'rgba(255, 153, 0, 0.1)',
                color: '#8b949e',
                borderRight: '1px solid rgba(255, 153, 0, 0.2)'
              }}>
                linkedin.com/in/
              </span>
              <input
                type="text"
                value={linkedinUser}
                onChange={(e) => setLinkedinUser(e.target.value)}
                placeholder="tunombre"
                className="flex-1 p-3 outline-none"
                style={{
                  background: 'transparent',
                  color: '#fff'
                }}
              />
            </div>
          </div>

          {/* Days input */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold" style={{ color: '#8b949e' }}>
                Pasos por día
              </label>
              {days.length < 7 && (
                <button
                  onClick={addDay}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                  style={{
                    background: 'rgba(255, 153, 0, 0.2)',
                    border: '1px solid rgba(255, 153, 0, 0.3)',
                    color: '#FF9900'
                  }}
                >
                  + Día
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              {days.map((day, index) => (
                <div key={index} className="flex items-center gap-2" style={{ opacity: day.active ? 1 : 0.5 }}>
                  <button
                    onClick={() => toggleDay(index)}
                    className="w-14 py-2 rounded-lg font-bold text-xs"
                    style={{
                      background: day.active ? 'rgba(255, 153, 0, 0.2)' : 'rgba(35, 47, 62, 0.5)',
                      border: `1px solid ${day.active ? 'rgba(255, 153, 0, 0.3)' : 'rgba(139, 148, 158, 0.2)'}`,
                      color: day.active ? '#FF9900' : '#6e7681'
                    }}
                  >
                    {day.label}
                  </button>
                  <input
                    type="number"
                    value={day.steps || ''}
                    onChange={(e) => updateDaySteps(index, e.target.value)}
                    placeholder="0"
                    disabled={!day.active}
                    className="flex-1 p-2.5 rounded-lg outline-none"
                    style={{
                      background: 'rgba(35, 47, 62, 0.8)',
                      border: '1px solid rgba(255, 153, 0, 0.2)',
                      color: '#fff'
                    }}
                  />
                  <span className="text-xs w-16" style={{ color: '#6e7681' }}>
                    {stepsToKm(day.steps || 0)} km
                  </span>
                  {days.length > 1 && (
                    <button
                      onClick={() => removeDay(index)}
                      className="p-2 rounded-md text-sm"
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Venues */}
          <div className="mb-5">
            <label className="block mb-3 text-sm font-semibold" style={{ color: '#8b949e' }}>
              🏨 Venues que recorriste
            </label>
            <div className="flex flex-wrap gap-2">
              {VENUES.map(venue => (
                <button
                  key={venue}
                  onClick={() => toggleVenue(venue)}
                  className="px-3 py-2 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: selectedVenues.includes(venue) ? 'rgba(255, 153, 0, 0.2)' : 'rgba(35, 47, 62, 0.5)',
                    border: `1px solid ${selectedVenues.includes(venue) ? 'rgba(255, 153, 0, 0.3)' : 'rgba(139, 148, 158, 0.2)'}`,
                    color: selectedVenues.includes(venue) ? '#FF9900' : '#8b949e'
                  }}
                >
                  {venue}
                </button>
              ))}
            </div>
          </div>

          {/* Live Stats Preview */}
          <div className="rounded-2xl p-4 mb-5" style={{
            background: 'rgba(255, 153, 0, 0.1)',
            border: '1px solid rgba(255, 153, 0, 0.2)'
          }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs uppercase tracking-wider" style={{ color: '#8b949e' }}>Total Pasos</div>
                <div className="text-2xl font-extrabold" style={{ color: '#FF9900' }}>{formatNumber(totalSteps)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider" style={{ color: '#8b949e' }}>Distancia</div>
                <div className="text-2xl font-extrabold">{totalKm} km</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider" style={{ color: '#8b949e' }}>Tu Rango</div>
                <div className="text-base font-bold" style={{ color: rank.color }}>
                  {rank.emoji} {rank.name}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider" style={{ color: '#8b949e' }}>Promedio/día</div>
                <div className="text-base font-bold">{formatNumber(avgSteps)}</div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateCard}
            disabled={totalSteps === 0}
            className="w-full py-4 rounded-xl text-lg font-bold transition-all"
            style={{
              background: totalSteps > 0 ? 'linear-gradient(135deg, #FF9900, #ffb84d)' : 'rgba(139, 148, 158, 0.3)',
              color: totalSteps > 0 ? '#232F3E' : '#6e7681',
              cursor: totalSteps > 0 ? 'pointer' : 'not-allowed',
              boxShadow: totalSteps > 0 ? '0 4px 20px rgba(255, 153, 0, 0.4)' : 'none'
            }}
          >
            🎫 Generar Mi Tarjeta
          </button>
        </div>

        {/* Card Preview */}
        {showCard && (
          <div>
            <div ref={cardRef} style={{
              background: 'linear-gradient(160deg, #1a2332 0%, #0f1419 100%)',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 153, 0, 0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Top border */}
              <div style={{
                height: '4px',
                background: 'linear-gradient(90deg, #FF9900, #ffb84d, #FF9900)'
              }} />

              {/* Header */}
              <div style={{
                padding: '20px 24px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 153, 0, 0.15)',
                background: 'linear-gradient(180deg, rgba(255, 153, 0, 0.08) 0%, transparent 100%)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="50" viewBox="0 0 304 182">
                    <path d="M86.4 66.4c0 3.7.4 6.7 1.1 8.9.8 2.2 1.8 4.6 3.2 7.2.5.8.7 1.6.7 2.3 0 1-.6 2-1.9 3l-6.3 4.2c-.9.6-1.8.9-2.6.9-1 0-2-.5-3-1.4-1.4-1.5-2.6-3.1-3.6-4.7-1-1.7-2-3.6-3.1-5.9-7.8 9.2-17.6 13.8-29.4 13.8-8.4 0-15.1-2.4-20-7.2-4.9-4.8-7.4-11.2-7.4-19.2 0-8.5 3-15.4 9.1-20.6 6.1-5.2 14.2-7.8 24.5-7.8 3.4 0 6.9.3 10.6.8 3.7.5 7.5 1.3 11.5 2.2v-7.3c0-7.6-1.6-12.9-4.7-16-3.2-3.1-8.6-4.6-16.3-4.6-3.5 0-7.1.4-10.8 1.3-3.7.9-7.3 2-10.8 3.4-1.6.7-2.8 1.1-3.5 1.3-.7.2-1.2.3-1.6.3-1.4 0-2.1-1-2.1-3.1v-4.9c0-1.6.2-2.8.7-3.5.5-.7 1.4-1.4 2.8-2.1 3.5-1.8 7.7-3.3 12.6-4.5 4.9-1.3 10.1-1.9 15.6-1.9 11.9 0 20.6 2.7 26.2 8.1 5.5 5.4 8.3 13.6 8.3 24.6v32.4zM45.8 81.6c3.3 0 6.7-.6 10.3-1.8 3.6-1.2 6.8-3.4 9.5-6.4 1.6-1.9 2.8-4 3.4-6.4.6-2.4 1-5.3 1-8.7v-4.2c-2.9-.7-6-1.3-9.2-1.7-3.2-.4-6.3-.6-9.4-.6-6.7 0-11.6 1.3-14.9 4-3.3 2.7-4.9 6.5-4.9 11.5 0 4.7 1.2 8.2 3.7 10.6 2.4 2.5 5.9 3.7 10.5 3.7zm80.3 10.8c-1.8 0-3-.3-3.8-1-.8-.6-1.5-2-2.1-3.9L96.7 10.2c-.6-2-.9-3.3-.9-4 0-1.6.8-2.5 2.4-2.5h9.8c1.9 0 3.2.3 3.9 1 .8.6 1.4 2 2 3.9l16.8 66.2 15.6-66.2c.5-2 1.1-3.3 1.9-3.9.8-.6 2.2-1 4-1h8c1.9 0 3.2.3 4 1 .8.6 1.5 2 1.9 3.9l15.8 67 17.3-67c.6-2 1.3-3.3 2-3.9.8-.6 2.1-1 3.9-1h9.3c1.6 0 2.5.8 2.5 2.5 0 .5-.1 1-.2 1.6-.1.6-.3 1.4-.7 2.5l-24.1 77.3c-.6 2-1.3 3.3-2.1 3.9-.8.6-2.1 1-3.8 1h-8.6c-1.9 0-3.2-.3-4-1-.8-.7-1.5-2-1.9-4l-15.5-64.5-15.4 64.4c-.5 2-1.1 3.3-1.9 4-.8.7-2.2 1-4 1h-8.6zm128.5 2.7c-5.2 0-10.4-.6-15.4-1.8-5-1.2-8.9-2.5-11.5-4-1.6-.9-2.7-1.9-3.1-2.8-.4-.9-.6-1.9-.6-2.8v-5.1c0-2.1.8-3.1 2.3-3.1.6 0 1.2.1 1.8.3.6.2 1.5.6 2.5 1 3.4 1.5 7.1 2.7 11 3.5 4 .8 7.9 1.2 11.9 1.2 6.3 0 11.2-1.1 14.6-3.3 3.4-2.2 5.2-5.4 5.2-9.5 0-2.8-.9-5.1-2.7-7-1.8-1.9-5.2-3.6-10.1-5.2L246 52c-7.3-2.3-12.7-5.7-16-10.2-3.3-4.4-5-9.3-5-14.5 0-4.2.9-7.9 2.7-11.1 1.8-3.2 4.2-6 7.2-8.2 3-2.3 6.4-4 10.4-5.2 4-1.2 8.2-1.7 12.6-1.7 2.2 0 4.5.1 6.7.4 2.3.3 4.4.7 6.5 1.1 2 .5 3.9 1 5.7 1.6 1.8.6 3.2 1.2 4.2 1.8 1.4.8 2.4 1.6 3 2.5.6.8.9 1.9.9 3.3v4.7c0 2.1-.8 3.2-2.3 3.2-.8 0-2.1-.4-3.8-1.2-5.7-2.6-12.1-3.9-19.2-3.9-5.7 0-10.2.9-13.3 2.8-3.1 1.9-4.7 4.8-4.7 8.9 0 2.8 1 5.2 3 7.1 2 1.9 5.7 3.8 11 5.5l14.2 4.5c7.2 2.3 12.4 5.5 15.5 9.6 3.1 4.1 4.6 8.8 4.6 14 0 4.3-.9 8.2-2.6 11.6-1.8 3.4-4.2 6.4-7.3 8.8-3.1 2.5-6.8 4.3-11.1 5.6-4.5 1.4-9.2 2.1-14.3 2.1z" fill="#252F3E"/>
                    <path d="M273.5 143.7c-32.9 24.3-80.7 37.2-121.8 37.2-57.6 0-109.5-21.3-148.7-56.7-3.1-2.8-.3-6.6 3.4-4.4 42.4 24.6 94.7 39.5 148.8 39.5 36.5 0 76.6-7.6 113.5-23.2 5.5-2.5 10.2 3.6 4.8 7.6z" fill="#FF9900"/>
                    <path d="M287.2 128.1c-4.2-5.4-27.8-2.6-38.5-1.3-3.2.4-3.7-2.4-.8-4.5 18.8-13.2 49.7-9.4 53.3-5 3.6 4.5-1 35.4-18.6 50.2-2.7 2.3-5.3 1.1-4.1-1.9 4-9.9 12.9-32.2 8.7-37.5z" fill="#FF9900"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: '1.1em', fontWeight: '700', color: '#fff' }}>re:Invent</div>
                    <div style={{ fontSize: '0.75em', color: '#FF9900', fontWeight: '600' }}>2025 • LAS VEGAS</div>
                  </div>
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(255, 153, 0, 0.15)',
                  padding: '5px 10px',
                  borderRadius: '16px',
                  fontSize: '0.65em',
                  color: '#FF9900',
                  fontWeight: '600',
                  lineHeight: 1
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>📍</span>
                  <span>Las Vegas</span>
                </div>
              </div>

              {/* Main Content */}
              <div style={{ padding: '24px' }}>
                {/* Rank badge */}
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: 'rgba(255, 153, 0, 0.15)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 153, 0, 0.3)',
                    lineHeight: 1
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '1.2em', lineHeight: 1 }}>{rank.emoji}</span>
                    <span style={{ color: rank.color, fontSize: '0.85em', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1 }}>{rank.name}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '1.2em', lineHeight: 1 }}>{rank.emoji}</span>
                  </div>
                </div>

                {/* Main Metric */}
                <div style={{
                  fontSize: '3.5em',
                  fontWeight: '900',
                  textAlign: 'center',
                  color: '#FF9900',
                  marginBottom: '6px',
                  letterSpacing: '-2px',
                  lineHeight: 1
                }}>
                  {formatNumber(totalSteps)}
                </div>
                <div style={{
                  textAlign: 'center',
                  fontSize: '0.75em',
                  color: '#8b949e',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontWeight: '600',
                  marginBottom: '16px'
                }}>
                  Pasos Totales
                </div>

                {/* Stats pills */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    background: 'rgba(35, 47, 62, 0.8)',
                    borderRadius: '50px',
                    border: '1px solid rgba(255, 153, 0, 0.2)',
                    lineHeight: 1
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>⏱️</span>
                    <span style={{ fontWeight: '700', lineHeight: 1 }}>{activeDays || days.filter(d => d.active).length}</span>
                    <span style={{ color: '#8b949e', fontSize: '0.8em', lineHeight: 1 }}>días</span>
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    background: 'rgba(35, 47, 62, 0.8)',
                    borderRadius: '50px',
                    border: '1px solid rgba(255, 153, 0, 0.2)',
                    lineHeight: 1
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>📍</span>
                    <span style={{ fontWeight: '700', lineHeight: 1 }}>{totalKm}</span>
                    <span style={{ color: '#8b949e', fontSize: '0.8em', lineHeight: 1 }}>km</span>
                  </div>
                </div>

                {/* Chart */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    fontSize: '0.65em',
                    color: '#8b949e',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}>
                    ─── Pasos por día ───
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    height: '130px',
                    padding: '25px 4px 0 4px'
                  }}>
                    {days.filter(d => d.active).map((day, index) => {
                      const height = maxSteps > 0 ? ((parseInt(day.steps) || 0) / maxSteps) * 100 : 0;
                      const isMax = parseInt(day.steps) === maxSteps && maxSteps > 0;
                      return (
                        <div key={index} style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          flex: 1,
                          height: '100%',
                          justifyContent: 'flex-end'
                        }}>
                          <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'flex-end', padding: '0 3px', position: 'relative' }}>
                            {isMax && (
                              <div style={{
                                position: 'absolute',
                                top: '-25px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '0.6em',
                                fontWeight: '700',
                                color: '#FF9900',
                                whiteSpace: 'nowrap',
                                background: 'rgba(255, 153, 0, 0.15)',
                                padding: '3px 8px',
                                borderRadius: '8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                lineHeight: 1
                              }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>🏆</span>
                                <span style={{ lineHeight: 1 }}>{formatNumber(maxSteps)}</span>
                              </div>
                            )}
                            <div style={{
                              width: '100%',
                              height: `${Math.max(height, 5)}%`,
                              background: isMax
                                ? 'linear-gradient(180deg, #ffcc66 0%, #FF9900 50%, #e68a00 100%)'
                                : 'linear-gradient(180deg, #4a5d70 0%, #3d4f61 100%)',
                              borderRadius: '5px 5px 2px 2px',
                              boxShadow: isMax ? '0 0 15px rgba(255, 153, 0, 0.4)' : 'none',
                              border: isMax ? '1px solid rgba(255, 153, 0, 0.5)' : '1px solid rgba(255, 153, 0, 0.3)'
                            }} />
                          </div>
                          <div style={{ fontSize: '0.65em', color: '#8b949e', marginTop: '8px', fontWeight: '600' }}>
                            {day.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Venues */}
                {selectedVenues.length > 0 && (
                  <div style={{
                    padding: '12px',
                    background: 'rgba(35, 47, 62, 0.5)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 153, 0, 0.1)',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '0.6em', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                      🏨 Venues Recorridos
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {selectedVenues.map(venue => (
                        <span key={venue} style={{
                          fontSize: '0.6em',
                          padding: '3px 8px',
                          background: 'rgba(255, 153, 0, 0.1)',
                          borderRadius: '10px',
                          color: '#c9d1d9',
                          border: '1px solid rgba(255, 153, 0, 0.15)'
                        }}>
                          {venue}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div style={{
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 153, 0, 0.15)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <div style={{ fontSize: '0.65em', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                      Media Diaria
                    </div>
                    <div style={{ fontSize: '1.6em', fontWeight: '800', color: '#FF9900', lineHeight: 1 }}>
                      {formatNumber(avgSteps)}
                    </div>
                    <div style={{ fontSize: '0.75em', color: '#6e7681' }}>
                      📍 {avgKm} km/día
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(255, 153, 0, 0.2)',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontWeight: '700',
                      color: '#FF9900',
                      fontSize: '0.8em',
                      border: '1px solid rgba(255, 153, 0, 0.3)',
                      marginBottom: '6px'
                    }}>
                      #AWSreInvent
                    </div>
                    <div style={{ fontSize: '0.7em', color: '#6e7681', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#0A66C2">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      {linkedinUser ? `in/${linkedinUser}` : 'in/tunombre'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={downloadAsImage}
                disabled={isDownloading}
                className="flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                style={{
                  background: isDownloading ? 'rgba(139, 148, 158, 0.3)' : 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#fff',
                  cursor: isDownloading ? 'wait' : 'pointer',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                    </svg>
                    Generando...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Descargar PNG
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setShowCard(false);
                  setLinkedinUser("");
                  setDays([
                    { label: "DOM", steps: 0, active: true },
                    { label: "LUN", steps: 0, active: true },
                    { label: "MAR", steps: 0, active: true },
                    { label: "MIÉ", steps: 0, active: true },
                    { label: "JUE", steps: 0, active: true },
                    { label: "VIE", steps: 0, active: true },
                  ]);
                  setSelectedVenues([]);
                }}
                className="py-3 px-5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(139, 148, 158, 0.2)',
                  color: '#8b949e',
                  border: '1px solid rgba(139, 148, 158, 0.3)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                Nueva
              </button>
            </div>

            {/* Rank explanation */}
            <div className="mt-4 p-4 rounded-2xl" style={{
              background: 'rgba(35, 47, 62, 0.5)',
              border: '1px solid rgba(255, 153, 0, 0.1)'
            }}>
              <h3 className="text-sm mb-3 flex items-center gap-2">
                🏅 Sistema de Rangos
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {RANKS.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{
                    background: rank.name === r.name ? 'rgba(255, 153, 0, 0.2)' : 'rgba(35, 47, 62, 0.3)',
                    border: rank.name === r.name ? '1px solid rgba(255, 153, 0, 0.3)' : '1px solid transparent',
                    opacity: rank.name === r.name ? 1 : 0.7
                  }}>
                    <span>{r.emoji}</span>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: r.color }}>{r.name}</div>
                      <div className="text-xs" style={{ color: '#6e7681', fontSize: '0.6em' }}>
                        {r.max === Infinity ? `${formatNumber(r.min)}+` : `${formatNumber(r.min)} - ${formatNumber(r.max)}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-sm" style={{ color: '#6e7681' }}>
        Made with ☁️ for the AWS re:Invent community
      </div>
    </div>
  );
}
