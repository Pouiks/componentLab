import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FolderOpen,
    FileText,
    Files,
    Code,
    X,
    ChevronRight,
    Upload,
    AlertCircle,
    File
} from 'lucide-react';

/**
 * Assistant d'import de composants avec support multi-modes
 */
function ImportWizard({ isOpen, onClose, onImport }) {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState('choose-method');
    const [importData, setImportData] = useState(null);
    const [importType, setImportType] = useState(null);

    // Options d'import
    const importMethods = [
        {
            id: 'folder',
            title: t('import.folder_title'),
            description: t('import.folder_description'),
            icon: FolderOpen,
            recommended: true
        },
        {
            id: 'files',
            title: t('import.files_title'),
            description: t('import.files_description'),
            icon: Files,
            recommended: false
        },
        {
            id: 'snippet',
            title: t('import.snippet_title'),
            description: t('import.snippet_description'),
            icon: Code,
            recommended: false
        }
    ];

    const handleMethodSelect = (method) => {
        setImportType(method);
        setCurrentStep('import-data');
        handleImportData(method);
    };

    const handleImportData = async (method) => {
        try {
            let data = null;

            switch (method) {
                case 'folder':
                    data = await window.electronAPI.dialog.openFolder();
                    break;
                case 'files':
                    data = await window.electronAPI.dialog.openFiles();
                    break;
                case 'snippet':
                    setCurrentStep('snippet-input');
                    return;
                default:
                    return;
            }

            if (data) {
                setImportData(data);
                setCurrentStep('configure');
            }
        } catch (error) {
            console.error('Erreur lors de l\'import:', error);
        }
    };

    const handleSnippetCreate = (snippetData) => {
        setImportData(snippetData);
        setCurrentStep('configure');
    };

    const handleFinalize = (componentConfig) => {
        onImport({
            type: importType,
            data: importData,
            config: componentConfig
        });
        handleClose();
    };

    const handleClose = () => {
        setCurrentStep('choose-method');
        setImportData(null);
        setImportType(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-3/4 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('import.wizard_title')}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {currentStep === 'choose-method' && t('import.choose_method')}
                            {currentStep === 'import-data' && t('import.importing')}
                            {currentStep === 'snippet-input' && t('import.create_snippet')}
                            {currentStep === 'configure' && t('import.configure_component')}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content avec fond adaptatif */}
                <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800">
                    {currentStep === 'choose-method' && (
                        <ChooseMethodStep
                            methods={importMethods}
                            onSelect={handleMethodSelect}
                        />
                    )}

                    {currentStep === 'import-data' && (
                        <div className="h-full flex items-center justify-center bg-white dark:bg-gray-800">
                            <div className="text-center">
                                <Upload className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4 animate-pulse" />
                                <p className="text-lg font-medium text-gray-900 dark:text-white">Import en cours...</p>
                                <p className="text-gray-600 dark:text-gray-400">Lecture des fichiers...</p>
                            </div>
                        </div>
                    )}

                    {currentStep === 'snippet-input' && (
                        <SnippetInputStep onNext={handleSnippetCreate} />
                    )}

                    {currentStep === 'configure' && importData && (
                        <ConfigureStep
                            importType={importType}
                            importData={importData}
                            onFinalize={handleFinalize}
                            onBack={() => setCurrentStep('choose-method')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Étape de choix de la méthode d'import
 */
function ChooseMethodStep({ methods, onSelect }) {
    const { t } = useTranslation();
    return (
        <div className="p-6 bg-white dark:bg-gray-800">
            <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
                {methods.map((method) => {
                    const Icon = method.icon;
                    return (
                        <button
                            key={method.id}
                            onClick={() => onSelect(method.id)}
                            className="p-6 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200 text-left group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 transition-colors">
                                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {method.title}
                                        </h3>
                                        {method.recommended && (
                                            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                                                {t('import.recommended')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400">{method.description}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Étape de saisie de snippet
 */
function SnippetInputStep({ onNext }) {
    const { t } = useTranslation();
    const [snippetCode, setSnippetCode] = useState('');
    const [snippetName, setSnippetName] = useState('');

    const handleNext = () => {
        if (snippetCode.trim() && snippetName.trim()) {
            onNext({
                name: snippetName,
                code: snippetCode,
                files: [{
                    name: 'snippet.js',
                    content: snippetCode
                }]
            });
        }
    };

    return (
        <div className="h-full flex flex-col p-6">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('import.snippet_name')}
                </label>
                <input
                    type="text"
                    value={snippetName}
                    onChange={(e) => setSnippetName(e.target.value)}
                    className="input-field"
                    placeholder={t('import.snippet_placeholder')}
                />
            </div>

            <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.code')}
                </label>
                <textarea
                    value={snippetCode}
                    onChange={(e) => setSnippetCode(e.target.value)}
                    className="flex-1 input-field font-mono text-sm resize-none"
                    placeholder={t('import.snippet_code_placeholder')}
                />
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <button
                    onClick={() => handleNext()}
                    disabled={!snippetCode.trim() || !snippetName.trim()}
                    className="btn-primary"
                >
                    {t('common.continue')}
                </button>
            </div>
        </div>
    );
}

/**
 * Étape de configuration du composant
 */
function ConfigureStep({ importType, importData, onFinalize, onBack }) {
    const { t } = useTranslation();
    const [config, setConfig] = useState({
        name: '',
        framework: 'React',
        platform: 'Web',
        language: 'JSX',
        version: '1.0.0',
        tags: [],
        description: '',
        external_styles: [],
        partial_import: importType === 'files',
        snippet: importType === 'snippet',
        previewable: false
    });

    const [tagInput, setTagInput] = useState('');
    const [externalStyleInput, setExternalStyleInput] = useState('');

    // Auto-détecter certaines propriétés
    React.useEffect(() => {
        if (importData) {
            let detectedName = '';
            let detectedFramework = 'React';
            let detectedLanguage = 'JSX';

            if (importType === 'folder') {
                detectedName = importData.name;
                // Détecter le framework basé sur les fichiers
                const hasReactFiles = importData.files.some(f => f.name.endsWith('.jsx') || f.name.endsWith('.tsx'));
                const hasVueFiles = importData.files.some(f => f.name.endsWith('.vue'));
                const hasFlutterFiles = importData.files.some(f => f.name.endsWith('.dart'));

                if (hasVueFiles) {
                    detectedFramework = 'Vue';
                    detectedLanguage = 'Vue';
                } else if (hasFlutterFiles) {
                    detectedFramework = 'Flutter';
                    detectedLanguage = 'Dart';
                } else if (hasReactFiles) {
                    detectedFramework = 'React';
                    detectedLanguage = importData.files.some(f => f.name.endsWith('.tsx')) ? 'TSX' : 'JSX';
                }
            } else if (importType === 'snippet') {
                detectedName = importData.name;
            }

            setConfig(prev => ({
                ...prev,
                name: detectedName,
                framework: detectedFramework,
                language: detectedLanguage,
                previewable: ['React', 'Vue', 'HTML'].includes(detectedFramework)
            }));
        }
    }, [importData, importType]);

    const handleAddTag = () => {
        if (tagInput.trim() && !config.tags.includes(tagInput.trim())) {
            setConfig(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag) => {
        setConfig(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };

    const handleAddExternalStyle = () => {
        if (externalStyleInput.trim() && !config.external_styles.includes(externalStyleInput.trim())) {
            setConfig(prev => ({
                ...prev,
                external_styles: [...prev.external_styles, externalStyleInput.trim()]
            }));
            setExternalStyleInput('');
        }
    };

    const handleFinalize = () => {
        if (config.name && config.description) {
            onFinalize(config);
        }
    };

    const getFilesList = () => {
        if (importType === 'folder') {
            return importData.files.map(f => f.name);
        } else if (importType === 'files') {
            return importData.map(f => f.name);
        } else if (importType === 'snippet') {
            return ['snippet.js'];
        }
        return [];
    };

    return (
        <div className="h-full flex">
            {/* Configuration */}
            <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('import.configuration')}</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('component.name')} *
                        </label>
                        <input
                            type="text"
                            value={config.name}
                            onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('component.description')} *
                        </label>
                        <textarea
                            value={config.description}
                            onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                            className="input-field"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Framework</label>
                        <select
                            value={config.framework}
                            onChange={(e) => setConfig(prev => ({ ...prev, framework: e.target.value }))}
                            className="input-field"
                        >
                            {Object.keys(t('frameworks', { returnObjects: true })).map(framework => (
                                <option key={framework} value={framework}>
                                    {t(`frameworks.${framework}`)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                        <input
                            type="text"
                            value={config.version}
                            onChange={(e) => setConfig(prev => ({ ...prev, version: e.target.value }))}
                            className="input-field"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                className="input-field flex-1"
                                placeholder="Ajouter un tag..."
                            />
                            <button onClick={handleAddTag} className="btn-secondary">+</button>
                        </div>
                        {config.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {config.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                    >
                                        {tag}
                                        <button onClick={() => handleRemoveTag(tag)}>×</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Styles externes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Styles externes (optionnel)
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={externalStyleInput}
                                onChange={(e) => setExternalStyleInput(e.target.value)}
                                className="input-field flex-1"
                                placeholder="/styles/global.css"
                            />
                            <button onClick={handleAddExternalStyle} className="btn-secondary">+</button>
                        </div>
                        {config.external_styles.length > 0 && (
                            <div className="space-y-1">
                                {config.external_styles.map((style, index) => (
                                    <div key={index} className="text-xs bg-gray-50 px-2 py-1 rounded">
                                        {style}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Aperçu */}
            <div className="w-1/2 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aperçu</h3>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">{config.name || 'Nom du composant'}</h4>
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">{config.framework}</span>
                            {importType === 'snippet' && (
                                <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded">Snippet</span>
                            )}
                            {importType === 'files' && (
                                <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded">Import partiel</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{config.description || 'Description...'}</p>
                    </div>

                    <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Fichiers ({getFilesList().length})
                        </h5>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {getFilesList().map((file, index) => {
                                const isMainFile = file.startsWith('index.') || file.includes('main.');
                                const fileExtension = file.split('.').pop();

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 bg-white dark:bg-gray-700 px-3 py-2 rounded border border-gray-200 dark:border-gray-600"
                                    >
                                        <File className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {file}
                                                </span>
                                                {isMainFile && (
                                                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded flex-shrink-0">
                                                        Principal
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Fichier {fileExtension.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {config.external_styles.length > 0 && (
                        <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Styles externes</h5>
                            <div className="space-y-1">
                                {config.external_styles.map((style, index) => (
                                    <div key={index} className="text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-2 rounded font-mono">
                                        {style}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {config.tags.length > 0 && (
                        <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h5>
                            <div className="flex flex-wrap gap-1">
                                {config.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-6">
                    <button onClick={onBack} className="btn-secondary">
                        Retour
                    </button>
                    <button
                        onClick={handleFinalize}
                        disabled={!config.name || !config.description}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Créer le composant
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImportWizard; 