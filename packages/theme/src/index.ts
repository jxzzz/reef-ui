export const tokens = {
  color: {
    brand: 'var(--reef-color-brand)',
    brandHover: 'var(--reef-color-brand-hover)',
    success: 'var(--reef-color-success)',
    warning: 'var(--reef-color-warning)',
    danger: 'var(--reef-color-danger)',
    surface: 'var(--reef-color-surface)',
    textPrimary: 'var(--reef-color-text-primary)',
    textSecondary: 'var(--reef-color-text-secondary)',
    textDisabled: 'var(--reef-color-text-disabled)',
  },
  space: {
    xs: 'var(--reef-space-xs)',
    sm: 'var(--reef-space-sm)',
    md: 'var(--reef-space-md)',
    lg: 'var(--reef-space-lg)',
    xl: 'var(--reef-space-xl)',
  },
  radius: {
    sm: 'var(--reef-radius-sm)',
    md: 'var(--reef-radius-md)',
    lg: 'var(--reef-radius-lg)',
    full: 'var(--reef-radius-full)',
  },
  fontSize: {
    sm: 'var(--reef-font-size-sm)',
    md: 'var(--reef-font-size-md)',
    lg: 'var(--reef-font-size-lg)',
  },
} as const;
