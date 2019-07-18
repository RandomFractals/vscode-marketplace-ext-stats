# vscode-marketplace-ext-stats

Port of https://github.com/RandomFractals/vscode-data-preview/issues/111 for other vscode ext. devs to use

# Install

```bash
$ git clone https://github.com/RandomFractals/vscode-marketplace-ext-stats
$ cd vscode-marketplace-ext-stats
```

**Note**: [nodejs v10.16.0 || higher](https://nodejs.org/en/download/) required! No other modules or libs needed :) Thus, no `package.json` atm.

# Config

Change your desired ext. name & run time interval in [tools/vscode-marketplace-stats.js](https://github.com/RandomFractals/vscode-marketplace-ext-stats/blob/master/tools/vscode-marketplace-stats.js) for now...

```javascript
// extension to get stats for
const extensionName = 'RandomFractalsInc.vscode-data-preview';

// stats time interval
const timeInterval = 1000 * 60 * 10; // ever 10 mins
```
**Note**: I will add those CLS & other args later! :)

# Run

```bash
$ cd tools
$ node vscode-marketplace-stats
```


