import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";
const git = simpleGit();

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function commitEveryDay(startYear, endYear, minCommits = 1, maxCommits = 10) {
  const start = moment(`${startYear}-01-01`);
  const end = moment(`${endYear}-12-31`);

  for (let d = start.clone(); d.isSameOrBefore(end); d.add(1, "day")) {
    const commitsToday = randInt(minCommits, maxCommits);

    for (let i = 0; i < commitsToday; i++) {
      const date = d.format();
      const data = { date, i };
      jsonfile.writeFileSync(path, data);
      await git.add([path]).commit(date, { "--date": date });
    }
    console.log(d.format("YYYY-MM-DD"), ":", commitsToday, "commits");
  }

  await git.push();
}

// run from 2020 → 2025 with 1–10 commits per day
commitEveryDay(2020, 2025, 1, 10);
