export default {
  vuexComputed,
  vuexSimple,
  vuexComputedNamespace,
  licensePlate,
  hexify,
  prettyDate,
  setDefaults,
  moveOrAdd,
  noop,
  range,
  lpFromUrl
};
export function vuexSimple(options, props) {
  const {
    state = {},
    mutations = {},
    actions = {},
    getters = {},
    modules = {}
  } = options;
  const r = { ...options };
  r.state = state;
  r.mutations = mutations;
  r.actions = actions;
  r.getters = getters;
  r.modules = modules;
  Object.entries(props).forEach(([prop, initial]) => {
    state[prop] = initial;
    mutations[prop] =
      mutations[prop] || ((state, value) => (state[prop] = value));
    actions[prop] =
      actions[prop] || (({ commit }, value) => commit(prop, value));
    getters[prop] = getters[prop] || (state => state[prop]);
  });
  return r;
}
export function vuexComputed(...props) {
  return props.reduce((map, prop) => {
    return {
      ...map,
      [prop.replace(/^[^\/]\//, '')]: {
        get() {
          return this.$store.getters[prop];
        },
        set(value) {
          this.$store.dispatch(prop, value);
        }
      }
    };
  }, {});
}
export function vuexComputedNamespace(...props) {
  return props.reduce((map, prop) => {
    return {
      ...map,
      [prop]: {
        get() {
          return this.$store.getters[key(this)];
        },
        set(value) {
          this.$store.dispatch(key(this), value);
        }
      }
    };
    function key({ namespace }) {
      const ns = (namespace && namespace + '/') || '';
      return ns + prop;
    }
  }, {});
}
export function licensePlate() {
  return [alpha(), alpha(), alpha(), '-', numeric(), numeric(), numeric()].join('');
  function alpha() {
    return String.fromCharCode(numeric(90, 65));
  }
  function numeric(max = 9, min = 0) {
    const delta = max + 1 - min;
    return Math.floor(Math.random() * delta + min);
  }
}
export function hexify(text) {
  return btoa(
    text
      .split('')
      .map(s => (s.charCodeAt(0) + 150).toString(16))
      .reverse()
      .join('')
  )
    .split('')
    .reverse()
    .join('');
}
export function prettyDate(date) {
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [all, year, month, day] = /(\d{4})-(\d{2})-(\d{2})T/.exec(date);
  return `${ months[num(month)] } ${ num(day) }, ${ year }` || all;
  function num(text) {
    return text.replace(/^0/, '') * 1;
  }
}
export function setDefaults(props) {
  Object.entries(props).forEach(([key, value]) => {
    const raw = key.replace(/^default_/, '');
    if (key !== raw && !value) {
      // set defaults
      props[key] = props[raw];
      //console.log('setting defaults', key, value, props[raw]);
    }
  });
}
export function moveOrAdd(array, to, item) {
  let r = false;
  if (to > -1) {
    const from = array.indexOf(item);
    const noop = to === from;
    const adjust = from < to && -1 || 0;
    let found;
    if (noop) {
      console.log('to matches from');
    } else {
      if (from === -1) {
        //console.log('external window', id);
        array.splice(to, 0, item);
      } else {
        //console.log('drop had', to, from, adjust, to * 1 + adjust);
        found = array.splice(from, 1)[0];
        array.splice(to * 1 + adjust, 0, found);
      }
      r = true;
      console.log('success');
    }
  } else {
    console.log('no drop before');
  }
  return r;
}
export function noop() {}
export function range(start, stop, step = 1) {
  return Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
}
export function lpFromUrl(url, reg = /[A-Z]{3}\-?[0-9]{3}/i) {
  const lp = (reg.exec(url) || [])[0];
  return lp && normalizeLp(lp);
}
function normalizeLp(lp = '') {
  return lp.replace(/([A-Z]{3})\-?/i, '$1-').toUpperCase();
}
