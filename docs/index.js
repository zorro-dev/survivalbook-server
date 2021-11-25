const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const user = require('./infos/user');
const forum = require('./infos/forum');

module.exports = {
    ...basicInfo,
    ...servers,
    ...components,
    ...tags,
    paths : {
        ...user,
        ...forum
    }
};