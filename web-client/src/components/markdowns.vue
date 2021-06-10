<script>
import { h } from 'vue';
import { markdown } from 'markdown';
export default {
  name: 'markdowns',
  props: {
    items: {
      type: Array,
      required: true
    },
    replacer: {
      type: Function,
      default: html => html
    }
  },
  render() {
    // using a render function instead of a template because of the need to produce html and escape lt and gt
    const { items, replacer } = this;
    return h('div', {
      className: 'markdowns',
      innerHTML: items.map(text => `
      <div class="markdown">
        ${ replacer(markdown.toHTML((text || '').replace(/\</g, '&lt;').replace(/\>/g, '&gt;'))) }
      </div>`).join(' ')
    });
  }
};
</script>
<style scoped lang="scss">
.markdowns {
  display: inline-block;
  .markdown {
    display: inline-block;
  }
}
</style>