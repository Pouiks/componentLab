import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Code, Eye, Edit, Trash2, Copy, ExternalLink, Download, FileText, Folder } from 'lucide-react';
import { useComponents } from '../context/ComponentContext';
import { useTheme } from '../context/ThemeContext';
import MonacoEditor from '@monaco-editor/react';
import { getFrameworkIcon, getPlatformIcon, getFrameworkColor } from '../utils/icons';

/**
 * Vue ComponentView - Affichage détaillé d'un composant
 */
function ComponentView({ onViewChange }) {
    const { t } = useTranslation();
    const { currentComponent, deleteComponent, exportSingleComponent } = useComponents();
    const { isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState('code');
    const [activeFile, setActiveFile] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    if (!currentComponent) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-400">{t('component.no_component_selected')}</p>
            </div>
        );
    }

    const FrameworkIcon = getFrameworkIcon(currentComponent.framework);
    const PlatformIcon = getPlatformIcon(currentComponent.platform);
    const frameworkColor = getFrameworkColor(currentComponent.framework);

    // Stabiliser les valeurs calculées pour éviter les re-calculs
    const sourceFiles = useMemo(() => {
        return currentComponent ? Object.keys(currentComponent.sourceFiles || {}) : [];
    }, [currentComponent?.sourceFiles]);

    const currentActiveFile = useMemo(() => {
        return activeFile || sourceFiles[0];
    }, [activeFile, sourceFiles]);

    // Réinitialiser activeFile seulement quand nécessaire
    useEffect(() => {
        if (currentComponent && sourceFiles.length > 0 && !activeFile) {
            setActiveFile(sourceFiles[0]);
        }
    }, [currentComponent?.id, sourceFiles]);

    const handleDelete = async () => {
        if (window.confirm(t('component.delete_confirm', { name: currentComponent.name }))) {
            await deleteComponent(currentComponent.id);
            onViewChange('browse');
        }
    };

    const copyToClipboard = (content) => {
        navigator.clipboard.writeText(content);
        // TODO: Ajouter notification de succès
    };

    const getLanguageFromExtension = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        const langMap = {
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'html': 'html',
            'css': 'css',
            'dart': 'dart',
            'swift': 'swift',
            'kt': 'kotlin',
            'json': 'json',
            'md': 'markdown'
        };
        return langMap[ext] || 'plaintext';
    };

    const handleExportComponent = async (exportType) => {
        try {
            setIsExporting(true);
            setShowExportMenu(false);

            let defaultName = `${currentComponent.name}`;
            let exportDescription = '';

            switch (exportType) {
                case 'folder':
                    defaultName += '-folder';
                    exportDescription = 'dossier complet';
                    break;
                case 'files':
                    defaultName += '-files';
                    exportDescription = 'fichiers individuels';
                    break;
                case 'snippet':
                    defaultName += '-snippet';
                    exportDescription = 'snippet';
                    break;
            }

            const filePath = await window.electronAPI.files.saveDialog({
                title: t('export.choose_export_location'),
                defaultPath: `${defaultName}.json`,
                filters: [
                    { name: 'ComponentLab Export', extensions: ['json'] }
                ]
            });

            if (filePath) {
                const result = await exportSingleComponent(currentComponent.id, filePath);

                if (result.success) {
                    console.log(`${t('export.export_success')} (${exportDescription})`);
                    console.log(t('export.exported_to', { path: filePath }));
                } else {
                    console.error(t('export.export_error'), result.error);
                }
            }
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onViewChange('browse')}
                            className="btn-ghost p-2"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <FrameworkIcon className={`w-5 h-5 ${frameworkColor}`} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {currentComponent.name}
                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">v{currentComponent.version}</span>
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">{currentComponent.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDelete}
                            className="btn-ghost text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Métadonnées */}
                <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('component.framework')}:</span>
                        <span className={`text-sm font-medium ${frameworkColor}`}>
                            {currentComponent.framework}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PlatformIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{currentComponent.platform}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('component.language')}:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {currentComponent.language}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {currentComponent.snippet && (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm text-yellow-600 dark:text-yellow-400">Snippet</span>
                            </div>
                        )}
                        {currentComponent.partial_import && (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span className="text-sm text-orange-600 dark:text-orange-400">{t('component.partial_import')}</span>
                            </div>
                        )}
                        {currentComponent.previewable && (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-600 dark:text-green-400">{t('component.preview_available')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tags */}
                {currentComponent.tags && currentComponent.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {currentComponent.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Styles externes */}
                {currentComponent.external_styles && currentComponent.external_styles.length > 0 && (
                    <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('component.external_styles')}</h4>
                        <div className="flex flex-wrap gap-2">
                            {currentComponent.external_styles.map((style, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded font-mono"
                                >
                                    {style}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Onglets */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'code'
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <Code className="w-4 h-4 inline mr-2" />
                        {t('editor.source_code')}
                    </button>
                    {currentComponent.previewable && (
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preview'
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            <Eye className="w-4 h-4 inline mr-2" />
                            {t('editor.preview')}
                        </button>
                    )}
                </div>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'code' && (
                    <div className="h-full flex">
                        {/* Liste des fichiers */}
                        {sourceFiles.length > 1 && (
                            <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">{t('editor.files')}</h3>
                                <div className="space-y-1">
                                    {sourceFiles.map((filename) => (
                                        <button
                                            key={filename}
                                            onClick={() => setActiveFile(filename)}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${currentActiveFile === filename
                                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 font-medium'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {filename}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Éditeur de code */}
                        <div className="flex-1 flex flex-col">
                            {currentActiveFile && (
                                <>
                                    {/* Header du fichier */}
                                    <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {currentActiveFile}
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard(currentComponent.sourceFiles[currentActiveFile])}
                                            className="btn-ghost text-xs"
                                        >
                                            <Copy className="w-3 h-3 mr-1" />
                                            {t('common.copy')}
                                        </button>
                                    </div>

                                    {/* Monaco Editor */}
                                    <div className="flex-1 bg-white dark:bg-gray-800">
                                        <MonacoEditor
                                            value={currentComponent.sourceFiles[currentActiveFile] || ''}
                                            language={getLanguageFromExtension(currentActiveFile)}
                                            theme={isDarkMode ? "vs-dark" : "vs-light"}
                                            options={{
                                                readOnly: true,
                                                minimap: { enabled: false },
                                                scrollBeyondLastLine: false,
                                                fontSize: 14,
                                                lineNumbers: 'on',
                                                wordWrap: 'on',
                                                automaticLayout: true
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'preview' && currentComponent.previewable && (
                    <div className="h-full p-6 bg-gray-50 dark:bg-gray-900">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
                            <div className="text-center">
                                <ExternalLink className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('editor.preview_development')}</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t('editor.preview_future')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Menu Export */}
            <div className="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        disabled={isExporting}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span>{t('export.export_single')}</span>
                    </button>

                    {showExportMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                            <div className="p-2">
                                <button
                                    onClick={() => handleExportComponent('folder')}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <Folder className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            {t('export.export_as_folder')}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Structure complète du composant
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleExportComponent('files')}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <FileText className="w-4 h-4 text-green-600" />
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            {t('export.export_as_files')}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Fichiers individuels
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleExportComponent('snippet')}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <Code className="w-4 h-4 text-yellow-600" />
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            {t('export.export_as_snippet')}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Snippet
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ComponentView; 