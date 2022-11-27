import { style, styleVariants } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const base = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: 8,
  alignItems: 'center',
  padding: 8,
  borderRadius: 10,

  fontFamily: 'Rubik',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: 12,
  lineHeight: '16px',
  color: 'white',
});

const colorVariants = styleVariants({
  green: { backgroundColor: '#2E7D32' },
  orange: { backgroundColor: '#F57F27' },
  red: { backgroundColor: '#C62828' },
  salad: { backgroundColor: '#90c348' },
});

export const content = recipe({
  base,

  variants: { color: colorVariants },
});
