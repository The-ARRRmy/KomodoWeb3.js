const KomodoWeb3 = require('./komodoweb3');
const Utils = require('./utils');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.KomodoWeb3 === 'undefined') {
  window.KomodoWeb3 = KomodoWeb3;
}

module.exports = {
  KomodoWeb3,
  Utils,
};
