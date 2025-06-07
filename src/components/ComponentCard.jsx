import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { useComponents } from '../context/ComponentContext';
import { useSettings } from '../context/SettingsContext';
import DeleteConfirmation from './DeleteConfirmation';

/**
 * Composant ComponentCard - Carte d'affichage d'un composant
 */
function ComponentCard({ component, onClick }) {
    const { t } = useTranslation();
    const { deleteComponent } = useComponents();
    const { settings, updateSettings } = useSettings();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleDeleteClick = (e) => {
        e.stopPropagation();

        if (settings.skipDeleteConfirmation) {
            deleteComponent(component.id);
        } else {
            setShowDeleteConfirm(true);
        }
    };

    const handleDeleteConfirm = () => {
        deleteComponent(component.id);
        setShowDeleteConfirm(false);
    };

    const handleDontAskAgainChange = (dontAskAgain) => {
        if (dontAskAgain) {
            updateSettings({ skipDeleteConfirmation: true });
        }
    };

    return (
        <>
            <div
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm cursor-pointer transition-colors component-card-stable"
                style={{ minHeight: '88px' }}
            >
                {/* Bouton de suppression au hover */}
                {isHovered && (
                    <button
                        onClick={handleDeleteClick}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center transition-colors z-10"
                        title={t('common.delete')}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                )}

                <div className="flex flex-col gap-2">
                    {/* Header avec nom seulement */}
                    <div className="flex items-start justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm pr-8">
                            {component.name}
                        </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                        {component.description}
                    </p>

                    {/* Framework et plateforme */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded font-medium">
                            {component.framework}
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                            {component.platform}
                        </span>
                    </div>

                    {/* Types et statuts */}
                    <div className="flex items-center gap-1 flex-wrap">
                        {component.snippet && (
                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
                                Snippet
                            </span>
                        )}
                        {component.partial_import && (
                            <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                                Fichiers
                            </span>
                        )}
                        {component.previewable && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                                Preview
                            </span>
                        )}
                    </div>

                    {/* Tags */}
                    {component.tags && component.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {component.tags.slice(0, 2).map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                            {component.tags.length > 2 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    +{component.tags.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Dialogue de confirmation de suppression */}
            <DeleteConfirmation
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteConfirm}
                componentName={component.name}
                showDontAskAgain={true}
                onDontAskAgainChange={handleDontAskAgainChange}
            />
        </>
    );
}

export default ComponentCard; 