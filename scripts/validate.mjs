import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const errors = [];
const jsonFiles = [];

function walk(directory) {
  for (const name of readdirSync(directory)) {
    if (name === ".git") continue;
    const path = join(directory, name);
    if (statSync(path).isDirectory()) {
      walk(path);
    } else if (path.endsWith(".json")) {
      jsonFiles.push(path);
    }
  }
}

walk(".");
for (const file of jsonFiles) {
  try {
    JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${file} 不是有效 JSON：${error.message}`);
  }
}

const app = JSON.parse(readFileSync("app.json", "utf8"));
for (const page of app.pages || []) {
  for (const extension of ["js", "json", "wxml", "wxss"]) {
    const file = `${page}.${extension}`;
    if (!existsSync(file)) errors.push(`页面缺少 ${file}`);
  }
}

const appSource = readFileSync("app.js", "utf8");
if (!/apiBaseUrl:\s*"https:\/\/[^\"]+\/api"/.test(appSource)) {
  errors.push("app.js 的 apiBaseUrl 必须是以 HTTPS 开头并以 /api 结尾的地址");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`已验证 ${jsonFiles.length} 个 JSON 文件和 ${(app.pages || []).length} 个页面。`);
