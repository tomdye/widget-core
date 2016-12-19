import { ComposeFactory } from 'dojo-compose/compose';
import { Widget, WidgetOptions, WidgetState, DNode } from '../../interfaces';
import createWidgetBase from '../../createWidgetBase';
import { v } from '../../d';
import * as css from './tabpanel.module.styl';

export interface TabPanelState extends WidgetState {}

export interface TabPanelOptions extends WidgetOptions<TabPanelState> {}

export type TabPanel = Widget<TabPanelState>;

export interface TabPanelFactory extends ComposeFactory<TabPanel, TabPanelOptions> {}

const createTabPanel: TabPanelFactory = createWidgetBase.mixin({
	mixin: {
		tagName: 'tab-panel',
		classes: [ css.root ],
		getChildrenNodes: function (this: TabPanel): DNode[] {
			return [
				v(`ul.${css.tabs}`, [
					v('li', [ 'tab1' ]),
					v(`li.${css.activeTab}`, [ 'tab2' ]),
					v('li', [ 'tab3' ])
				]),
				v(`div.${css.panels}`, [
					v(`div.${css.panel}`, [ 'hello world' ])
				])
			];
		}
	}
});

export default createTabPanel;
