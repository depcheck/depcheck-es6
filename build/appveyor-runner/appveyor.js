/* eslint-disable no-console */

import os from 'os';
import fs from 'fs';
import path from 'path';
import download from 'download';
import extract from 'extract-zip';
import childProcess from 'child_process';

function access(filePath) {
  return new Promise((resolve) =>
    fs.access(filePath, (error) =>
      (error ? resolve(false) : resolve(true))
    )
  );
}

function mkdir(dirPath) {
  return new Promise((resolve, reject) =>
    fs.mkdir(dirPath, (error) => {
      if (!error) {
        console.log(`[Runner] Folder is created: ${dirPath}`);
        resolve(dirPath);
      } else if (error.code === 'EEXIST') { // fine with directory already exists.
        console.log(`[Runner] Folder already existed, skip creation: ${dirPath}`);
        resolve(dirPath);
      } else {
        reject(error);
      }
    })
  );
}

function unzip(dir, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve(dir, filename);
    extract(filePath, { dir }, (error) =>
      (error ? reject(error) : resolve())
    );
  });
}

function exec(script, env) {
  return new Promise((resolve, reject) =>
    childProcess.exec(script, { env }, (error, stdout, stderr) =>
      (error ? reject(error) : resolve({ stdout, stderr }))
    )
  );
}

async function getNode(dir, version) {
  const arch = os.arch();
  const filename = `node-v${version}-win-${arch}.zip`;
  const basename = path.basename(filename, '.zip');
  const node = path.resolve(dir, basename, 'node.exe');
  const existed = await access(node);

  if (existed) {
    console.log(`[Runner][${version}] Found existing node: ${node}`);
  } else {
    const url = `https://nodejs.org/dist/v${version}/${filename}`;
    console.log(`[Runner][${version}] Not found existing node, download from: ${url}`);
    await download(url, dir);
    console.log(`[Runner][${version}] File ${filename} downloaded, extract to: ${dir}`);
    await unzip(dir, filename);
    console.log(`[Runner][${version}] Extract finished, node path: ${node}`);
  }

  return node;
}

async function run(dir, version, scripts) {
  const node = await getNode(dir, version);
  const nodeDir = path.dirname(node);
  const env = Object.assign({ PATH: `${nodeDir};${process.env.PATH}` }, process.env);
  console.log(`[Runner][${version}] Node path is added to environment: ${nodeDir}`);

  for (const script of scripts) {
    console.log(`[Runner][${version}][Script] ${script}`);
    const { stdout, stderr } = await exec(script, env);
    console.log(`[Runner][${version}][Stdout] ${stdout.trim()}`);
    console.log(`[Runner][${version}][Stderr] ${stderr.trim()}`);
  }

  console.log(`[Runner][${version}] Scripts completed.`);
}

async function main(dir, versions, scripts) {
  try {
    console.log(`[Runner] Start runner under ${dir}, with versions: ${versions}`);
    const rootDir = path.resolve(dir, 'node_bins');
    await mkdir(rootDir);
    await Promise.all(versions.map(v => run(rootDir, v, scripts)));
    console.log('[Runner] All tasks are completed successfully!');
  } catch (error) {
    console.error('[Runner] Whoops! Get into trouble. :(');
    console.error(error);
  }
}

main(
  process.cwd(),
  [
    '6.2.2',
  ],
  [
    'node --version',
    'npm --version',
  ],
);
