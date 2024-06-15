const { spawn } = require('child_process');

exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['bot.js']);

    child.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      resolve({
        statusCode: 200,
        body: 'Telegram bot running'
      });
    });

    child.on('error', (err) => {
      console.error(`child process error: ${err}`);
      reject({
        statusCode: 500,
        body: 'Error running Telegram bot'
      });
    });
  });
};