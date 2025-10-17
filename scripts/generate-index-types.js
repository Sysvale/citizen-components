import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const indexTypesContent = `import type { DefineComponent, Plugin } from 'vue';

// Configuration types
export interface CitizenComponentsConfig {
  apiBaseUrl?: string;
  endpoints?: {
    index?: string;
    searchCitizens?: string;
  };
}

// Re-export types
export type { Citizen, Nullable } from './services/citizen/citizen.types';
export type { CitizenSelectModelType } from './types';

// Import types for the component definition
import type { Citizen } from './services/citizen/citizen.types';
import type { CitizenSelectModelType } from './types';

// Define component types
export interface CitizenSelectProps {
  showButton: boolean;
  fluid?: boolean;
  variant?: string;
  optionsField?: keyof Citizen;
  modelValue?: CitizenSelectModelType;
}

export interface CitizenTableProps {
  modelValue?: Citizen[];
}

// Export components
export declare const CitizenSelect: DefineComponent<CitizenSelectProps>;
export declare const CitizenTable: DefineComponent<CitizenTableProps>;

// Export plugin
export declare const CitizenComponentsPlugin: Plugin;
export default CitizenComponentsPlugin;
`;

const distPath = path.join(__dirname, '..', 'dist', 'index.d.ts');

fs.writeFileSync(distPath, indexTypesContent, 'utf8');
console.log('✓ Generated index.d.ts successfully');
