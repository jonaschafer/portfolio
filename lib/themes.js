import { BUILD_PATHS } from './builds'

// The six site themes, from Figma (Website — Oct 26, node 7:235).
// bg: page field, ink: all type and outlines, hmu/hmuInk: the email button,
// icon: favicon fill (the field color, or the ink when the field is near white).
// Pages, the footer and the link highlight all draw from this one list.
export const THEMES = [
  { bg: '#D5B800', ink: '#19180E', hmu: '#19180E', hmuInk: '#F2F2F2', icon: '#D5B800' },
  { bg: '#FFFFFF', ink: '#2E2E2E', hmu: '#FF000F', hmuInk: '#FFFFFF', icon: '#2E2E2E' },
  { bg: '#9FAE79', ink: '#3E3C32', hmu: '#FFFFFF', hmuInk: '#3E3C32', icon: '#9FAE79' },
  { bg: '#FF4B00', ink: '#511A07', hmu: '#FFFFFF', hmuInk: '#511A07', icon: '#FF4B00' },
  { bg: '#F2F2F2', ink: '#130EA8', hmu: '#130EA8', hmuInk: '#F2F2F2', icon: '#130EA8' },
  { bg: '#0F50C8', ink: '#FF69B4', hmu: '#FF69B4', hmuInk: '#0F50C8', icon: '#0F50C8' },
]

// Pages whose whole field takes the dealt theme. The boot script below colors
// these before first paint, so the old body color never flashes.
// The favicon mark (app/icon.svg) as a data URI in any color.
const ICON_PATH = 'M26.2632 0C26.6205 0 27.0374 0.0595536 27.5138 0.178661C30.8488 0.65509 32.5163 2.50125 32.5163 5.71715C32.5163 6.78912 32.2185 8.39706 31.623 10.541C29.3599 19.1167 28.1093 24.3574 27.8711 26.2632C29.8959 24.7148 32.8141 21.8562 36.6255 17.6874C40.6751 13.2805 43.7719 11.077 45.9159 11.077C46.9878 11.077 48.0002 11.3747 48.9531 11.9703C51.2161 13.3996 52.3477 15.4244 52.3477 18.0448C52.3477 19.9505 51.3352 21.4989 49.3104 22.6899C48.3576 23.2855 46.7496 23.881 44.4866 24.4765C36.2682 26.7396 31.2657 28.2284 29.4791 28.9431C31.8612 29.8959 34.6602 30.7892 37.8761 31.623C44.6652 33.4096 48.4171 34.4816 49.1318 34.8389C51.0375 35.9109 52.0499 37.5784 52.169 39.8414C52.169 40.6751 51.9903 41.5089 51.633 42.3426C50.4419 45.2012 48.5958 46.6305 46.0945 46.6305C44.1888 46.6305 41.3898 44.7843 37.6975 41.092C32.695 35.7322 29.3599 32.5163 27.6924 31.4443C28.0498 34.0647 28.7049 37.1019 29.6577 40.556C31.5634 47.1069 32.5163 50.8588 32.5163 51.8117C32.5163 52.169 32.4567 52.5263 32.3376 52.8836C31.8612 56.0995 29.7768 57.7075 26.0845 57.7075C25.7272 57.7075 25.3103 57.6479 24.8339 57.5288C21.4989 57.0524 19.8314 55.2062 19.8314 51.9903C19.8314 50.9184 20.1291 49.3104 20.7247 47.1665C22.9877 38.5908 24.2383 33.35 24.4765 31.4443C22.5708 32.8736 19.7718 35.5535 16.0795 39.4841C11.6725 44.2484 8.45662 46.6305 6.43179 46.6305C5.35983 46.6305 4.34742 46.3327 3.39456 45.7372C1.13152 44.3079 0 42.2831 0 39.6627C0 37.757 1.01241 36.2086 3.03724 35.0175C3.99009 34.422 5.59804 33.8265 7.86108 33.2309C16.0795 30.9679 21.082 29.4791 22.8686 28.7644C20.4865 27.8116 17.6874 26.9182 14.4715 26.0845C7.68242 24.2979 3.93054 23.2259 3.2159 22.8686C1.31018 21.7966 0.297768 20.1291 0.178661 17.8661C0.178661 17.0323 0.357322 16.1986 0.714644 15.3648C1.90572 12.5063 3.75188 11.077 6.25313 11.077C8.27796 11.1961 10.9579 12.9231 14.2929 16.2581C19.4145 21.4989 22.809 24.7743 24.4765 26.0845C24.1192 23.5832 23.5237 20.6651 22.6899 17.3301C20.7842 10.541 19.8314 6.72956 19.8314 5.89581C19.8314 5.53849 19.8909 5.18117 20.01 4.82385C20.4865 1.60795 22.5708 0 26.2632 0Z'
export const iconDataUri = (fill) =>
  'data:image/svg+xml,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58"><path transform="translate(2.65 0)" fill="${fill}" d="${ICON_PATH}"/></svg>`)

// Points every SVG icon link at the mark in the theme's icon color.
export const setThemeIcon = (theme) => {
  const href = iconDataUri(theme.icon)
  document.querySelectorAll('link[rel~="icon"][type="image/svg+xml"]').forEach((l) => (l.href = href))
}

export const THEMED_PATHS = ['/', '/play', '/about', '/row', '/row-simulator', ...BUILD_PATHS]
export const DECK_KEY = 'site-theme-deck'

// Runs inline in <head>: deals the next card from the same deck the hook uses
// (see components/useRandomTheme.js), sets --page-bg, and leaves the pick on
// window for the hook to adopt instead of dealing again.
export const themeBootScript = () => `(function(){try{
var paths=${JSON.stringify(THEMED_PATHS)},p=location.pathname.replace(/\\/$/,'')||'/';
if(paths.indexOf(p)<0)return;
var bgs=${JSON.stringify(THEMES.map((t) => t.bg))},inks=${JSON.stringify(THEMES.map((t) => t.ink))},icons=${JSON.stringify(THEMES.map((t) => iconDataUri(t.icon)))},n=bgs.length,K=${JSON.stringify(DECK_KEY)},d=null;
try{d=JSON.parse(localStorage.getItem(K)||'null')}catch(e){}
if(!d||!Array.isArray(d.order)||d.order.length!==n||d.pos>=n){
var last=d&&d.order?d.order[n-1]:undefined,o=[],i,j,t;
for(i=0;i<n;i++)o.push(i);
for(i=n-1;i>0;i--){j=Math.floor(Math.random()*(i+1));t=o[i];o[i]=o[j];o[j]=t}
if(o[0]===last)o.push(o.shift());d={order:o,pos:0}}
var pick=d.order[d.pos];
try{localStorage.setItem(K,JSON.stringify({order:d.order,pos:d.pos+1}))}catch(e){}
window.__sitePick={path:location.pathname,pick:pick};
document.documentElement.style.setProperty('--page-bg',bgs[pick]);
document.documentElement.style.setProperty('--page-ink',inks[pick]);
var ic=function(){var ls=document.querySelectorAll('link[rel~="icon"][type="image/svg+xml"]');for(var k=0;k<ls.length;k++)ls[k].href=icons[pick]};
ic();document.addEventListener('DOMContentLoaded',ic);
}catch(e){}})()`
