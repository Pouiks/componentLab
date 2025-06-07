import { 
  Code2, 
  Smartphone, 
  Monitor, 
  Tablet,
  Globe,
  Layers,
  Box
} from 'lucide-react';

/**
 * Obtenir l'icône correspondant à un framework
 */
export function getFrameworkIcon(framework) {
  const icons = {
    'React': Code2,
    'React Native': Smartphone,
    'Flutter': Layers,
    'Vue': Code2,
    'Angular': Code2,
    'HTML': Globe,
    'CSS': Box,
    'Web Components': Globe,
    'Swift': Smartphone,
    'Kotlin': Smartphone,
    'Dart': Layers
  };
  
  return icons[framework] || Code2;
}

/**
 * Obtenir l'icône correspondant à une plateforme
 */
export function getPlatformIcon(platform) {
  const icons = {
    'Web': Globe,
    'Mobile': Smartphone,
    'Desktop': Monitor,
    'Tablet': Tablet,
    'Cross-platform': Layers
  };
  
  return icons[platform] || Monitor;
}

/**
 * Obtenir la couleur correspondant à un framework
 */
export function getFrameworkColor(framework) {
  const colors = {
    'React': 'text-blue-600',
    'React Native': 'text-blue-500',
    'Flutter': 'text-cyan-600',
    'Vue': 'text-green-600',
    'Angular': 'text-red-600',
    'HTML': 'text-orange-600',
    'CSS': 'text-purple-600',
    'Web Components': 'text-indigo-600',
    'Swift': 'text-orange-500',
    'Kotlin': 'text-purple-500',
    'Dart': 'text-cyan-500'
  };
  
  return colors[framework] || 'text-gray-600';
} 