SystemJS.config({
  baseURL: '/static/hadiths/js-angular',
  meta: {
    'rxjs': {
      format: 'global'
    },
    '@angular/core': {
      format: 'global',
      deps: ['rxjs']
    },
    '@angular/common': {
      format: 'global',
      deps: ['@angular/core']
    },
    '@angular/compiler': {
      format: 'global'
    },
    '@angular/platform-browser': {
      format: 'global',
      deps: ['@angular/common', '@angular/core']
    },
    '@angular/platform-browser-dynamic': {
      format: 'global',
      deps: ['@angular/compiler', '@angular/common', '@angular/core', '@angular/platform-browser']
    },
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
    "rxjs": "https://unpkg.com/rxjs@5.5.6/bundles/Rx.min.js",
    "@angular/common": "https://unpkg.com/@angular/common@5.2.2/bundles/common.umd.js",
    "@angular/compiler": "https://unpkg.com/@angular/compiler@5.2.2/bundles/compiler.umd.js",
    '@angular/core': 'https://unpkg.com/@angular/core@5.2.2/bundles/core.umd.js',
    '@angular/platform-browser': 'https://unpkg.com/@angular/platform-browser@5.2.2/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'https://unpkg.com/@angular/platform-browser-dynamic@5.2.2/bundles/platform-browser-dynamic.umd.js',
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

