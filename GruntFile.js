module.exports = function (grunt) {
    // grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 4649,
                    base: './'
                }
            }
        },
        ts: {
          default : {
            src: ["lib/**/*.ts", "!node_modules/**/*.ts"],
            out: "bin/index.js",
            // outDir: "bin/",
            options: {
                module: "commonjs",
                declaration: true,
                sourceMap: true,
                // fast: 'watch',
                watch: "lib/"
            }
          }
        },
        watch: {
            files: 'lib/**/*.ts',
            tasks: ['ts']
        },
        open: {
            dev: {
                path: 'http://localhost:4649/index.html'
            }
        }
    });
 
    //grunt.registerTask('default', ['connect', 'open', 'watch']);
   grunt.registerTask("default", ["watch", "ts", 'connect', 'open']);

}