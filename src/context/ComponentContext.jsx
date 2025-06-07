import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Actions du reducer
const ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_COMPONENTS: 'SET_COMPONENTS',
    SET_CURRENT_COMPONENT: 'SET_CURRENT_COMPONENT',
    SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
    SET_FILTERS: 'SET_FILTERS',
    ADD_COMPONENT: 'ADD_COMPONENT',
    UPDATE_COMPONENT: 'UPDATE_COMPONENT',
    DELETE_COMPONENT: 'DELETE_COMPONENT',
    SET_ERROR: 'SET_ERROR'
};

// État initial
const initialState = {
    components: [],
    currentComponent: null,
    searchQuery: '',
    filters: {
        framework: '',
        platform: '',
        tags: []
    },
    loading: false,
    error: null
};

// Reducer pour la gestion de l'état
function componentReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_LOADING:
            return { ...state, loading: action.payload };

        case ACTIONS.SET_COMPONENTS:
            return { ...state, components: action.payload, loading: false };

        case ACTIONS.SET_CURRENT_COMPONENT:
            return { ...state, currentComponent: action.payload };

        case ACTIONS.SET_SEARCH_QUERY:
            return { ...state, searchQuery: action.payload };

        case ACTIONS.SET_FILTERS:
            return { ...state, filters: { ...state.filters, ...action.payload } };

        case ACTIONS.ADD_COMPONENT:
            return { ...state, components: [...state.components, action.payload] };

        case ACTIONS.UPDATE_COMPONENT:
            return {
                ...state,
                components: state.components.map(comp =>
                    comp.id === action.payload.id ? action.payload : comp
                )
            };

        case ACTIONS.DELETE_COMPONENT:
            return {
                ...state,
                components: state.components.filter(comp => comp.id !== action.payload),
                currentComponent: state.currentComponent?.id === action.payload ? null : state.currentComponent
            };

        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, loading: false };

        default:
            return state;
    }
}

// Contexte
const ComponentContext = createContext();

/**
 * Provider pour le contexte des composants
 */
export function ComponentProvider({ children }) {
    const [state, dispatch] = useReducer(componentReducer, initialState);

    // Charger la liste des composants au démarrage
    useEffect(() => {
        loadComponents();
    }, []);

    /**
     * Charger tous les composants depuis le système de fichiers
     */
    const loadComponents = async () => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            const components = await window.electronAPI.components.list();
            dispatch({ type: ACTIONS.SET_COMPONENTS, payload: components });
        } catch (error) {
            console.error('Erreur lors du chargement des composants:', error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    /**
     * Charger un composant spécifique avec ses fichiers source
     */
    const loadComponent = async (componentId) => {
        try {
            // Éviter le loading si c'est déjà le composant actuel
            if (state.currentComponent && state.currentComponent.id === componentId) {
                return;
            }

            // Utiliser un loading plus subtil pour éviter les sautillements
            const component = await window.electronAPI.components.get(componentId);
            dispatch({ type: ACTIONS.SET_CURRENT_COMPONENT, payload: component });
        } catch (error) {
            console.error('Erreur lors du chargement du composant:', error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    /**
 * Sauvegarder un composant
 */
    const saveComponent = async (componentData) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            await window.electronAPI.components.save(componentData);

            // Recharger la liste des composants
            await loadComponents();
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
            return false;
        }
    };

    /**
     * Importer un composant depuis différentes sources
     */
    const importComponent = async (importRequest) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });

            const { type, data, config } = importRequest;
            let sourceFiles = {};

            // Traiter les données d'import selon le type
            switch (type) {
                case 'folder':
                    // Dossier complet
                    data.files.forEach(file => {
                        sourceFiles[file.name] = file.content;
                    });
                    break;

                case 'files':
                    // Fichiers multiples
                    data.forEach(file => {
                        sourceFiles[file.name] = file.content;
                    });
                    break;

                case 'snippet':
                    // Snippet de code
                    sourceFiles['snippet.js'] = data.code;
                    break;

                default:
                    throw new Error(`Type d'import non supporté: ${type}`);
            }

            // Créer les métadonnées complètes
            const meta = {
                ...config,
                id: config.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
                source_files: Object.keys(sourceFiles),
                external_styles: config.external_styles || [],
                partial_import: config.partial_import || false,
                snippet: config.snippet || false,
                previewable: ['React', 'Vue', 'HTML'].includes(config.framework)
            };

            const componentData = {
                meta,
                sourceFiles
            };

            await window.electronAPI.components.save(componentData);

            // Recharger la liste des composants
            await loadComponents();
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'import:', error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
            return false;
        }
    };

    /**
     * Supprimer un composant
     */
    const deleteComponent = async (componentId) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            await window.electronAPI.components.delete(componentId);
            dispatch({ type: ACTIONS.DELETE_COMPONENT, payload: componentId });
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        } finally {
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };

    /**
     * Filtrer les composants selon la recherche et les filtres
     */
    const getFilteredComponents = () => {
        let filtered = state.components;

        // Filtrage par recherche textuelle
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            filtered = filtered.filter(component =>
                component.name.toLowerCase().includes(query) ||
                component.description.toLowerCase().includes(query) ||
                component.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Filtrage par framework
        if (state.filters.framework) {
            filtered = filtered.filter(component =>
                component.framework === state.filters.framework
            );
        }

        // Filtrage par plateforme
        if (state.filters.platform) {
            filtered = filtered.filter(component =>
                component.platform === state.filters.platform
            );
        }

        // Filtrage par tags
        if (state.filters.tags.length > 0) {
            filtered = filtered.filter(component =>
                state.filters.tags.every(tag =>
                    component.tags.includes(tag)
                )
            );
        }

        return filtered;
    };

    const value = {
        // État
        ...state,
        filteredComponents: getFilteredComponents(),

        // Actions
        loadComponents,
        loadComponent,
        saveComponent,
        importComponent,
        deleteComponent,
        setSearchQuery: (query) => dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: query }),
        setFilters: (filters) => dispatch({ type: ACTIONS.SET_FILTERS, payload: filters }),
        setCurrentComponent: (component) => dispatch({ type: ACTIONS.SET_CURRENT_COMPONENT, payload: component }),
        clearError: () => dispatch({ type: ACTIONS.SET_ERROR, payload: null })
    };

    return (
        <ComponentContext.Provider value={value}>
            {children}
        </ComponentContext.Provider>
    );
}

/**
 * Hook pour utiliser le contexte des composants
 */
export function useComponents() {
    const context = useContext(ComponentContext);
    if (!context) {
        throw new Error('useComponents must be used within a ComponentProvider');
    }
    return context;
} 