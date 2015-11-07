import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testUtils from 'dxref/tests/helpers/dxref-test-utils';


moduleForComponent('paging-component', 'Integration | Component | paging component', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // // Set any properties with this.set('myProperty', 'value');


  var noPagedItems = {
    pageNum: 0,
    pageSize: 0,
    numResults: 0,
    items:[]
  };

  this.set('pageInfo',noPagedItems);

  this.render(hbs`{{paging-component pagingInfo=pageInfo}}`);

  var result=this.$().html();
  var expectedResult =`<span class="page-indexes"> No Results. </span>`;


  assert.ok(testUtils.textContains(result,[expectedResult],true));

  // // Handle any actions with this.on('myAction', function(val) { ... });

  // this.render(hbs`{{paging-component}}`);

  // assert.equal(this.$().text(), '');

  // // Template block usage:
  // this.render(hbs`
  //   {{#paging-component}}
  //     template block text
  //   {{/paging-component}}
  // `);

  // assert.equal(this.$().text().trim(), 'template block text');
});
