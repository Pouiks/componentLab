import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Search,
    Plus,
    Folder,
    Filter,
    Smartphone,
    Monitor,
    Tablet,
    Settings
} from 'lucide-react';
import { useComponents } from '../context/ComponentContext';
import SearchBar from './SearchBar';
import ComponentList from './ComponentList';
import FilterPanel from './FilterPanel';

/**
 * Composant Sidebar - Navigation et recherche des composants
 */
function Sidebar({ currentView, onViewChange }) {
    const { t } = useTranslation();
    const { components, loading } = useComponents();

    // Statistiques rapides
    const stats = {
        total: components.length,
        frameworks: [...new Set(components.map(c => c.framework))].length,
        platforms: [...new Set(components.map(c => c.platform))].length
    };

    return (
        <div className="h-full flex flex-col bg-sidebar-50 dark:bg-gray-800 transition-colors duration-200 sidebar-stable">
            {/* Header avec logo et titre */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        {/* Logo SVG */}
                        <div className="w-8 h-8 flex items-center justify-center">
                            <img
                                src="/componentLab.svg"
                                alt="ComponentLab Logo"
                                className="w-8 h-8"
                            />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900 dark:text-white">ComponentLab</h1>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{t('common.component_vault')}</p>
                        </div>
                    </div>

                    {/* Boutons d'actions */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onViewChange('settings')}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title={t('navigation.settings')}
                        >
                            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Bouton Nouveau Composant */}
                <button
                    onClick={() => onViewChange('add')}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {t('navigation.import')}
                </button>
            </div>

            {/* Barre de recherche */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <SearchBar />
            </div>

            {/* Statistiques rapides - Plus compactes */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
                        <div className="text-lg font-bold text-primary-600 dark:text-primary-400">{stats.total}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{t('common.components')}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">{stats.frameworks}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{t('common.frameworks')}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.platforms}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{t('common.platforms')}</div>
                    </div>
                </div>
            </div>

            {/* Filtres */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <FilterPanel />
            </div>

            {/* Liste des composants - Optimisée pour le scrolling */}
            <div className="flex-1 min-h-0 flex flex-col">
                <div className="px-3 py-2 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Folder className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{t('common.my_components')}</span>
                        {loading && (
                            <div className="w-3 h-3 border-2 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                        )}
                    </div>
                </div>

                {/* Zone scrollable optimisée */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent px-3 pb-3">
                    <ComponentList onViewChange={onViewChange} />
                </div>
            </div>
        </div>
    );
}

export default Sidebar; 