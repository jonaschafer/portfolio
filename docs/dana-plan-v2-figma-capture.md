# Dana Plan v2 calendar → Figma (Chrome DevTools MCP)

Use this flow to capture the calendar view and paste it into Figma so you can tweak the design.

## Prerequisites

- Chrome running **with remote debugging**:  
  `Google Chrome --remote-debugging-port=9222`  
  (or on Mac: close Chrome, then in Terminal:  
  `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222`)
- Dev server: `npm run dev` (calendar at http://localhost:3000/dana-plan-v2/calendar)
- Figma file open in the same browser (e.g. https://www.figma.com/design/YxeUoYEoYvVssrfDLyhevL/Orbit?node-id=62-469)

## MCP steps

1. **Capture calendar**  
   - `navigate_page` to `http://localhost:3000/dana-plan-v2/calendar`  
   - `take_screenshot` with `filePath`: `public/cal-capture.png` (so the image is served at `/cal-capture.png`)

2. **Copy image to clipboard**  
   - `navigate_page` to `http://localhost:3000/dana-plan-v2-capture-helper.html`  
   - `evaluate_script` to click the copy button:  
     `() => { document.getElementById('copyBtn').click(); return 'ok'; }`

3. **Paste in Figma**  
   - `navigate_page` to your Figma design (same tab or new tab)  
   - Optional: `take_snapshot` and `click` the canvas/frame so Figma has focus  
   - `evaluate_script` to paste:  
     `() => { document.execCommand('paste'); return 'paste triggered'; }`  
     or dispatch Cmd+V:  
     `() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'v', code: 'KeyV', metaKey: true, bubbles: true })); return 'ok'; }`

If paste doesn’t run, focus the Figma canvas and press **Cmd+V** (Mac) or **Ctrl+V** (Win) manually after step 2.

## Manual fallback

1. Open `/dana-plan-v2/calendar`, take a screenshot (e.g. Cmd+Shift+4), save as `public/cal-capture.png`.
2. Open `http://localhost:3000/dana-plan-v2-capture-helper.html` and click **Copy cal-capture.png to clipboard**.
3. In Figma, select the frame (e.g. 62-469) and press Cmd+V / Ctrl+V.
