module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: '',
                    hostname: 'localhost',
                    keepalive: true,
                    open: {
                        target: 'http://localhost:9001',
                        appName: 'MyStore'
                    }
                }
            }
        }
    });

    // Load the plugin used to start a connect web server.
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task(s).
    grunt.registerTask('default', ['connect']);

};