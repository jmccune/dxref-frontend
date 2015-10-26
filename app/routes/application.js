import Ember from 'ember';
import claimService from 'dxref/adapters/adapter-claimservice';
import pollingService from 'dxref/services/polling-service';

function appInit() {
  console.log("Dxref Initialization Starting...");
  pollingService.addPollable('claimService',claimService.pollableFunction);
  pollingService.poll();
  console.log("Dxref Initialization COMPLETE!");
}


appInit();

export default Ember.Route.extend({
  model: function() {
    return {};
  }
});
