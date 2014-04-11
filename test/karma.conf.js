var appConfig = require('../app.config.json');

module.exports = function(config){
  config.set({
    basePath : '..',

    files : appConfig.vendor.concat(appConfig.ngMock, 'client/**/*.js'),

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],
  });
};
