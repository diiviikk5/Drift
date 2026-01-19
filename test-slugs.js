const { getAllSlugs } = require('./src/lib/labs/conversions');
const slugs = getAllSlugs();
console.log('Total slugs:', slugs.length);
console.log('First 10:', slugs.slice(0, 10));
