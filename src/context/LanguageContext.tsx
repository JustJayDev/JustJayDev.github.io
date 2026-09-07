import React, { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'en' | 'hi';

// Add new strings here — both languages side by side.
export const STRINGS: Record<string, { en: string; hi: string }> = {
  tagline: { en: '16-year-old developer from India', hi: 'भारत का 16 साल का डेवलपर' },
  scanQr: { en: 'Scan to visit my site', hi: 'मेरी साइट खोलने के लिए स्कैन करें' },
  loadoutTitle: { en: 'My Loadout', hi: 'मेरा लोडआउट' },
  loadoutDesc: {
    en: 'The exact sensitivity and settings I use. Copy them, tune them, make them yours.',
    hi: 'मेरी असली सेंसिटिविटी और सेटिंग्स। इन्हें कॉपी करें, अपने हिसाब से सेट करें।',
  },
  presets: { en: 'Sensitivity Presets', hi: 'सेंसिटिविटी प्रीसेट' },
  deviceSetup: { en: 'Device Setup', hi: 'डिवाइस सेटअप' },
  quizTitle: { en: 'How well do you know Jay?', hi: 'जे के बारे में कितना जानते हो?' },
  quizDesc: { en: '8 questions. No cheating (the answers are on the site somewhere 👀).', hi: '8 सवाल। ना चीटिंग (जवाब साइट पर कहीं छिपे हैं 👀)।' },
  playAgain: { en: 'Play Again', hi: 'फिर से खेलें' },
  question: { en: 'Question', hi: 'सवाल' },
  of: { en: 'of', hi: '/' },
  galleryTitle: { en: 'Moments', hi: 'पल' },
  galleryDesc: { en: 'Setup, gameplay, and random good moments. Tap any card to zoom.', hi: 'सेटअप, गेमप्ले और अच्छे पल। ज़ूम के लिए किसी भी कार्ड पर टैप करें।' },
  photoSoon: { en: 'photo coming soon', hi: 'फोटो जल्द आ रही है' },
  guestbookTitle: { en: 'Say Hi', hi: 'नमस्ते कहो' },
  guestbookDesc: { en: 'Sign the guestbook — your message goes live instantly for everyone to see.', hi: 'गेस्टबुक में लिखो — आपका मैसेज तुरंत सबको दिखेगा।' },
  yourName: { en: 'Your name', hi: 'आपका नाम' },
  yourMsg: { en: 'Your message…', hi: 'आपका मैसेज…' },
  sign: { en: 'Sign Guestbook', hi: 'गेस्टबुक साइन करें' },
  signing: { en: 'Signing…', hi: 'हो रहा है…' },
  signed: { en: 'Signed! ✓', hi: 'हो गया! ✓' },
  messages: { en: 'Messages', hi: 'मैसेज' },
  noMsgs: { en: 'No messages yet 😢', hi: 'अभी कोई मैसेज नहीं 😢' },
  firstSign: { en: 'Be the very first to sign. Forever spot #1 is open.', hi: 'पहले साइन करने वाले बनो। पक्की जगह #1 खाली है।' },
  visits: { en: 'visits', hi: 'विज़िट' },
  reacted: { en: 'You reacted — thanks! One reaction per person.', hi: 'आपने रिएक्ट किया — शुक्रिया! एक व्यक्ति को एक ही रिएक्शन।' },
};

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<LangCtx>({ lang: 'en', setLang: () => {}, t: (k) => k });

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('jjdev-lang');
      if (saved === 'hi' || saved === 'en') return saved;
    } catch { /* ignore */ }
    return 'en';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('jjdev-lang', l); } catch { /* ignore */ }
  };

  useEffect(() => {
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  }, [lang]);

  const t = (key: string) => STRINGS[key]?.[lang] ?? key;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
};

export const useLang = () => useContext(Ctx);