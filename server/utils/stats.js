import fs from 'fs';

let statsStats = [];

export function getStats() {
  return statsStats;
}

function waitWatchFile({ path, onChange, timeout = 33120000 } = {}) {
  function watch(loaded, timeleft) {
    return new Promise((resolve, reject) => {
      if (timeleft < 0) {
        loaded = true;
        return reject(new Error(`waitFile: timeout (${timeout}ms): ${path}`));
      }

      // Simple first read for production
      if (!loaded) {
        console.log('>>>>>>>>>>>>>>>>> STATS.JS > waitWatchFile > !loaded <<<<<<<<<<<<<<<<<<<');
        // https://nodejs.org/api/all.html#fs_fs_access_path_mode_callback
        fs.access(path, fs.constants.F_OK, (err) => {
          console.log(`${path} ${err ? 'does not exist +++++++' : 'exists'}`);
        });
        fs.access(path, fs.constants.R_OK, err => {
          console.log(`${path} ${err ? 'is not readable' : 'is readable'}`);
          if (!err && !loaded) {
            fs.readFile(path, 'utf8', (err2, data) => {
              if (err2) {
                return reject(err2);
              }
              loaded = true;
              resolve(data);
            });
          }
        });
      }

      if (!__DEVELOPMENT__) {
        return;
      }

      try {
        const watcher = fs.watch(path, 'utf8', eventType => {
          if (eventType !== 'change') return;
          fs.readFile(path, 'utf8', (err2, data) => {
            if (err2) return onChange(err2);
            loaded = true;
            onChange(null, data);
          });
        });

        setTimeout(() => {
          watcher.close();
          if (!loaded) {
            loaded = true;
            reject(new Error(`waitFile: timeout (${timeout}ms): ${path}`));
          }
        }, timeleft);
      } catch (err) {
        if (err.code === 'ENOENT') {
          return setTimeout(() => resolve(watch(loaded, timeleft - 100)), 100);
        }
        loaded = true;
        reject(err);
      }
    });
  }
  return watch(false, timeout);
}

function parse(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return statsStats;
  }
}

export async function waitStats(statsPath, timeout) {
  const statsStatsJson = await waitWatchFile({
    path: statsPath,
    onChange(err, stats) {
      if (err) {
        throw new Error('Unable to load stats');
      }
      statsStats = parse(stats);
    },
    timeout
  });
  statsStats = parse(statsStatsJson);
  return statsStats;
}
