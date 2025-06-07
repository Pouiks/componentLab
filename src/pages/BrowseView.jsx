import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid3X3, List, Plus } from 'lucide-react';
import { useComponents } from '../context/ComponentContext';
import ComponentCard from '../components/ComponentCard';

/**
 * Vue BrowseView - Navigation et parcours des composants
 */
function BrowseView({ onViewChange }) {
    const { t } = useTranslation();
    const { filteredComponents, loading, loadComponent, searchQuery } = useComponents();

    const handleComponentClick = async (component) => {
        await loadComponent(component.id);
        onViewChange('component');
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('common.my_components')}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {filteredComponents.length} {t('common.components').toLowerCase()}
                            {searchQuery && ` ${t('search.found_for', { query: searchQuery })}`}
                        </p>
                    </div>

                    <button
                        onClick={() => onViewChange('import')}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {t('navigation.import')}
                    </button>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 overflow-auto p-6">
                {loading ? (
                    // État de chargement
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
                                            <div className="flex gap-2">
                                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredComponents.length === 0 ? (
                    // État vide
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <Grid3X3 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {searchQuery ? t('search.no_results') : t('component.no_components')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {searchQuery
                                ? t('search.no_results_for', { query: searchQuery })
                                : t('component.get_started')
                            }
                        </p>
                        <button
                            onClick={() => onViewChange('import')}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            {t('navigation.import')}
                        </button>
                    </div>
                ) : (
                    // Grille des composants
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredComponents.map((component) => (
                            <ComponentCard
                                key={component.id}
                                component={component}
                                onClick={() => handleComponentClick(component)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BrowseView;