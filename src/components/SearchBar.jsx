import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { useComponents } from '../context/ComponentContext';

/**
 * Composant SearchBar - Barre de recherche globale
 */
function SearchBar() {
    const { t } = useTranslation();
    const { searchQuery, setSearchQuery } = useComponents();

    const handleClear = () => {
        setSearchQuery('');
    };

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 pr-10 text-sm"
            />
            {searchQuery && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <X className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </button>
            )}
        </div>
    );
}

export default SearchBar; 