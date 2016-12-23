import { ComposeFactory } from 'dojo-compose/compose';
import { Widget, WidgetOptions, WidgetProperties, WidgetState, DNode } from '../../interfaces';
import createWidgetBase from '../../createWidgetBase';
import { v } from '../../d';
import * as css from './tabpanel.module.styl';
import themeManager from '../../themeManager';

export interface TabPanelState extends WidgetState {}

export interface TabPanelOptions extends WidgetOptions<TabPanelState, WidgetProperties> {}

export type TabPanel = Widget<TabPanelState, WidgetProperties>;

export interface TabPanelFactory extends ComposeFactory<TabPanel, TabPanelOptions> {}

const createTabPanel: TabPanelFactory = createWidgetBase.mixin({
	mixin: {
		tagName: 'tab-panel',
		classes: [ css.root ],
		getChildrenNodes: function (this: TabPanel): DNode[] {
			const theme: any = themeManager.theme;

			return [
				v(`ul.${css.tabs}.${theme.tabPanelTabs}`, [
					v('li', [ 'tab1' ]),
					v(`li.${css.activeTab}.${theme.tabPanelActiveTab}`, [ 'tab2' ]),
					v('li', [ 'tab3' ])
				]),
				v(`div.${css.panels}.${theme.tabPanelPanels}`, [
					v(`div.${css.panel}.${theme.tabPanelPanel}`, [ 'hello world' ])
				])
			];
		}
	}
});

export default createTabPanel;
