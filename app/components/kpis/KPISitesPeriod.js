/**
 * @class KPISitesPeriod
 * @memberOf FSCounterAggregatorApp
 * @description Compute the sum of data for each range within a period of time
 */
(function() {
    
    angular.module('FSCounterAggregatorApp').
	controller('KPISitesPeriod', [ 
	    "ComputeService",	    
	    function(
		ComputeService
	    ) {

		this.options = {

		    ranges: [
			{ id: '15min', name: 'Minutes' },
			{ id: 'hours', name: 'Hours' },
			{ id: 'days', name: 'Days' },
			{ id: 'week', name: 'Week' },
			{ id: 'month', name: 'Month' }
		    ],
		    
		    indicators: [
			{ id: 'in', name: 'In' },
			{ id: 'out', name: 'Out' }
		    ],
		    
		    defaultIndicatorId: 'in',
		    
		    defaultRangeId: 'hours',

		    getLabel: function(id) {
			return id;
		    }
		};

		/**
		 * @function compute
		 * @memberOf FSCounterAggregatorApp.KPISitesPeriod
		 * @description Compute the sum of data for each range within a period of time
		 */
		this.compute = function(query) {

		    var res = { 
			query: query,
			data: undefined,
			value: 0
		    };
				
		    res.data = ComputeService.cSumForPeriod(query.data,
							    query.period,
							    query.groupBy,
							    query.indicator);
		    res.value = ComputeService.cSum(res.data, function(elt) { return elt.y; });

		    return res;
		};
		
	    }]);
}());