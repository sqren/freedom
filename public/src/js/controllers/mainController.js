freedomApp.controller("MainController", function($scope, $http, $location, facebookService) {
  'use strict';

  // Liste for route changes
  $scope.$on('$routeChangeSuccess', function(next, current) {
    $scope.currentPath = $location.path().substring(1);
  });

  $scope.step = 1;

  $scope.isAndroid = function() {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
  };

  $scope.connectWithFacebook = function() {
    // remove all alerts
    $scope.errorMessage = "";
    $scope.loading = true;

    // get token with access to user_events and user_groups
    facebookService.login(['user_events', 'user_groups', 'user_friends', 'read_friendlists'], function() {
      // extend access token

      $http({
        method: 'POST',
        url: '/users/save-access-token'
      }).success(function(response) {

        $scope.userId = FB.getAuthResponse().userID;
        var secureHash = response.secure_hash;

        // Add success event to GA
        _gaq.push(['_trackEvent', 'facebookLogin', 'success', $scope.userId]);

        // to avoid Google Calendar caching an old feed
        var dummy = Math.floor(Math.random() * 1000);

        // update DOM
        $scope.downloadFeedHref = "webcal://freedom.konscript.com/feed.ics?user_id=" + $scope.userId + '&secure_hash=' + secureHash + '&dummy=' + dummy;
        $scope.googleButtonHref = "http://www.google.com/calendar/render?cid=" + encodeURIComponent($scope.downloadFeedHref);

        // next step
        $scope.step = 2;
        $scope.loading = false;
      });

      // unsuccessful login
    }, function() {
      _gaq.push(['_trackEvent', 'facebookLogin', 'failed']);

      $scope.$apply(function() {
        $scope.errorMessage = "Facebook connect failed";
        $scope.loading = false;
      });
    });
  }; // End of connectWithFacebook function

  $scope.addToCalendarGoogle = function() {
    $scope.step = 3;
    _gaq.push(['_trackEvent', 'addToCalendar', 'google', $scope.userId]);
  };

  $scope.addToCalendarDownload = function() {
    $scope.step = 3;
    _gaq.push(['_trackEvent', 'addToCalendar', 'download', $scope.userId]);
  };

}); // end of WizardController
