import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

/**
 * Hook pour utiliser le contexte des paramètres
 */
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        // Retourner des valeurs par défaut si le contexte n'est pas disponible
        return {
            settings: { skipDeleteConfirmation: false },
            updateSettings: () => { },
            resetSettings: () => { }
        };
    }
    return context;
};

/**
 * Provider pour les paramètres de l'application
 */
export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        theme: 'system', // light, dark, system
        compactMode: false,
        autoSave: true,
        autoPreview: true,
        skipDeleteConfirmation: false, // Nouveau paramètre
        language: 'fr'
    });

    // Charger les paramètres depuis localStorage au démarrage
    useEffect(() => {
        const savedSettings = localStorage.getItem('componentlab-settings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(prev => ({ ...prev, ...parsed }));
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }, []);

    // Sauvegarder les paramètres dans localStorage à chaque modification
    useEffect(() => {
        localStorage.setItem('componentlab-settings', JSON.stringify(settings));
    }, [settings]);

    /**
     * Mettre à jour un ou plusieurs paramètres
     */
    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    /**
     * Réinitialiser tous les paramètres
     */
    const resetSettings = () => {
        setSettings({
            theme: 'system',
            compactMode: false,
            autoSave: true,
            autoPreview: true,
            skipDeleteConfirmation: false,
            language: 'fr'
        });
        localStorage.removeItem('componentlab-settings');
    };

    const value = {
        settings,
        updateSettings,
        resetSettings
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext; 