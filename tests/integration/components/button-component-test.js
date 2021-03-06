import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('button-component', 'Integration | Component | button component', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{button-component text="prev" isEnabled=false action="prevPage"}}`);

  assert.equal(this.$().text(), 'prev');

  // NO CURRENT BLOCK USE-CASE FOR THIS COMPONENT.

  // Template block usage:
  // this.render(hbs`
  //   {{#button-component}}
  //     template block text
  //   {{/button-component}}
  // `);

  // assert.equal(this.$().text().trim(), 'template block text');
});
