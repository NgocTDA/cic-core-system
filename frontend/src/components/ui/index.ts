// ============================================================
//  CIC Core System — Shared UI Components
//  Import from '@/components/ui' in page/module files.
//
//  These components enforce design-system tokens and provide
//  consistent layout patterns across all list/detail pages.
// ============================================================

// ─── Layout ──────────────────────────────────────────────────
export { default as PageLayout }       from './PageLayout';
export { default as FilterBar }        from './FilterBar';
export { FilterCol }                   from './FilterBar';
export { default as SectionCard }      from './SectionCard';
export { default as StatusSummaryBar } from './StatusSummaryBar';
export type { SummaryItem }            from './StatusSummaryBar';

// ─── Data display ─────────────────────────────────────────────
export { default as StatusTag }        from './StatusTag';
export { STATUS_CONFIG }               from './StatusTag';
export type { StatusKey }              from './StatusTag';
export { default as ActionMenu }       from './ActionMenu';
export { default as CodeText }         from './CodeText';

// ─── Table utilities ──────────────────────────────────────────
export { tablePagination }             from './tableConfig';
