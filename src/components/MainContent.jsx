import React from 'react';
import BrowseView from '../pages/BrowseView';
import ComponentView from '../pages/ComponentView';
import AddComponentView from '../pages/AddComponentView';
import SettingsView from '../pages/SettingsView';

/**
 * Composant MainContent - Gestionnaire des vues principales
 */
function MainContent({ currentView, onViewChange }) {
    const renderCurrentView = () => {
        switch (currentView) {
            case 'browse':
                return <BrowseView onViewChange={onViewChange} />;
            case 'component':
                return <ComponentView onViewChange={onViewChange} />;
            case 'add':
                return <AddComponentView onViewChange={onViewChange} />;
            case 'settings':
                return <SettingsView onViewChange={onViewChange} />;
            default:
                return <BrowseView onViewChange={onViewChange} />;
        }
    };

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {renderCurrentView()}
        </div>
    );
}

export default MainContent; 