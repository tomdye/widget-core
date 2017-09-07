import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { stub, SinonStub } from 'sinon';
import NodeHandler, { Type } from '../../src/NodeHandler';

const elementStub: SinonStub = stub();
const widgetStub: SinonStub = stub();
const projectorStub: SinonStub = stub();
let nodeHandler: NodeHandler;
let element: Element;

registerSuite({
	name: 'NodeHandler',
	beforeEach() {
		nodeHandler = new NodeHandler();
		element = document.createElement('div');
	},
	'add populates nodehandler map'() {
		nodeHandler.add(element, { key: 'foo' });
		assert.isTrue(nodeHandler.has('foo'));
	},
	'has returns undefined when element does not exist'() {
		assert.isFalse(nodeHandler.has('foo'));
	},
	'get returns elements that have been added'() {
		nodeHandler.add(element, { key: 'foo' });
		assert.equal(nodeHandler.get('foo'), element);
	},
	'events': {
		beforeEach() {
			elementStub.reset();
			widgetStub.reset();
			projectorStub.reset();

			nodeHandler.on('foo', elementStub);
			nodeHandler.on(Type.Widget, widgetStub);
			nodeHandler.on(Type.Projector, projectorStub);
		},
		'add emits event when element added'() {
			nodeHandler.add(element, { key: 'foo' });

			assert.isTrue(elementStub.calledOnce);
			assert.isTrue(widgetStub.notCalled);
			assert.isTrue(projectorStub.notCalled);
		},
		'add root emits Widget and element event'() {
			nodeHandler.addRoot(element, { key: 'foo' });

			assert.isTrue(widgetStub.calledOnce);
			assert.isTrue(elementStub.calledOnce);
			assert.isTrue(projectorStub.notCalled);
		},
		'add projector emits Projector, Widget and element event'() {
			nodeHandler.addProjector(element, { key: 'foo' });

			assert.isTrue(widgetStub.notCalled);
			assert.isTrue(elementStub.calledOnce);
			assert.isTrue(projectorStub.calledOnce);
		}
	}
});
