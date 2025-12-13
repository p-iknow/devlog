import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const POSTS_DIR = "./src/content/posts";

async function getAllMarkdownFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllMarkdownFiles(fullPath)));
    } else if (entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function fixImagePaths(content) {
  let changed = false;
  let newContent = content;

  // ../../../static/xxx.webp -> /xxx.webp
  const staticPathPattern = /\.\.\/+static\/([^\s\)]+)/g;
  if (staticPathPattern.test(content)) {
    newContent = newContent.replace(staticPathPattern, "/$1");
    changed = true;
  }

  // ../../../public/xxx.webp -> /xxx.webp
  const publicPathPattern = /\.\.\/+public\/([^\s\)]+)/g;
  if (publicPathPattern.test(newContent)) {
    newContent = newContent.replace(publicPathPattern, "/$1");
    changed = true;
  }

  return { content: newContent, changed };
}

async function main() {
  console.log("Starting image path fix...");

  const files = await getAllMarkdownFiles(POSTS_DIR);
  console.log(`Found ${files.length} markdown files`);

  let changedCount = 0;

  for (const file of files) {
    const content = await readFile(file, "utf-8");
    const { content: newContent, changed } = fixImagePaths(content);

    if (changed) {
      await writeFile(file, newContent, "utf-8");
      console.log(`Updated: ${file}`);
      changedCount++;
    }
  }

  console.log(`\nFix complete! Updated ${changedCount} files.`);
}

main().catch(console.error);
