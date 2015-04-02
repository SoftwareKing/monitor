module.exports = function ( grunt ) {

  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-jade');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-cleanempty');

  /**
   * Load in our build configuration file.
   */
  var userConfig = require( './config.js' );
  var system = userConfig.system;

  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON("package.json"),
    mappings: grunt.file.readJSON(".mappings"),
    localMappings: grunt.file.readJSON("node_modules/.local_mappings"),

    target: system,

    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner:
        '/**\n' +
        ' * <%= target.name %> - v<%= target.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    /**
     * Creates a changelog on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },

    /**
     * Increments the version number, etc.
     */
    bump: {
      options: {
        files: [
          "package.json",
          "bower.json"
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          "package.json",
          "client/bower.json"
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: {
      build: ['<%= build_dir %>'],
      deploy:['<%= deploy_dir %>' ],
      build_extra: ['<%= build_dir %>/**/*.jade', '<%= build_dir%>/**/*.tpl.html'],
      deploy_extra: ['<%= deploy_dir %>/**/*.jade'],
      specs: ['<%= build_dir %>/**/*.spec.js', '<%= build_dir %>/**/*.spec.coffee', '<%= build_dir %>/karma-unit.js'],
      options: {force: true}
    },
    cleanempty: {
      options: {force: true},
      build: {src: '<%= build_dir %>/**/*'},
      deploy:{src: '<%= deploy_dir %>/**/*' }
    },
    /**
     * Jade is used to compile .jade to .html
     */
    jade: {
      source: {
        files: {'<%= build_dir %>': ['index/main/menus.jade']},
        options: {
          basePath: '.'
        }
      },
      index: {
        files: {'<%= build_dir %>': ['<%= build_dir %>/index.jade']}
      },
      login: {
        files: {'<%= build_dir %>': ['<%= build_dir %>/login.jade']}
      },
      index2: {
        files: {'<%= deploy_dir %>': ['<%= deploy_dir %>/index.jade']}
      },
      login2: {
        files: {'<%= deploy_dir %>': ['<%= deploy_dir %>/login.jade']}
      },
      options: {
        extension: '.html',
        client: false,
        runtime: false,
        wrap: true,
        locals:{ title: 'Convert jade by grunt-jade'}
      }
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      /**
       * These are the templates from `src/lib`.
       */
      lib: {
        options: {
          base: 'lib',
          module: 'Lib.Templates'
        },
        src: [ '<%= index_files.lib_tpl %>' ],
        dest: '<%= build_dir %>/templates/lib.js'
      },
      /**
       * These are the templates from `src/general`.
       */
      general: {
        options: {
          base: 'general/index',
          module: 'General.Templates',
          jade: {basedir: '.'}
        },
        src: [ '<%= index_files.general_tpl %>' ],
        dest: '<%= build_dir %>/templates/general.js'
      },
      /**
       * These are the templates from `src/resources`.
       */
      resources: {
        options: {
          base: 'resources',
          module: 'Resources.Templates',
          jade: {basedir: '.'}
        },
        src: [ '<%= index_files.resources_tpl %>' ],
        dest: '<%= build_dir %>/templates/resources.js'
      },
      /**
       * These are the templates from `src/credentials`.
       */
      credentials: {
        options: {
          base: 'credentials',
          module: 'Credentials.Templates',
          jade: {basedir: '.'}
        },
        src: [ '<%= index_files.credentials_tpl %>' ],
        dest: '<%= build_dir %>/templates/credentials.js'
      },
      /**
       * These are the templates from `src/index`.
       */
      index: {
        options: {
          base: 'index',
          module: 'Index.Templates',
          // 因为 main container 的这个tpl有include其他jade文件
          // 所以其需要指定 options.jade.filename
          // see: https://github.com/karlgoldstein/grunt-html2js/pull/48
          // 如果这里有多个在不同目录下的 tpl.jade include 其他jade，这将会玩不转
          // 所以，我们应该基于html2js，设置的jade basedir选项，采用绝对路径include
          jade: {basedir: '.'}
        },
        src: [ '<%= index_files.index_tpl %>' ],
        dest: '<%= build_dir %>/templates/index.js'
      },
      ms_index: {
        options: {
          base: '<%= target.name %>/index',
          module: '<%= target.title %>Index.Templates',
          jade: {basedir: '.'}
        },
        src: [ '<%= index_files.ms_tpl %>' ],
        dest: '<%= build_dir %>/templates/<%= target.name %>-index.js'
      },
      /**
       * These are the templates from `src/login`.
       */
      login: {
        options: {
          base: 'login',
          module: 'Login.Templates',
          jade: {basedir: '.'}
        },
        src: [ '<%= login_files.login_tpl %>' ],
        dest: '<%= build_dir %>/templates/login.js'
      },
      ms_login: {
        options: {
          base: '<%= target.name %>/login',
          module: '<%=target.title%>Login.Templates',
          jade: {basedir: '.'}
        },
        src: [ '<%= login_files.ms_tpl %>' ],
        dest: '<%= build_dir %>/templates/<%= target.name %>-login.js'
      }

    },

    /**
     * jslint 任务路径只能以Gruntfile所在目录为相对路径
     */
    jshint: {
      source: [ '<%= index_files.js %>', '<%= login_files.js %>' ],
      test: [ '<%= index_files.js_unit %>', '<%= login_files.js_unit %>' ],
      gruntfile: [
        '../Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      }
    },

    /**
     * `coffeelint` does the same as `jshint`, but for CoffeeScript.
     * CoffeeScript is not the default in ItsNow, so we're just using
     * the defaults here.
     */
    coffeelint: {
      options: {max_line_length: 200},
      source: [ '<%= index_files.coffee %>', '<%= login_files.coffee %>' ],
      test: [ '<%= index_files.coffee_unit %>', '<%= login_files.coffee_unit %>' ]
    },

    /**
     * `grunt coffee` compiles the CoffeeScript sources. To work well with the
     * rest of the build, we have a separate compilation task for sources and
     * specs so they can go to different places. For example, we need the
     * sources to live with the rest of the copied JavaScript so we can include
     * it in the final build, but we don't want to include our specs there.
     */
    coffee: {
      index: {
        options: {
          bare: true
        },
        expand: true,
        src: [ '<%= index_files.coffee %>' ],
        dest: '<%= build_dir %>',
        ext: '.js'
      },
      login: {
        options: {
          bare: true
        },
        expand: true,
        src: [ '<%= login_files.coffee %>' ],
        dest: '<%= build_dir %>',
        ext: '.js'
      }
    },

    /**
     * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
     * Only our `main.less` file is included in compilation;
     * all other files should be imported from this file OR concat by grunt .
     */
    less: {
      build: {
        files: {
          '<%= build_dir %>/assets/<%= target.index %>.css': '<%= index_files.less %>',
          '<%= build_dir %>/assets/<%= target.login %>.css': '<%= login_files.less %>'
        }
      },
      compile: {
        files: {
          '<%= deploy_dir %>/assets/<%= target.index %>.css': '<%= index_files.less %>',
          '<%= deploy_dir %>/assets/<%= target.login %>.css': '<%= login_files.less %>'
        },
        options: {
          cleancss: true,
          compress: true
        }
      }
    },

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build_dir`, and then to copy the assets to `deploy_dir`.
     */
    copy: {
      build_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= build_dir %>/assets/',
            cwd: 'assets',
            expand: true
          }
        ]
      },
      build_vendor_assets: {
        files: [
          {
            src: [ '<%= vendor_files.assets %>', '<%= vendor_files.css %>' ],
            dest: '<%= build_dir %>/assets/',
            expand: true,
            flatten: true
          }
        ]
      },
      build_jade: {
        files: [
          {
            src: [ '<%=index_files.jade%>','<%=login_files.jade%>' ],
            dest: '<%= build_dir %>/',
            expand: true
          }
        ]
      },
      build_index_js: {
        files: [
          {
            src: [ '<%= index_files.js %>' ],
            dest: '<%= build_dir %>/',
            expand: true
          }
        ]
      },
      build_login_js: {
        files: [
          {
            src: [ '<%= login_files.js %>' ],
            dest: '<%= build_dir %>/',
            expand: true
          }
        ]
      },
      build_vendor_js: {
        files: [
          {
            src: [ '<%= vendor_files.js %>' ],
            dest: '<%= build_dir %>/vendor',
            expand: true
          }
        ]
      },
      build_specs: {
        files: [
          {
            src: [
              '<%= index_files.js_unit%>',
              '<%= index_files.coffee_unit%>',
              '<%= login_files.js_unit%>',
              '<%= login_files.coffee_unit%>'
            ],
            dest: '<%= build_dir %>',
            expand: true
          }
        ]

      },
      compile_jade: {
        files: [
          {
            src: [ '<%=index_files.jade%>','<%=login_files.jade%>' ],
            dest: '<%= deploy_dir %>/',
            expand: true
          }
        ]
      },
      compile_assets: {
        files: [
          {
            src: [ '**', '!*.css' ],
            dest: '<%= deploy_dir %>/assets',
            cwd: '<%= build_dir %>/assets',
            expand: true
          }
        ]
      }
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      /**
       * The `compile_index_css` target concatenates compiled CSS and vendor CSS
       * together.
       */
      compile_index_css: {
        src: [
          '<%= build_dir %>/assets/<%= target.index %>.css',
          '<%= vendor_files.css %>'
        ],
        dest: '<%= deploy_dir %>/assets/<%= target.index %>.css'
      },
      compile_login_css: {
        src: [
          '<%= build_dir %>/assets/<%= target.login %>.css',
          '<%= vendor_files.css %>'
        ],
        dest: '<%= deploy_dir %>/assets/<%= target.login %>.css'
      },
      /**
       * The `compile_js` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      compile_index_js: {
        src: [
          '<%= vendor_files.js %>',
          'module.prefix',
          'window.VERSION = "<%=target.version%>"' ,
          '<%= build_dir %>/lib/**/*.js',
          '<%= build_dir %>/general/**/*.js',
          '<%= build_dir %>/resources/**/*.js',
          '<%= build_dir %>/credentials/**/*.js',
          '<%= build_dir %>/index/**/*.js',
          '<%= build_dir %>/<%= target.name %>/index/**/*.js',
          '<%= html2js.lib.dest %>',
          '<%= html2js.general.dest %>',
          '<%= html2js.resources.dest %>',
          '<%= html2js.credentials.dest %>',
          '<%= html2js.index.dest %>',
          '<%= html2js.ms_index.dest %>',
          'module.suffix'
        ],
        dest: '<%= deploy_dir %>/assets/<%= target.index %>.js'
      },
      compile_login_js: {
        src: [
          '<%= vendor_files.js %>',
          'module.prefix',
          'window.VERSION = "<%=target.version%>"' ,
          '<%= build_dir %>/lib/**/*.js',
          '<%= build_dir %>/general/**/*.js',
          '<%= build_dir %>/resources/**/*.js',
          '<%= build_dir %>/credentials/**/*.js',
          '<%= build_dir %>/login/**/*.js',
          '<%= build_dir %>/<%= target.name %>/login/**/*.js',
          '<%= html2js.lib.dest %>',
          '<%= html2js.general.dest %>',
          '<%= html2js.resources.dest %>',
          '<%= html2js.credentials.dest %>',
          '<%= html2js.login.dest %>',
          '<%= html2js.ms_login.dest %>',
          'module.suffix'
        ],
        dest: '<%= deploy_dir %>/assets/<%= target.login %>.js'
      }
    },

    /**
     * `ng-min` annotates the sources before minifying. That is, it allows us
     * to code without the array syntax.
     */
    ngmin: {
      compile: {
        files: [
          {
            src: [ '<%= index_files.js %>', '<%= login_files.js %>',  '<%= test_files.js %>' ],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          }
        ]
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_index_js.dest %>': '<%= concat.compile_index_js.dest %>',
          '<%= concat.compile_login_js.dest %>': '<%= concat.compile_login_js.dest %>'
        }
      }
    },

    cssmin: {
      index: {
        src: '<%= deploy_dir %>/assets/<%= target.index %>.css',
        dest: '<%= deploy_dir %>/assets/<%= target.index %>.css'
      },
      login: {
        src: '<%= deploy_dir %>/assets/<%= target.login %>.css',
        dest: '<%= deploy_dir %>/assets/<%= target.login %>.css'
      }
    },

    system_config: {
      system:{
        output: '<%= build_dir %>'
      }
    },

    /**
     * This task compiles the karma template so that changes to its file array
     * don't have to be managed manually.
     */
    karma_config: {
      unit: {
        output: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= index_files.js %>',
          '<%= index_files.coffee %>',
          '<%= login_files.js %>',
          '<%= login_files.coffee %>',

          '<%= test_files.js %>',
          '<%= index_files.js_unit %>',
          '<%= index_files.coffee_unit %>',
          '<%= login_files.js_unit %>',
          '<%= login_files.coffee_unit %>'
        ]
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: '<%= build_dir %>/karma-unit.js',
        force: true
      },
      unit: {
        port: 9019,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },

    /**
     * The `index` task compiles the `index.jade` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have wait for compilation,
       * js concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        output: '<%= build_dir %>',
        scripts: [
          '<%= vendor_files.js %>',
          '<%= html2js.lib.dest %>',
          '<%= html2js.general.dest %>',
          '<%= html2js.resources.dest %>',
          '<%= html2js.credentials.dest %>',
          '<%= html2js.index.dest %>',
          '<%= html2js.ms_index.dest %>',
          '<%= index_files.js %>'
        ],
        styles: [
          // TODO 现在这个写法是有问题的，我们定义的css最先被加载，具有最低的优先级
          // 主要是因为bootstrap被我们的less文件引用
          // 而ace改写了bootstrap的默认css，需要优先级更高
          // 为了解决这个问题，应该将ace的css改为less，并由 index/login的less文件import
          '<%= build_dir %>/assets/<%= target.index %>.css',
          '<%= vendor_files.built_css%>'
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        output: '<%= deploy_dir %>',
        scripts: '<%= concat.compile_index_js.dest %>',
        styles: ['<%= deploy_dir %>/assets/<%= target.index %>.css']
      }
    },


    /**
     * The `login` task compiles the `login.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    login: {

      build: {
        output: '<%= build_dir %>',
        scripts: [
          '<%= vendor_files.js %>',
          '<%= html2js.lib.dest %>',
          '<%= html2js.general.dest %>',
          '<%= html2js.resources.dest %>',
          '<%= html2js.credentials.dest %>',
          '<%= html2js.login.dest %>',
          '<%= html2js.ms_login.dest %>',
          '<%= login_files.js %>'
        ],
        styles: [
          '<%= build_dir %>/assets/<%= target.login %>.css',
          '<%= vendor_files.built_css%>'
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        output: '<%= deploy_dir %>',
        scripts: [
          '<%= concat.compile_login_js.dest %>'
        ],
        styles: ['<%= deploy_dir %>/assets/<%= target.login %>.css']
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files.
     */
    detect: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: '../Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      jssrc: {
        files: [
          '<%= index_files.js %>',
          '<%= login_files.js %>'
        ],
        tasks: [ 'copy:build_index_js', 'copy:build_login_js' ]
      },

      /**
       * When our CoffeeScript source files change, we want to run lint them and
       * run our unit tests.
       */
      coffeesrc: {
        files: [
          '<%= index_files.coffee %>',
          '<%= login_files.coffee %>'
        ],
        tasks: [ 'coffee', 'copy:build_index_js', 'copy:build_login_js' ]
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [
          'assets/**/*', '<%=vendor_files.css%>'
        ],
        tasks: [ 'copy:build_assets', 'copy:build_vendor_assets' ]
      },

      /**
       * When the app skeleton changes, we need rebuilt them
       */
      index_skeletons: {
        files: [
          '../index.jade', 'lib/**/*.jade', 'index/**/*.jade', '!**/*.tpl.jade', 'general/**/*.jade', 'resources/**/*.jade', 'credentials/**/*.jade'
        ],
        tasks: ['copy:build_jade', 'index:build', 'jade:index']
      },
      login_skeletons: {
        files: [
          '../login.jade', 'lib/**/*.jade', 'login/**/*.jade', '!**/*.tpl.jade', 'general/**/*.jade', 'resources/**/*.jade', 'credentials/**/*.jade'
        ],
        tasks: ['copy:build_jade', 'login:build', 'jade:login']
      },
      system_config:{
        files: '../.target',
        tasks: ['system_config']
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [
          '<%= index_files.lib_tpl %>',
          '<%= index_files.index_tpl %>',
          '<%= index_files.ms_tpl %>',
          '<%= index_files.general_tpl %>',
          '<%= index_files.resources_tpl %>',
          '<%= index_files.credentials_tpl %>',
          '<%= login_files.lib_tpl %>',
          '<%= login_files.login_tpl %>',
          '<%= login_files.ms_tpl %>',
          '<%= login_files.general_tpl %>',
          '<%= login_files.resources_tpl %>',
          '<%= login_files.credentials_tpl %>'
        ],
        tasks: [ 'html2js' ]
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      less: {
        files: [ '**/*.less' ],
        tasks: [ 'less:build' ]
      },

      /**
       * When a JavaScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      jsunit: {
        files: [
          '<%= index_files.js_unit %>',
          '<%= login_files.js_unit %>'
        ],
        tasks: [ 'jshint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      },

      /**
       * When a CoffeeScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      coffeeunit: {
        files: [
          '<%= index_files.coffee_unit %>',
          '<%= login_files.coffee_unit %>'
        ],
        tasks: [ 'coffeelint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      }

    }
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  grunt.event.on('watch', function (action, filepath, target) {
    var mappings = taskConfig.mappings;
    var localMappings = taskConfig.localMappings;
    var pathPrefix = "frontend/src/";
    filepath = filepath.replace(/\\/g, "/");

    var mid = mappings[pathPrefix + filepath];
    if (mid == null) {
      var customFilePath = pathPrefix + filepath.substr(0, filepath.lastIndexOf("/") + 1);
      for (var mapPath in mappings) {
        if (mapPath.indexOf(customFilePath) != -1) {
          mid = mappings[mapPath];
          break;
        }
      }
    }
    if(mid == null) {return;}
    var real = localMappings[mid] + filepath;
    grunt.log.writeln("Watch RealPath: " + real);
    if (real == null) {return;}
    if (action == "added" || action == "changed") {
      grunt.file.write(real, grunt.file.read(filepath));
    } else if (action == "deleted") {
      grunt.file['delete'](real, {force: true});
    }
  });

  grunt.file.setBase("src");
  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `detect` (that's why the configuration var above is
   * `detect`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask( 'watch', 'detect' );
  grunt.registerTask( 'watch', [ 'build', 'karma:unit', 'detect' ] );

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask( 'default', [ 'build', 'compile' ] );

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build', [
    'clean:build',                // 清除build目录
    //'jade:source',              // 将src目录中的jade文件编译成为build目录中的html(由于现在html2js支持了jade，所以暂时不需要直接生成)
    'html2js',                    // 将src/build目录中的*.tpl.html编译成为build目录中的templates/*.js
    'jshint',                     // 检查src目录中的js语法
    //'coffeelint',                 // 检查src目录中的coffee语法
    'coffee',                     // 将src目录中的coffee文件编译为build目录中的js
    'less:build',                 // 将src目录中的less文件编译为css
    'copy:build_assets',          // 将assets目录中的文件copy到build目录中的assets
    'copy:build_vendor_assets',   // 将vendor的assets copy到build目录中的assets
    'copy:build_vendor_js',       // 将src目录中的js文件copy到build目录中
    'copy:build_jade',            // 将src目录中的非模板的jade文件copy到build目录
    'system_config',
    'copy:build_index_js',
    'copy:build_login_js',
    'index:build',                // 将实际输出目录的scripts,style变量设置到 index.jade 文件中
    'jade:index',                 // 编译 build_dir下的index.jade 为index.html
    'login:build',                // 将实际输出目录的scripts,style变量设置到 login.jade 文件中
    'jade:login',                 // 编译 build_dir下的login.jade 为login.html
    'clean:build_extra',          // 清除build目录多余的文件
    'cleanempty:build',           // 清除build目录中的空目录
    'copy:build_specs',
    'karma_config',               // 准备单元测试(karma-unit.tpl.js -> karma-unit.js)
    //'karma:continuous',           // 执行单元测试
    'clean:specs'                 // 清除build目录多余的单元测试文件
  ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask( 'compile', [
    'clean:deploy',
    'copy:compile_assets',       //将build目录下的assets copy到deploy目录下
    'ngmin',                     //在压缩前标记js文件
    'concat:compile_index_css',  //合并deploy目录中所有的css文件为一个文件
    'concat:compile_login_css',
    'concat:compile_index_js',   //合并js文件
    'concat:compile_login_js',
    'uglify',                    //压缩js文件
    'cssmin:index',              //压缩css文件
    'cssmin:login',
    'login:compile',             // 将实际输出目录的scripts,style变量设置到 login.jade 文件中
    'copy:compile_jade',
    'jade:login2',               // 编译deploy_dir下的login.jade为login.html
    'index:compile',
    'jade:index2',               // 编译deploy_dir下的index.jade为index.html
    'clean:deploy_extra',        // 清除deploy目录多余的文件
    'cleanempty:deploy'          // 清除deploy目录中的空目录
  ]);

  var BuildDir = function(dir){
    this.result = [];
    this.dir = dir;
  };
  BuildDir.prototype = {
    result: [],
    reset: function(){
      this.result = [];
    },
    processPattern: function(pattern){
      //vendor pattern need special process
      if( pattern.indexOf("../vendor") === 0) {
        pattern = pattern.substring(3);
      }
      //if relative to build dir
      if( pattern.indexOf(this.dir) === 0 ) {
        pattern = pattern.substring(this.dir.length);
      }
      if( pattern.indexOf("/") === 0 ) {
        pattern = pattern.substring(1);
      }
      return grunt.file.expand({cwd: this.dir}, pattern);
    },
    processRaw: function(arrayOrPattern){
      if(Array.isArray(arrayOrPattern)){
        arrayOrPattern.forEach(this.processRaw.bind(this));
      }else{
        this.result.push.apply(this.result, this.processPattern(arrayOrPattern));
      }
    }
  };


  /**
   * The index.jade template needs the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */

  grunt.registerMultiTask( 'index', 'Process index.jade template', function () {
    //Expand relative to build dir)
    //
    // JS Files
    //   when build(is array)
    //     vendor_files.js
    //     html2js.lib.dest
    //     html2js.index.dest
    //     html2js.ms_index.dest
    //     index_files.js
    //   when compile(is string)
    //     concat.index.dest
    //CSS File
    //  assets/<%= target.index %>.css
    var bd = new BuildDir(this.data.output);
    bd.processRaw(this.data.styles);
    var styles = bd.result;
    bd.reset();
    bd.processRaw(this.data.scripts);
    var scripts = bd.result;

    grunt.file.copy('../index.jade', this.data.output + '/index.jade', {
      process: function ( contents ) {
        return grunt.template.process( contents, {
          data: {
            scripts: scripts,
            styles: styles,
            sysName: system.title,
            sysApp: system.app
          }
        });
      }
    });
  });

  grunt.registerMultiTask( 'login', 'Process login.jade template', function () {
    var bd = new BuildDir(this.data.output);
    bd.processRaw(this.data.styles);
    var styles = bd.result;
    bd.reset();
    bd.processRaw(this.data.scripts);
    var scripts = bd.result;

    grunt.file.copy('../login.jade', this.data.output + '/login.jade', {
      process: function ( contents ) {
        return grunt.template.process( contents, {
          data: {
            scripts: scripts,
            styles:  styles,
            sysName: system.title,
            sysApp: system.app
          }
        });
      }
    });
  });

  /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
  grunt.registerMultiTask( 'karma_config', 'Process karma config templates', function () {
    var bd = new BuildDir(this.data.output);
    bd.processRaw(this.data.src);
    var scripts = bd.result;
    grunt.file.copy( '../templates/karma-unit.tpl.js', grunt.config( 'build_dir' ) + '/karma-unit.js', {
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: scripts,
            build_dir: grunt.config('build_dir')
          }
        });
      }
    });
  });

  grunt.registerMultiTask( 'system_config', 'Process system config templates', function () {
    grunt.file.copy( '../templates/system-config.tpl.js', grunt.config( 'build_dir' ) + '/lib/system-config.js', {
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            system: system
          }
        });
      }
    });
  });
};
