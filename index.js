import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";
const git = simpleGit();

async function commitEveryDay(startYear, endYear, commitsPerDay = 1) {
  const start = moment(`${startYear}-01-01`);
  const end = moment(`${endYear}-12-31`);

  for (let d = start.clone(); d.isSameOrBefore(end); d.add(1, "day")) {
    for (let i = 0; i < commitsPerDay; i++) {
      const date = d.format();
      const data = { date };
      jsonfile.writeFileSync(path, data);
      await git.add([path]).commit(date, { "--date": date });
      console.log("commit", date);
    }
  }

  await git.push();
}

// fill every day from 2020 → 2025 with 1 commit each
commitEveryDay(2020, 2025, 1);
