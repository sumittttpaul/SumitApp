import { Template } from '../types/index.js';

const mainRepoUrl = 'https://github.com/sumittttpaul/SumitApp.git';

export const TEMPLATES: Template[] = [
  {
    name: 'default',
    description: 'Full-stack template with Next.js + Expo + Node.js',
    url: mainRepoUrl,
    path: 'templates/default',
    features: [
      'React Native with Expo',
      'Next.js 15 with App Router',
      'TypeScript configured',
      'Tailwind CSS',
      'Legend State for state management',
      'Shared components library',
    ],
  },
  {
    name: 'mobile and backend',
    description: 'Full-stack template with Expo + Node.js',
    url: mainRepoUrl,
    path: 'templates/mobile-and-backend',
    features: [
      'React Native with Expo',
      'TypeScript configured',
      'Tailwind CSS',
      'Legend State for state management',
      'Shared components library',
    ],
  },
  {
    name: 'website and backend',
    description: 'Full-stack template with Next.js + Node.js',
    url: mainRepoUrl,
    path: 'templates/website-and-backend',
    features: [
      'Next.js 15 with App Router',
      'TypeScript configured',
      'Tailwind CSS',
      'Legend State for state management',
      'Shared components library',
    ],
  },
];

export function getTemplate(name: string): Template | undefined {
  return TEMPLATES.find((template) => template.name === name);
}

export function listTemplates(): void {
  console.log('\n📋 Available templates:\n');

  TEMPLATES.forEach((template, index) => {
    console.log(`${index + 1}. ${template.name}`);
    console.log(`   ${template.description}`);
    console.log(
      `   Features: ${template.features.slice(0, 3).join(', ')}${template.features.length > 3 ? '...' : ''}`
    );
    console.log();
  });
}
