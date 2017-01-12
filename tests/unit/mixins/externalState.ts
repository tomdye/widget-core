import compose from 'dojo-compose/compose';
import * as registerSuite from 'intern!object';
import Promise from 'dojo-shim/Promise';
import * as assert from 'intern/chai!assert';
import externalState from '../../../src/mixins/externalState';
import { createObservableStore, ObservableStore } from 'dojo-stores/store/mixins/createObservableStoreMixin';

let store: ObservableStore<{}, {}, any>;

const externalStateWithProperties = compose({
	properties: <any> {},
	diffProperties(this: any, previousProperties: any, newProperties: any) { },
	applyChangedProperties(this: any) { }
}).mixin(externalState);

registerSuite({
	name: 'mixins/externalStateMixin',
	beforeEach() {
		store = createObservableStore({
			data: [
				{ id: '1', foo: 'bar' },
				{ id: '2', foo: 'bar' }
			]
		});
	},
	observe: {
		'throw error if `id` property is not passed'() {
			const externalStateMixin = externalStateWithProperties();

			externalStateMixin.properties = {
				externalState: store
			};
			assert.throws(() => externalStateMixin.observe(), Error);
		},
		'throw error if `externalState` property is not passed'() {
			const externalStateMixin = externalStateWithProperties();

			externalStateMixin.properties = {
				id: '1'
			};
			assert.throws(() => externalStateMixin.observe(), Error);
		},
		observe() {
			const externalStateMixin = externalStateWithProperties();
			let stateChangeCount = 0;
			const properties = {
				id: '1',
				externalState: store
			};
			externalStateMixin.properties = properties;

			const promise = new Promise((resolve, reject) => {
				externalStateMixin.on('state:changed', ({ state }: any) => {
					stateChangeCount++;
					try {
						assert.equal(stateChangeCount, 1);
						assert.deepEqual(state, { id: '1', foo: 'bar'});
						resolve();
					} catch (err) {
						reject(err);
					}
				});
			});

			externalStateMixin.diffProperties({}, properties);
			externalStateMixin.observe();
			externalStateMixin.observe();
			return promise;
		},
		'throws error if observe called with a different id'() {
			const externalStateMixin = externalStateWithProperties();

			externalStateMixin.properties = {
				id: '1',
				externalState: store
			};

			externalStateMixin.observe();
			externalStateMixin.properties.id = '2';
			assert.throws(() => externalStateMixin.observe(), Error);

		}
	},
	getState() {
		const externalStateMixin = externalStateWithProperties();

		externalStateMixin.properties = {
			id: '1',
			externalState: store
		};

		const promise = new Promise((resolve, reject) => {
			externalStateMixin.on('state:changed', () => {
				try {
					assert.deepEqual(externalStateMixin.state, { id: '1', foo: 'bar'});
					resolve();
				} catch (err) {
					reject(err);
				}
			});
		});

		externalStateMixin.observe();
		assert.deepEqual(externalStateMixin.state, Object.create(null));
		return promise;
	},
	setState() {
		const externalStateMixin = externalStateWithProperties();
		let intialStateChange = true;

		externalStateMixin.properties = {
			id: '1',
			externalState: store
		};

		const promise = new Promise((resolve, reject) => {
			externalStateMixin.on('state:changed', () => {
				try {
					if (intialStateChange) {
						intialStateChange = false;
						assert.deepEqual(externalStateMixin.state, { id: '1', foo: 'bar'});
					}
					else {
						assert.deepEqual(externalStateMixin.state, { id: '1', foo: 'baz', baz: 'qux' });
						resolve();
					}
				} catch (err) {
					reject(err);
				}
			});
		});

		externalStateMixin.observe();
		assert.deepEqual(externalStateMixin.state, Object.create(null));
		externalStateMixin.setState({ id: '1', foo: 'baz', baz: 'qux' });
		return promise;
	},
	'on "properties:changed" event': {
		'initial properties'() {
			const externalStateMixin = externalStateWithProperties();

			externalStateMixin.properties = {
				id: '1',
				externalState: store
			};

			const promise = new Promise((resolve, reject) => {
				externalStateMixin.on('state:changed', () => {
					try {
						assert.deepEqual(externalStateMixin.state, { id: '1', foo: 'bar' });
						resolve();
					} catch (err) {
						reject(err);
					}
				});
			});

			externalStateMixin.emit({
				type: 'properties:changed'
			});
			return promise;
		},

		'call destroy on observe handle if externalState has been updated.'() {
			const externalStateMixin = externalStateWithProperties();
			const newStore = createObservableStore({ data: [ { id: '1', foo: 'bar' } ]});
			let intialStateChange = true;
			const initialProperties = {
				id: '1',
				externalState: store
			};

			externalStateMixin.properties = initialProperties;

			const promise = new Promise((resolve, reject) => {
				externalStateMixin.on('state:changed', ({ target }: any) => {
					try {
						if (intialStateChange) {
							intialStateChange = false;
							assert.equal(target.properties.externalState, store);
							const updatedProperties = {
								externalState: newStore,
								id: '1'
							};
							externalStateMixin.properties = updatedProperties;
							externalStateMixin.emit({
								type: 'properties:changed',
								target: externalStateMixin,
								properties: updatedProperties,
								changedPropertyKeys: [ 'externalState' ]
							});
						}
						else {
							assert.equal(target.properties.externalState, newStore);
							resolve();
						}
					} catch (err) {
						reject(err);
					}
				});
			});

			externalStateMixin.emit({
				type: 'properties:changed',
				target: externalStateMixin,
				properties: initialProperties,
				changedPropertyKeys: [ 'externalState', 'id' ]
			});

			return promise;
		},
		'call destroy on observe handle if id has been updated.'() {
			const externalStateMixin = externalStateWithProperties();
			let intialStateChange = true;
			const initialProperties = {
				id: '1',
				externalState: store
			};

			externalStateMixin.properties = initialProperties;

			const promise = new Promise((resolve, reject) => {
				externalStateMixin.on('state:changed', ({ target }: any) => {
					try {
						if (intialStateChange) {
							intialStateChange = false;
							assert.equal(target.properties.id, '1');
							const updatedProperties = {
								externalState: store,
								id: '2'
							};
							externalStateMixin.properties = updatedProperties;
							externalStateMixin.emit({
								type: 'properties:changed',
								target: externalStateMixin,
								properties: updatedProperties,
								changedPropertyKeys: [ 'id' ]
							});
						}
						else {
							assert.equal(target.properties.id, '2');
							resolve();
						}
					} catch (err) {
						reject(err);
					}
				});
			});

			externalStateMixin.emit({
				type: 'properties:changed',
				target: externalStateMixin,
				properties: initialProperties,
				changedPropertyKeys: [ 'externalState', 'id' ]
			});

			return promise;
		}
	}
});