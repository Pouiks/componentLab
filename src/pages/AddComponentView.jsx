import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, Upload, FileText, Save, Wand2 } from 'lucide-react';
import { useComponents } from '../context/ComponentContext';
import { useTheme } from '../context/ThemeContext';
import MonacoEditor from '@monaco-editor/react';
import ImportWizard from '../components/ImportWizard';

/**
 * Vue AddComponentView - Formulaire d'ajout d'un nouveau composant
 */
function AddComponentView({ onViewChange }) {
    const { t } = useTranslation();
    const { saveComponent, importComponent, loading } = useComponents();
    const { isDarkMode } = useTheme();
    const [showImportWizard, setShowImportWizard] = useState(false);

    // État du formulaire
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        framework: 'React',
        platform: 'Web',
        language: 'JSX',
        version: '1.0.0',
        tags: [],
        description: '',
        previewable: false
    });

    const [sourceFiles, setSourceFiles] = useState({
        'index.jsx': ''
    });

    const [activeFile, setActiveFile] = useState('index.jsx');
    const [tagInput, setTagInput] = useState('');

    // Options de configuration
    const frameworkOptions = Object.keys(t('frameworks', { returnObjects: true }));

    const platformOptions = Object.keys(t('platforms', { returnObjects: true }));

    const languageOptions = {
        'React': ['JSX', 'TSX'],
        'React Native': ['JSX', 'TSX'],
        'Flutter': ['Dart'],
        'Vue': ['Vue', 'JSX'],
        'Angular': ['TypeScript', 'JavaScript'],
        'HTML': ['HTML'],
        'CSS': ['CSS', 'SCSS', 'SASS'],
        'Web Components': ['JavaScript', 'TypeScript'],
        'Swift': ['Swift'],
        'Kotlin': ['Kotlin']
    };

    const fileExtensions = {
        'JSX': 'jsx',
        'TSX': 'tsx',
        'JavaScript': 'js',
        'TypeScript': 'ts',
        'Vue': 'vue',
        'HTML': 'html',
        'CSS': 'css',
        'SCSS': 'scss',
        'SASS': 'sass',
        'Dart': 'dart',
        'Swift': 'swift',
        'Kotlin': 'kt'
    };

    // Handlers
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            ...(field === 'name' && { id: value.toLowerCase().replace(/[^a-z0-9]/g, '') }),
            ...(field === 'framework' && {
                language: languageOptions[value]?.[0] || 'JavaScript'
            })
        }));

        // Mettre à jour l'extension du fichier principal si le langage change
        if (field === 'language' || field === 'framework') {
            const newLang = field === 'language' ? value : languageOptions[value]?.[0];
            const newExt = fileExtensions[newLang] || 'js';
            const newFileName = `index.${newExt}`;

            setSourceFiles(prev => {
                const newFiles = { ...prev };
                const oldFileName = activeFile;
                if (oldFileName !== newFileName) {
                    newFiles[newFileName] = newFiles[oldFileName] || '';
                    delete newFiles[oldFileName];
                }
                return newFiles;
            });
            setActiveFile(newFileName);
        }
    };

    const handleTagAdd = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleTagRemove = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleFileAdd = () => {
        const fileName = prompt('Nom du fichier (avec extension):');
        if (fileName && !sourceFiles[fileName]) {
            setSourceFiles(prev => ({
                ...prev,
                [fileName]: ''
            }));
            setActiveFile(fileName);
        }
    };

    const handleFileRemove = (fileName) => {
        if (Object.keys(sourceFiles).length > 1) {
            setSourceFiles(prev => {
                const newFiles = { ...prev };
                delete newFiles[fileName];
                return newFiles;
            });
            if (activeFile === fileName) {
                setActiveFile(Object.keys(sourceFiles).find(f => f !== fileName));
            }
        }
    };

    const handleImportFile = async () => {
        try {
            const file = await window.electronAPI.dialog.openFile();
            if (file) {
                setSourceFiles(prev => ({
                    ...prev,
                    [file.name]: file.content
                }));
                setActiveFile(file.name);
            }
        } catch (error) {
            console.error('Erreur lors de l\'import:', error);
        }
    };

    const handleSave = async () => {
        // Validation basique
        if (!formData.name || !formData.description) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        const componentData = {
            meta: {
                ...formData,
                source_files: Object.keys(sourceFiles),
                external_styles: [],
                partial_import: false,
                snippet: false,
                previewable: ['React', 'HTML', 'Vue'].includes(formData.framework)
            },
            sourceFiles
        };

        const success = await saveComponent(componentData);
        if (success) {
            onViewChange('browse');
        }
    };

    const handleImport = async (importRequest) => {
        const success = await importComponent(importRequest);
        if (success) {
            onViewChange('browse');
        }
    };

    const getLanguageFromExtension = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        const langMap = {
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'vue': 'vue',
            'html': 'html',
            'css': 'css',
            'scss': 'scss',
            'sass': 'sass',
            'dart': 'dart',
            'swift': 'swift',
            'kt': 'kotlin'
        };
        return langMap[ext] || 'plaintext';
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
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nouveau Composant</h1>
                            <p className="text-gray-600 dark:text-gray-400">Ajoutez un nouveau composant à votre vault</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowImportWizard(true)}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Wand2 className="w-4 h-4" />
                            Assistant d'import
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenu */}
            <div className="flex-1 flex overflow-hidden">
                {/* Formulaire de métadonnées */}
                <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Métadonnées</h2>

                    <div className="space-y-4">
                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nom du composant *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="input-field"
                                placeholder="ex: UserCard"
                            />
                            {formData.id && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {formData.id}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="input-field"
                                rows={3}
                                placeholder="Description du composant..."
                            />
                        </div>

                        {/* Framework */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Framework
                            </label>
                            <select
                                value={formData.framework}
                                onChange={(e) => handleInputChange('framework', e.target.value)}
                                className="input-field"
                            >
                                {frameworkOptions.map(framework => (
                                    <option key={framework} value={framework}>
                                        {t(`frameworks.${framework}`)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Plateforme */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Plateforme
                            </label>
                            <select
                                value={formData.platform}
                                onChange={(e) => handleInputChange('platform', e.target.value)}
                                className="input-field"
                            >
                                {platformOptions.map(platform => (
                                    <option key={platform} value={platform}>
                                        {t(`platforms.${platform}`)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Langage */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Langage
                            </label>
                            <select
                                value={formData.language}
                                onChange={(e) => handleInputChange('language', e.target.value)}
                                className="input-field"
                            >
                                {(languageOptions[formData.framework] || ['JavaScript']).map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>

                        {/* Version */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Version
                            </label>
                            <input
                                type="text"
                                value={formData.version}
                                onChange={(e) => handleInputChange('version', e.target.value)}
                                className="input-field"
                                placeholder="1.0.0"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tags
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                                    className="input-field flex-1"
                                    placeholder="Ajouter un tag..."
                                />
                                <button
                                    onClick={handleTagAdd}
                                    className="btn-secondary"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {formData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                        >
                                            {tag}
                                            <button
                                                onClick={() => handleTagRemove(tag)}
                                                className="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Éditeur de code */}
                <div className="flex-1 flex flex-col">
                    {/* Header des fichiers */}
                    <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Code Source</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleImportFile}
                                    className="btn-secondary text-sm flex items-center gap-2"
                                >
                                    <Upload className="w-3 h-3" />
                                    Importer
                                </button>
                                <button
                                    onClick={handleFileAdd}
                                    className="btn-secondary text-sm flex items-center gap-2"
                                >
                                    <Plus className="w-3 h-3" />
                                    Fichier
                                </button>
                            </div>
                        </div>

                        {/* Onglets des fichiers */}
                        <div className="flex gap-1">
                            {Object.keys(sourceFiles).map((filename) => (
                                <div key={filename} className="flex items-center">
                                    <button
                                        onClick={() => setActiveFile(filename)}
                                        className={`px-3 py-1 text-sm rounded-t-lg transition-colors ${activeFile === filename
                                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-t border-l border-r border-gray-200 dark:border-gray-700'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {filename}
                                    </button>
                                    {Object.keys(sourceFiles).length > 1 && (
                                        <button
                                            onClick={() => handleFileRemove(filename)}
                                            className="ml-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1 bg-white dark:bg-gray-800">
                        {activeFile && (
                            <MonacoEditor
                                value={sourceFiles[activeFile] || ''}
                                language={getLanguageFromExtension(activeFile)}
                                theme={isDarkMode ? "vs-dark" : "vs-light"}
                                onChange={(value) =>
                                    setSourceFiles(prev => ({
                                        ...prev,
                                        [activeFile]: value || ''
                                    }))
                                }
                                options={{
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    wordWrap: 'on',
                                    automaticLayout: true
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Import Wizard */}
            <ImportWizard
                isOpen={showImportWizard}
                onClose={() => setShowImportWizard(false)}
                onImport={handleImport}
            />
        </div>
    );
}

export default AddComponentView; 