/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  system: {
    "app":     "Monitor",
    "name":    "server",
    "title":   "Server",
    "label":   "监控服务器",
    "version": "1.2.0-SNAPSHOT",
    "index":   "monitor-server-index-1.2.0-SNAPSHOT",
    "login":   "monitor-server-login-1.2.0-SNAPSHOT",
    "skin" :   "skin-1",
    "defaultUser" : "admin",
    "defaultPassword" : "secret",
    "builtAt" : "2015-02-15 13:27:08"
  },
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: '../../build',
  deploy_dir: '../../deploy',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  index_files: {
    js: [ 'lib/**/*.js', 'index/**/*.js', 'server/index/**/*.js', '!**/*.spec.js' , 'resources/**/*.js'],
    jade: [ 'lib/**/*.jade', 'index/**/*.jade', 'server/index/**/*.jade', '!**/*.tpl.jade', 'resources/**/*.jade'],
    js_unit: [ 'lib/**/*.spec.js', 'index/**/*.spec.js', 'server/index/**/*.spec.js', 'resources/**/*.spec.js'],

    coffee: [ 'lib/**/*.coffee', 'index/**/*.coffee', 'server/index/**/*.coffee', '!**/*.spec.coffee', 'resources/**/*.coffee' ],
    coffee_unit: [ 'lib/**/*.spec.coffee', 'index/**/*.spec.coffee', 'server/index/**/*.spec.coffee', 'resources/**/*.spec.coffee'],

    lib_tpl: [ 'lib/**/*.tpl.html', 'lib/**/*.tpl.jade' ],
    index_tpl: [ 'index/**/*.tpl.html', 'index/**/*.tpl.jade' ],
    ms_tpl: [ 'server/index/**/*.tpl.html', 'server/index/**/*.tpl.jade', 'server/index/**/*.jade' ],
    general_tpl: [], // general_tpl is used in msp and msu, but here must identify an empty variable to run grunt successful
    resources_tpl: ['resources/**/*.jade'],
    credentials_tpl: ['credentials/**/*.jade'],

    less: 'less/index.less'
  },

  login_files: {
    js: [ 'lib/**/*.js', 'login/**/*.js', 'server/login/**/*.js', '!**/*.spec.js'],
    jade: [ 'lib/**/*.jade', 'login/**/*.jade', 'server/login/**/*.jade', '!**/*.tpl.jade'],
    js_unit: [ 'lib/**/*.spec.js', 'login/**/*.spec.js', 'server/login/**/*.spec.js'],

    coffee: [ 'lib/**/*.coffee', 'login/**/*.coffee', 'server/login/**/*.coffee', '!**/*.spec.coffee' ],
    coffee_unit: [ 'lib/**/*.spec.coffee', 'login/**/*.spec.coffee', 'server/login/**/*.spec.coffee'],

    lib_tpl: [ 'lib/**/*.tpl.html', 'lib/**/*.tpl.jade' ],
    login_tpl: [ 'login/**/*.tpl.html', 'login/**/*.tpl.jade' ],
    ms_tpl: [ 'server/login/**/*.tpl.html', 'server/login/**/*.tpl.jade' ],
    general_tpl: [], // general_tpl is used in msp and msu, but here must identify an empty variable to run grunt successful
    resources_tpl: [],
    credentials_tpl: [],

    less: 'less/login.less'
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
      '../vendor/angular-mocks/angular-mocks.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      '../vendor/jquery/dist/jquery.js',
      '../vendor/jquery-ui/jquery-ui.js',
      '../vendor/jquery-layout/dist/jquery-layout.js',
      '../vendor/angular/angular.js',
      '../vendor/datatables/jquery.dataTables.js',
      '../vendor/datatables/datatables.directive.js',
      '../vendor/angular-resource/angular-resource.js',
      '../vendor/angular-route/angular-route.js',
      '../vendor/angular-animate/angular-animate.js',
      '../vendor/angular-sanitize/angular-sanitize.js',
      '../vendor/bootstrap/dist/js/bootstrap.js',
      '../vendor/angular-bootstrap/ui-bootstrap-tpls.js',
//    '../vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
      '../vendor/angular-ui-router/release/angular-ui-router.js',
      '../vendor/angular-ui-router/release/ct-ui-router-extras.js',
      '../vendor/angular-ui-utils/modules/route/route.js',
      '../vendor/fuelux/dist/js/fuelux.js',
      '../vendor/ace-bootstrap/js/ace.js',
      '../vendor/ace-bootstrap/js/ace-elements.js',
      '../vendor/ace-bootstrap/js/ace-extra.js',
      '../vendor/ace-bootstrap/js/jquery.raty.js',
      '../vendor/typehead.js/bs2/typeahead-bs2.js',
      '../vendor/ng-table/ng-table.js',
      '../vendor/angular-infinite-scroll/ng-infinite-scroll.js',
      '../vendor/angular-ui-tree/dist/angular-ui-tree.js',
      '../vendor/angular-dialog-service/dialogs.js',
      '../vendor/angular-dialog-service/dialogs-default-translations.js',
      '../vendor/angular-translate/angular-translate.js',
      '../vendor/angular-auto-validate/dist/jcs-auto-validate.js',
      '../vendor/select2/select2.js',
      '../vendor/isteven-angular-multiselect/angular-multi-select.js',
      '../vendor/qunee/demos/lib/qunee-min.js',
      '../vendor/qunee/demos/js/common.js',
      // Add angular mock in runtime for SLA demo temporally
      '../vendor/angular-tabs/tabs.js',
      '../vendor/angular-ztree/jquery.ztree.all-3.5.js',
      '../vendor/angular-ztree/angular-ztree.js',
      '../vendor/checklist-model/checklist-model.js',
      '../vendor/twaver/lib/*.js',
      '../vendor/echarts/dist/*.js',
      '../vendor/sockjs-client/dist/sockjs.js'
      // Add angular mock in runtime for SLA demo temporally
      //'../vendor/angular-mocks/angular-mocks.js'
    ],
    css: [
//    '../vendor/angular/angular-csp.css',
      '../vendor/angular/angular.css',
      '../vendor/angular-animate/animate.css',
      '../vendor/jquery-ui/themes/excite-bike/jquery-ui.css',
      '../vendor/chart/css/echartsMain.css',
      '../vendor/bootstrap/dist/css/bootstrap-theme.css',
      '../vendor/ace-bootstrap/css/*.css',
      '../vendor/angular-dialog-service/dialogs.css',
      '../vendor/angular-ui-tree/dist/angular-ui-tree.min.css',
      '../vendor/ng-table/ng-table.css',
      '../vendor/select2/select2.css',
      '../vendor/isteven-angular-multiselect/angular-multi-select.css',
      '../vendor/angular-ztree/css/zTreeStyle/zTreeStyle.css',
      '../vendor/qunee/demos/qunee.css',
      '../vendor/twaver/demo/css/twaver.css',
      '../vendor/jquery-layout/css/*.css',
      '../vendor/datatables/css/jquery.dataTables.css',
      '../vendor/datatables/style/datatable.css'
//    '../vendor/fuelux/dist/css/fuelux.css'
    ],
    built_css: [
      '<%= build_dir %>/assets/angular.css',
      '<%= build_dir %>/assets/animate.css',
      '<%= build_dir %>/assets/jquery-ui.css',
      '<%= build_dir %>/assets/echartsMain.css',
      '<%= build_dir %>/assets/bootstrap-theme.css',
      '<%= build_dir %>/assets/ace*.css',
      '<%= build_dir %>/assets/ng-grid.css',
      '<%= build_dir %>/assets/dialogs.css',
      '<%= build_dir %>/assets/angular-ui-tree.min.css',
      '<%= build_dir %>/assets/ng-table.css',
      '<%= build_dir %>/assets/select2.css',
      '<%= build_dir %>/assets/angular-multi-select.css',
      '<%= build_dir %>/assets/zTreeStyle.css',
      '<%= build_dir %>/assets/qunee.css',
      '<%= build_dir %>/assets/twaver.css',
      '<%= build_dir %>/assets/jquery-layout*.css',
      '<%= build_dir %>/assets/jquery.dataTables.css',
      '<%= build_dir %>/assets/datatable.css'
    ],

    assets: [
      '../vendor/font-awesome/fonts/*.*',
      '../vendor/bootstrap/dist/fonts/*.*',
      '../vendor/bootstrap/dist/css/bootstrap-theme.css.map',
      '../vendor/ace-bootstrap/fonts/font1.woff',
      '../vendor/ace-bootstrap/fonts/font2.woff',
      '../vendor/ace-bootstrap/images/*.*',
      '../vendor/ace-bootstrap/avatars/*.*',
      '../vendor/ace-bootstrap/images/gallery/*.jpg',
      '../vendor/select2/*.png',
      '../vendor/select2/*.gif',
      '../vendor/angular-ztree/css/zTreeStyle/img/*.*',
      '../vendor/angular-ztree/css/zTreeStyle/img/diy/*.*',
      '../vendor/qunee/demos/images/*.*',
      '../vendor/twaver/images/*/*.*',
      '../vendor/jquery-layout/img/*.*',
      '../vendor/datatables/images/*.*'
//    '../vendor/fuelux/dist/fonts/fuelux.*'
    ]
  }
};