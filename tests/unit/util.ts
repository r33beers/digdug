import * as util from 'src/util';
import * as fs from 'fs';
import * as path from 'path';
import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { EventEmitter } from 'events';

function rmFileAndDir(filename: string) {
	fs.unlinkSync(filename);
	while ((filename = path.dirname(filename)) && filename !== '.') {
		fs.rmdirSync(filename);
	}
}

registerSuite({
	name: 'unit/Tunnel',

	'.fileExists': function () {
		assert.isTrue(util.fileExists('src/Tunnel.ts'));
		assert.isFalse(util.fileExists('src/Tunnel.jsx'));
	},

	'.on': function () {
		const emitter = new EventEmitter();

		let called = false;
		const handle = util.on(emitter, 'foo', function () {
			called = true;
		});
		emitter.emit('foo');
		assert.isTrue(called);
		assert.property(handle, 'destroy');

		handle.destroy();
		called = false;
		emitter.emit('foo');
		assert.isFalse(called);
	},

	'.writeFile': function () {
		const filename = path.join('_a', '_b', 'foo.txt');
		return util.writeFile('foo\n', filename).then(function () {
			try {
				fs.statSync(filename).isFile();
			}
			finally {
				rmFileAndDir(filename);
			}
		});
	}
});
