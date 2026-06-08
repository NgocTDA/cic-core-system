import React from 'react';

// Layout
import PageLayoutDemo        from './components/layout/PageLayoutDemo';
import SectionCardDemo       from './components/layout/SectionCardDemo';
import FilterBarDemo         from './components/layout/FilterBarDemo';

// Data Display
import StatusTagDemo         from './components/data-display/StatusTagDemo';
import StatusSummaryBarDemo  from './components/data-display/StatusSummaryBarDemo';
import ActionMenuDemo        from './components/data-display/ActionMenuDemo';
import CodeTextDemo          from './components/data-display/CodeTextDemo';
import TableDemo             from './components/data-display/TableDemo';
import ColumnSettingsDemo    from './components/data-display/ColumnSettingsDemo';
import AuditLogDemo          from './components/data-display/AuditLogDemo';

// Form & Input
import TextboxDemo           from './components/form/TextboxDemo';
import InputNumberDemo       from './components/form/InputNumberDemo';
import TextAreaDemo          from './components/form/TextAreaDemo';
import SelectDemo            from './components/form/SelectDemo';
import DatePickerDemo        from './components/form/DatePickerDemo';
import SwitchDemo            from './components/form/SwitchDemo';
import CheckboxRadioDemo     from './components/form/CheckboxRadioDemo';
import SliderDemo            from './components/form/SliderDemo';
import UploadDemo            from './components/form/UploadDemo';
import FormFullDemo          from './components/form/FormFullDemo';

// Button
import ButtonDemo            from './components/button/ButtonDemo';

// Feedback
import ModalDemo             from './components/feedback/ModalDemo';
import NotificationDemo      from './components/feedback/NotificationDemo';
import AlertDemo             from './components/feedback/AlertDemo';

// Dashboard
import StatCardDemo          from './components/dashboard/StatCardDemo';
import ChartBarDemo          from './components/dashboard/ChartBarDemo';
import ChartLineDemo         from './components/dashboard/ChartLineDemo';
import ChartPieDemo          from './components/dashboard/ChartPieDemo';
import ChartGaugeDemo        from './components/dashboard/ChartGaugeDemo';

// Tokens
import ColorsDemo            from './components/tokens/ColorsDemo';
import TypographySpacingDemo from './components/tokens/TypographySpacingDemo';
import TypographyDemo        from './components/tokens/TypographyDemo';
import SpacingDemo           from './components/tokens/SpacingDemo';
import ShadowsDemo           from './components/tokens/ShadowsDemo';

export const DEMO_REGISTRY: Record<string, React.ComponentType> = {
    // Layout
    'layout/page-layout':  PageLayoutDemo,
    'layout/section-card': SectionCardDemo,
    'layout/filter-bar':   FilterBarDemo,

    // Data Display
    'data-display/status-tag':         StatusTagDemo,
    'data-display/status-summary-bar': StatusSummaryBarDemo,
    'data-display/action-menu':        ActionMenuDemo,
    'data-display/code-text':          CodeTextDemo,
    'data-display/table':              TableDemo,
    'data-display/column-settings':   ColumnSettingsDemo,
    'data-display/audit-log':         AuditLogDemo,

    // Form
    'form/textbox':        TextboxDemo,
    'form/input-number':   InputNumberDemo,
    'form/textarea':       TextAreaDemo,
    'form/select':         SelectDemo,
    'form/date-picker':    DatePickerDemo,
    'form/switch':         SwitchDemo,
    'form/checkbox':       CheckboxRadioDemo,
    'form/radio':          CheckboxRadioDemo,
    'form/slider':         SliderDemo,
    'form/upload':         UploadDemo,
    'form/full-form':      FormFullDemo,

    // Button
    'button/variants': ButtonDemo,
    'button/patterns': ButtonDemo,

    // Feedback
    'feedback/modal':        ModalDemo,
    'feedback/notification': NotificationDemo,
    'feedback/alert':        AlertDemo,

    // Dashboard
    'dashboard/stat-card':     StatCardDemo,
    'dashboard/chart-bar':     ChartBarDemo,
    'dashboard/chart-line':    ChartLineDemo,
    'dashboard/chart-pie':     ChartPieDemo,
    'dashboard/chart-gauge':   ChartGaugeDemo,
    'dashboard/chart-dual-axis': ChartPieDemo,

    // Tokens
    'tokens/colors':      ColorsDemo,
    'tokens/typography':  TypographyDemo,
    'tokens/spacing':     SpacingDemo,
    'tokens/shadows':     ShadowsDemo,
};
