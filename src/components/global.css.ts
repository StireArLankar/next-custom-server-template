import { globalStyle } from '@vanilla-extract/css';
import { createThemeContract, createTheme } from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    brand: null,
    background: null,
    color: null,
  },
  font: {
    body: null,
  },
});

export const themeA = createTheme(vars, {
  color: {
    brand: 'blue',
    background: '#002325',
    color: 'white',
  },
  font: {
    body: 'arial',
  },
});

export const themeB = createTheme(vars, {
  color: {
    brand: 'pink',
    background: '#232300',
    color: 'white',
  },
  font: {
    body: 'comic sans ms',
  },
});

globalStyle('html, body', {
  margin: 0,
  boxSizing: 'border-box',
  padding: 0,
  fontFamily: vars.font.body,
  backgroundColor: vars.color.background,
  color: vars.color.color,
});

globalStyle('*', {
  boxSizing: 'inherit',
});
