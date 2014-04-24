module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-karma'

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    meta:
      banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    clean:
      options:
        force: true
      dist: ["compile/**/*", "dist/**/*"]
    concat:
      options:
        banner: '<%= meta.banner %>'
      dist:
        src: 'src/**/*.js'
        dest: 'dist/ng-infinite-scroll.js'
    uglify:
      options:
        banner: '<%= meta.banner %>'
      dist:
        src: ['dist/ng-infinite-scroll.js']
        dest: 'dist/ng-infinite-scroll.min.js'
    karma:
      unit:
        configFile: 'test/karma.conf.js'
        autoWatch: true
        browsers: ['Chrome', 'PhantomJS']
        reporters: ['dots']
        runnerPort: 9101
        keepalive: true

  grunt.registerTask 'default', ['clean', 'concat', 'uglify']
  grunt.registerTask 'test', ['karma']
