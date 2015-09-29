import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('where/nav-component', 'Integration | Component | where/nav component', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{where/nav-component}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#where/nav-component}}
      template block text
    {{/where/nav-component}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
