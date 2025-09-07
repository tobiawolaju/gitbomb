import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const makeCommits = async (n) => {
  if (n === 0) return simpleGit().push();

  // pick a random year between 2020–2025
  const year = random.int(2020, 2025);
  // pick a random month/day
  const month = random.int(0, 11);
  const day = random.int(1, 28); // keep safe for february

  const date = moment({ year, month, day }).format();

  const data = { date };
  console.log(date);

  jsonfile.writeFile(path, data, () => {
    simpleGit()
      .add([path])
      .commit(date, { "--date": date }, makeCommits.bind(this, --n));
  });
};

makeCommits(200); // adjust count
