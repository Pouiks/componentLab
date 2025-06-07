import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useComponents } from '../context/ComponentContext';

/**
 * Composant FilterPanel - Panneau de filtres avancés
 */
function FilterPanel() {
    const { t } = useTranslation();
    const { components, filters, setFilters } = useComponents();
    const [isExpanded, setIsExpanded] = useState(false);

    // Extraire les options disponibles depuis les composants existants
    const availableFrameworks = [...new Set(components.map(c => c.framework))].sort();
    const availablePlatforms = [...new Set(components.map(c => c.platform))].sort();
    const availableTags = [...new Set(components.flatMap(c => c.tags))].sort();

    const handleFrameworkChange = (framework) => {
        setFilters({
            framework: filters.framework === framework ? '' : framework
        });
    };

    const handlePlatformChange = (platform) => {
        setFilters({
            platform: filters.platform === platform ? '' : platform
        });
    };

    const handleTagToggle = (tag) => {
        const newTags = filters.tags.includes(tag)
            ? filters.tags.filter(t => t !== tag)
            : [...filters.tags, tag];
        setFilters({ tags: newTags });
    };

    const clearAllFilters = () => {
        setFilters({ framework: '', platform: '', tags: [] });
    };

    const hasActiveFilters = filters.framework || filters.platform || filters.tags.length > 0;

    return (
        <div className="bg-white dark:bg-gray-800">
            {/* Header du panneau de filtres */}
            <div className="p-3">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{t('common.filters')}</span>
                        {hasActiveFilters && (
                            <div className="flex items-center gap-2">
                                <span className="bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300 text-xs px-2 py-1 rounded-full">
                                    {(filters.framework ? 1 : 0) + (filters.platform ? 1 : 0) + filters.tags.length}
                                </span>
                                <button
                                    onClick={clearAllFilters}
                                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                    title={t('common.clear_filters')}
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    )}
                </button>
            </div>

            {/* Contenu des filtres */}
            {isExpanded && (
                <div className="px-3 pb-3 space-y-3">
                    {/* Filtre par Framework */}
                    {availableFrameworks.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{t('component.framework')}</h4>
                            <div className="space-y-1">
                                {availableFrameworks.map(framework => (
                                    <label key={framework} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded transition-colors">
                                        <input
                                            type="radio"
                                            name="framework"
                                            checked={filters.framework === framework}
                                            onChange={() => handleFrameworkChange(framework)}
                                            className="text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{framework}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filtre par Plateforme */}
                    {availablePlatforms.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{t('component.platform')}</h4>
                            <div className="space-y-1">
                                {availablePlatforms.map(platform => (
                                    <label key={platform} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded transition-colors">
                                        <input
                                            type="radio"
                                            name="platform"
                                            checked={filters.platform === platform}
                                            onChange={() => handlePlatformChange(platform)}
                                            className="text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{platform}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filtre par Tags */}
                    {availableTags.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{t('component.tags')}</h4>
                            <div className="max-h-28 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                {availableTags.map(tag => (
                                    <label key={tag} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={filters.tags.includes(tag)}
                                            onChange={() => handleTagToggle(tag)}
                                            className="text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bouton pour effacer tous les filtres */}
                    {hasActiveFilters && (
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={clearAllFilters}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors border border-red-200 dark:border-red-800"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {t('common.clear_filters')}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default FilterPanel; 