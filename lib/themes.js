// The six site themes, from Figma (Website — Oct 26, node 7:235).
// bg: page field, ink: all type and outlines, hmu/hmuInk: the email button.
// Pages, the footer and the link highlight all draw from this one list.
export const THEMES = [
  { bg: '#D5B800', ink: '#19180E', hmu: '#19180E', hmuInk: '#F2F2F2' },
  { bg: '#FFFFFF', ink: '#2E2E2E', hmu: '#FF000F', hmuInk: '#FFFFFF' },
  { bg: '#9FAE79', ink: '#3E3C32', hmu: '#FFFFFF', hmuInk: '#3E3C32' },
  { bg: '#FF4B00', ink: '#511A07', hmu: '#FFFFFF', hmuInk: '#511A07' },
  { bg: '#F2F2F2', ink: '#130EA8', hmu: '#130EA8', hmuInk: '#F2F2F2' },
  { bg: '#0F50C8', ink: '#FF69B4', hmu: '#FF69B4', hmuInk: '#0F50C8' },
]

// Pages whose whole field takes the dealt theme. The boot script below colors
// these before first paint, so the old body color never flashes.
export const THEMED_PATHS = ['/', '/play', '/about']
export const DECK_KEY = 'site-theme-deck'

// Runs inline in <head>: deals the next card from the same deck the hook uses
// (see components/useRandomTheme.js), sets --page-bg, and leaves the pick on
// window for the hook to adopt instead of dealing again.
export const themeBootScript = () => `(function(){try{
var paths=${JSON.stringify(THEMED_PATHS)},p=location.pathname.replace(/\\/$/,'')||'/';
if(paths.indexOf(p)<0)return;
var bgs=${JSON.stringify(THEMES.map((t) => t.bg))},n=bgs.length,K=${JSON.stringify(DECK_KEY)},d=null;
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
}catch(e){}})()`
