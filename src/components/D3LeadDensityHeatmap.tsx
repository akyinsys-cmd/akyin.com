import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface D3HeatmapCellDatum {
  x: number;
  y: number;
  region: string;
  zone: string;
  densityPct: number;
  highIntentLeads: number;
  topBuyerIntent: string;
}

interface D3LeadDensityHeatmapProps {
  cells: D3HeatmapCellDatum[];
  regions: string[];
  zones: string[];
}

interface DensityPaletteStop {
  fill: string;
  stroke: string;
  text: string;
  tierLabel: string;
}

const DENSITY_PALETTE: DensityPaletteStop[] = [
  { fill: '#F3E8FF', stroke: '#E9D5FF', text: '#1D1D1F', tierLabel: 'Exploratory' },
  { fill: '#DDD6FE', stroke: '#C4B5FD', text: '#1D1D1F', tierLabel: 'Moderate Intent' },
  { fill: '#8B5CF6', stroke: '#7C3AED', text: '#FFFFFF', tierLabel: 'Strong Demand' },
  { fill: '#6D28D9', stroke: '#5B21B6', text: '#FFFFFF', tierLabel: 'High Priority' },
  { fill: '#4C1D95', stroke: '#3B0764', text: '#FFFFFF', tierLabel: 'Peak Density' },
];

const colorScale = d3
  .scaleThreshold<number, DensityPaletteStop>()
  .domain([38, 50, 62, 74])
  .range(DENSITY_PALETTE);

export function D3LeadDensityHeatmap({
  cells,
  regions,
  zones,
}: D3LeadDensityHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<{
    cell: D3HeatmapCellDatum;
    x: number;
    y: number;
  } | null>(null);

  // Order zones top-to-bottom: Core Metro -> Showroom Belt -> Suburbs -> Corridor
  const orderedZones = [...zones].reverse();

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svgWidth = 880;
    const svgHeight = 340;
    const margin = { top: 42, right: 20, bottom: 16, left: 168 };
    const innerWidth = svgWidth - margin.left - margin.right;
    const innerHeight = svgHeight - margin.top - margin.bottom;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();
    svg
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .attr('role', 'img')
      .attr(
        'aria-label',
        'D3 geographical heatmap of high-intent dealership lead qualification density across regions and showroom catchment distances'
      );

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand<string>()
      .domain(regions)
      .range([0, innerWidth])
      .padding(0.14);

    const yScale = d3
      .scaleBand<string>()
      .domain(orderedZones)
      .range([0, innerHeight])
      .padding(0.16);

    // Top X Axis (Metro Hubs)
    const xAxisGroup = g
      .append('g')
      .attr('transform', 'translate(0, -8)')
      .call(d3.axisTop(xScale).tickSize(0));

    xAxisGroup.select('.domain').remove();
    xAxisGroup
      .selectAll('text')
      .attr('fill', '#1D1D1F')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .style('font-family', 'var(--font-sans)');

    // Left Y Axis (Catchment Distances)
    const yAxisGroup = g
      .append('g')
      .attr('transform', 'translate(-8, 0)')
      .call(d3.axisLeft(yScale).tickSize(0));

    yAxisGroup.select('.domain').remove();
    yAxisGroup
      .selectAll('text')
      .attr('fill', '#6E6E73')
      .attr('font-size', '11.5px')
      .attr('font-weight', '500')
      .style('font-family', 'var(--font-sans)');

    // Heatmap Cells
    const tileGroups = g
      .selectAll<SVGGElement, D3HeatmapCellDatum>('g.d3-heatmap-cell')
      .data(cells, (d) => `${d.region}-${d.zone}`)
      .join('g')
      .attr('class', 'd3-heatmap-cell')
      .attr('tabindex', 0)
      .style('cursor', 'pointer')
      .attr(
        'transform',
        (d) =>
          `translate(${xScale(d.region) ?? 0},${yScale(d.zone) ?? 0})`
      );

    const cellW = xScale.bandwidth();
    const cellH = yScale.bandwidth();

    tileGroups
      .append('rect')
      .attr('width', cellW)
      .attr('height', cellH)
      .attr('rx', 12)
      .attr('ry', 12)
      .attr('fill', (d) => colorScale(d.densityPct).fill)
      .attr('stroke', (d) => colorScale(d.densityPct).stroke)
      .attr('stroke-width', 1.25)
      .style('transition', 'transform 160ms ease, stroke-width 160ms ease, filter 160ms ease');

    tileGroups
      .append('text')
      .attr('x', cellW / 2)
      .attr('y', cellH / 2 - 5)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', (d) => colorScale(d.densityPct).text)
      .attr('font-size', '14px')
      .attr('font-weight', '700')
      .style('font-family', 'var(--font-mono)')
      .style('pointer-events', 'none')
      .text((d) => `${d.densityPct}%`);

    tileGroups
      .append('text')
      .attr('x', cellW / 2)
      .attr('y', cellH / 2 + 12)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', (d) => colorScale(d.densityPct).text)
      .attr('opacity', 0.88)
      .attr('font-size', '10px')
      .attr('font-weight', '500')
      .style('font-family', 'var(--font-sans)')
      .style('pointer-events', 'none')
      .text((d) => `${d.highIntentLeads} leads`);

    const updateTooltipPosition = (event: PointerEvent | MouseEvent | FocusEvent, d: D3HeatmapCellDatum) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      if ('clientX' in event && typeof event.clientX === 'number' && event.clientX > 0) {
        const relX = event.clientX - containerRect.left;
        const relY = event.clientY - containerRect.top;
        setHovered({ cell: d, x: relX, y: relY });
      } else {
        const target = event.currentTarget as SVGGElement | null;
        const targetRect = target?.getBoundingClientRect();
        if (targetRect) {
          setHovered({
            cell: d,
            x: targetRect.left - containerRect.left + targetRect.width / 2,
            y: targetRect.top - containerRect.top + 8,
          });
        }
      }
    };

    tileGroups
      .on('mouseenter', function (event: MouseEvent, d: D3HeatmapCellDatum) {
        d3.select(this)
          .select('rect')
          .attr('stroke', '#1D1D1F')
          .attr('stroke-width', 2);
        updateTooltipPosition(event, d);
      })
      .on('mousemove', function (event: MouseEvent, d: D3HeatmapCellDatum) {
        updateTooltipPosition(event, d);
      })
      .on('mouseleave', function (_event: MouseEvent, d: D3HeatmapCellDatum) {
        d3.select(this)
          .select('rect')
          .attr('stroke', colorScale(d.densityPct).stroke)
          .attr('stroke-width', 1.25);
        setHovered(null);
      })
      .on('focus', function (event: FocusEvent, d: D3HeatmapCellDatum) {
        d3.select(this)
          .select('rect')
          .attr('stroke', '#1D1D1F')
          .attr('stroke-width', 2);
        updateTooltipPosition(event, d);
      })
      .on('blur', function (_event: FocusEvent, d: D3HeatmapCellDatum) {
        d3.select(this)
          .select('rect')
          .attr('stroke', colorScale(d.densityPct).stroke)
          .attr('stroke-width', 1.25);
        setHovered(null);
      });
  }, [cells, regions, orderedZones]);

  const hoveredTier = hovered ? colorScale(hovered.cell.densityPct) : null;

  return (
    <div ref={containerRef} className="relative w-full overflow-x-auto pb-2">
      <div className="min-w-[700px] w-full">
        <svg ref={svgRef} className="w-full h-auto block select-none" />
      </div>

      {hovered && hoveredTier && (
        <div
          role="status"
          aria-live="polite"
          style={{
            left: `${Math.min(Math.max(hovered.x + 14, 16), 620)}px`,
            top: `${Math.max(hovered.y - 12, 8)}px`,
          }}
          className="pointer-events-none absolute z-20 liquid-glass-dropdown rounded-2xl p-4 text-xs text-[#1D1D1F] shadow-xl space-y-1.5 min-w-[245px]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#1D1D1F]/10 pb-1.5">
            <p className="font-display text-sm font-bold text-[#1D1D1F]">
              {hovered.cell.region}
            </p>
            <span className="text-[11px] font-semibold text-purple-700">
              {hoveredTier.tierLabel}
            </span>
          </div>
          <p className="text-[11px] font-medium text-[#6E6E73]">{hovered.cell.zone}</p>
          <div className="flex justify-between gap-4 pt-1">
            <span className="text-[#6E6E73]">Qualification Density</span>
            <span className="font-mono-num tabular-nums font-bold text-purple-700">
              {hovered.cell.densityPct}%
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#6E6E73]">High-Intent Leads / Mo</span>
            <span className="font-mono-num tabular-nums font-bold">
              {hovered.cell.highIntentLeads}
            </span>
          </div>
          <p className="text-[11px] font-medium text-emerald-700 pt-1 border-t border-[#1D1D1F]/10">
            Top Demand: {hovered.cell.topBuyerIntent}
          </p>
        </div>
      )}
    </div>
  );
}
