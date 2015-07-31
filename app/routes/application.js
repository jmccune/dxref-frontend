import Ember from 'ember';
import claimService from 'dxref/adapters/adapter-claimservice';
import pollingService from 'dxref/services/polling-service';

var dynamic_user = false;

function appInit() {
  console.log("Dxref Initialization Starting...");
  pollingService.addPollable('claimService',claimService.pollableFunction);
  pollingService.poll();
  console.log("Dxref Initialization COMPLETE!");
}


appInit();

export default Ember.Route.extend({
  model: function () {
    var defaultUser = {
      user: {name: {first: "cody", last: "hudson", title: "mr."}}
    };

    if (dynamic_user) {
      return new Ember.RSVP.Promise(function (resolve) {
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
