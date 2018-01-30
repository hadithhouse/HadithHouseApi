SystemJS.config({
  baseURL: '/static/hadiths/js-angular',
  meta: {
    'bootstrap': {
      format: 'global',
      deps: ['popper.js']
    },
    'jquery': {
      format: 'global',
      exports: '$'
    },
    'lodash': {
      format: 'global',
      exports: '_'
    },
    'popper.js': {
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
  '//': 'When you add more modules, make sure to update systemjs-offline.config.js and prepare-offline.sh files.',
  map: {
    'react': 'https://cdnjs.cloudflare.com/ajax/libs/react/16.2.0/umd/react.production.min.js',
    'react-dom': 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.2.0/umd/react-dom.production.min.js',
    'bootstrap': 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/js/bootstrap.js',
    'd3': 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.js',
    'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js',
    'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.js',
    'moment': 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.2/moment.js',
    'popper.js': 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.13.0/umd/popper.min.js',
    'toastr': 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.3/toastr.min.js',
    'typeahead': 'https://cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.11.1/typeahead.jquery.js',
    'bloodhound': 'https://cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.11.1/bloodhound.js'
  },
  packages: {
    '/': {
      defaultExtension: 'js'
    }
  }
});

