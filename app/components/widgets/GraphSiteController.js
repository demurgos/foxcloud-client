/*
 * Widget implementation for displaying site data on a graph
 **/

(function() {

    angular.module('FSCounterAggregatorApp').
	controller('GraphSiteController', [ 
	    '$scope', 
	    'WidgetStyleService',
	    'KPI',
	    'DashboardParamsService',
	    function(
		$scope, 
		WidgetStyleService,
		KPI,
		DashboardParamsService
	    ) {
		$scope.widgetId = "GraphSiteWidget";

		$scope.params = DashboardParamsService;

		$scope.siteSelected = undefined; 

		DashboardParamsService.loadParams().then(function() {
		    $scope.siteSelected = $scope.params.sites[0];
		    $scope.update();
		});

		$scope.siteComparisonSelected = undefined;

		$scope.style = undefined;
		$scope.countingChartOptions = undefined;
		$scope.countingChartData = undefined;
		$scope.sparklines = [];

		$scope.indicatorSelected = { id: WidgetStyleService.getDefaultIndicatorId() };

		$scope.rangeSelected = { id: WidgetStyleService.getDefaultRangeId() };

		$scope.periodTimeFormat = WidgetStyleService.getTimeFormat($scope.params.period,
									   $scope.rangeSelected.id);

		$scope.total = 0;

		$scope.toggleSiteComparison = function(open) {
		    $scope.siteComparisonSelected = (open ? ($scope.params.sites[0].id !== $scope.siteSelected.id ? 
							     $scope.params.sites[0] : $scope.params.sites[1]) : undefined);
		};

		$scope.$watch('params.period', function(oldPeriod, newPeriod) {
		    if(newPeriod !== oldPeriod) {
			$scope.update();
		    }
		});

		$scope.$watch('rangeSelected.id', function(oldId, newId) {
		    if(oldId !== newId) {
			$scope.update();
		    }
		});

		$scope.update = function() {

		    KPI.getSiteCountingPeriod({ id: $scope.siteSelected.id,
						period: $scope.params.period,
						groupBy: $scope.rangeSelected.id,
						indicator: $scope.indicatorSelected.id })
		    .then(function(res) {

			$scope.total = res.total;
			$scope.periodTimeFormat = WidgetStyleService.getTimeFormat($scope.params.period,
										   $scope.rangeSelected.id);
			$scope.countingChartData = [
			    { key: WidgetStyleService.getIndicatorName($scope.indicatorSelected.id),
			      values: res.data,
			      area: true } ];
		    });
		};
		
		$scope.createWidget = function() {
		    
		    WidgetStyleService.getStyle($scope.widgetId).
			then(function(data) {
			    $scope.style = data.json;
			    $scope.style.nvd3.chart.xAxis.tickFormat = function(d) {
				return moment(d).format($scope.periodTimeFormat);
			    };
			    $scope.style.nvd3.chart.yAxis.tickFormat = function(d) {
				return d3.format('d')(d);
			    };
			    $scope.style.nvd3.chart.tooltip.headerFormatter = function(d, i) {
				return WidgetStyleService.getRangeTimeFormat($scope.rangeSelected.id)(d, $scope.params.period);
			    };
			    $scope.countingChartOptions = $scope.style.nvd3;
			    $scope.countingChartData = [];
			    
			    //Sparkline charts
			    var sparklineLabels = ["January", "February", "March", "April", "May", "June", "July",
						   "August", "September", "October", "November", "December"];
			    var sparklineOptions = $scope.style.sparkline.options;

			    var sparkline = $scope.sparklines[0];
			    var sparklineData = {
				labels: sparklineLabels,
				datasets: [ angular.extend({}, $scope.style.sparkline.datasets["in"]) ] };
			    sparklineData.datasets[0].data = [1000, 1200, 920, 927, 931, 1027, 819, 930, 1021, 980, 970, 1000];
			    sparkline.Line(sparklineData, sparklineOptions);

			    sparkline = $scope.sparklines[1];
			    sparklineData = {
				labels: sparklineLabels,
				datasets: [ angular.extend({}, $scope.style.sparkline.datasets["in"]) ] };
			    sparklineData.datasets[0].data = [515, 519, 520, 522, 652, 810, 370, 627, 319, 630, 921, 900];
			    sparkline.Line(sparklineData, sparklineOptions);

			    sparkline = $scope.sparklines[2];
			    sparklineData = {
				labels: sparklineLabels,
				datasets: [ angular.extend({}, $scope.style.sparkline.datasets["in"]) ] };
			    sparklineData.datasets[0].data = [400, 423, 478, 410, 412, 510, 576, 580, 600, 605, 610, 607];
			    sparkline.Line(sparklineData, sparklineOptions);
			});		    
		};    
	    }])
    .directive('fcaGraphSite', function() {
	return {
	    link: function(scope, element, attr) {

		scope.sparklines.push(new Chart($(element).find("#sparkline-1").get(0).getContext("2d")));
		scope.sparklines.push(new Chart($(element).find("#sparkline-2").get(0).getContext("2d")));
		scope.sparklines.push(new Chart($(element).find("#sparkline-3").get(0).getContext("2d")));

		scope.createWidget();
	    },
	    templateUrl: 'build/html/GraphSiteView.html'
	};
    });

}());
