const { injectBabelPlugin } = require('react-app-rewired');
const rewireSass = require('react-app-rewire-sass');
const rewireLess = require('react-app-rewire-less');
const rewireTypescriptPlugin = require('react-app-rewire-typescript');

module.exports = function override(config, env){
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    config = rewireLess(config, env, {
        modifyVars: { "@primary-color": "#1DA57A" },
    });
    config = rewireTypescriptPlugin(config, env);
    
    return config;
}