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
    'angular': 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.6/angular.js',
    'angular-animate': 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.6/angular-animate.js',
    'angular-aria': 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.6/angular-aria.js',
    'angular-resource': 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.6/angular-resource.js',
    'angular-route': 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.6/angular-route.js',
    'bootstrap': 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/js/bootstrap.js',
    'd3': 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.js',
    'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js',
    'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.js',
    'moment': 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.2/moment.js',
    'tether': 'https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.3/js/tether.js',
    'toastr': 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.3/toastr.js',
    'typeahead': 'https://cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.11.1/typeahead.jquery.js',
    'bloodhound': 'https://cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.11.1/bloodhound.js'
  },
  packages: {
    '/': {
      defaultExtension: 'js'
    }
  }
});

