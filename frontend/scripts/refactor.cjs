const fs = require('fs');
const path = require('path');

const directory = 'src';

const tokenMap = {
  // Colors
  'colors.primary\\[500\\]': 'var(--primary)',
  'colors.primary\\[600\\]': 'var(--primary-hover)',
  'colors.primary\\[50\\]': 'var(--primary-subtle)',
  'colors.primary\\[400\\]': 'var(--color-primary-400)',
  'colors.text.primary': 'var(--text)',
  'colors.text.secondary': 'var(--text-muted)',
  'colors.text.tertiary': 'var(--text-subtle)',
  'colors.text.inverse': 'var(--text-inverse)',
  'colors.bg.page': 'var(--bg)',
  'colors.bg.container': 'var(--surface)',
  'colors.bg.subtle': 'var(--bg-subtle)',
  'colors.bg.context': 'var(--surface-sunken)',
  'colors.border.base': 'var(--border)',
  'colors.border.split': 'var(--color-neutral-100)',
  'colors.border.strong': 'var(--border-strong)',
  'colors.success.dark': 'var(--success-ink)',
  'colors.success.base': 'var(--success)',
  'colors.success.light': 'var(--success-subtle)',
  'colors.warning.dark': 'var(--warning-ink)',
  'colors.warning.base': 'var(--warning)',
  'colors.warning.light': 'var(--warning-subtle)',
  'colors.error.dark': 'var(--error-ink)',
  'colors.error.base': 'var(--error)',
  'colors.error.light': 'var(--error-subtle)',
  'colors.info.dark': 'var(--info-ink)',
  'colors.info.base': 'var(--info)',
  'colors.info.light': 'var(--info-subtle)',
  'colors.neutral\\[50\\]': 'var(--color-neutral-50)',
  'colors.neutral\\[100\\]': 'var(--color-neutral-100)',
  'colors.neutral\\[200\\]': 'var(--color-neutral-200)',
  'colors.neutral\\[300\\]': 'var(--color-neutral-300)',
  'colors.neutral\\[700\\]': 'var(--color-neutral-700)',
  'colors.neutral\\[900\\]': 'var(--text)',
  
  // Sidebar
  'colors.sidebar.bg': 'var(--color-ink-900)',
  'colors.sidebar.bgDeep': 'var(--color-ink-950)',
  'colors.sidebar.text': 'var(--color-neutral-0)',
  'colors.sidebar.textSecond': 'var(--color-secondary-300)',
  
  // Subsystem
  'colors.subsystem.kkn': 'var(--chart-5-amber)',
  'colors.subsystem.collection': 'var(--chart-6-sky)',
  'colors.subsystem.product': 'var(--primary)',
  'colors.subsystem.ops': 'var(--chart-4-indigo)',
  'colors.subsystem.analytics': 'var(--chart-8-rose)',
  'colors.subsystem.governance': 'var(--color-info-500)',
  
  // Spacing
  'spacing\\[1\\]': 'var(--spacing-4)',
  'spacing\\[2\\]': 'var(--spacing-8)',
  'spacing\\[3\\]': 'var(--spacing-12)',
  'spacing\\[4\\]': 'var(--spacing-16)',
  'spacing\\[5\\]': 'var(--spacing-20)',
  'spacing\\[6\\]': 'var(--spacing-24)',
  'spacing\\[8\\]': 'var(--spacing-32)',
  
  // Typography
  'typography.fontSize.xs': '11px',
  'typography.fontSize.sm': '12px',
  'typography.fontSize.base': '14px',
  'typography.fontSize.md': '16px',
  'typography.fontSize.lg': '18px',
  'typography.fontSize.xl': '20px',
  
  // Radius
  'radius.sm': 'var(--radius-sm)',
  'radius.md': 'var(--radius-md)',
  'radius.lg': 'var(--radius-lg)',
  
  // Shadows
  'shadows.sm': 'var(--elevation-1)',
  'shadows.md': 'var(--elevation-2)',
  'shadows.card': 'var(--elevation-1)',
};

function processFile(fullPath) {
  if (fullPath.includes('design-system\\\\tokens.ts') || fullPath.includes('design-system/tokens.ts') ||
      fullPath.includes('design-system\\\\theme.ts') || fullPath.includes('design-system/theme.ts')) {
    return;
  }

  let original = fs.readFileSync(fullPath, 'utf8');
  let content = original;
  
  for (const [key, value] of Object.entries(tokenMap)) {
    // Escape string for regex
    // 'colors.primary\\[500\\]' -> 'colors\\.primary\\[500\\]'
    const escapedKey = key.replace(/\./g, '\\.');

    // 1. Template literals: ${colors.primary[500]} -> var(--primary)
    const templateRegex = new RegExp(`\\$\\{\\s*${escapedKey}\\s*\\}`, 'g');
    content = content.replace(templateRegex, value);

    // 2. Direct usage: colors.primary[500] -> 'var(--primary)'
    // Using a negative lookbehind and lookahead for quotes so we don't quote twice.
    const directRegex = new RegExp(`(?<!['"\`])${escapedKey}(?!['"\`])`, 'g');
    
    // Replace with single quotes around the value
    content = content.replace(directRegex, `'${value}'`);
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[Agent Task Force] Refactored: ${fullPath}`);
  }
}

function walkDir(dir) {
  let files = fs.readdirSync(dir);
  for (let file of files) {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

console.log("🚀 Agent Workforce Started: Refactoring missed tokens...");
walkDir(directory);
console.log("✅ Agent Workforce Finished.");
