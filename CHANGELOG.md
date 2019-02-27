# Change Log

## 1.0.2 [02-27-2019]

* Fixed the extension not starting at all

## 1.0.1 [02-26-2019]

* [#31](https://github.com/TheNouillet/symfony-vscode/pull/31) Fix parsing of files not working on Windows (thank you [smertelny](https://github.com/smertelny) !)
* Fix of command console failure when the console output has comments in it
* Fix PHP parsing not working

## 1.0.0 [02-25-2019]

* Added a "Include PHPDoc tag for Symfony service" code action
    * This code action allows you to include a `@var` PHPDoc tag on the line above a recognized service name
    * This acts as a way to provide autocompletion of a service obtained via a ContainerInterface object (such as `$this->get('logger')` in a controller for example)
* Added a "Go to definition" on services in YAML, XML and PHP files
    * PHP files are now parsed
* Container elements and PHP files are now cached
    * Startup is now way faster on existing projects
    * Commands and file modification invalidates caches.
* Console command calls are now asynchronous
    * The extension usage with Docker or others shell-based environments has been changed, via the addition of `shellExecutable` and `shellCommand` parameters.
* Added a search functionnality on services, routes and parameters views.
* Added the `parametersFilters` setting to filter out parameters, such as classes.
* Added the `routesFilters` setting to filter out routes, such as Assetic routes.
    * Let know in the repository issues if default filters aren't pertinent enough ! I made them according to my work habbits, but each project is different.
* Errors messages now display only once when refreshing services, routes and parameters (i.e. at extension startup or configuration file modification)

## 0.0.3 [08-06-2018]

* Added aucompletion of public services in PHP files
* Added the parameter view to display parameters of the Symfony container.
* Added aucompletion of parameters in YAML files
* Added class name on hover on a known service id in YAML and PHP files.
* Added the `enableFileWatching` setting to enable or disable file watching.
* Added the `servicesFilters` to improve autocompletion pertinence.
* Added the "Toggle class/id display for services" command to switch between Id and class name display on the services view.
* Added the "Toggle path/id display for routes" command to switch between Id and paths display on the routes view.
    * These two commands are available via buttons on the side of the two views.

## 0.0.2 [08-04-2018]

* Added autocompletion of services in YAML files
* Added the `detectCwd` setting to help with Symfony projects on Docker
* Added more logging of errors
    * Added the `showConsoleErrors` setting to hide errors from the Symfony console
* Added progress indicator on the status bar
* Added buttons to the side of TreeViews to re-sync the extension and Symfony.
* Added class name for services aliases

## 0.0.1

Initial preview release