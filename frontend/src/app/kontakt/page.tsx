"use client";
import { useRef, useState, useEffect } from "react";

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => { setPlaying(false); setShowButton(true); };
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
      setShowButton(false);
    } else {
      video.pause();
      setPlaying(false);
      setShowButton(true);
    }
  };

  return (
    <div className="relative w-full bg-[#f4f4f4] cursor-pointer" onClick={toggle}>
      <video
        ref={videoRef}
        className="w-full max-h-[500px] object-contain"
        playsInline
      >
        <source src="/jopke-willkommen.mp4" type="video/mp4" />
      </video>
      {showButton && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-[#822660] ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Kontakt() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-bold text-[#2b2b2b] uppercase tracking-wide mb-8 border-l-4 border-[#822660] pl-4">
        Kontakt
      </h1>

      {/* Welcome video */}
      <div className="mb-8">
        <VideoPlayer />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Address card */}
        <div className="bg-white border border-[#dcdcdc] p-6 text-sm text-[#333333] leading-7">
          <h2 className="font-semibold text-[#2b2b2b] mb-3">Jopke Dialog Services</h2>
          <address className="not-italic text-[#666666] space-y-1">
            <p>Am Mondschein 23a</p>
            <p>59557 Lippstadt</p>
            <p className="mt-3">
              Telefon:{" "}
              <a href="tel:+4929412868980" className="text-[#822660] hover:underline">
                +49 2941 2868 980
              </a>
            </p>
            <p>Telefax: +49 2941 2868 989</p>
            <p>
              E-Mail:{" "}
              <a href="mailto:info@jopke.de" className="text-[#822660] hover:underline">
                info@jopke.de
              </a>
            </p>
          </address>
        </div>

        {/* Hours card */}
        <div className="bg-white border border-[#dcdcdc] p-6 text-sm text-[#333333] leading-7">
          <h2 className="font-semibold text-[#2b2b2b] mb-3">Geschäftszeiten</h2>
          <p className="text-[#666666]">Montags – Freitags</p>
          <p className="text-[#822660] font-semibold text-base">08:00 – 17:00 Uhr</p>
          <p className="mt-4 text-xs text-[#888888]">
            Nur für gewerbliche Kunden.<br />
            Alle Preise zzgl. gesetzlicher MwSt.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 bg-[#2b2b2b] text-white p-8">
        <h2 className="font-bold text-lg mb-4">Angebot unverbindlich anfragen</h2>
        <p className="text-[#bbbbbb] text-sm mb-6">
          Sie haben spezielle Wünsche oder benötigen ein individuelles Angebot?
          Rufen Sie uns an oder schreiben Sie uns eine E-Mail – wir melden uns schnellstmöglich.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="tel:+4929412868980"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#822660] hover:bg-[#6b1f50] text-white font-semibold transition-colors"
          >
            Jetzt anrufen
          </a>
          <a
            href="mailto:info@jopke.de"
            className="inline-flex items-center justify-center px-6 py-3 border border-[#555555] text-white font-semibold hover:bg-[#3a3a3a] transition-colors"
          >
            E-Mail senden
          </a>
        </div>
      </div>
    </main>
  );
}
