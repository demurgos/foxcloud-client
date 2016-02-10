/**
 * @class ComputeService
 * @memberOf FSCounterAggregatorApp
 * @description A set of numerical methods
 */
(function() {

 angular.module('FSCounterAggregatorApp').service('ComputeService', function() {

     var that = this;

     this.NSEC_15MIN = 900;
     this.NSEC_HOUR = 3600;
     this.NSEC_DAY = 86400;
     this.NSEC_WEEK = 604800;

     this.rangeFunc = { 
	 '15min': { 
	     init: function(date) {
		 return date.minute(Math.floor(date.minute() / 15) * 15);
	     },
	     step: function(date) { 
		 return date.add(15,"m"); 
	     },
	     dist: function(date, dateStart) {
		 return that.getTimeIndex(date.unix(),
					  dateStart.unix(),
					  that.NSEC_15MIN);
	     }},
	 'hours': { 
	     init: function(date) {
		 return date.minute(0);
	     },
	     step: function(date) { return date.add(1, "h"); },
	     dist: function(date, dateStart) {
		 return that.getTimeIndex(date.unix(),
					  dateStart.unix(),
					  that.NSEC_HOUR);
	     }},
	 'days': { 
	     init: function(date) {
		 return date.minute(0).hour(0);
	     },
	     step: function(date) { return date.add(1, "d"); },
	     dist: function(date, dateStart) {
		 return that.getTimeIndex(date.unix(),
					  dateStart.unix(),
					  that.NSEC_DAY);
	     }},
	 'week': { 
	     init: function(date) {
		 return date.day(1);
	     },
	     step: function(date) { return date.add(1, "w"); },
	     dist: function(date, dateStart) {
		 return that.getTimeIndex(date.unix(),
					  dateStart.unix(),
					  that.NSEC_WEEK);
	     }},
	 'month': { 
	     init: function(date) {
		 return date.date(1);
	     },
	     step: function(date) { return date.add(1,"M"); },
	     dist: function(date, dateStart) {
		 //return date.diff(dateStart, "months");
		 return (date.year()*12 + date.month()) - 
		     (dateStart.year()*12 + dateStart.month());
	     }}
     };

     /**
      * @function getTimeIndex
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description returns the number of step interval between 2 values
      */
     this.getTimeIndex = function(time, timeStart, step) {
	 return Math.floor((time - timeStart) / step);
     };    

     /**
      * @function getTimeIterator
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description returns the function with iterate over a specific time range
      */
     this.getTimeIterator = function(step) {
	 return this.rangeFunc[step].step;
     };

     /**
      * @function createTimeIndex
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description returns an array of index elements for a period range
      */
     this.createTimeIndex = function(period, initFunc, stepFunc, idxFuncValue) {
	 var index = [];
	 var ts = initFunc(period.startDate.clone());
	 for(var i = 0; ts.unix() < period.endDate.unix(); ++i) {
	     index.push({ x: ts.clone(), y: idxFuncValue(i, ts) });
	     ts = stepFunc(ts);
	 }
	 return index;
     };

     /**
      * @function fillIndex
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description create new index
      */
     this.fillIndex = function(data, index, idxFunc) {
	 for(var i = 0; i < data.length; ++i) {
	     var idx = idxFunc(data[i]);
	     if(idx !== undefined && 
		idx >= 0 &&
		idx < index.length) {
		 if(index[idx].y === undefined) {
		     index[idx].y = [ i ];
		 } else {
		     index[idx].y.push(i);
		 }
	     }
	 }
	 return index;
     };

     /**
      * @function aggregate
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description generic function to merge data regarding indexes list
      */
     this.aggregate = function(data, index, cumulFunc) {
	 var res = [];
	 for(var i = 0; i < index.length; ++i) {
	     var curIndex = index[i];
	     var cumul = { x: curIndex.x, y: cumulFunc() };
	     if(curIndex.y !== undefined) {
		 for(var j = 0; j < curIndex.y.length; ++j) {
		     cumul.y = cumulFunc(data[curIndex.y[j]], cumul.y);
		 }
	     }
	     res.push(cumul);
	 }
	 return res;
     };    

     /**
      * @function split
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description transpose a javascript array into a javascript object
      */
     this.split = function(data) {
	 var res = {};
	 for(var i = 0; i < data.length; ++i) {
	     for(var key in data[i]) {
		 if(res.key === undefined) {
		     res.key = [ data[i].key ];
		 } else {
		     res.push(data[i].key);
		 }
	     }
	 }
	 return res;
     };

     /**
      * @function merge
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description transpose a javascript object into a javascript array
      */
     this.merge = function(data) {
     };

     /**
      * @function IdentityFunc
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description f(x) = x
      */
     this.identityFunc = function(x) {
	 return x;
     };

     
     /**
      * @function cSum
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description Simply returns the sum off all elements in a array
      */
     this.cSum = function(data, fsum) {
	 var s = 0;
	 for(var i = 0; i < data.length; ++i) {
	     s += fsum(data[i]);
	 }
	 return s;
     };

     /**
      * @function cSumForPeriod
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description aggregate data on a period grouped by step duration
      */
     this.cSumForPeriod = function(data, period, step, id) {
	 
	 var that = this;

	 var timeIndex = this.createTimeIndex(period,
					      that.rangeFunc[step].init,
					      that.rangeFunc[step].step,
					      function() { return undefined; });
	 timeIndex = this.fillIndex(data,
				    timeIndex,
				    function(elt) {
					return that.rangeFunc[step].dist(
					    moment(elt.time*1000), period.startDate);
				    }
				   );
	 var tdata = this.aggregate(data, 
				    timeIndex,
				    function(elt, curCumul) {
					return curCumul !== undefined ? 
					    curCumul + elt[id] : 0;
				    });
	 return tdata;
     };

 });

}());
