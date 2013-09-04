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

Any sounds required should either be in the tadaa-runner ./sounds directory or in the ./sounds directory of the plugin. 

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
- [Thoughtworks Go](https://github.com/jamesbloomer/tadaa-go)
- [AWS Elastic Load Balancer](https://github.com/jamesbloomer/tadaa-elb)