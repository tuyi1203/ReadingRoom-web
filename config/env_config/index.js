let env;
switch (process.argv[2]) {
    case 'dev':
        env = require('./dev');
        break;

    case 'production':
        env = require('./prod');
        break;

    case 'test':
        env = require('./test');
        break;

    case 'demo':
        env = require('./demo');
        break;

    default:
        env = require('./dev');
}

module.exports = JSON.stringify(env);