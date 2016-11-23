const webpack = require('webpack');

const tasks = new Map();


function run(task) {
  const start = new Date();
  console.log(`Starting '${task}'...`);
  return Promise.resolve().then(() => tasks.get(task)()).then(() => {
    console.log(`Finished '${task}' after ${new Date().getTime() - start.getTime()}ms`);
  }, err => console.error(err.stack));
}

tasks.set('clean', () => del(['public/dist/*', '!public/dist/.git'], { dot: true }));

tasks.set('bundle', () => {
  const webpackConfig = require('./webpack.config');
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        console.log(stats.toString(webpackConfig.stats));
        resolve();
      }
    });
  });
});

tasks.set('build', () => {
  return Promise.resolve()
    .then(() => run('bundle'));
});

run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'start' /* default */);
