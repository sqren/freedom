freedomApp.controller("WizardController", function ($scope, $rootScope) {
  $scope.step = 1;

  $scope.connectWithFacebook = function () {
    // remove all alerts
    $scope.errorMessage = "";
    $scope.loading = true;

    // login with Facebook
    $rootScope.facebookPromise.then(function(data){
      FB.login(function (response) {

        // successful login
        if (response.authResponse) {

          // extend access token
          $.getJSON('/handlers.php?f=saveAccessToken', function (response) {

            var userId = FB.getAuthResponse()['userID'];
            var secureHash = response.secure_hash;

            // Add success event to GA
            _gaq.push(['_trackEvent', 'feedSubmitted', 'success', userId]);

            // to avoid Google Calendar caching an old feed
            var dummy = Math.floor(Math.random() * 1000);

            // update DOM
            $scope.$apply(function(){
              // setup links
              $scope.downloadFeedHref = "webcal://freedom.konscript.com/feed.ics?user_id=" + userId + '&secure_hash=' + secureHash + '&dummy=' + dummy;
              $scope.googleButtonHref = "http://www.google.com/calendar/render?cid=" + encodeURIComponent($scope.downloadFeedHref);

              // next step
              $scope.step = 2;

              $scope.loading = false;
            });
          });

          // unsuccessful login
        } else {
          $scope.$apply(function(){
            $scope.errorMessage = "Facebook connect failed";
          });

          $scope.loading = false;
        }
      }, {
        scope: 'user_events, user_groups'
      });
    });
  }; // End of connectWithFacebook function

}); // end of WizardController
