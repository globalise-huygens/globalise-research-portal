import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { reporter } from 'vfile-reporter';
import { statistics } from 'vfile-statistics';
import { buildContent, writeContent } from './buildContent.ts';
import { writeReport } from './writeReport.ts';

const { positionals: [contentDir, outputDir], values: { force } } = parseArgs({
  allowPositionals: true,
  options: { force: { type: 'boolean', default: false } },
});

if (!existsSync(join(contentDir, 'pages'))) {
  console.warn(`No content found in ${contentDir}, run \`pnpm content:init\` first`);
  process.exit(0);
}

const build = await buildContent(contentDir);
console.log(reporter(build.files, { quiet: true }));

const { fatal } = statistics(build.files);
const failed = fatal > 0 && !force;
const reportDir = join(outputDir, 'report');
await rm(outputDir, { recursive: true, force: true });
if (!failed) {
  await writeContent(build, outputDir);
}
await writeReport(build.files, reportDir);

console.log(`Built ${build.pages.length} of ${build.files.length} pages into ${outputDir}, report in ${reportDir}`);
if (failed) {
  console.error('Content has errors, nothing written; use `--force` to write the valid pages anyway');
  process.exitCode = 1;
}
