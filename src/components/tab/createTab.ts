import { ComposeFactory } from 'dojo-compose/compose';
import { VNodeProperties } from 'dojo-interfaces/vdom';
import { Widget, WidgetOptions, WidgetState } from '../../interfaces';
import createWidgetBase from '../../createWidgetBase';
import * as css from './tab.m.styl';

export interface TabState extends WidgetState {
	label?: string;
}

export interface TabOptions extends WidgetOptions<TabState> { }

export type Tab = Widget<TabState>;

export interface TabFactory extends ComposeFactory<Tab, TabOptions> { }

const createTab: TabFactory = createWidgetBase.mixin({
	mixin: {
		tagName: 'li',
		classes: [ css.root ],
		nodeAttributes: [
			function(this: Tab): VNodeProperties {
				return { innerHTML: this.state.label };
			}
		]
	}
});

export default createTab;
