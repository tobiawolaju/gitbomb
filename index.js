import moment from "moment";
import simpleGit from "simple-git";
import jsonfile from "jsonfile";

const path = "./data.json";
const git = simpleGit();

// 5x7 pixel font for digits
const DIGITS = {
  "0": [
    "111",
    "101",
    "101",
    "101",
    "111"
  ],
  "1": [
    "010",
    "110",
    "010",
    "010",
    "111"
  ],
  "2": [
    "111",
    "001",
    "111",
    "100",
    "111"
  ],
  "3": [
    "111",
    "001",
    "111",
    "001",
    "111"
  ],
  "4": [
    "101",
    "101",
    "111",
    "001",
    "001"
  ],
  "5": [
    "111",
    "100",
    "111",
    "001",
    "111"
  ],
  "6": [
    "111",
    "100",
    "111",
    "101",
    "111"
  ],
  "7": [
    "111",
    "001",
    "001",
    "010",
    "010"
  ],
  "8": [
    "111",
    "101",
    "111",
    "101",
    "111"
  ],
  "9": [
    "111",
    "101",
    "111",
    "001",
    "111"
  ]
};

// draw a string of digits into a mask (7 rows tall, many cols)
function buildMask(str) {
  const rows = 7;
  const colsPerDigit = 4; // 3 pixels + 1 space
  const width = str.length * colsPerDigit;
  const mask = Array.from({ length: rows }, () => Array(width).fill(0));

  for (let i = 0; i < str.length; i++) {
    const digit = DIGITS[str[i]];
    for (let y = 0; y < digit.length; y++) {
      for (let x = 0; x < digit[y].length; x++) {
        if (digit[y][x] === "1") {
          mask[y + 1][i * colsPerDigit + x] = 1; 
          // +1 vertical offset so it sits nicely in 7-row grid
        }
      }
    }
  }
  return mask;
}

async function commitFromMask(mask, year) {
  for (let x = 0; x < mask[0].length; x++) {
    for (let y = 0; y < mask.length; y++) {
      if (mask[y][x] === 1) {
        const date = moment({ year, month: 0, day: 1 })
          .add(x, "w")
          .add(y, "d")
          .format();
        const data = { date };
        jsonfile.writeFileSync(path, data);
        await git.add([path]).commit(date, { "--date": date });
        console.log("commit", date);
      }
    }
  }
}

async function main() {
  for (let year = 2020; year <= 2025; year++) {
    const mask = buildMask(String(year));
    await commitFromMask(mask, year);
  }
  await git.push();
}

main();
