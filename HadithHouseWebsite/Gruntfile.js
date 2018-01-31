module.exports = function (grunt) {
  grunt.initConfig({
    tslint: {
      options: {
        configuration: "tslint.json",
        force: false,
        fix: false
      },
      files: {
        src: [
          "hadiths/static/hadiths/js/caching/cache.ts",
          "hadiths/static/hadiths/js/controllers/book-listing-page.ts",
          "hadiths/static/hadiths/js/controllers/hadith-house.ts",
          "hadiths/static/hadiths/js/controllers/hadith-listing-page.ts",
          "hadiths/static/hadiths/js/directives/entity-lookup.directive.ts",
          "hadiths/static/hadiths/js/directives/entity.directive.ts",
          "hadiths/static/hadiths/js/directives/tags-input.directive.ts",
          "hadiths/static/hadiths/js/resources/*.ts",
          "hadiths/static/hadiths/js/services/*.ts",
          "hadiths/static/hadiths/js/app-def.ts",
          "hadiths/static/hadiths/js/app.ts",
          "hadiths/static/hadiths/js-angular/**/*.ts",
          "hadiths/static/hadiths/js-reactjs/**/*.ts"
        ]
      }
    },
    ts: {
      default: {
        tsconfig: {
          tsconfig: 'hadiths/static/hadiths/js/tsconfig.json'
        },
        options: {
          sourceMap: false
        }
      },
      reactjs: {
        tsconfig: {
          tsconfig: 'hadiths/static/hadiths/js-reactjs/tsconfig.json'
        },
        options: {
          sourceMap: false
        }
      },
      angular: {
        tsconfig: {
          tsconfig: 'hadiths/static/hadiths/js-angular/tsconfig.json'
        },
        options: {
          sourceMap: false
        }
      }
    },
    systemjs: {
      options: {
        sfx: false,
        baseURL: "hadiths/static/hadiths/js",
        configFile: "hadiths/static/hadiths/js/systemjs.config.js",
        minify: false,
        build: {
          mangle: false
        }
      },
      dist: {
        files: [{
          "src": "app.js",
          "dest": "hadiths/static/hadiths/js/all.js"
        }]
      }
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
    },
    clean: {
      generated_js_files: [
        'hadiths/static/hadiths/js/**/*.js',
        'hadiths/static/hadiths/js/**/*.js.map',
        '!hadiths/static/hadiths/js/systemjs.config.js'
      ]
    }
  });
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks("grunt-tslint");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-systemjs-builder');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['tslint', 'ts', 'systemjs', 'cssmin']);
};
