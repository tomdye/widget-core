import { ComposeFactory } from 'dojo-compose/compose';
import { Widget, WidgetOptions, WidgetState, DNode } from '../../interfaces';
import createWidgetBase from '../../createWidgetBase';
import { v, w } from '../../d';
import createTab, { TabOptions } from '../tab/createTab';
import * as css from './tabpanel.m.styl';

export interface TabPanelTabs extends TabOptions {
	content: DNode;
}

export interface TabPanelState extends WidgetState {
	tabs?: TabPanelTabs[];
}

export interface TabPanelOptions extends WidgetOptions<TabPanelState> {}

export type TabPanel = Widget<TabPanelState>;

export interface TabPanelFactory extends ComposeFactory<TabPanel, TabPanelOptions> {}

const createTabPanel: TabPanelFactory = createWidgetBase.mixin({
	mixin: {
		tagName: 'div',
		classes: [ css.root ],
		getChildrenNodes: function (this: TabPanel): DNode[] {
			const { tabs = [] } = this.state;
			return [
				v(`ul.${css.tabs}`, tabs.map((tab) => w(createTab, tab))),
				v(`div.${css.panels}`, tabs.map((tab) => v(`div.${css.panel}`, [ tab.content ])))
			];
		}
	}
});

export default createTabPanel;
