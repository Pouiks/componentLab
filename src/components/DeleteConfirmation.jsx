import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, AlertTriangle } from 'lucide-react';

/**
 * Composant DeleteConfirmation - Dialogue de confirmation de suppression
 */
function DeleteConfirmation({
    isOpen,
    onClose,
    onConfirm,
    componentName,
    showDontAskAgain = false,
    onDontAskAgainChange
}) {
    const { t } = useTranslation();
    const [dontAskAgain, setDontAskAgain] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (showDontAskAgain && onDontAskAgainChange) {
            onDontAskAgainChange(dontAskAgain);
        }
        onConfirm();
    };

    const handleDontAskAgainChange = (checked) => {
        setDontAskAgain(checked);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('component.quick_delete')}
                        </h3>
                    </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('component.delete_confirm_quick', { name: componentName })}
                </p>

                {showDontAskAgain && (
                    <div className="mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={dontAskAgain}
                                onChange={(e) => handleDontAskAgainChange(e.target.checked)}
                                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {t('component.dont_ask_again')}
                            </span>
                        </label>
                    </div>
                )}

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        {t('common.delete')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmation; 