angular.module('meanhotel')
  .controller('hotelController', hotelController);

function hotelController($window, $route, hotelDataFactory, $routeParams, AuthFactory, jwtHelper) {
  var me = this;
  var id = $routeParams.id;
  hotelDataFactory.displayHotel(id).then(function(response) {
    me.hotel = response;
    me.stars = _getStarRating(response.stars);
  });

function _getStarRating(stars) {
  return new Array(stars);
}

me.addReview = function() {
  var token = jwtHelper.decodeToken($window.sessionStorage.token);
  var userName = token.userName;
  var postData = {
    name: userName,
    rating: me.rating,
    review: me.review
  };
  if(me.reviewForm.$valid){
    hotelDataFactory.postReview(id, postData).then(function(response){
      if(response._id){
        $route.reload();
      }
      else {
        console.log({status: 500, message: 'Failed to create review'});
      }
    }).catch(function(err){
      console.log(err);
    });
  }
  else{
    me.isSubmitted = true;
  }
};
}
