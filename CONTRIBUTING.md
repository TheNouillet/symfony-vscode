# Contributing

## Creating issues

You don't have to code to contribute to this project !

Creating issues is the way to go if you have something in mind that can help Symfony support on VSCode.

The philosophy behind the extension is :
* The extension must work without any further configuration, juste by creating a simple Symfony 2+ project, following instructions on the official documentation.
* Even if features such as autocomplete can be hard to implement, data visualization, quick code access or even an SVG on a button can be a plus.
* The extension must have enough settings to work on most common work environments (for example : Dockerized Symfony projects).

This means that there are 2 types of issues :
* The extension is not working (correctly or not at all) in your work environment. Please create an issue describing your OS, VSCode version, Symfony version, other installed extensions and the tool you'are working with (FPM, Apache PHP worker, Docker, Vagrant ...).
* The extension lacks a feature that would improve productivity. Please create an issue with at least a minimum Symfony version.

Note that if your Symfony app is not running on a conventionnal installation (Docker, Vagrant ...) and the extension is working with some settings tweak, you can contribute [this file](ENVIRONMENTS.md) to help other users to set up their IDE.

## Development

### Prerequisites

To contribute to this extension, you must have the following tools :
* Git (obviously)
* NodeJS (>= 8.11)
* npm (>= 5.6)

If you want to have a better understanding of extension authoring, [the documentation is your first stop](https://code.visualstudio.com/api).

### Installation

```
git clone https://github.com/TheNouillet/symfony-vscode.git
npm install --no-save
npm run compile
```

### Watching

For development, it's easier to watch the files with :
```
npm run watch
```

### Creating the VSIX file

VSIX file allows you to install the extension on VSCode. For this, you have to install the `vsce` utility :
```
npm install -g vsce
```

To create a VSIX file, you can use this command : 
```
vsce package
```

Make sure that your dependencies are up-to-date before packaging the extension.
