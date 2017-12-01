import * as ua from 'universal-analytics';

const keys = require('../keys.json');

const visitor = ua(keys.ganalytics);
export default visitor;
