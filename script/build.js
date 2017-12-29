/* eslint-disable */
const path = require('path');
const fs = require('fs');
const ora = require('ora');
const rm = require('rimraf');
const copy = require('copy');
const chalk = require('chalk');
const webpack = require('webpack');
const Promise = require('promise');

const config = require('../config/webpack.config');
const pkg = require('../package.json');
const rootPath = path.resolve(__dirname, '../');
const buildPath = path.resolve(rootPath, 'dist');
const distPath = path.resolve(rootPath, 'dist');
const srcPath = path.resolve(rootPath, 'src');

const newPackage = {
  name: pkg.name,
  version: pkg.version,
  author: pkg.author,
  description: pkg.description,
  keywords: pkg.keywords,
  repository: pkg.repository,
  main: `${pkg.name}.min.js`,
  scripts: {},
  types: 'types/index.d.ts',
  license: pkg.license,
  bugs: pkg.bugs,
  homepage: pkg.homepage,
};

// 构建全量压缩包
const building = ora('building...\n\n');
building.start();
new Promise((resolve, reject) => {
  console.log(chalk.cyan(`## clear dist directory ...\n\n`));
  rm(path.resolve(buildPath, `*`), err => {
    if (err) {
      reject(err);
      return;
    };
    resolve();
  });
  console.log(chalk.green(`  clear complete\n\n`));
})
  .then(() => {
    return new Promise((resolve, reject) => {
      console.log(chalk.cyan('## webpack building... \n'));
      webpack(config, function (err, stats) {
        if (err) {
          reject(err);
          return;
        };
        building.stop();
        process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false,
        }) + '\n\n');
        console.log(chalk.green('  webpack Build complete.\n'));
        resolve();
      });
    });
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      console.log(chalk.cyan('## copy LICENSE\n'));
      copy(`${rootPath}/LICENSE`, distPath, function (err, files) {
        if (err) {
          reject(err);
          return;
        };
        resolve();
        console.log(chalk.green('  copying LICENSE complete.\n'));
      });
    });
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      console.log(chalk.cyan('## copy README.md\n'));
      copy(`${rootPath}/README.md`, distPath, function (err, files) {
        if (err) {
          reject(err);
          return;
        };
        resolve();
        console.log(chalk.green('  copying README.md complete.\n'));
      });
    });
  })
  .then(() => {
    console.log(chalk.green('Build finish.\n'));
  })
  .catch((err) => {
    throw err;
  });