# Symfony for VS Code

This extension aims to help developing Symfony2+ projects, by showing services and routes of your current project, and provide autocompletion support with these datas.

## Features

This extension add a new view, the *Symfony Debug View*, to visualize the status of your project container and routes. With this, you can :
* know which controller action is binded to a route
* know which class is binded to a service
* see all services aliases
* ...

This extension also enable autocompletion in YAML files to reference services.

## How does it works ?

To detect Symfony projects, this extension rely on `composer.json` files with `symfony/symfony` as one of its dependencies.

The `composer.json` file is supposed to be at the root of your Symfony project.

When the project is detected, it simply uses the `debug:container` and `debug:router` console commands to hydrate the views and autocompletions.

## Extension Settings

This extension contributes the following settings:

* TODO

## Troubleshooting

Q: I run my Symfony project on Docker. How do I configure the extension ?

A: You have to tell the extension to do console commands via shell to your docker container, like this :
```json
{
    "symfony-vscode.shellExecutable": "/bin/bash",
    "symfony-vscode.shellCommand": "docker exec my_container_id /bin/sh -c 'cd /path/to/symfony && php \"$@\"' -- "
}
```

## Release Notes

See [the changelog](CHANGELOG.md) for releases notes.

## Acknowledgments

Icons from www.flaticon.com, by :
* [Chanut](https://www.flaticon.com/authors/chanut)
* [SimpleIcon](https://www.flaticon.com/authors/simpleicon)