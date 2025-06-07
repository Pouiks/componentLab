import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import {
    Settings,
    Globe,
    Moon,
    Sun,
    Monitor,
    Info,
    ArrowLeft,
    Shield
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

/**
 * Page de paramètres de l'application
 */
function SettingsView({ onViewChange }) {
    const { t, i18n } = useTranslation();
    const { isDarkMode, toggleTheme } = useTheme();
    const { settings, updateSettings } = useSettings();

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' }
    ];

    const themes = [
        { value: 'light', label: t('settings.theme_light'), icon: Sun },
        { value: 'dark', label: t('settings.theme_dark'), icon: Moon },
        { value: 'system', label: t('settings.theme_system'), icon: Monitor }
    ];

    const handleLanguageChange = async (langCode) => {
        await i18n.changeLanguage(langCode);
        updateSettings({ language: langCode });
        localStorage.setItem('component-lab-language', langCode);
    };

    const handleThemeChange = (theme) => {
        updateSettings({ theme });

        if (theme === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (systemDark !== isDarkMode) {
                toggleTheme();
            }
        } else {
            const shouldBeDark = theme === 'dark';
            if (shouldBeDark !== isDarkMode) {
                toggleTheme();
            }
        }
    };

    const handleSkipDeleteConfirmationChange = (skip) => {
        updateSettings({ skipDeleteConfirmation: skip });
        localStorage.setItem('component-lab-skip-delete-confirmation', skip.toString());
    };

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        {/* Bouton retour */}
                        <button
                            onClick={() => onViewChange('browse')}
                            className="btn-ghost p-2"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-3">
                            <Settings className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {t('navigation.settings')}
                            </h1>
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 ml-16">
                        {t('settings.subtitle')}
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Apparence */}
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Monitor className="w-5 h-5" />
                            {t('settings.appearance')}
                        </h2>

                        {/* Thème */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                {t('settings.theme')}
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {themes.map((theme) => {
                                    const Icon = theme.icon;
                                    return (
                                        <button
                                            key={theme.value}
                                            onClick={() => handleThemeChange(theme.value)}
                                            className={`p-3 rounded-lg border-2 transition-all ${settings.theme === theme.value
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {theme.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Comportement */}
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            {t('settings.behavior')}
                        </h2>

                        <div className="space-y-4">
                            {/* Confirmation de suppression */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t('settings.skip_delete_confirmation')}
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {t('settings.skip_delete_confirmation_desc')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleSkipDeleteConfirmationChange(!settings.skipDeleteConfirmation)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.skipDeleteConfirmation ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.skipDeleteConfirmation ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Langue */}
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            {t('welcome.language_selection')}
                        </h2>

                        <div className="grid grid-cols-2 gap-3">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`p-4 rounded-lg border-2 transition-all text-left ${i18n.language === lang.code
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{lang.flag}</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {lang.name}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Informations */}
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            {t('settings.information')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">{t('settings.version')}:</span>
                                <span className="ml-2 font-mono text-gray-900 dark:text-white">1.0.0</span>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">{t('settings.platform')}:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">Electron</span>
                            </div>
                            <div>
                                <span className="text-gray-600 dark:text-gray-400">{t('settings.framework')}:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">React</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsView; 