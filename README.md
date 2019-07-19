# vscode-marketplace-ext-stats

[VSCode Marketplace](https://marketplace.visualstudio.com/vscode) Extension Stats tool for devs to get periodic Installs & Downloads counts since Microsoft doesn't have a proper store dashboard for extension authors.

Port of https://github.com/RandomFractals/vscode-data-preview/issues/111 for other vscode ext. devs to use.

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
where `extensionName` is the Unique Identifier from [VSCode Marketplace Store](https://marketplace.visualstudio.com/vscode), i.e. `itemName` param from vscode marketplace url :)

## Example

To see Installs and Downloads stats for GitLens, run:

```bash
tools>node vscode-marketplace-stats eamodio.gitlens
```

# Sample Output

from our [DataPreview 🈸 vscode ext.](https://github.com/RandomFractals/vscode-data-preview) marketplace stats run today :)

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
## VSMarketplace Badges

If you are looking for vscode marketplace stats badges, they are here: 

https://github.com/cssho/VSMarketplaceBadge
