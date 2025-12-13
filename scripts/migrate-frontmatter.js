import { readdir, readFile, writeFile, stat } from "fs/promises";
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

function migrateFrontmatter(content) {
  // Split frontmatter and content
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { content, changed: false };
  }

  let frontmatter = match[1];
  const body = match[2];
  let changed = false;

  // Remove template field
  if (frontmatter.includes("template:")) {
    frontmatter = frontmatter
      .split("\n")
      .filter((line) => !line.startsWith("template:"))
      .join("\n");
    changed = true;
  }

  // Fix draft: True/False to lowercase
  if (frontmatter.match(/draft:\s*(True|False)/)) {
    frontmatter = frontmatter.replace(
      /draft:\s*True/gi,
      "draft: true"
    );
    frontmatter = frontmatter.replace(
      /draft:\s*False/gi,
      "draft: false"
    );
    changed = true;
  }

  // Remove slug field (optional - file path will be used as slug)
  if (frontmatter.includes("slug:")) {
    frontmatter = frontmatter
      .split("\n")
      .filter((line) => !line.startsWith("slug:"))
      .join("\n");
    changed = true;
  }

  return {
    content: `---\n${frontmatter}\n---\n${body}`,
    changed,
  };
}

async function main() {
  console.log("Starting frontmatter migration...");

  const files = await getAllMarkdownFiles(POSTS_DIR);
  console.log(`Found ${files.length} markdown files`);

  let changedCount = 0;

  for (const file of files) {
    const content = await readFile(file, "utf-8");
    const { content: newContent, changed } = migrateFrontmatter(content);

    if (changed) {
      await writeFile(file, newContent, "utf-8");
      console.log(`Updated: ${file}`);
      changedCount++;
    }
  }

  console.log(`\nMigration complete! Updated ${changedCount} files.`);
}

main().catch(console.error);
