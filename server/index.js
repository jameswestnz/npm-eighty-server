module.exports.register = register
module.exports.register.attributes = {
  name: 'eighty',
  connections: false
}

var
  // modules

  // local
  getOptions        = require('./options'),
  getState          = require('./state'),
  getApi            = require('./api')
;

function register(server, options, next) {
  var options = getOptions(options);
  var state = getState(server);
  var api = getApi(state, options);

  Object.keys(api.options.servers).map(function(name) {
    var server = api.options.servers[name]
    api.servers.add(name, server.name, server.listen, server.locations);
  });

  // expose the api for events and access to options
  server.expose('api', api)

  next();
}
