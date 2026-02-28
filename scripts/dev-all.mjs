import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const npmCommand = "npm";

const processes = [
  {
    name: "web",
    color: "\x1b[36m",
    command: npmCommand,
    args: ["run", "dev", "--workspace", "@it-blog/web"]
  },
  {
    name: "api",
    color: "\x1b[33m",
    command: npmCommand,
    args: ["run", "dev", "--workspace", "@it-blog/api"]
  }
];

const reset = "\x1b[0m";
const children = [];
let shuttingDown = false;

function prefixOutput(name, color, chunk) {
  const text = chunk.toString();
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    if (!line) {
      continue;
    }

    process.stdout.write(`${color}[${name}]${reset} ${line}\n`);
  }
}

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => {
    process.exit(exitCode);
  }, 200);
}

for (const processConfig of processes) {
  const child = spawn(processConfig.command, processConfig.args, {
    stdio: ["inherit", "pipe", "pipe"],
    shell: isWindows,
    env: process.env
  });

  children.push(child);

  child.stdout.on("data", (chunk) => {
    prefixOutput(processConfig.name, processConfig.color, chunk);
  });

  child.stderr.on("data", (chunk) => {
    prefixOutput(processConfig.name, processConfig.color, chunk);
  });

  child.on("exit", (code) => {
    if (!shuttingDown && code && code !== 0) {
      shutdown(code);
    }
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
