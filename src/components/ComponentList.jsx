import React from 'react';
import { useTranslation } from 'react-i18next';
import { useComponents } from '../context/ComponentContext';
import ComponentCard from './ComponentCard';

/**
 * Composant ComponentList - Liste des composants filtrés
 */
function ComponentList({ onViewChange }) {
    const { t } = useTranslation();
    const { filteredComponents, loading, loadComponent } = useComponents();

    const handleComponentClick = async (component) => {
        await loadComponent(component.id);
        onViewChange('component');
    };

    if (loading) {
        return (
            <div className="space-y-1.5">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (filteredComponents.length === 0) {
        return (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <p className="text-sm">{t('component.no_components')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-1.5">
            {filteredComponents.map((component) => (
                <ComponentCard
                    key={component.id}
                    component={component}
                    onClick={() => handleComponentClick(component)}
                />
            ))}
        </div>
    );
}

export default ComponentList; 