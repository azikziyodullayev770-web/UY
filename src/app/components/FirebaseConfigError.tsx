/**
 * FirebaseConfigError — shown when .env.local contains placeholder values.
 * Replaces the crash / silent failure with actionable setup instructions.
 */
export function FirebaseConfigError() {
  const steps = [
    {
      num: "1",
      title: "Firebase loyihangizni oching",
      desc: "console.firebase.google.com sahifasiga o'ting",
      link: "https://console.firebase.google.com",
      linkText: "Firebase Console →",
    },
    {
      num: "2",
      title: "SDK kalitlarini oling",
      desc: "Project Settings → General → Your Apps → SDK config (</> belgisini bosing)",
      link: null,
      linkText: null,
    },
    {
      num: "3",
      title: ".env.local faylini to'ldiring",
      desc: "Loyiha papkasidagi .env.local faylida YOUR_* qiymatlarini haqiqiy qiymatlar bilan almashtiring",
      link: null,
      linkText: null,
    },
    {
      num: "4",
      title: "Dev serverni qayta ishga tushiring",
      desc: (
        <span>
          Terminal ga{" "}
          <code className="bg-slate-800 text-cyan-400 px-2 py-0.5 rounded text-xs font-mono">
            npm run dev
          </code>{" "}
          buyrug'ini bering
        </span>
      ),
      link: null,
      linkText: null,
    },
  ];

  const envVars = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Background glow */}
      <div className="fixed top-0 right-0 w-[40%] h-[40%] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-2">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-foreground">Firebase Sozlanmagan</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <code className="text-red-400 font-mono text-xs bg-red-500/10 px-2 py-0.5 rounded">
              auth/api-key-not-valid
            </code>
            {" "}xatosi — <strong className="text-foreground">.env.local</strong> faylida{" "}
            hali haqiqiy Firebase kalitlari kiritilmagan.
          </p>
        </div>

        {/* Steps */}
        <div className="bg-white/3 border border-black/10 dark:border-white/10 rounded-3xl p-6 space-y-5">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            Sozlash bosqichlari
          </p>
          {steps.map((step) => (
            <div key={step.num} className="flex gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <span className="text-[10px] font-black text-cyan-400">{step.num}</span>
              </div>
              <div className="space-y-0.5 flex-1">
                <p className="text-sm font-bold text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {typeof step.desc === "string" ? step.desc : step.desc}
                </p>
                {step.link && (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-cyan-400 font-bold hover:text-cyan-300 transition-colors mt-1"
                  >
                    {step.linkText}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* .env.local template */}
        <div className="bg-card border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-black/5 dark:border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            <span className="ml-2 text-[10px] font-mono text-slate-500">.env.local</span>
          </div>
          <div className="p-4 space-y-1">
            {envVars.map((v) => (
              <p key={v} className="font-mono text-xs">
                <span className="text-cyan-400">{v}</span>
                <span className="text-slate-600">=</span>
                <span className="text-orange-400">your_value_here</span>
              </p>
            ))}
          </div>
        </div>

        {/* Auth providers checklist */}
        <div className="bg-white/3 border border-black/10 dark:border-white/10 rounded-2xl p-5 space-y-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            Firebase Console — Tekshiring
          </p>
          {[
            "Authentication → Sign-in method → Google ✅ yoqingan",
            "Authentication → Sign-in method → Phone ✅ yoqingan",
            "Authentication → Settings → Authorized domains → localhost ✅",
            "Google Cloud → OAuth credentials → Redirect URI: http://localhost:5173/__/auth/handler",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" />
              <p className="text-xs text-slate-300">{item}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-[10px] text-slate-700 font-black uppercase tracking-[0.3em]">
          UY JOY • Dev Setup Guide
        </p>
      </div>
    </div>
  );
}
