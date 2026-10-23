import { THEMES } from '../lib/themes'

// /dana-plan-v2 in the site register, on one fixed theme instead of the deal:
// Bone, so the plan reads the same every time it's opened mid-run.
export const T = THEMES.find((t) => t.bg === '#F2F2F2')

export const social = "font-['Social_Condensed','Haas_Grot_Disp',sans-serif]"
export const nichrome = "font-['Nichrome','Haas_Grot_Disp',sans-serif] font-normal"
export const ultra = "font-['Nichrome','Arial_Black',sans-serif] font-black"

// Hairline in the theme ink. 40 is the site's 25% card rule.
export const rule = (alpha = '40') => ({ borderColor: `${T.ink}${alpha}` })

// Outline chip, the /play chip pattern. Pressable when it's a button.
export const chip = `${social} inline-flex items-center gap-[6px] rounded-[4px] border border-current px-[8px] py-[3px] text-[14px] leading-[1.2] tabular-nums`
export const pressable = 'transition-[background-color,color,transform] duration-[140ms] ease-out active:scale-[0.97] motion-reduce:transition-none'

// **bold** and "- " bullets from the plan JSON, as HTML.
export function formatContentHtml(text) {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/^- /gm, '• ')
    .replace(/\n/g, '<br/>')
}
