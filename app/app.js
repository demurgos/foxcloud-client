/**
* @namespace FSCounterAggregatorApp
*/

(function() {

  // module main declaration
  //require('angular');
  require('angular-ui-codemirror');
  require('./components/modules/ngReallyClickModule');
  require('./components/services/LayoutService');

  angular.module('FSCounterAggregatorApp',[
    'ngRoute',
    'ngResource',
    'ui.bootstrap',
    'daterangepicker',
    'nvd3',
    'datatables',
    'datatables.bootstrap',
    'ui.codemirror',
    'adminLTE',
    'ngReallyClickModule'
  ]);

  // controllers
  require('./components/dashboard/DashboardController');
  require('./components/monitoring/MonitoringController');
  require('./components/settings/CurrentUser');
  require('./components/settings/SettingsSiteItems');
  require('./components/settings/SettingsSiteMembers');
  require('./components/settings/SettingsUsers');
  require('./components/settings/SettingsSites');
  require('./components/settings/SettingsPerSite');
  require('./components/settings/SettingsUsersSites');
  require('./components/settings/SettingsPerUser');

  // directives
  require('./components/dashboard/SideMenu');
  require('./components/topbar/TopBar');
  require('./components/settings/MemberEditor');
  require('./components/settings/SiteEditor');
  require('./components/settings/UserEditor');
  require('./components/settings/UserSiteEditor');
  require('./components/widgets/CalendarPicker');
  require('./components/widgets/GraphKPI');
  require('./components/widgets/heatmap/HeatMapKPI');
  require('./components/widgets/StatBox');
  require('./components/widgets/StatBoxKPI');
  require('./components/widgets/TableKPI');
  require('./components/widgets/UserDashboard');

  // kpis
  require('./components/kpis/KPIMax');
  require('./components/kpis/KPIMaxPeriod');
  require('./components/kpis/KPIMaxSiteRatio');
  require('./components/kpis/KPIMean');
  require('./components/kpis/KPISum');

  angular.module('FSCounterAggregatorApp')
  .controller('KPISumGeneric', require('./components/kpis/KPISumGeneric'))
  .controller('KPISumMax', require('./components/kpis/KPISumMax'))
  .controller('KPIPeriodGeneric', require('./components/kpis/KPIPeriodGeneric'))
  .controller('KPISitesPeriod', require('./components/kpis/KPISitesPeriod'))
  .controller('KPITypicalDay', require('./components/kpis/KPITypicalDay'));

  // filters
  require('./components/pipes/HourFormatPipe');
  require('./components/pipes/SiteNamePipe');

  // Configure routes
  angular.module('FSCounterAggregatorApp').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/dashboard', {
      templateUrl: 'build/html/DashboardView.html',
      controller: 'DashboardController',
      pageName: 'Counters / Sites Overview',
      category: 'Counters'
    }).
    when('/generic', {
      templateUrl: 'build/html/TestView.html',
      controller: 'DashboardController',
      pageName: 'Counters / Generic',
      category: 'Counters'
    }).
	  when('/mydashboard', {
	      templateUrl: 'build/html/MyDashboardView.html',
	      controller: 'DashboardController',
	      pageName: 'Counters / MyDashboard',
	      category: 'Counters'
	  }).
    when('/monitoring', {
      templateUrl: 'build/html/MonitoringView.html',
      controller: 'MonitoringController',
      pageName: 'Monitoring / Sites Overview',
      category: 'Monitoring'
    }).
    when('/current_user', {
      templateUrl: 'build/html/CurrentUserView.html',
      pageName : "My account",
      controller: 'CurrentUser',
      category : "Settings"
    }).
    when('/settings_site_items', {
      templateUrl: 'build/html/SettingsSiteItemsView.html',
      controller: 'SettingsSiteItems',
      pageName : "Site cameras",
      category : "Settings"
    }).
    when('/settings_site_members/:siteId?', {
      templateUrl: 'build/html/SettingsSiteMembersView.html',
      controller: 'SettingsSiteMembers',
      pageName : "Site Members",
      category : "Settings"
    }).
    when('/settings_users', {
      templateUrl: 'build/html/SettingsUsersView.html',
      controller: 'SettingsUsers',
      pageName : "Users management",
      category : "Settings"
    }).
    when('/settings_sites', {
      templateUrl: 'build/html/SettingsSitesView.html',
      controller: 'SettingsSites',
      pageName : "Sites - Users management",
      category : "Settings"
    }).
    when('/settings_per_site/:siteId?', {
      templateUrl: 'build/html/SettingsPerSiteView.html',
      controller: 'SettingsPerSite',
      pageName : "Per Site management",
      category : "Settings"
    }).
    when('/settings_users_sites', {
      templateUrl: 'build/html/SettingsUsersSitesView.html',
      controller: 'SettingsUsersSites',
      pageName : "Users - Sites management",
      category : "Settings"
    }).
    when('/settings_per_user/:userId?', {
      templateUrl: 'build/html/SettingsPerUserView.html',
      controller: 'SettingsPerUser',
      pageName : "Per User management",
      category : "Settings"
    }).
    otherwise({
      redirectTo: '/dashboard'
    });
  }
]);
}());
