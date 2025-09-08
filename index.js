import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";
const git = simpleGit();

async function commitEveryDay(startYear, endYear, commitsPerDay = 10) {
  for (let year = startYear; year <= endYear; year++) {
    // start at Jan 1
    let start = moment(`${year}-01-01`);
    // snap back to the Sunday of that week
    while (start.day() !== 0) {
      start.subtract(1, "day");
    }
    const end = moment(`${year}-12-31`);

    for (let d = start.clone(); d.isSameOrBefore(end); d.add(1, "day")) {
      for (let i = 0; i < commitsPerDay; i++) {
        const date = d.format();
        const data = { date };
        jsonfile.writeFileSync(path, data);
        await git.add([path]).commit(date, { "--date": date });
        console.log("commit", date);
      }
    }
  }

  await git.push();
}

// fill every day from 2020 → 2025 with 1 commit each
commitEveryDay(2024, 2025, 1);
