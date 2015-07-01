import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home',{path:'/'});
  this.route('about');  
  this.route('layout1');
});

export default Router;
