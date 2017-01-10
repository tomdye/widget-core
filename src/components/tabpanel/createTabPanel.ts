import { ComposeFactory } from 'dojo-compose/compose';
import { Widget, WidgetOptions, WidgetProperties, WidgetState, DNode } from '../../interfaces';
import createWidgetBase from '../../createWidgetBase';
import { v } from '../../d';
import * as css from './styles/tabpanel';
import themeManager, { Theme } from '../../themeManager';

export interface TabPanelState extends WidgetState {}

export interface TabPanelProperties extends WidgetProperties {
	overrideClasses: Theme;
}

export interface TabPanelOptions extends WidgetOptions<TabPanelState, TabPanelProperties> {}

export type TabPanel = Widget<TabPanelState, TabPanelProperties>;

export interface TabPanelFactory extends ComposeFactory<TabPanel, TabPanelOptions> {}

const createTabPanel: TabPanelFactory = createWidgetBase.mixin({
	mixin: {
		tagName: 'tab-panel',
		classes: [ css.tabPanel ],
		getChildrenNodes: function (this: TabPanel): DNode[] {
			const { overrideClasses } = this.properties;
			const theme = themeManager.getThemeClasses(css, overrideClasses);

			return [
				v(`ul`, { classes: theme.tabPanelTabs }, [
					v('li', { classes: theme.tabPanelTab }, [ 'tab1' ]),
					v('li', { classes: { ...theme.tabPanelActiveTab, ...theme.tabPanelTab } }, [ 'tab2' ]),
					v('li', { classes: theme.tabPanelTab }, [ 'tab3' ])
				]),
				v('div', { classes: theme.tabPanelPanels }, [
					v('div', { classes: theme.tabPanelPanel }, [ 'hello world' ])
				])
			];
		}
	}
});

export default createTabPanel;
