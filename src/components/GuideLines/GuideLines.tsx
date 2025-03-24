import React from 'react';
import {
  CONTAINER_WIDTH,
  CONTAINER_HEIGHT,
  TRIM_INSET_PERCENT,
  TRIM_WIDTH_PERCENT,
  TRIM_HEIGHT_PERCENT,
  INNER_MARGIN_PERCENT,
  OUTER_MARGIN_PERCENT,
  TOP_MARGIN_PERCENT,
  BOTTOM_MARGIN_PERCENT
} from './utils';

interface GuideLinesProps {
  showGuides: boolean;
}

export const GuideLines: React.FC<GuideLinesProps> = ({ showGuides }) => {
  if (!showGuides) return null;

  // Calculate trim dimensions in pixels
  const trimInsetPx = (TRIM_INSET_PERCENT / 100) * CONTAINER_WIDTH;
  const trimWidthPx = (TRIM_WIDTH_PERCENT / 100) * CONTAINER_WIDTH;
  const trimHeightPx = (TRIM_HEIGHT_PERCENT / 100) * CONTAINER_HEIGHT;

  // Calculate margin dimensions in pixels
  const innerMarginPx = (INNER_MARGIN_PERCENT / 100) * CONTAINER_WIDTH;
  const outerMarginPx = (OUTER_MARGIN_PERCENT / 100) * CONTAINER_WIDTH;
  const topMarginPx = (TOP_MARGIN_PERCENT / 100) * CONTAINER_HEIGHT;
  const bottomMarginPx = (BOTTOM_MARGIN_PERCENT / 100) * CONTAINER_HEIGHT;

  return (
    <>
      {/* Trim lines (cyan) */}
      <div 
        className="absolute pointer-events-none"
        data-guide-element="true"
        style={{
          left: `${trimInsetPx}px`,
          top: `${(CONTAINER_HEIGHT - trimHeightPx) / 2}px`,
          width: `${trimWidthPx}px`,
          height: `${trimHeightPx}px`,
          border: '1px dashed #00AACC',
          opacity: 0.8,
          zIndex: 5
        }}
      >
        {/* Label for trim line */}
        <div className="absolute -top-5 left-0 text-xs text-cyan-600 font-mono font-bold">
          Trim (5" × 7.5") - Cyan
        </div>
        <div className="absolute -bottom-5 right-0 text-xs text-cyan-600 font-mono font-bold">
          0.125" bleed on all sides
        </div>
      </div>

      {/* Margin lines (magenta) */}
      <div 
        className="absolute pointer-events-none"
        data-guide-element="true"
        style={{
          left: `${trimInsetPx + innerMarginPx}px`,
          top: `${(CONTAINER_HEIGHT - trimHeightPx) / 2 + topMarginPx}px`,
          width: `${trimWidthPx - innerMarginPx - outerMarginPx}px`,
          height: `${trimHeightPx - topMarginPx - bottomMarginPx}px`,
          border: '1px dashed #CC0099',
          opacity: 0.8,
          zIndex: 5
        }}
      >
        {/* Label for margin line */}
        <div className="absolute -top-5 left-0 text-xs text-fuchsia-600 font-mono font-bold">
          Safe Area (Magenta)
        </div>
        <div className="absolute top-1 left-1 text-xs text-fuchsia-600 font-mono font-bold">
          Inner: 0.75"
          <br />
          Outer: 0.5"
        </div>
      </div>
    </>
  );
};
