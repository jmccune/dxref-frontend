import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testUtils from 'dxref/tests/helpers/dxref-test-utils';

moduleForComponent('item-list', 'Integration | Component | item list', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  var testData = [
    { "title":"test title A", "description":"test A - description information..."},
    { "title":"test title B", "description":"test B - description #2 information?"}
  ];

  this.set('listInfo',testData);
  this.render(hbs`{{item-list items=listInfo}}`);

  var renderResult = this.$().text();


  assert.ok(testUtils.textAnswerContains(renderResult,["test title A"]));
  

  // // Template block usage:
  // this.render(hbs`
  //   {{#item-list}}
  //     template block text
  //   {{/item-list}}
  // `);

  // assert.equal(this.$().text().trim(), 'template block text');
});
