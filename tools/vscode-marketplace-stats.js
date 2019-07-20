const https = require('https');

// extension to get stats for
let extensionName = 'RandomFractalsInc.vscode-data-preview';

// stats time interval
let timeInterval = 1000 * 60 * 60; // every hour

// get command line arguments
const args = process.argv.slice(2); // skip node & script args
if (args.length > 0) {
  // get extension name
  extensionName = args[0].trim();

  // print stats CSV header
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

        // log periodic stats in CSV format: DateTime, Installs, Downloads, Version
        logStats(stats, extensionVersion);
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
 * Logs extention stats to console.
 * @param stats Stats object with install and updateCount properties.
 * @param extensionVersion Extension version string.
 */
function logStats(stats, extensionVersion) {
  // create local dateTime ISO string
  const timeString = getLocalDateTimeISOString(new Date());
  // log periodic stats in CSV format: DateTime, Installs, Downloads, Version
  console.log(`${timeString}, ${stats.install}, ${stats.install + stats.updateCount}, v${extensionVersion}`);
}

/**
 * Converts a Date to local date and time ISO string.
 * @param dateTime Date to convert to local date/time ISO string.
 */
function getLocalDateTimeISOString(dateTime) {
  return dateTime.getFullYear() + '-' +
    pad(dateTime.getMonth() + 1) + '-' + 
    pad(dateTime.getDate()) + 'T' + 
    pad(dateTime.getHours()) + ':' + 
    pad(dateTime.getMinutes()) + ':' + 
    pad(dateTime.getSeconds());
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
