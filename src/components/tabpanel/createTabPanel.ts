import { ComposeFactory } from 'dojo-compose/compose';
import { Widget, WidgetOptions, WidgetProperties, WidgetState, DNode } from '../../interfaces';
import createWidgetBase from '../../createWidgetBase';
import { v } from '../../d';
import * as css from './tabpanel.module.styl';
// import * as theme from '../../themes/default/tabpanel.module.styl';
import themeManager, { Theme } from '../../themeManager';

export interface TabPanelState extends WidgetState {}

export interface TabPanelProperties extends WidgetProperties {
	overrideClasses: Theme;
}

export interface TabPanelOptions extends WidgetOptions<TabPanelState, TabPanelProperties> {}

export type TabPanel = Widget<TabPanelState, TabPanelProperties>;

export interface TabPanelFactory extends ComposeFactory<TabPanel, TabPanelOptions> {}

// export type ActiveClassMap<T> = {
// 	[P in keyof T]?: ActiveClasses;
// }

// export type ActiveClasses = {
// 	[key: string]: boolean;
// }

// export type ClassMap = {};

// function getClasses<T, U, V>(baseClasses: T, themeClasses: U, overrideClasses?: V): ActiveClassMap<T> & ActiveClassMap<U> & ActiveClassMap<V> {
// 	// create the class map to be returned
// 	const activeClassMap: ActiveClassMap<T & U & V> = <ActiveClassMap<T & U & V>> {};

// 	// create array of class lists and push on overrideClasses if it exists
// 	const classLists: (T | U | V)[] = [ baseClasses, themeClasses ];
// 	overrideClasses && classLists.push(overrideClasses);

// 	// get the combined classnames from all three
// 	const classNames = Object.keys(Object.assign({}, baseClasses, themeClasses, overrideClasses));

// 	// loop through the class names
// 	classNames.forEach((className) => {
// 		// create an empty class map for the given classname
// 		// ie.
// 		// { className1: { css-classname1: true, theme-module-classname1: true } }
// 		//

// 		const classMap: ActiveClasses = activeClassMap[<keyof T & U & V> className] = {};

// 		// loop through classlists and build up the class map
// 		classLists.forEach((classList) => {
// 			if (classList.hasOwnProperty(className)) {
// 				const generatedClassName = (<any> classList)[className];
// 				classMap[generatedClassName] = true;
// 			}
// 		});
// 	});

// 	return activeClassMap;
// }

const createTabPanel: TabPanelFactory = createWidgetBase.mixin({
	mixin: {
		tagName: 'tab-panel',
		classes: [ css.tabPanel ],
		getChildrenNodes: function (this: TabPanel): DNode[] {
			const { overrideClasses } = this.properties;
			const themeable = themeManager.getThemeClasses(overrideClasses);

			return [
				v(`ul`, { classes: { [ css.tabPanelTabs ]: true, ...themeable.tabPanelTabs } }, [
					v('li', [ 'tab1' ]),
					v('li', { classes: { [ css.tabPanelActiveTab ]: true, ...themeable.tabPanelActiveTab } }, [ 'tab2' ]),
					v('li', [ 'tab3' ])
				]),
				v('div', { classes: { [ css.tabPanelPanels ]: true, ...themeable.tabPanelPanels } }, [
					v('div', { classes: { [ css.tabPanelPanel ]: true, ...themeable.tabPanelPanel } }, [ 'hello world' ])
				])
			];
		}
	}
});

export default createTabPanel;
