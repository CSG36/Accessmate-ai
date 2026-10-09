import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Contrast, Maximize2, Minimize2, Eye, Sparkles } from 'lucide-react';

interface DocumentPreviewProps {
  imageUrl?: string;
  title: string;
  urgency?: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  imageUrl,
  title,
  urgency,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isHighContrastFilter, setIsHighContrastFilter] = useState(false);
  const [isMagnifierActive, setIsMagnifierActive] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  if (!imageUrl) {
    return (
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 text-center text-slate-500">
        No document image preview available.
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMagnifierActive || !imgContainerRef.current) return;
    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMagnifierPos({ x, y });
  };

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : ''}`}>
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 gap-2">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Visual Document Inspector
          </span>
          {urgency === 'urgent' && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400">
              High Urgency
            </span>
          )}
        </div>

        {/* Accessibility Visual Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Magnifier Lens Toggle */}
          <button
            type="button"
            onClick={() => setIsMagnifierActive(!isMagnifierActive)}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              isMagnifierActive
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
            }`}
            title="Interactive Magnifying Glass for fine print"
            aria-label="Toggle magnifying glass"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Magnifier</span>
          </button>

          {/* Contrast Filter */}
          <button
            type="button"
            onClick={() => setIsHighContrastFilter(!isHighContrastFilter)}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              isHighContrastFilter
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
            }`}
            title="Invert & sharpen for high-contrast reading"
            aria-label="Toggle document contrast"
          >
            <Contrast className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">High Contrast</span>
          </button>

          {/* Rotate */}
          <button
            type="button"
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
            title="Rotate 90 degrees"
            aria-label="Rotate image"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs font-mono font-semibold px-1 text-slate-500">
            {Math.round(zoomLevel * 100)}%
          </span>

          {/* Zoom In */}
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Modal */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
            title={isFullscreen ? 'Exit full screen' : 'Expand full screen'}
            aria-label="Toggle full screen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Image Display Area with Pan & Zoom */}
      <div
        ref={imgContainerRef}
        onMouseMove={handleMouseMove}
        className={`relative overflow-auto bg-slate-100/90 dark:bg-slate-950 p-4 flex items-center justify-center transition-all ${
          isFullscreen ? 'flex-1 min-h-0' : 'max-h-[460px] min-h-[300px]'
        }`}
      >
        <div
          className="transition-transform duration-200 origin-center max-w-full"
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
          }}
        >
          <img
            src={imageUrl}
            alt={`Scanned document preview: ${title}`}
            className={`rounded-lg shadow-md max-w-full h-auto transition-filter duration-200 ${
              isHighContrastFilter
                ? 'invert contrast-200 brightness-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : ''
            }`}
          />
        </div>

        {/* Magnifier Floating HUD */}
        {isMagnifierActive && (
          <div
            className="pointer-events-none absolute w-48 h-48 rounded-full border-4 border-indigo-500 shadow-2xl overflow-hidden bg-white dark:bg-slate-900 z-30"
            style={{
              left: `calc(${magnifierPos.x}% - 96px)`,
              top: `calc(${magnifierPos.y}% - 96px)`,
              boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.9), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              className="w-[300%] h-[300%] origin-top-left"
              style={{
                transform: `translate(-${magnifierPos.x * 2}%, -${magnifierPos.y * 2}%) scale(2.5)`,
              }}
            >
              <img
                src={imageUrl}
                alt="Magnified preview"
                className={`w-full h-full object-contain ${
                  isHighContrastFilter ? 'invert contrast-200 brightness-110' : ''
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Info for Assistive Tech */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>Hover over image when Magnifier is on to inspect fine print text</span>
        <span className="font-mono">{title}</span>
      </div>
    </div>
  );
};
