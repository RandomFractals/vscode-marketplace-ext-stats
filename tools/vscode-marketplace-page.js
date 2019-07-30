const fs = require('fs');
const https = require('https');
const path = require('path');
const url = require('url');

// extension to get stats for
let extensionName = 'RandomFractalsInc.vscode-data-preview';

// stats time interval
let timeInterval = 1000 * 60 * 10; // every 10 mins :)

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
  console.log('DateTime, Installs, Downloads, Version');

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
  const statsFileName = `${extensionName}-stats-page-${isoDateString}.csv`;
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
  // create page request options
  const requestOptions = createPageRequestOptions(extensionName);

  // create extension stats post request
  const postRequest = https.get(requestOptions, (response) => {
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
      // console.log('response:', JSON.stringify(responseData, null, 2));
      console.log('.'); //responseText); // ...
    });
  });
  
  // write post request body and send stats request
  // postRequest.write(requestBodyString);
  postRequest.end();
  postRequest.on("error", (err) => {
    console.log("Error: " + err.message);
  });

} // end of getStats()

/**
 * Creates vscode marketplace page request options.
 * @param extensionName Extension name to page :)
 */
function createPageRequestOptions(extensionName) {
  // create get request url
  const requestUrl = url.parse(url.format({
    protocol: 'https',
    hostname: 'marketplace.visualstudio.com',
    pathname: '/items',
    query: {
      itemName: extensionName
    }
  }));

  // create post request options
  const requestOptions = {
    hostname: 'marketplace.visualstudio.com',
    path: requestUrl.path,
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
    `${timeString}, ${stats.install}, ${stats.install + stats.updateCount}, v${extensionVersion}`;
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
