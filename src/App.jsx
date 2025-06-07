import React, { useState, useEffect } from 'react';
import { ComponentProvider, useComponents } from './context/ComponentContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ImportWizard from './components/ImportWizard';
import FirstRunSetup from './components/FirstRunSetup';
import { SettingsProvider } from './context/SettingsContext';

/**
 * Composant interne avec accès au contexte
 */
function AppContent() {
    const [currentView, setCurrentView] = useState('browse');
    const [showImportWizard, setShowImportWizard] = useState(false);
    const { importComponent } = useComponents();

    const handleViewChange = (view) => {
        if (view === 'import') {
            setShowImportWizard(true);
        } else {
            setCurrentView(view);
        }
    };

    const handleImport = async (importRequest) => {
        const success = await importComponent(importRequest);
        if (success) {
            setCurrentView('browse');
            setShowImportWizard(false);
        }
    };

    return (
        <div className="h-screen flex" style={{ overflow: 'hidden' }}>
            <Sidebar currentView={currentView} onViewChange={handleViewChange} />
            <div className="flex-1 min-w-0" style={{ contain: 'layout' }}>
                <MainContent currentView={currentView} onViewChange={handleViewChange} />
            </div>

            {/* Assistant d'import direct */}
            <ImportWizard
                isOpen={showImportWizard}
                onClose={() => setShowImportWizard(false)}
                onImport={handleImport}
            />
        </div>
    );
}

/**
 * Composant principal de l'application ComponentLab
 */
function App() {
    const [showFirstRun, setShowFirstRun] = useState(false);

    useEffect(() => {
        // Vérifier si c'est le premier lancement
        const isFirstRun = localStorage.getItem('component-lab-first-run');
        if (isFirstRun === null) {
            setShowFirstRun(true);
        }
    }, []);

    const handleFirstRunComplete = () => {
        setShowFirstRun(false);
    };

    return (
        <SettingsProvider>
            <ThemeProvider>
                <ComponentProvider>
                    <AppContent />
                    {/* Configuration premier lancement */}
                    {showFirstRun && (
                        <FirstRunSetup onComplete={handleFirstRunComplete} />
                    )}
                </ComponentProvider>
            </ThemeProvider>
        </SettingsProvider>
    );
}

export default App; 