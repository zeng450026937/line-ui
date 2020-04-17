// module.exports = (data) => data;
/* eslint-disable-next-line */
const i18n = __I18N_RUNTIME__;
console.log('i18n', i18n);

module.exports = (key) => {
  console.log(`key: ${key}, value: ${i18n[key]}`);
  return key;
};
