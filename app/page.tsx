// app/page.tsx  ——  英文版
'use client';
import { useState } from 'react';

export default function Home() {
  const [chipId, setChipId] = useState('');
  const [result, setResult] = useState('');

  const verify = async () => {
    if (!chipId) return;
    const res = await fetch('/api/products/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chip_id: chipId }),
    });
    const data = await res.json();
    setResult(data.message || 'Unknown error');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white">

      {/* Hero */}

      <section className="px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
          LingLink Band
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          One chip · One life · One code — verify authenticity in a second
        </p>
      </section>

      {/* Product intro */}

      <section className="px-6 py-16 max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Wear the Future, Secured</h2>
          <ul className="space-y-3 text-slate-300">
            <li>✅ Encrypted chip with a unique global ID</li>
            <li>✅ Blockchain-grade traceability for the full supply chain</li>
            <li>✅ Scan & verify instantly — counterfeits have nowhere to hide</li>
            <li>✅ Health data sync plus your digital identity pass</li>
          </ul>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="/linglink-band.jpg"
            alt="LingLink Band"
            className="w-full"
          />
        </div>
      </section>

      {/* Verification */}

      <section className="px-6 py-16 bg-slate-800/50">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Verify Your Band</h2>
          <p className="text-slate-300 mb-6">Find the chip ID inside the strap or box and enter it below</p>
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-3 rounded-lg text-black"
              placeholder="Enter chip ID or scan result"
              value={chipId}
              onChange={(e) => setChipId(e.target.value)}
            />
            <button
              onClick={verify}
              className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
            >
              Verify
            </button>
          </div>
          {result && (
            <p className="mt-4 text-sm text-slate-200">
              Result: <span className="font-semibold">{result}</span>
            </p>
          )}
        </div>
      </section>

      {/* Download */}

      <section className="px-6 py-16 text-center">
        <h2 className="text-2xl font-bold mb-6">Get the App</h2>
        <p className="text-slate-300 mb-6">Scan to download the Android app (iOS coming soon)</p>

        <div className="flex justify-center gap-8">
          {/* Android QR */}

          <div className="bg-white p-3 rounded-lg">
            <img
              src="/download/android-qr.png"
              alt="Android QR"
              className="w-40 h-40"
            />
            <p className="text-black text-sm mt-2">Android</p>
          </div>

          {/* iOS placeholder */}

          <div className="bg-white p-3 rounded-lg opacity-40">
            <div className="w-40 h-40 flex items-center justify-center text-black text-sm">
              iOS<br />Coming soon
            </div>
            <p className="text-black text-sm mt-2">iOS</p>
          </div>
        </div>
      </section>

      {/* Footer */}

      <footer className="px-6 py-10 text-center text-slate-400 text-sm">
        <p>© 2025 LingLink Tech | dajuzhaoxiang@gmail.com | +86-400-123-4567</p>
      </footer>
    </main>
  );
}