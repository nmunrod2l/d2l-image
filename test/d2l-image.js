/* global describe, it, beforeEach, afterEach, fixture, expect, sinon */

'use strict';

describe('<d2l-image>', function() {
	var server,
		widget;

	beforeEach(function() {
		server = sinon.fakeServer.create();
		server.respondImmediately = true;
		widget = fixture('d2l-image-fixture');
	});

	afterEach(function() {
		server.restore();
	});

	it('loads element', function() {
		expect(widget).to.exist;
	});

	describe('Hypermedia calls', function() {
		it('should not send a request without an auth token', function() {
			var sent = false;
			server.respondWith(
				'GET',
				widget.imageUrl,
				function(req) {
					sent = true;
					req.respond(200);
				});
			widget._onImageUrlChange();
			expect(sent).to.equal(false);
		});

		it('should send a request with an auth token', function(done) {
			var spy = sinon.spy(widget, '_onImageUrlChange');
			var authToken = 'My token';
			widget.token = authToken;
			server.respondWith(
				'GET',
				widget.imageUrl,
				function(req) {
					expect(req.requestHeaders['authorization']).to.equal('Bearer ' + authToken);
					req.respond(200);
					done();
				});

			widget.imageUrl = 'test123';
			expect(spy.called);
		});
	});
});
