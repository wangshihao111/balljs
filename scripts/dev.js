const { spawn } = require("child_process");
const {readdirSync} = require('fs');
const path = require('path');

const packages = readdirSync(path.resolve(__dirname, '../packages')).map(p => path.resolve(__dirname, '../packages', p));

packages.forEach((p) => {
  spawn('tsc -w', {
    shell: true,
    cwd: p,
    stdio: ["ignore", "inherit", "inherit"],
  });
});