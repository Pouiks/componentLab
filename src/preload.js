const { contextBridge, ipcRenderer } = require('electron');

/**
 * API exposée au processus de rendu de manière sécurisée
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // Gestion des composants
  components: {
    list: () => ipcRenderer.invoke('components:list'),
    get: (id) => ipcRenderer.invoke('components:get', id),
    save: (data) => ipcRenderer.invoke('components:save', data),
    delete: (id) => ipcRenderer.invoke('components:delete', id),
    import: (data) => ipcRenderer.invoke('components:import', data),
    exportAll: (filePath) => ipcRenderer.invoke('components:export-all', filePath),
    importAll: (filePath) => ipcRenderer.invoke('components:import-all', filePath),
    exportSingle: (componentId, filePath) => ipcRenderer.invoke('components:export-single', componentId, filePath),
    importSingle: (filePath) => ipcRenderer.invoke('components:import-single', filePath)
  },
  
  // Dialogues système
  dialog: {
    openFile: (options) => ipcRenderer.invoke('dialog:openFile', options),
    openFiles: (options) => ipcRenderer.invoke('dialog:openFiles', options),
    openFolder: (options) => ipcRenderer.invoke('dialog:openFolder', options)
  },
  
  files: {
    openDialog: (options) => ipcRenderer.invoke('files:open-dialog', options),
    saveDialog: (options) => ipcRenderer.invoke('files:save-dialog', options)
  }
}); 