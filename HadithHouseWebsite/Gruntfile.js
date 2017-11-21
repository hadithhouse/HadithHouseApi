module.exports = function(grunt) {
  grunt.initConfig({
    ts: {
      default : {
        tsconfig: {
          tsconfig: 'tsconfig.json'
        }
      }
    },
    uglify: {
      options: {
        mangle: false,
        preserveComments: false,
        sourceMap: true,
        sourceMapIncludeSources: true,
        compress: false
      },
      all: {
        files: [
          {
            'hadiths/static/hadiths/js/all.js': [
              'hadiths/static/hadiths/js/app.js',
              'hadiths/static/hadiths/js/services/facebook.service.js',
              'hadiths/static/hadiths/js/services/services.js',
              'hadiths/static/hadiths/js/caching/cache.js',
              'hadiths/static/hadiths/js/resources/resources.js',
              'hadiths/static/hadiths/js/controllers/entity-page.js',
              'hadiths/static/hadiths/js/controllers/entity-listing-page.js',
              'hadiths/static/hadiths/js/controllers/book-page.js',
              'hadiths/static/hadiths/js/controllers/book-listing-page.js',
              'hadiths/static/hadiths/js/controllers/hadith-page.js',
              'hadiths/static/hadiths/js/controllers/hadith-listing-page.js',
              'hadiths/static/hadiths/js/controllers/hadithtag-page.js',
              'hadiths/static/hadiths/js/controllers/hadithtag-listing-page.js',
              'hadiths/static/hadiths/js/controllers/home-page.js',
              'hadiths/static/hadiths/js/controllers/person-page.js',
              'hadiths/static/hadiths/js/controllers/person-listing-page.js',
              'hadiths/static/hadiths/js/controllers/user-page.js',
              'hadiths/static/hadiths/js/controllers/user-listing-page.js',
              'hadiths/static/hadiths/js/directives/entity.directive.js',
              'hadiths/static/hadiths/js/directives/entity-lookup.directive.js',
              'hadiths/static/hadiths/js/directives/hadith-listing.directive.js',
              'hadiths/static/hadiths/js/directives/selector.directive.js',
              'hadiths/static/hadiths/js/directives/tags-input.directive.js',
              'hadiths/static/hadiths/js/directives/tree.directive.js'
            ]
          }
        ]
      },
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1,
        rebase: true,
        sourceMap: true
      },
      all: {
        files: [
          {
            dest: 'hadiths/static/hadiths/css/all.css',
            src: [
              'hadiths/static/hadiths/css/styles.css',
              'hadiths/static/hadiths/css/typeaheadjs.css'
            ]
          }
        ]
      },
    }
  });
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['ts', 'uglify', 'cssmin']);
};