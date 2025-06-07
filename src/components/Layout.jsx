import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { useComponents } from '../context/ComponentContext';
import { Plus } from 'lucide-react';

/**
 * Composant Layout principal - Structure de base de l'application
 */
function Layout() {
    const [currentView, setCurrentView] = useState('browse'); // 'browse', 'component', 'add'
    const { error, clearError } = useComponents();
    const [showImportWizard, setShowImportWizard] = useState(false);

    return (
        <div className="flex h-full">
            {/* Sidebar - Navigation */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
                <Sidebar currentView={currentView} onViewChange={setCurrentView} />
            </div>

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col">
                {/* Barre d'erreur si nécessaire */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-red-800 dark:text-red-200 text-sm font-medium">
                                Erreur: {error}
                            </span>
                        </div>
                        <button
                            onClick={clearError}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium text-sm"
                        >
                            Fermer
                        </button>
                    </div>
                )}

                {/* Zone de contenu */}
                <div className="flex-1 overflow-hidden">
                    <MainContent currentView={currentView} onViewChange={setCurrentView} />
                </div>

                <button
                    onClick={() => setShowImportWizard(true)}
                    className="btn-primary flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Importer un composant
                </button>
            </div>
        </div>
    );
}

export default Layout; 