import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const latest = '2fauth-api-latest.yaml';
const versionedSpecPattern = /^2fauth-api-v\d+\.\d+\.\d+\.yaml$/;

const specs = readdirSync(process.cwd())
  .filter(file => file === latest || versionedSpecPattern.test(file))
  .sort((a, b) => {
    if (a === latest) return -1;
    if (b === latest) return 1;
    return a.localeCompare(b, undefined, { numeric: true });
  });

if (specs.length === 0) {
  console.error('No OpenAPI YAML specs found.');
  process.exit(1);
}

const redoclyCli = resolve('node_modules/@redocly/cli/bin/cli.js');

const result = spawnSync(process.execPath, [redoclyCli, 'lint', '--format=summary', ...specs], {
  stdio: 'inherit',
  shell: false,
});

if (result.error) {
  console.error(result.error.message);
}

process.exit(result.status ?? 1);
