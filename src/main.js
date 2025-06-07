const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

// Configuration du développement
const isDev = !app.isPackaged;

let mainWindow;

/**
 * Créer la fenêtre principale de l'application
 */
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/componentLab.png'),
    show: false, // Ne pas afficher immédiatement
    titleBarStyle: 'default'
  });

  // Charger l'application
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Afficher la fenêtre une fois qu'elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Gestionnaires d'événements de l'application
app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ========================================
// API IPC pour la gestion des composants
// ========================================

/**
 * Obtenir le chemin du dossier des composants
 */
function getComponentsPath() {
  return path.join(process.cwd(), 'my_components');
}

/**
 * S'assurer que le dossier des composants existe
 */
async function ensureComponentsDirectory() {
  const componentsPath = getComponentsPath();
  try {
    await fs.access(componentsPath);
  } catch {
    await fs.mkdir(componentsPath, { recursive: true });
  }
  return componentsPath;
}

/**
 * Lister tous les composants disponibles
 */
ipcMain.handle('components:list', async () => {
  try {
    const componentsPath = await ensureComponentsDirectory();
    const frameworks = await fs.readdir(componentsPath);
    const components = [];

    for (const framework of frameworks) {
      const frameworkPath = path.join(componentsPath, framework);
      
      try {
        const stat = await fs.stat(frameworkPath);
        
        if (stat.isDirectory()) {
          const componentDirs = await fs.readdir(frameworkPath);
          
          for (const componentDir of componentDirs) {
            const componentPath = path.join(frameworkPath, componentDir);
            const metaPath = path.join(componentPath, 'meta.json');
            
            try {
              // Vérifier que le dossier et le meta.json existent
              const componentStat = await fs.stat(componentPath);
              if (!componentStat.isDirectory()) continue;
              
              // Vérifier que meta.json existe avant de le lire
              await fs.access(metaPath);
              
              const metaContent = await fs.readFile(metaPath, 'utf-8');
              const meta = JSON.parse(metaContent);
              components.push({
                ...meta,
                path: componentPath,
                framework
              });
            } catch (error) {
              // Si meta.json n'existe pas ou est corrompu, nettoyer le dossier orphelin
              console.warn(`Dossier de composant invalide détecté: ${componentPath}, nettoyage...`);
              try {
                await fs.rm(componentPath, { recursive: true, force: true });
              } catch (cleanupError) {
                console.warn(`Impossible de nettoyer ${componentPath}:`, cleanupError.message);
              }
            }
          }
        }
      } catch (error) {
        console.warn(`Impossible de lire le framework ${framework}:`, error.message);
      }
    }

    return components;
  } catch (error) {
    console.error('Erreur lors de la liste des composants:', error);
    return [];
  }
});

/**
 * Obtenir les détails d'un composant spécifique
 */
ipcMain.handle('components:get', async (event, componentId) => {
  try {
    const componentsPath = await ensureComponentsDirectory();
    const frameworks = await fs.readdir(componentsPath);
    let component = null;

    // Chercher le composant dans tous les frameworks
    for (const framework of frameworks) {
      const frameworkPath = path.join(componentsPath, framework);
      
      try {
        const stat = await fs.stat(frameworkPath);
        
        if (stat.isDirectory()) {
          const componentDirs = await fs.readdir(frameworkPath);
          
          for (const componentDir of componentDirs) {
            const componentPath = path.join(frameworkPath, componentDir);
            const metaPath = path.join(componentPath, 'meta.json');
            
            try {
              // Vérifier que meta.json existe
              await fs.access(metaPath);
              
              const metaContent = await fs.readFile(metaPath, 'utf-8');
              const meta = JSON.parse(metaContent);
              
              if (meta.id === componentId) {
                component = {
                  ...meta,
                  path: componentPath,
                  framework
                };
                break;
              }
            } catch (error) {
              // Ignorer silencieusement les dossiers sans meta.json valide
              continue;
            }
          }
          
          if (component) break;
        }
      } catch (error) {
        console.warn(`Impossible de lire le framework ${framework}:`, error.message);
      }
    }
    
    if (!component) {
      throw new Error(`Composant ${componentId} non trouvé`);
    }

    // Lire les fichiers source
    const sourceFiles = {};
    for (const fileName of component.source_files || []) {
      const filePath = path.join(component.path, fileName);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        sourceFiles[fileName] = content;
      } catch (error) {
        console.warn(`Impossible de lire le fichier ${fileName}:`, error.message);
        sourceFiles[fileName] = `// Erreur lors de la lecture du fichier ${fileName}`;
      }
    }

    return {
      ...component,
      sourceFiles
    };
  } catch (error) {
    console.error('Erreur lors du chargement du composant:', error);
    throw error;
  }
});

/**
 * Sauvegarder un composant
 */
ipcMain.handle('components:save', async (event, componentData) => {
  try {
    const componentsPath = await ensureComponentsDirectory();
    const { meta, sourceFiles } = componentData;
    
    // Créer le dossier du framework s'il n'existe pas
    const frameworkPath = path.join(componentsPath, meta.framework);
    await fs.mkdir(frameworkPath, { recursive: true });
    
    // Créer le dossier du composant
    const componentPath = path.join(frameworkPath, meta.id);
    await fs.mkdir(componentPath, { recursive: true });
    
    // Sauvegarder les fichiers source
    for (const [fileName, content] of Object.entries(sourceFiles)) {
      const filePath = path.join(componentPath, fileName);
      await fs.writeFile(filePath, content, 'utf-8');
    }
    
    // Sauvegarder les métadonnées
    const metaPath = path.join(componentPath, 'meta.json');
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8');
    
    return { success: true, path: componentPath };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    throw error;
  }
});

/**
 * Supprimer un composant
 */
ipcMain.handle('components:delete', async (event, componentId) => {
  try {
    const componentsPath = await ensureComponentsDirectory();
    const frameworks = await fs.readdir(componentsPath);
    let componentToDelete = null;

    // Chercher le composant dans tous les frameworks
    for (const framework of frameworks) {
      const frameworkPath = path.join(componentsPath, framework);
      
      try {
        const stat = await fs.stat(frameworkPath);
        
        if (stat.isDirectory()) {
          const componentDirs = await fs.readdir(frameworkPath);
          
          for (const componentDir of componentDirs) {
            const componentPath = path.join(frameworkPath, componentDir);
            const metaPath = path.join(componentPath, 'meta.json');
            
            try {
              // Vérifier que meta.json existe
              await fs.access(metaPath);
              
              const metaContent = await fs.readFile(metaPath, 'utf-8');
              const meta = JSON.parse(metaContent);
              
              if (meta.id === componentId) {
                componentToDelete = {
                  ...meta,
                  path: componentPath,
                  framework
                };
                break;
              }
            } catch (error) {
              // Si c'est le bon dossier mais meta.json est corrompu, le supprimer quand même
              if (componentDir === componentId) {
                componentToDelete = {
                  id: componentId,
                  path: componentPath,
                  framework
                };
                break;
              }
            }
          }
          
          if (componentToDelete) break;
        }
      } catch (error) {
        console.warn(`Impossible de lire le framework ${framework}:`, error.message);
      }
    }
    
    if (!componentToDelete) {
      throw new Error(`Composant ${componentId} non trouvé`);
    }

    // Supprimer le dossier du composant
    await fs.rm(componentToDelete.path, { recursive: true, force: true });
    
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
});

/**
 * Ouvrir un dialogue de sélection de fichier(s)
 */
ipcMain.handle('dialog:openFile', async (event, options = {}) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Fichiers source', extensions: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'dart', 'swift', 'kt'] },
      { name: 'Tous les fichiers', extensions: ['*'] }
    ],
    ...options
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const content = await fs.readFile(filePath, 'utf-8');
    return {
      path: filePath,
      name: path.basename(filePath),
      content
    };
  }
  
  return null;
});

/**
 * Ouvrir un dialogue de sélection de fichiers multiples
 */
ipcMain.handle('dialog:openFiles', async (event, options = {}) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Fichiers source', extensions: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'dart', 'swift', 'kt', 'md'] },
      { name: 'Tous les fichiers', extensions: ['*'] }
    ],
    ...options
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    const files = [];
    for (const filePath of result.filePaths) {
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        files.push({
          path: filePath,
          name: path.basename(filePath),
          content
        });
      } catch (error) {
        console.warn(`Impossible de lire le fichier ${filePath}:`, error.message);
      }
    }
    return files;
  }
  
  return [];
});

/**
 * Ouvrir un dialogue de sélection de dossier
 */
ipcMain.handle('dialog:openFolder', async (event, options = {}) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    ...options
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0];
    const folderName = path.basename(folderPath);
    
    // Lire récursivement les fichiers du dossier
    const files = await readFolderRecursively(folderPath);
    
    return {
      path: folderPath,
      name: folderName,
      files
    };
  }
  
  return null;
});

/**
 * Handler d'import unifié pour tous les types d'import
 */
ipcMain.handle('components:import', async (event, importRequest) => {
  try {
    const { type, data, config } = importRequest;
    
    // Traiter les données selon le type d'import
    let processedData = {};
    
    switch (type) {
      case 'folder':
        // Import de dossier - data contient { path, name, files }
        processedData = {
          name: config.name || data.name,
          files: data.files,
          framework: detectFramework(data.files),
          mainFile: detectMainFile(data.files)
        };
        break;
        
      case 'files':
        // Import de fichiers multiples - data est un array de fichiers
        processedData = {
          name: config.name || 'imported-component',
          files: data,
          framework: detectFramework(data),
          mainFile: detectMainFile(data)
        };
        break;
        
      case 'snippet':
        // Import de snippet - data contient { code, language }
        processedData = {
          name: config.name || 'snippet',
          files: [{
            name: `${config.name || 'snippet'}.${getExtensionForLanguage(data.language)}`,
            content: data.code,
            isMainFile: true
          }],
          framework: data.language || 'JavaScript',
          mainFile: `${config.name || 'snippet'}.${getExtensionForLanguage(data.language)}`
        };
        break;
        
      default:
        throw new Error(`Type d'import non supporté: ${type}`);
    }
    
    // Créer les métadonnées complètes
    const meta = {
      id: (config.name || processedData.name).toLowerCase().replace(/[^a-z0-9]/g, ''),
      name: config.name || processedData.name,
      description: config.description || '',
      framework: config.framework || processedData.framework,
      platform: config.platform || 'Web',
      tags: config.tags || [],
      version: config.version || '1.0.0',
      author: config.author || '',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      source_files: processedData.files.map(f => f.name),
      main_file: config.mainFile || processedData.mainFile,
      external_styles: config.external_styles || [],
      partial_import: config.partial_import || false,
      snippet: config.snippet || (type === 'snippet'),
      previewable: ['React', 'Vue', 'HTML', 'JavaScript'].includes(config.framework || processedData.framework)
    };
    
    // Préparer les fichiers source
    const sourceFiles = {};
    processedData.files.forEach(file => {
      sourceFiles[file.name] = file.content;
    });
    
    // Sauvegarder le composant directement
    const componentsPath = await ensureComponentsDirectory();
    
    // Créer le dossier du framework s'il n'existe pas
    const frameworkPath = path.join(componentsPath, meta.framework);
    await fs.mkdir(frameworkPath, { recursive: true });
    
    // Créer le dossier du composant
    const componentPath = path.join(frameworkPath, meta.id);
    await fs.mkdir(componentPath, { recursive: true });
    
    // Sauvegarder les fichiers source
    for (const [fileName, content] of Object.entries(sourceFiles)) {
      const filePath = path.join(componentPath, fileName);
      await fs.writeFile(filePath, content, 'utf-8');
    }
    
    // Sauvegarder les métadonnées
    const metaPath = path.join(componentPath, 'meta.json');
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8');
    
    return { success: true, component: meta };
    
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    throw error;
  }
});

/**
 * Détecter le framework depuis les fichiers
 */
function detectFramework(files) {
  const extensions = files.map(f => path.extname(f.name).toLowerCase());
  const contents = files.map(f => f.content || '').join('\n');
  
  if (extensions.includes('.jsx') || extensions.includes('.tsx') || contents.includes('import React')) {
    return 'React';
  }
  if (extensions.includes('.vue') || contents.includes('<template>')) {
    return 'Vue';
  }
  if (contents.includes('@Component') || contents.includes('angular')) {
    return 'Angular';
  }
  if (extensions.includes('.svelte')) {
    return 'Svelte';
  }
  if (extensions.includes('.dart')) {
    return 'Flutter';
  }
  if (extensions.includes('.html')) {
    return 'HTML';
  }
  if (extensions.includes('.js') || extensions.includes('.ts')) {
    return 'JavaScript';
  }
  
  return 'HTML';
}

/**
 * Détecter le fichier principal
 */
function detectMainFile(files) {
  // Chercher les fichiers index ou main en priorité
  for (const file of files) {
    const name = file.name.toLowerCase();
    if (name.startsWith('index.') || name.startsWith('main.') || file.isMainFile) {
      return file.name;
    }
  }
  
  // Sinon, prendre le premier fichier
  return files.length > 0 ? files[0].name : '';
}

/**
 * Obtenir l'extension pour un langage
 */
function getExtensionForLanguage(language) {
  const extensions = {
    'javascript': 'js',
    'typescript': 'ts',
    'react': 'jsx',
    'vue': 'vue',
    'html': 'html',
    'css': 'css',
    'dart': 'dart',
    'swift': 'swift',
    'kotlin': 'kt'
  };
  
  return extensions[language?.toLowerCase()] || 'js';
}

/**
 * Lire récursivement les fichiers d'un dossier
 */
async function readFolderRecursively(folderPath, relativePath = '') {
  const files = [];
  const items = await fs.readdir(folderPath);
  
  for (const item of items) {
    const itemPath = path.join(folderPath, item);
    const stat = await fs.stat(itemPath);
    const relativeItemPath = path.join(relativePath, item);
    
    if (stat.isDirectory()) {
      // Ignorer certains dossiers
      if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
        const subFiles = await readFolderRecursively(itemPath, relativeItemPath);
        files.push(...subFiles);
      }
    } else {
      // Filtrer les fichiers pertinents
      const ext = path.extname(item).toLowerCase();
      if (['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.sass', '.dart', '.swift', '.kt', '.md', '.json'].includes(ext)) {
        try {
          const content = await fs.readFile(itemPath, 'utf-8');
          files.push({
            path: itemPath,
            name: relativeItemPath,
            content,
            isMainFile: item.startsWith('index.') || item === 'main.' + ext.slice(1)
          });
        } catch (error) {
          console.warn(`Impossible de lire le fichier ${itemPath}:`, error.message);
        }
      }
    }
  }
  
  return files;
}

/**
 * Dialogue d'ouverture de fichier
 */
ipcMain.handle('files:open-dialog', async (event, options) => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result.canceled ? null : result.filePaths[0];
});

/**
 * Dialogue de sauvegarde de fichier
 */
ipcMain.handle('files:save-dialog', async (event, options) => {
  const { dialog } = require('electron');
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result.canceled ? null : result.filePath;
}); 