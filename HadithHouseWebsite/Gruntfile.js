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
          "hadiths/static/hadiths/js/controllers/hadith-house.ts",
          "hadiths/static/hadiths/js/app.ts",
        ]
      }
    },
    ts: {
      default: {
        tsconfig: {
          tsconfig: 'tsconfig.json'
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
