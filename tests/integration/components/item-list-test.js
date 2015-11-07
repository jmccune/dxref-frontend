import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import testUtils from 'dxref/tests/helpers/dxref-test-utils';

moduleForComponent('item-list', 'Integration | Component | item list', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  var testData = [
    { "title":"test title A", "description":"test A - description information..."},
    { "title":"test title B", "description":"test B - description #2 information?"}
  ];

  this.set('listInfo',testData);
  this.render(hbs`{{item-list items=listInfo}}`);

  var renderResult = this.$().text();

  var testValues= _.transform(testData,function(result,obj) {
    _.transform(_.values(obj),function(x,str) { result.push(str); });
  });

  assert.ok(testUtils.textAnswerContains(renderResult,testValues));
  

  // Template block usage:
  this.render(hbs`
    {{#item-list items=listInfo as |item|}}
      template block text
      {{item.description}}      
    {{/item-list}}
  `);


  var renderResult2 = this.$().text();


  var tv2 = _.clone(testValues);
  tv2.push('template block text');
  assert.ok(testUtils.textAnswerContains(renderResult2,tv2));
});
