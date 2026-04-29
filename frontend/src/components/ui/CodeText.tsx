import React from 'react';
import { Typography } from 'antd';
import { colors, typography } from '../../design-system';

const { Text } = Typography;

// ─── CodeText ─────────────────────────────────────────────────
// Monospace blue text for codes, IDs, and variable names.
//
// Usage:
//   <CodeText>JOB-001</CodeText>
//   <CodeText template>myVar</CodeText>   → renders {{myVar}}
//   <CodeText muted>v1.0.0</CodeText>      → renders in secondary color

interface CodeTextProps {
  children: React.ReactNode;
  template?: boolean;
  muted?: boolean;
  style?: React.CSSProperties;
}

const CodeText: React.FC<CodeTextProps> = ({ children, template, muted, style }) => (
  <Text
    strong={!muted}
    style={{
      color: muted ? colors.text.secondary : colors.primary[500],
      fontFamily: typography.fontFamily.mono,
      letterSpacing: '0.02em',
      ...style,
    }}
  >
    {template ? `{{${children}}}` : children}
  </Text>
);

export default CodeText;
