/**
 * @class SettingsPerSite
 * @memberof FSCounterAggregatorApp
 * @description Controller that manages single site
 * require administrator rights
 */
(function() {

    angular.module('FSCounterAggregatorApp')
	.controller('SettingsPerSite', [
	    '$scope',
	    '$compile',
	    '$routeParams',
	    'SiteService',
	    'DTOptionsBuilder',
	    'DTColumnDefBuilder',
	    function(
		$scope,
		$compile,
		$routeParams,
		SiteService,
		DTOptionsBuilder,
		DTColumnDefBuilder
	    ) {

		var SiteResources = SiteService.getResource();

		$scope.users = [];
		$scope.usersadmin = [];		

		$scope.selectAll = false;
		$scope.selectedLength = 0;
		$scope.selectedElts = {};
		$scope.selectedElt = undefined;
		$scope.user = undefined;
		
		$scope.dtOptions = DTOptionsBuilder.newOptions();
		
		$scope.dtColumnDefs = [
		    DTColumnDefBuilder.newColumnDef(0).notSortable(),
		    DTColumnDefBuilder.newColumnDef(1)
		];

		$scope.toggleAll = function() {
		    $scope.selectAll = !$scope.selectAll;
		    for(var key in $scope.selectedElts) {
			$scope.selectedElts[key].selected = $scope.selectAll;
		    }
		    $scope.selectedLength = $scope.selectAll ? $scope.users.length + $scope.usersadmin.length : 0;
		};

		$scope.toggleOne = function(id) {
		    if($scope.selectedElts[id].selected) {
			$scope.selectedLength++;
			$scope.selectAll = $scope.selectedLength == ($scope.users.length + $scope.usersadmin.length);
		    } else {
			$scope.selectedLength--;
			$scope.selectAll = false;
		    }
		};

		$scope.selectElt = function(elt) {
		    $scope.selectedElt = elt;
		    $scope.update();
		};

		$scope.addUser = function() {
		    $scope.isNewUser = true;
		    $scope.user = { site: $scope.selectedElt,
				    email: "",
				    isAdmin: true };
		};

		$scope.editUser = function(user) {
		    $scope.isNewUser = false;
		    $scope.user = user;
		};

		$scope.clearUser = function() {
		    $scope.user = undefined;
		};

		$scope.saveUser = function() {
		    if($scope.isNewUser) {
			SiteService.addUser($scope.selectedElt._id,
					    $scope.user.email,
					    $scope.user.isAdmin)
			    .then(function(ret) {
				if($scope.user.isAdmin) {
				    $scope.usersadmin.push($scope.user.email);
				} else {
				    $scope.users.push($scope.user.email);
				}
				$scope.selectedElts[$scope.email] = { selected: false,
								      isAdmin: $scope.user.isAdmin };
				$scope.selectAll = $scope.selectedLength == ($scope.users.length + $scope.usersadmin.length);
			    });
		    } else {
			// backend
		    }
		};
		
		$scope.update = function() {
		    var i;
		    $scope.users = $scope.selectedElt.users;
		    $scope.usersadmin = $scope.selectedElt.usersadmin;
		    $scope.selectedElts = {};
		    $scope.selectedLength = 0;
		    $scope.selectAll = false;
		    for(i = 0; i < $scope.users.length; ++i) {
			$scope.selectedElts[$scope.users[i]] = { selected: false,
							         isAdmin: false };
		    }
		    for(i = 0; i < $scope.usersadmin.length; ++i) {
			$scope.selectedElts[$scope.usersadmin[i]] = { selected: false,
								      isAdmin: true };
		    }		    
		};

		$scope.removeUser = function(user, isAdmin) {
		    SiteService.removeUser($scope.selectedElt._id, user.email, isAdmin ? true : false)
			.then(function(ret) {
			    removeUserFromArray(user);
			});
		};

		$scope.removeSelectedUsers = function() {
		    for(var key in $scope.selectedElts) {
			if($scope.selectedElts[key].selected) {
			    $scope.removeUser($scope.selectedElts[key].user, $scope.selectedElts[key].isAdmin);
			}
		    }
		};		

		function removeUserFromArray(user) {                                    
		    var pos = $scope.users.indexOf(user);
		    if(pos != -1) {
			$scope.users.splice(pos, 1);
		    } else {
			pos = $scope.usersadmin.indexOf(user);
			$scope.usersadmin.splice(pos, 1);
		    }
		    var sel = $scope.selectedElts[user.email];
		    if(sel.selected) {
			$scope.selectedLength--;
		    }
		    sel = undefined;
		    $scope.selectAll = $scope.selectedLength == ($scope.users.length + $scope.usersadmin.length);
		}
		
		function initScope()
		{
		    $scope.sites = SiteResources.query(function () {
			if($scope.sites.length > 0) {
			    if($routeParams.siteId === undefined) {
				$scope.selectedElt = $scope.sites[0];
			    } else {
				for(var i = 0; i < $scope.sites.length; ++i) {
				    if($scope.sites[i]._id === $routeParams.siteId) {
					$scope.selectedElt = $scope.sites[i];
					break;
				    }
				}
			    }
			    $scope.update();
			}					
		    });
		}
		
		initScope();

	    }]);
})();
