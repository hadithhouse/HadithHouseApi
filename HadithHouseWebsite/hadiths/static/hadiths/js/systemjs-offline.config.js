SystemJS.config({
  baseURL: '/static/hadiths/js',
  meta: {
    'angular': {
      format: 'global',
      deps: ['jquery']
    },
    'angular-animate': {
      format: 'global',
      deps: ['angular']
    },
    'angular-aria': {
      format: 'global',
      deps: ['angular']

    },
    'angular-resource': {
      format: 'global',
      deps: ['angular']
    },
    'angular-route': {
      format: 'global',
      deps: ['angular']
    },
    'bootstrap': {
      format: 'global',
      deps: ['tether']
    },
    'jquery': {
      format: 'global',
      exports: '$'
    },
    'lodash': {
      format: 'global',
      exports: '_'
    },
    'tether': {
      format: 'global'
    },
    'typeahead': {
      format: 'global',
      deps: ['bloodhound']
    },
    'bloodhound': {
      format: 'global'
    }
  },
  map: {
    'angular': '/static/hadiths/third-party/angular.js',
    'angular-animate': '/static/hadiths/third-party/angular-animate.js',
    'angular-aria': '/static/hadiths/third-party/angular-aria.js',
    'angular-resource': '/static/hadiths/third-party/angular-resource.js',
    'angular-route': '/static/hadiths/third-party/angular-route.js',
    'bootstrap': '/static/hadiths/third-party/bootstrap.js',
    'd3': '/static/hadiths/third-party/d3.js',
    'jquery': '/static/hadiths/third-party/jquery.js',
    'lodash': '/static/hadiths/third-party/lodash.js',
    'moment': '/static/hadiths/third-party/moment.js',
    'tether': '/static/hadiths/third-party/tether.js',
    'toastr': '/static/hadiths/third-party/toastr.js',
    'typeahead': '/static/hadiths/third-party/typeahead.jquery.js',
    'bloodhound': '/static/hadiths/third-party/bloodhound.js'
  },
  packages: {
    '/': {
      defaultExtension: 'js'
    }
  }
});

