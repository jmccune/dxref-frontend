import Ember from 'ember';

var dynamic_user = false;

export default Ember.Route.extend({
  model: function () {
    var defaultUser = {
      user: {name: {first: "cody", last: "hudson", title: "mr."}}
    };

    if (dynamic_user) {
      return new Ember.RSVP.Promise(function (resolve, reject) {
        $.ajax({
          url: 'http://api.randomuser.me/',
          dataType: 'json',
          success: function (data) {
            resolve(data.results[0]);
          }
        }).fail(function () {
          console.log("*** ERROR>> unable to load username-- using default fallback");
          resolve(defaultUser);
        });
      });
    }


    return defaultUser;
  }
});
