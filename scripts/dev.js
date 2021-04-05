const { spawn } = require("child_process");

const tasks = ["tsc -w", "yarn server"];

tasks.forEach((task) => {
  spawn(task, {
    shell: true,
    cwd: process.cwd(),
    stdio: ["ignore", "inherit", "inherit"],
  });
});
