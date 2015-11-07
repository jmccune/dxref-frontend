import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testUtils from 'dxref/tests/helpers/dxref-test-utils';
import PagedItems from 'dxref/models/paged-items';

moduleForComponent('paging-component', 'Integration | Component | paging component', {
  integration: true
});

test('it render no results correctly', function(assert) {
  assert.expect(1);

  // // Set any properties with this.set('myProperty', 'value');


  var noPagedItems = {
    pageNum: 0,
    pageSize: 0,
    numResults: 0
  };

  this.set('pageInfo',noPagedItems);

  this.render(hbs`{{paging-component pagingInfo=pageInfo}}`);

  var result=this.$().html();
  var expectedResults = [`<span class="page-indexes"> No Results. </span>`];

  assert.ok(testUtils.textContains(result,expectedResults,true));

});


test('it render paging results correctly', function(assert) {
  assert.expect(1);

  // // Set any properties with this.set('myProperty', 'value');


  var pagingInfo = {
    pageNum: 2,
    pageSize: 10,
    numResults: 54321,
    items:[]
  };

  pagingInfo = new PagedItems(pagingInfo);
  pagingInfo = pagingInfo.adaptForComponent("x","y");

  console.log("PAGINGINFO. startindex: "+pagingInfo.startIndex);
  this.set('pageInfo',pagingInfo);
  this.render(hbs`{{paging-component pagingInfo=pageInfo}}`);


  var result=this.$().html();
  var expectedResults =[`<span class="page-indexes"> Showing Results: 21 to 30 &nbsp;  of  &nbsp; 54321 </span>`,
  `</button> Page: 3 <button`];

  assert.ok(testUtils.textContains(result,expectedResults,true));

});