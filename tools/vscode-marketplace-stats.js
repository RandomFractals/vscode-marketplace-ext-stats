const fs = require('fs');
const https = require('https');
const path = require('path');

// extension to get stats for
let extensionName = 'RandomFractalsInc.vscode-data-preview';

// stats time interval
let timeInterval = 1000 * 60 * 60; // every hour

// initialize data folder name and path
const statsFolderName = '../data'; // default data folder
const statsScriptPath = process.argv[1]; 
const statsFolderPath = path.join(statsScriptPath, '../', statsFolderName);
let statsFilePath = statsFolderPath;

if (!fs.existsSync(statsFolderPath)) {
  // create stats data folder
  fs.mkdirSync(statsFolderPath);
}

// get command line arguments
const args = process.argv.slice(2); // skip node & script args
if (args.length > 0) {
  // get extension name
  extensionName = args[0].trim();

  // create stats file
  statsFilePath = createStatsFile(statsFolderPath, extensionName);

  // print stats CSV header to console
  console.log('DateTime, Installs, Updates, Downloads, Version');

  // get initial stats
  getStats();

  // schedule repeated stats calls
  const timeOut = setInterval(getStats, timeInterval);

} else {
  // print command info
  console.log(`
    Please specify extension name. vscode-marketplace-stats command example:

    $ node vscode-marketplace-stats eamodio.gitlens
    
    Gets vscode marketplace stats for GitLens extension :)`);
}

/**
 * Creates new CSV stats file for capturing VS extension installs and downloads stats.
 * @param statsFolderPath Stats data files folder path. Defaults to ../data.
 * @param extensionName Extension name to create stats file for.
 */
function createStatsFile(statsFolderPath, extensionName) {
  // create stats data file of form: <extensionName>-stats-<ISODate>.csv
  const isoDateTimeString = getLocalDateTimeISOString(new Date());
  const isoDateString = isoDateTimeString.split('T')[0]; // date part
  const statsFileName = `${extensionName}-stats-${isoDateString}.csv`;
  const statsFilePath = path.join(statsFolderPath, statsFileName);
  if (!fs.existsSync(statsFilePath)) {
    try {
      // write stats CSV header to start new stats file
      const statsWriteStream = fs.createWriteStream(statsFilePath, {encoding: 'utf8'});
      statsWriteStream.write('DateTime, Installs, Downloads, Version');
      statsWriteStream.end();
    } catch (error) {
      console.error('  Unable to create stats file:', statsFilePath);
    }
  }
  console.log(`\n  Logging stats to: ${statsFilePath} ...\n`);
  return statsFilePath;
}

/**
 * Gets vscode marketplace extension stats and prints 
 * DateTime, Installs, Downloads, Version
 * CSV to console for copy over to hourly/daily stats
 * data files for vscode extension metrics and analytics.
 */
function getStats() {
  // create extension stats post request body
  const requestBodyString = createStatsRequestBody(extensionName);

  // create post request options
  const requestOptions = createStatsRequestOptions(requestBodyString);

  // create extension stats post request
  const postRequest = https.request(requestOptions, (response) => {
    // set response encoding for reading JSON response data
    response.setEncoding('utf8');
    // console.log('statusCode:', response.statusCode);
    // console.log('headers:', response.headers);

    // get response data
    let responseText = '';
    response.on('data', (chunk) => {
      responseText += chunk;
    });
  
    // process extension data response and stats
    response.on('end', () => {
      const responseData = JSON.parse(responseText);
      // console.log('response:', JSON.stringify(responseData, null, 2));
      const results = responseData.results;
      if (results.length > 0 && results[0].extensions && results[0].extensions.length > 0) {
        // get the 1st extension info
        const extension = results[0].extensions[0];
        const extensionVersion = extension.versions[0].version;
        const extensionStats = extension.statistics;
        // console.log('version:', extensionVersion);
        // console.log('stats:', JSON.stringify(extensionStats, null, 2));

        // convert extension stats to simpler data object
        const stats = {};
        extensionStats.forEach(stat => {
          stats[stat.statisticName] = stat.value;
        });
        // console.log('stats:', JSON.stringify(stats, null, 2));

        // log periodic stats in CSV format to console: DateTime, Installs, Downloads, Version
        const statsCsvLine = logStats(stats, extensionVersion);

        // update stats data file
        appendStatsToFile(statsFilePath, statsCsvLine);
      }
    });
  });
  
  // write post request body and send stats request
  postRequest.write(requestBodyString);
  postRequest.end();
  postRequest.on("error", (err) => {
    console.log("Error: " + err.message);
  });

} // end of getStats()

/**
 * Creates vscode marketplace extension stats post request body string.
 * @param extensionName Extension name to create stats request for.
 */
function createStatsRequestBody(extensionName) {
  // create ext stats post request body
  const requestBodyString = JSON.stringify({
    filters: [{
      criteria: [{
        filterType: 7,
        value: extensionName
      }, {
        filterType : 12,
        value: '4096'
      }]
    }],
    flags: 914
  }, null, 2);
  // console.log('request:', requestBodyString);
  return requestBodyString;
}

/**
 * Creates vscode marketplace post request options.
 * @param requestBodyString Post request body string.
 */
function createStatsRequestOptions(requestBodyString) {
  // create post request options
  const requestOptions = {
    protocol: 'https:',
    host: 'marketplace.visualstudio.com',
    port: 443,
    path: '/_apis/public/gallery/extensionquery',
    method: 'POST',
    headers: {
      'Accept': 'application/json;api-version=3.0-preview.1',
      'Content-Type' : 'application/json',
      'Content-Length' : Buffer.byteLength(requestBodyString, 'utf8')
    }
  };
  return requestOptions;
}

/**
 * Creates new stats CSV entry and logs extention stats to console.
 * @param stats Stats object with install and updateCount properties.
 * @param extensionVersion Extension version string.
 */
function logStats(stats, extensionVersion) {
  // create local dateTime ISO string
  const timeString = getLocalDateTimeISOString(new Date());
  // create stats line entry in CSV format: DateTime, Installs, Downloads, Version
  const statsLine = 
    `${timeString}, ${stats.install}, ${stats.updateCount}, ${stats.downloadCount}, v${extensionVersion}`;
  // log to console :)
  console.log(statsLine);
  // return for append to stats file too
  return statsLine;
}

/**
 * Appends new data to stats file.
 * @param statsFilePath Stats file path.
 * @param statsLine Stats text in CSV format.
 */
function appendStatsToFile(statsFilePath, statsLine) {
  if (fs.existsSync(statsFilePath)) {
    try {
      // write stats CSV header to start new stats file
      const statsWriteStream = fs.createWriteStream(statsFilePath, {
        flags: 'a', // append
        encoding: 'utf8'
      });
      statsWriteStream.write('\n' + statsLine);
      statsWriteStream.end();
    } catch (error) {
      console.error('  Unable to update stats file:', statsFilePath);
    }
  }
}

/**
 * Converts a Date to local date and time ISO string, without seconds.
 * @param dateTime Date to convert to local date/time ISO string.
 */
function getLocalDateTimeISOString(dateTime) {
  return dateTime.getFullYear() + '-' +
    pad(dateTime.getMonth() + 1) + '-' + 
    pad(dateTime.getDate()) + 'T' + 
    pad(dateTime.getHours()) + ':' + 
    pad(dateTime.getMinutes());
}

/**
 * Pads date/time fields with 0s.
 * @param number date/time part number.
 */
function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}
