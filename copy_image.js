const fs = require('fs');
const path = require('path');

const src = "C:/Users/PC/.gemini/antigravity-ide/brain/f02a160e-d53d-42dd-b58a-47749670c70d/gaming_red_icon_1779436481607.png";
const dest = path.join(__dirname, "public/gaming_red_icon.png");

try {
  fs.copyFileSync(src, dest);
  console.log("Success: Copied gaming_red_icon.png to public/gaming_red_icon.png");
} catch (err) {
  console.error("Error copying file:", err);
}
