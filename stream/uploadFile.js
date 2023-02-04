import fs from "node:fs";
import path from "node:path";
import { Transform } from "node:stream";
const currentPath = import.meta.url;

const csvFile = new URL("./tasks.csv", currentPath);

const createTaskObj = new Transform({
  transform(chunk, encoding, cb) {
    const [title, description] = chunk.toString().split(",");
    cb(
      null,
      JSON.stringify({ title: title.trim(), description: description.trim() })
    );
  },
});

async function getTasksByFile() {
  return new Promise((resolve, reject) => {
    let tasksResult = [];
    const stream = fs.createReadStream(csvFile);
    const tasks = stream.pipe(createTaskObj);
    tasks.on("data", (chunk) => {
      tasksResult.push(JSON.parse(chunk));
    });
    tasks.on("end", () => {
      resolve(tasksResult);
    });
    tasks.on("error", reject);
  });
}

async function main() {
  const tasks = await getTasksByFile();
  for await (const line of tasks) {
    await fetch(`http://localhost:3333/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(line),
    });
  }

  console.log(tasks);
}

main();
