import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .auth-root {
          min-height: 100dvh;
          background: #050505;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Ambient gold glow */
        .auth-root::before {
          content: '';
          position: fixed;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 500px;
          background: radial-gradient(ellipse at center,
            rgba(201,168,76,0.12) 0%,
            rgba(201,168,76,0.04) 40%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 0;
        }

        /* Bottom ambient */
        .auth-root::after {
          content: '';
          position: fixed;
          bottom: -10%;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          height: 300px;
          background: radial-gradient(ellipse at center,
            rgba(201,168,76,0.05) 0%,
            transparent 60%
          );
          pointer-events: none;
          z-index: 0;
        }

        /* Grain overlay */
        .auth-grain {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
          opacity: 0.4;
        }

        .auth-nav {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: center;
          padding: 32px 24px 0;
        }

        .auth-wordmark {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          text-decoration: none;
          color: rgba(255,255,255,0.9);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.02em;
          backdrop-filter: blur(12px);
          transition: border-color 0.3s ease, background 0.3s ease;
        }

        .auth-wordmark:hover {
          border-color: rgba(201,168,76,0.3);
          background: rgba(201,168,76,0.04);
        }

        .auth-wordmark-icon {
          width: 28px;
          height: 28px;
          object-fit: contain;
          flex-shrink: 0;
          filter: drop-shadow(0 0 6px rgba(201,168,76,0.4));
        }

        .auth-main {
          flex: 1;
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px 60px;
        }

        .auth-footer {
          position: relative;
          z-index: 10;
          padding: 20px 24px;
          display: flex;
          justify-content: center;
          gap: 24px;
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.03em;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        /* Entry animation */
        @keyframes authFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        .auth-card-wrap {
          animation: authFadeUp 0.7s cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }

        /* Double-bezel card */
        .auth-outer-shell {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 6px;
          width: 100%;
          max-width: 420px;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.5),
            0 32px 64px rgba(0,0,0,0.6),
            0 8px 24px rgba(0,0,0,0.4);
        }

        .auth-inner-core {
          background: #0c0e12;
          border-radius: 19px;
          padding: 40px 36px;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.04);
          position: relative;
          overflow: hidden;
        }

        /* Inner top highlight */
        .auth-inner-core::before {
          content: '';
          position: absolute;
          top: 0;
          left: 20%;
          right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent);
        }

        /* Form elements */
        .auth-eyebrow {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 9999px;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.15);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(201,168,76,0.7);
          margin-bottom: 20px;
        }

        .auth-heading {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.04em;
          color: rgba(255,255,255,0.95);
          margin-bottom: 6px;
          line-height: 1.1;
        }

        .auth-subheading {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .auth-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .auth-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
          color: rgba(255,255,255,0.9);
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          -webkit-appearance: none;
        }

        .auth-input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .auth-input:focus {
          border-color: rgba(201,168,76,0.4);
          background: rgba(201,168,76,0.02);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.06), 0 0 20px rgba(201,168,76,0.04);
        }

        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-bottom: 14px;
        }

        .auth-btn-primary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 20px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(201,168,76,0.9) 0%, rgba(201,168,76,0.7) 100%);
          border: 1px solid rgba(201,168,76,0.4);
          color: #0a0a0a;
          font-size: 14px;
          font-weight: 700;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.32,0.72,0,1), box-shadow 0.2s ease, opacity 0.2s;
          box-shadow: 0 4px 16px rgba(201,168,76,0.15), 0 1px 3px rgba(0,0,0,0.3);
          margin-top: 8px;
        }

        .auth-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(201,168,76,0.25), 0 2px 6px rgba(0,0,0,0.3);
        }

        .auth-btn-primary:active:not(:disabled) {
          transform: scale(0.98) translateY(0);
        }

        .auth-btn-primary:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .auth-btn-arrow {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
          transition: transform 0.2s cubic-bezier(0.32,0.72,0,1);
        }

        .auth-btn-primary:hover:not(:disabled) .auth-btn-arrow {
          transform: translate(2px, -1px);
        }

        .auth-link-row {
          margin-top: 24px;
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
        }

        .auth-link {
          color: rgba(201,168,76,0.8);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .auth-link:hover {
          color: rgba(201,168,76,1);
        }

        .auth-alert {
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 18px;
          line-height: 1.5;
        }

        .auth-alert-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          color: rgba(239,68,68,0.85);
        }

        .auth-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 6px 0 20px;
        }

        .auth-success-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #c9a84c;
          font-size: 22px;
          box-shadow: 0 0 24px rgba(201,168,76,0.12);
        }

        .auth-success-wrap {
          text-align: center;
        }

        .auth-hint {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          margin-top: 5px;
        }

        .auth-terms {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          text-align: center;
          margin-top: 16px;
          line-height: 1.6;
        }

        .auth-terms a {
          color: rgba(255,255,255,0.35);
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s;
        }

        .auth-terms a:hover {
          color: rgba(201,168,76,0.7);
        }
      `}</style>

      <div className="auth-root">
        <div className="auth-grain" aria-hidden="true" />

        <nav className="auth-nav">
          <a href="https://ai.chairmans.uk" className="auth-wordmark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.png" alt="Chairman AI" className="auth-wordmark-icon" />
          </a>
        </nav>

        <main className="auth-main">
          {children}
        </main>

        <footer className="auth-footer">
          <span>© 2025 Chairman AI</span>
          <span>Private &amp; confidential</span>
        </footer>
      </div>
    </>
  );
}
