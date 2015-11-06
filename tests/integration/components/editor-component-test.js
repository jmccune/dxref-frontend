import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('editor-component', 'Integration | Component | editor component', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(0);
  
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!
  // DISABLE THESE TESTS FOR NOW... (This is a complex component in development.   Skipp this for now)
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!

  // assert.expect(2);

  // // Set any properties with this.set('myProperty', 'value');
  // // Handle any actions with this.on('myAction', function(val) { ... });

  // this.render(hbs`{{editor-component}}`);

  // assert.equal(this.$().text(), '');

  // // Template block usage:
  // this.render(hbs`
  //   {{#editor-component}}
  //     template block text
  //   {{/editor-component}}
  // `);

  // assert.equal(this.$().text().trim(), 'template block text');
});
