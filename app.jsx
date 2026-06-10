// Tiny React app that mounts only the Tweaks panel and applies live changes
// to CSS custom properties on :root.

const { useEffect } = React;

// Curated accent palette
const ACCENT_OPTIONS = [
  '#27AD27',  // original Erion green
  '#16A34A',  // refined modern green
  '#0EA5E9',  // sky blue
  '#7C3AED',  // electric purple
  '#F97316',  // orange
  '#DC2626',  // red
];

// Helper: convert hex → relative lightness adjustments via oklch overrides
function applyAccent(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  // simple lighter/darker via mixing through CSS
  const root = document.documentElement;
  root.style.setProperty('--accent', hex);
  root.style.setProperty('--accent-2', `color-mix(in oklch, ${hex} 80%, black 12%)`);
  root.style.setProperty('--accent-soft', `color-mix(in oklch, ${hex} 25%, white 70%)`);
  root.style.setProperty('--accent-ink', `color-mix(in oklch, ${hex} 60%, black 35%)`);
}

function App() {
  const defaults = window.TWEAK_DEFAULTS || { accent: '#27AD27' };
  const [t, setTweak] = useTweaks(defaults);

  // Apply on every change
  useEffect(() => {
    applyAccent(t.accent);
  }, [t.accent]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Cor de destaque">
        <TweakColor
          label="Accent"
          value={t.accent}
          options={ACCENT_OPTIONS}
          onChange={(v) => setTweak('accent', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);
