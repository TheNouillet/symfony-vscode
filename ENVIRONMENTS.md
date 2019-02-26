# Settings for different environments

This file sums up settings to put in your VSCode, so that the extension can work and help you developping your Symfony projects.

## Windows

You have to change the PHP path if you're working on Windows :

```json
{
    "symfony-vscode.phpExecutablePath": "c:\\xampp\\php\\php.exe"
}
```


## Docker

[Docker](https://www.docker.com/) is used to perform containerization.

```json
{
    "symfony-vscode.shellExecutable": "/bin/bash",
    "symfony-vscode.shellCommand": "docker exec <my_container_id> /bin/sh -c 'cd </path/to/symfony> && php \"$@\"' -- "
}
```

## eZ Launchpad

[eZ Launchpad](https://ezsystems.github.io/launchpad) is used to quickly install and deploy [eZ Platform](https://www.ezplatform.com) web sites.

```json
{
    "symfony-vscode.shellExecutable": "/bin/bash",
    "symfony-vscode.shellCommand": "ez docker:sfrun \"$@\" -- "
}
```