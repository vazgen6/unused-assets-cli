#!/usr/bin/env node

import { Command } from "commander";
import { formatBytes } from "./format-bytes";
import { findUnusedAssets } from "./find-unused-assets";
import { ask } from "./ask-confirmation";
import { unlinkSync } from "fs";

const program = new Command();

program
  .name("unused-assets")
  .description("Find and optionally remove unused asset files")
  .option("-p, --patterns <patterns...>", "Glob patterns to scan", [
    "src/assets/**/*.*",
  ])
  .option("-r, --remove", "Remove unused files")
  .option("-f, --force", "Force removal without prompt")
  .parse(process.argv);

const options = program.opts();

(async () => {
  const { files, totalSize } = await findUnusedAssets(options.patterns);

  if (files.length === 0) {
    console.log("✅ No unused assets found.");
    process.exit(0);
  }

  console.log("🗑 Unused assets:");
  files.forEach((f) => console.log(`  - ${f}`));
  const totalSizeFormatted = formatBytes(totalSize);
  console.log(`\n📦 Total ${files.length} files, size: ${totalSizeFormatted}`);

  if (options.remove) {
    let proceed = options.force;
    if (!proceed) {
      proceed = await ask("Do you want to remove these files? (y/N) ");
    }
    if (proceed) {
      files.forEach((file) => {
        unlinkSync(file);
        console.log(`Deleted: ${file}`);
      });
      console.log(`\n🗑 Removed all ${files.length} unused assets, size: ${totalSizeFormatted} freed`);
    } else {
      console.log("Operation cancelled. No files were removed.");
    }
  }
})();
