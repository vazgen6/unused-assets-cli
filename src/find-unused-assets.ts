import fg from "fast-glob";
import { execSync } from "child_process";
import path from "path";
import { statSync } from "fs";

/**
 * Check if an asset is referenced in project files
 * Safely matches both exact filename and name without extension
 */
function isReferenced(filePath: string): boolean {
  const fileName = path.basename(filePath);
  const nameNoExt = path.parse(fileName).name;
  // escape for regex
  const esc = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = `\\b(${esc(nameNoExt)}(\\.[a-zA-Z0-9]+)?|${esc(
    fileName
  )})\\b`;
  try {
    execSync(`grep -R -n -E "${pattern}" src/`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Find unused assets matching glob patterns
 */
export async function findUnusedAssets(
  patterns: string[]
): Promise<{ files: string[]; totalSize: number }> {
  console.log("🔍 Searching for unused assets...");
  const assets = await fg(patterns, { dot: false });
  const unused: string[] = [];
  let totalSize = 0;

  for (const file of assets) {
    if (!isReferenced(file)) {
      unused.push(file);
      totalSize += statSync(file).size;
    }
  }

  return { files: unused, totalSize };
}
