const assert = require('assert');
const augumentApp = require('../index'); // The module under test

describe('augumentApp', function () {

    let app;

    beforeEach(function () {
        app = {
            listen: function () { }
        };
    })

    it('should add an sRoute method to the app', function () {
        augumentApp(app);
        assert.ok(app.sRoute);
        assert.equal(typeof app.sRoute, 'function');
    });

    it('should override listen method', function () {
        const originalListen = app.listen;
        augumentApp(app);
        assert.notEqual(app.listen, originalListen);
    });

    it('should call original listen method', function () {
        let originalCalled = false;

        const originalListen = app.listen;

        app.listen = function () {
            originalCalled = true;
            return {
                on: () => { }
            };
        };

        augumentApp(app);

        app.listen();

        assert(originalCalled);
    });

    // Could test other aspects like:
    // - handler functions are called properly
    // - websocket upgrade event handled correctly
    // - route params parsed properly
    // etc

});
