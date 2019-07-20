# vscode-marketplace-ext-stats

[VSCode Marketplace](https://marketplace.visualstudio.com/vscode) **Extension Stats** tool anyone with 
[nodejs](https://nodejs.org/en/download/) installed can run 🏃
to get periodic Installs & Downloads counts for Visual Studio family of products extensions.

I created this simple script tool to capture vscode extension satatistics for 
[DataPreview 🈸](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.vscode-data-preview) and help me evaluate and analyze extension performance and foot 👣 traffic in Visual Studio marketplace store since Microsoft doesn't provide a proper dashboard for extension authors yet :)

**Note:** You can use it for any of your own VS extensions || see how popular other extensions are in VS marketplace store.

# Install

```bash
$ git clone https://github.com/RandomFractals/vscode-marketplace-ext-stats
$ cd vscode-marketplace-ext-stats
```

**Note**: [nodejs v10.16.0 || higher](https://nodejs.org/en/download/) required! No other modules or libs needed :) Thus, no `package.json` atm.

# Run

```bash
$ cd tools
$ node vscode-marketplace-stats <extensionName>
```
where `<extensionName>` is the Unique Identifier from [Visual Studio Marketplace Store](https://marketplace.visualstudio.com/vscode), i.e. `itemName` param from VS marketplace url :)

## Examples

Get [GitLens VSCode etension](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) stats:

```bash
tools>node vscode-marketplace-stats eamodio.gitlens
```
Get [Live Share Visual Studio extension](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsls-vs) stats:

```bash
tools>node vscode-marketplace-stats MS-vsliveshare.vsls-vs
```


# Sample Output

from our [DataPreview 🈸 vscode ext.](https://github.com/RandomFractals/vscode-data-preview) marketplace stats run:

```csv
DateTime, Installs, Downloads, Version
2019-07-18T08:00:00, 5637, 28067, v1.26.0
2019-07-18T08:10:00, 5639, 28070, v1.26.0
2019-07-18T08:20:00, 5642, 28073, v1.26.0
2019-07-18T08:30:00, 5644, 28075, v1.26.0
2019-07-18T08:40:00, 5644, 28079, v1.26.0
2019-07-18T08:50:00, 5648, 28084, v1.26.0
2019-07-18T09:30:00, 5654, 28092, v1.26.0
2019-07-18T09:40:00, 5656, 28096, v1.26.0
2019-07-18T09:50:00, 5656, 28097, v1.26.0
2019-07-18T10:00:00, 5657, 28098, v1.26.0
2019-07-18T10:10:00, 5657, 28099, v1.26.0
2019-07-18T10:20:00, 5658, 28101, v1.26.0
2019-07-18T10:30:00, 5661, 28107, v1.26.0
2019-07-18T10:40:00, 5663, 28110, v1.26.0
2019-07-18T10:50:00, 5665, 28112, v1.26.0
2019-07-18T11:00:00, 5666, 28113, v1.26.0
2019-07-18T11:10:00, 5666, 28114, v1.26.0
2019-07-18T11:20:00, 5669, 28118, v1.26.0
2019-07-18T11:30:00, 5670, 28119, v1.26.0
2019-07-18T11:40:00, 5670, 28121, v1.26.0
2019-07-18T11:50:00, 5670, 28123, v1.26.0
2019-07-18T12:00:00, 5671, 28126, v1.26.0
2019-07-18T12:10:00, 5671, 28127, v1.26.0
2019-07-18T12:20:00, 5671, 28127, v1.26.0
2019-07-18T12:30:00, 5674, 28130, v1.26.0
2019-07-18T12:40:00, 5675, 28131, v1.26.0
2019-07-18T12:50:00, 5678, 28135, v1.26.0
2019-07-18T13:00:00, 5678, 28137, v1.26.0
2019-07-18T13:10:00, 5679, 28138, v1.26.0
2019-07-18T13:20:00, 5679, 28139, v1.26.0
2019-07-18T13:30:00, 5681, 28141, v1.26.0
2019-07-18T13:40:00, 5682, 28142, v1.26.0
2019-07-18T13:50:00, 5683, 28144, v1.26.0
2019-07-18T14:00:00, 5684, 28145, v1.26.0
2019-07-18T14:10:00, 5685, 28146, v1.26.0
2019-07-18T14:20:00, 5686, 28148, v1.26.0
2019-07-18T14:30:00, 5687, 28150, v1.26.0
...
```

# Data Preview Plot Example

You can use my [Data Preview 🈸](https://github.com/RandomFractals/vscode-data-preview) extension to plot this CSV data :)

![Data Preview](https://github.com/RandomFractals/vscode-marketplace-ext-stats/blob/master/images/vscode-data-preview-stats-plot.png?raw=true 
"Data Preview")

## VSMarketplace Badges

If you are looking for vscode marketplace stats badges, they are here: 

https://github.com/cssho/VSMarketplaceBadge
