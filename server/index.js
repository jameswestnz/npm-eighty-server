module.exports.register = register
module.exports.register.attributes = {
  name: 'eighty',
  dependencies: ['h2o2', 'inert']
}

var
  // modules

  // local
  getState          = require('./utils/get-state'),
  getApi            = require('./utils/get-api'),
  getRoute          = require('./utils/get-route.js')
;

function register(server, options, next) {
  var state = getState(options);
  var api = getApi(state);

  // expose the api for events and access to options
  server.expose('api', api)

  // only apply routes as we start the server so we can wait for events to be bound
  server.ext('onPreStart', function(server, next) {
    // connect apps
    Object.keys(api.options.apps).map(function(key) {
      var app = api.options.apps[key]
      var route = getRoute.call(state, key, app, server)
      server.route(route);
      state.emitter.emit.call(this, 'app:connect', key, app);
      return route
    })

    next();
  });

  next();
}