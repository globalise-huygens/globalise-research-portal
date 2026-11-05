import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { statistics } from 'vfile-statistics';
import { buildContent } from './buildContent.ts';
import { copyContentAssets } from './copyContentAssets.ts';
import { formatReportMessage, toReportMessage } from './ReportMessage.ts';
import { writeContent } from './writeContent.ts';
import { writeReport } from './writeReport.ts';

const { positionals: [contentDir, outputDir], values: { force } } = parseArgs({
  allowPositionals: true,
  options: { force: { type: 'boolean', default: false } },
});

if (!existsSync(join(contentDir, 'pages'))) {
  console.warn(`No content found in ${contentDir},`
    + "run 'pnpm content:init' first");
  process.exit(0);
}

const build = await buildContent(contentDir);
const messages = build.sources
  .flatMap((source) => source.messages)
  .map((message) => toReportMessage(message, contentDir));
messages.map(formatReportMessage).forEach((line) => console.log(line));

const { fatal } = statistics(build.sources);
const failed = fatal > 0 && !force;
const reportDir = join(outputDir, 'report');
await rm(outputDir, { recursive: true, force: true });
if (!failed) {
  await writeContent(build, outputDir);
  await copyContentAssets(contentDir, outputDir);
}
await writeReport(messages, reportDir);

console.log(`Built ${build.pages.length} from ${build.sources.length} files`);
console.log(`- output: ${outputDir}`);
console.log(`- report: ${reportDir}`);

if (failed) {
  console.error('Content has errors, nothing written, ' +
    'use `--force` to write the valid pages anyway');
  process.exitCode = 1;
}
