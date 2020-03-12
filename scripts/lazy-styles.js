const fs = require("fs");
const STYLE_REGEX = /<link rel\=\"stylesheet\" href\=\"styles\.(\w+)\.css\">/m;
const ENTRY_FILE = "./dist/hue-action-app/index.html";
const content = fs.readFileSync(ENTRY_FILE).toString();
const newContent = content.replace(
  STYLE_REGEX,
  `<link rel="preload" href="styles.$1.css" as="style" onload="this.onload=null;this.rel='stylesheet'">`
);
if (newContent !== content) {
  fs.writeFileSync(ENTRY_FILE, newContent);
  console.log(">> Deferred non-critical css.");
} else {
  console.log(">> Skipped defer non-critical css.");
}
