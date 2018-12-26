const path = require('path');
const fs = require('fs-extra');
const chokidar = require('chokidar');

const shells = ['chrome'];
const shellsDir = path.resolve(__dirname, '..');
const buildDir = path.join(shellsDir, 'build');
const extensionDistDir = path.resolve(__dirname, 'dist');

fs.removeSync(buildDir);

shells.forEach(shell => {
  const source = path.join(shellsDir, shell);
  const target = path.join(buildDir, shell);
  fs.ensureDirSync(target);
  fs.copySync(source, target);
  fs.copySync(extensionDistDir, target);
  chokidar.watch(source).on('change', filePath => {
    const relativePath = path.relative(source, filePath);
    fs.copy(filePath, path.join(buildDir, shell, relativePath));
  });
});

chokidar.watch(extensionDistDir).on('change', filePath => {
  const relativePath = path.relative(extensionDistDir, filePath);
  shells.forEach(shell => {
    fs.copy(filePath, path.join(buildDir, shell, relativePath));
  });
});
