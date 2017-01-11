import { ComposeFactory } from 'dojo-compose/compose';
import { Widget, WidgetOptions, WidgetProperties, WidgetState, DNode } from '../../interfaces';
import createWidgetBase from '../../createWidgetBase';
import { v } from '../../d';
import * as css from './styles/tabpanel';
import themeManager from '../../theme/themeManager';

export interface TabPanelState extends WidgetState {}

export interface TabPanelOptions extends WidgetOptions<TabPanelState, WidgetProperties> {}

export type TabPanel = Widget<TabPanelState, WidgetProperties>;

export interface TabPanelFactory extends ComposeFactory<TabPanel, TabPanelOptions> {}

function formatTagNameAndClasses(tagName: string, classes: string[]) {
	if (classes.length) {
		return `${tagName}.${classes.join('.')}`;
	}
	return tagName;
}

const createTabPanel: TabPanelFactory = createWidgetBase.mixin({
	mixin: {
		tagName: 'tab-panel',
		getNode(this: TabPanel): DNode {
			const theme = themeManager.getThemeClasses(css);
			const tag = formatTagNameAndClasses(this.tagName, [ ...Object.keys(theme.tabPanel), ...this.classes ]);
			return v(tag, this.getNodeAttributes(), this.getChildrenNodes());
		},
		getChildrenNodes: function (this: TabPanel): DNode[] {
			const { overrideClasses } = this.properties;
			const theme = themeManager.getThemeClasses(css, overrideClasses);

			return [
				v(`ul`, { classes: theme.tabPanelTabs }, [
					v('li', { classes: theme.tabPanelTab }, [ 'tab1' ]),
					v('li', { classes: { ...theme.tabPanelTab, ...theme.tabPanelActiveTab } }, [ 'tab2' ]),
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
