#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(toolsDir, '..');
const isWindows = process.platform === 'win32';

function run(command, args, options = {}) {
	const result = spawnSync(command, args, {
		cwd: appRoot,
		stdio: 'inherit',
		...options,
	});

	if (result.error) {
		console.error(result.error.message);
		return 1;
	}

	return result.status ?? 1;
}

const llmsStatus = run(process.execPath, [path.join(toolsDir, 'generate-llms.js')]);

if (llmsStatus !== 0) {
	console.warn('generate-llms.js failed; continuing with Vite build.');
}

const viteStatus = run('vite', ['build', '--outDir', '../../dist/apps/web'], {
	shell: isWindows,
});
process.exit(viteStatus);
