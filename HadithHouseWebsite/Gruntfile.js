module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
            default : {
                src: ["hadiths/static/hadiths/js/**/*.ts"]
            }
        }
    });
    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask("default", ["ts"]);
};