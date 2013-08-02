# Tadaa Runner

Tadaa!
Monitor things via the medium of sound.

Tadaa Runner is a command line client for easily running multiple [tadaa](https://github.com/jamesbloomer/tadaa) powered audio monitors.
Monitor anything you want by writing a [simple plugin](https://github.com/jamesbloomer/tadaa-example). 

## Install
Install the runner:
``` 
npm install tadaa-runner
```
Now install any required plugins:
```
npm install tadaa-zendesk --save
```
Also currently need to copy any sound files required to the root of module directory (issue [#1](https://github.com/jamesbloomer/tadaa-runner/issues/1)).


## Configure
- Copy example-config.js to config.js.
- Edit config.js. See the plugins documentation for values to configure.

## Run
```
./bin/tadaa
```

## Plugins
- [Pivotal Tracker](https://github.com/jamesbloomer/tadaa-pivotaltracker)
- [Zendesk](https://github.com/jamesbloomer/tadaa-zendesk)
