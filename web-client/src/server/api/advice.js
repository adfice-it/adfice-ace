const fetch = require('node-fetch');
module.exports = ({ query: { id } }, res) => {
  (async () => {
    try {
      console.log('trying api...', id);
      const response = await fetch(`https://adfice.openelectronicslab.org/advice?id=${ id }`);
      const json = await response.json();
      console.log('api success', id);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(json);
    }
    catch (ex) {
      console.error(ex.message);
    }
  })();
};
