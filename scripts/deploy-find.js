import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("=================================");
console.log("🔍 ДІАГНОСТИКА ФАЙЛОВОЇ СИСТЕМИ");
console.log("=================================");
console.log("Поточна директорія:", process.cwd());
console.log("Root директорія:", rootDir);
console.log("---------------------------------\n");

// 1. Перевіряємо базові директорії
console.log("📁 Перевірка директорій:");
const dirsToCheck = ["apps", "apps/api", "apps/api/dist", "api", "api/dist"];

dirsToCheck.forEach((dir) => {
  const fullPath = path.join(rootDir, dir);
  try {
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      console.log(
        `✅ ${dir} - існує (${stat.isDirectory() ? "папка" : "файл"})`
      );
    } else {
      console.log(`❌ ${dir} - не існує`);
    }
  } catch (err) {
    console.log(`❌ ${dir} - помилка: ${err.message}`);
  }
});

console.log("\n---------------------------------");

// 2. Шукаємо всі index.js файли
console.log("🔎 Пошук всіх index.js файлів:");
let foundCount = 0;

function findIndexJs(dir, depth = 0) {
  if (depth > 5) return;
  if (!fs.existsSync(dir)) return;

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);

      try {
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          if (item !== "node_modules" && !item.startsWith(".")) {
            findIndexJs(fullPath, depth + 1);
          }
        } else if (item === "index.js") {
          foundCount++;
          const relativePath = path.relative(rootDir, fullPath);
          console.log(`\n  📄 [${foundCount}] ${relativePath}`);

          // Показуємо перші кілька рядків файлу
          try {
            const content = fs.readFileSync(fullPath, "utf8");
            const firstLines = content
              .split("\n")
              .slice(0, 3)
              .join("\n")
              .trim();
            if (firstLines) {
              console.log(
                `      Перші рядки: ${firstLines.substring(0, 100)}...`
              );
            }
          } catch (e) {
            // ігноруємо помилки читання
          }
        }
      } catch (err) {
        // ігноруємо помилки доступу
      }
    }
  } catch (err) {
    console.log(`❌ Помилка читання ${dir}: ${err.message}`);
  }
}

findIndexJs(rootDir);

console.log("\n---------------------------------");

// 3. Спеціальний пошук для API
console.log("🎯 Спеціальний пошук для API:");
const apiPatterns = [
  "**/api/**/index.js",
  "**/dist/**/index.js",
  "**/src/**/index.js",
];

function findApiFiles(dir) {
  if (!fs.existsSync(dir)) return;

  try {
    const searchDir = (d) => {
      try {
        const items = fs.readdirSync(d);
        for (const item of items) {
          const fullPath = path.join(d, item);
          try {
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
              if (item !== "node_modules" && !item.startsWith(".")) {
                searchDir(fullPath);
              }
            } else if (item === "index.js" && fullPath.includes("api")) {
              const relativePath = path.relative(rootDir, fullPath);
              console.log(`  🔥 API index.js: ${relativePath}`);

              // Пропонуємо команду для запуску
              console.log(`     ▶️  Використовуйте: node ${relativePath}`);
            }
          } catch (err) {
            // ігноруємо
          }
        }
      } catch (err) {
        // ігноруємо
      }
    };

    searchDir(dir);
  } catch (err) {
    console.log(`❌ Помилка: ${err.message}`);
  }
}

findApiFiles(rootDir);

console.log("\n=================================");
console.log("🏁 Діагностика завершена");
console.log("=================================");
