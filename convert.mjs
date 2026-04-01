import fs from 'fs';
import path from 'path';
import { transformFileSync } from '@babel/core';

const directories = ['.', 'components', 'pages'];

const babelConfig = {
  presets: [
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
  ],
  plugins: ['@babel/plugin-syntax-jsx'],
  retainLines: true
};

directories.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const filePath = path.join(dir, file);
      const isTsx = file.endsWith('.tsx');
      const newExt = isTsx ? '.jsx' : '.js';
      const newFilePath = path.join(dir, file.replace(/\.tsx?$/, newExt));
      
      console.log(`Converting ${filePath} to ${newFilePath}`);
      try {
        const result = transformFileSync(filePath, babelConfig);
        fs.writeFileSync(newFilePath, result.code);
        fs.unlinkSync(filePath); // Delete old file
      } catch (err) {
        console.error(`Failed to convert ${filePath}`, err);
      }
    }
  });
});
