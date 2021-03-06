import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home',{path:'/'});
  this.route('authentication',{path:'/authentication'},function(){
  	this.route('login',{path:'/login'});
  	this.route('create-user',{path:'/create-user'});
  });  
  this.route('content', {path:'/content'},function(){
  	this.route('find', {path:'/find'});
  	this.route('view', {path:'/view/:content_id'});  	
  });
  this.route('about');  
  this.route('layout1');
});

export default Router;
