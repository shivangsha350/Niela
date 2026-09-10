'use client';

import Head from 'next/head';

export default function Creative() {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <section className="section">
        <div className="head">
          <h2>Small details, big difference</h2>
          <p>Here&apos;s what actually changes when a pad is designed properly — not just packaged well.</p>
        </div>

        <div className="grid">
          <div className="card c1">
            <span className="spark" style={{ width: 6, height: 6, top: 6, left: '18%', animationDelay: '0.2s' }} />
            <span className="spark" style={{ width: 8, height: 8, top: 20, right: '16%', animationDelay: '1s' }} />
            <div className="sticker">
              <svg viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="66" fill="#fff" stroke="#7A2E12" strokeWidth={5} />
                <path
                  className="heart-beat"
                  d="M70 100 C52 86 34 72 34 52 C34 38 46 28 58 28 C64 28 70 33 70 41 C70 33 76 28 82 28 C94 28 106 38 106 52 C106 72 88 86 70 100 Z"
                  fill="#FF9E75"
                  stroke="#7A2E12"
                  strokeWidth={5}
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Made to move with you</h3>
            <p className="copy">Contoured fit and soft edges that hold their shape through every part of your day.</p>
          </div>

          <div className="card c2">
            <span className="spark" style={{ width: 7, height: 7, top: 10, left: '20%', animationDelay: '0.6s' }} />
            <span className="spark" style={{ width: 5, height: 5, top: 22, right: '18%', animationDelay: '1.4s' }} />
            <div className="sticker">
              <svg viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="66" fill="#fff" stroke="#164C30" strokeWidth={5} />
                <path
                  className="droplet-wiggle"
                  d="M70 34 C85 55 94 70 94 84 C94 100 83 111 70 111 C57 111 46 100 46 84 C46 70 55 55 70 34 Z"
                  fill="#7FDFA8"
                  stroke="#164C30"
                  strokeWidth={5}
                  strokeLinejoin="round"
                />
                <ellipse cx="88" cy="52" rx="9" ry="15" transform="rotate(28 88 52)" fill="#4FBF7E" stroke="#164C30" strokeWidth={4} />
              </svg>
            </div>
            <h3>Gentle, always</h3>
            <p className="copy">No chlorine, no added fragrance — tested to stay calm on sensitive skin.</p>
          </div>

          <div className="card c3">
            <span className="spark" style={{ width: 6, height: 6, top: 8, left: '22%', animationDelay: '0.3s' }} />
            <span className="spark" style={{ width: 8, height: 8, top: 18, right: '20%', animationDelay: '1.1s' }} />
            <div className="sticker">
              <svg viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="66" fill="#fff" stroke="#23297A" strokeWidth={5} />
                <circle cx="70" cy="70" r="26" fill="#AFC7F0" stroke="#23297A" strokeWidth={5} />
                <path
                  className="earth-spin"
                  d="M58 58 C62 54 68 54 70 58 C74 54 80 56 78 62 C82 66 78 72 72 70 C70 76 62 76 62 70 C56 72 52 66 58 58 Z"
                  fill="#7FAE6A"
                  stroke="#23297A"
                  strokeWidth={3}
                />
                <path d="M40 40 A42 42 0 0 1 100 40" fill="none" stroke="#23297A" strokeWidth={5} strokeLinecap="round" />
                <path d="M100 40 L92 34 M100 40 L94 48" fill="none" stroke="#23297A" strokeWidth={5} strokeLinecap="round" />
                <path d="M100 100 A42 42 0 0 1 40 100" fill="none" stroke="#23297A" strokeWidth={5} strokeLinecap="round" />
                <path d="M40 100 L48 106 M40 100 L46 92" fill="none" stroke="#23297A" strokeWidth={5} strokeLinecap="round" />
              </svg>
            </div>
            <h3>Better for tomorrow</h3>
            <p className="copy">A compostable core designed to return to the earth, not sit in a landfill.</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .section {
          max-width: 1160px;
          margin: 0 auto;
          padding: 60px 24px 80px;
          background: #faf8f5;
          font-family: 'Inter', sans-serif;
          color: #2b2622;
        }
        .head {
          max-width: 640px;
          margin: 0 auto 56px;
          text-align: center;
        }
        .head h2 {
          font-family: 'Baloo 2', sans-serif;
          font-weight: 700;
          font-size: 38px;
          line-height: 1.2;
          margin: 0 0 14px 0;
          color: #2b2622;
        }
        .head p {
          font-size: 16px;
          line-height: 1.6;
          color: #726a63;
          margin: 0 auto;
          max-width: 480px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          align-items: stretch;
        }
        .card {
          position: relative;
          border-radius: 26px;
          padding: 76px 24px 30px;
          text-align: center;
          transition: transform 0.3s ease;
        }
        .card:hover {
          transform: translateY(-6px);
        }
        .c1 {
          background: #ffdcc8;
        }
        .c2 {
          background: #d3f1de;
        }
        .c3 {
          background: #dee3fb;
        }
        .sticker {
          position: absolute;
          top: -46px;
          left: 50%;
          width: 132px;
          height: 132px;
          transform: translateX(-50%) rotate(var(--rot));
          filter: drop-shadow(0 10px 16px rgba(43, 38, 34, 0.18));
          animation: wobble 5s ease-in-out infinite;
          transition: transform 0.4s ease;
        }
        .card:hover .sticker {
          transform: translateX(-50%) rotate(0deg) scale(1.08);
        }
        .c1 .sticker {
          --rot: -7deg;
          animation-delay: 0s;
        }
        .c2 .sticker {
          --rot: 5deg;
          animation-delay: 0.4s;
        }
        .c3 .sticker {
          --rot: -4deg;
          animation-delay: 0.8s;
        }
        @keyframes wobble {
          0%,
          100% {
            transform: translateX(-50%) rotate(var(--rot));
          }
          50% {
            transform: translateX(-50%) rotate(calc(var(--rot) * -1));
          }
        }
        .spark {
          position: absolute;
          border-radius: 50%;
          background: #fff;
          opacity: 0;
          animation: twinkle 2.6s ease-in-out infinite;
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.6);
          }
          50% {
            opacity: 0.9;
            transform: scale(1);
          }
        }
        .heart-beat {
          transform-box: fill-box;
          transform-origin: 50% 50%;
          animation: heartbeat 1.1s ease-in-out infinite;
        }
        @keyframes heartbeat {
          0%,
          100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.16);
          }
          40% {
            transform: scale(0.94);
          }
          60% {
            transform: scale(1.1);
          }
          80% {
            transform: scale(1);
          }
        }
        .droplet-wiggle {
          transform-box: fill-box;
          transform-origin: 50% 0%;
          animation: dropwiggle 2s ease-in-out infinite;
        }
        @keyframes dropwiggle {
          0%,
          100% {
            transform: rotate(-6deg);
          }
          50% {
            transform: rotate(6deg);
          }
        }
        .earth-spin {
          transform-box: view-box;
          transform-origin: 70px 70px;
          animation: earthspin 6s linear infinite;
        }
        @keyframes earthspin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        h3 {
          font-family: 'Baloo 2', sans-serif;
          font-weight: 600;
          font-size: 20px;
          margin: 0 0 8px;
        }
        .c1 h3 {
          color: #b14a26;
        }
        .c2 h3 {
          color: #1f6b44;
        }
        .c3 h3 {
          color: #33409e;
        }
        .copy {
          font-size: 13.5px;
          line-height: 1.6;
          color: #090501;
          margin: 0 auto;
          max-width: 220px;
        }
        @media (max-width: 860px) {
          .section {
            padding: 48px 18px 64px;
          }
          .head {
            margin-bottom: 48px;
            padding: 0 8px;
          }
          .head h2 {
            font-size: 26px;
            line-height: 1.25;
            margin: 0 0 10px 0;
          }
          .head p {
            font-size: 14.5px;
            line-height: 1.55;
            max-width: 100%;
          }
          .grid {
            grid-template-columns: 1fr;
            gap: 58px;
            max-width: 360px;
            margin: 0 auto;
          }
          .card {
            padding: 68px 20px 28px;
          }
          .sticker {
            top: -42px;
            width: 118px;
            height: 118px;
          }
        }
      `}</style>
    </>
  );
}