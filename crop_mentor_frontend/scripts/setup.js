// scripts/setup.js
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Frontend dependencies
const frontendDeps = [
  'react-chartjs-2',
  'chart.js',
  'i18next',
  'react-i18next',
  'i18next-http-backend',
  'i18next-browser-languagedetector',
  '@ant-design/icons',
  'antd',
  'axios'
];

// Backend dependencies (added to requirements.txt)
const backendDeps = [
  'fastapi',
  'uvicorn',
  'python-dotenv',
  'requests',
  'pandas',
  'numpy',
  'scikit-learn',
  'python-multipart'
];

// Install frontend dependencies
console.log('Installing frontend dependencies...');
exec(`npm install ${frontendDeps.join(' ')}`, { cwd: resolve(__dirname, '../') }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error installing frontend dependencies: ${error}`);
    return;
  }
  console.log(stdout);
});

// Add backend dependencies to requirements.txt
console.log('Updating backend requirements.txt...');
const requirementsPath = resolve(__dirname, '../../Backend/requirements.txt');

try {
  let requirements = readFileSync(requirementsPath, 'utf8');
  const newDeps = backendDeps.filter(dep => !requirements.includes(dep));
  
  if (newDeps.length > 0) {
    requirements += '\n' + newDeps.join('\n');
    writeFileSync(requirementsPath, requirements);
    console.log('Successfully updated requirements.txt');
  } else {
    console.log('All backend dependencies already present in requirements.txt');
  }
} catch (error) {
  console.error(`Error updating requirements.txt: ${error}`);
}