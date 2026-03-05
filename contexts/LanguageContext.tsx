import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../i18n';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations.nl;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('fainl_lang') as Language) || 'nl';
        }
        return 'nl';
    });

    useEffect(() => {
        localStorage.setItem('fainl_lang', language);
    }, [language]);

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
