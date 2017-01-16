import WeakMap from '@dojo/shim/WeakMap';
import { includes } from '@dojo/shim/array';
import { PropertiesChangeEvent } from './../interfaces';
import { Evented } from '@dojo/interfaces/bases';
import createEvented from '@dojo/compose/bases/createEvented';
import { ComposeFactory } from '@dojo/compose/compose';
import { assign } from '@dojo/core/lang';

/**
 * A representation of the css-module class names
 * to be applied where each class in appliedClasses
 * is used.
 */
export type CSSModuleClassNames = {
	[key: string]: boolean;
}

/**
 * The object returned by getClasses.
 */
export type AppliedClasses<T> = {
	[P in keyof T]?: CSSModuleClassNames;
};

type StringIndexedObject = { [key: string]: string; };

/**
 * Properties required for the themeable mixin
 */
export interface ThemeableProperties {
	theme?: {};
	overrideClasses?: {};
}

/**
 * Themeable Options
 */
export interface ThemeableOptions {
	properties: ThemeableProperties;
}

/**
 * Themeable Mixin
 */
export interface ThemeableMixin<P> extends Evented {
	getTheme(): AppliedClasses<P>;
}

/**
 * Themeable
 */
export interface Themeable<P> extends ThemeableMixin<P> {
	baseTheme: P;
	properties: ThemeableProperties;
}

/**
 * Compose Themeable Factory interface
 */
export interface ThemeableFactory extends ComposeFactory<ThemeableMixin<{}>, ThemeableOptions> {}

/**
 * Private map for the widgets themeClasses.
 */
const themeClassesMap = new WeakMap<ThemeableMixin<{}>, AppliedClasses<any>>();

function addClassNameToMap(classMap: CSSModuleClassNames, classList: StringIndexedObject, className: string) {
	if (classList.hasOwnProperty(className)) {
		// split out the classname because css-module composition combines class names with a space
		const generatedClassNames: string[] = classList[className].split(' ');
		generatedClassNames.forEach((generatedClassName) => {
			classMap[generatedClassName] = true;
		});
	}
}

function negateOldClasses<T>(oldClasses: AppliedClasses<T>, newClasses: AppliedClasses<T>) {
	return Object.keys(oldClasses).reduce((currentAppliedClasses, className) => {
		const oldClassMap = oldClasses[<keyof T> className];

		const negatedClassNameMap = Object.keys(oldClassMap).reduce((currentClassMap, oldAppliedClassName) => {
			currentClassMap[oldAppliedClassName] = false;
			return currentClassMap;
		}, <CSSModuleClassNames> {});

		const calculatedClassNameMap = assign({}, negatedClassNameMap, newClasses[<keyof T> className]);
		currentAppliedClasses[<keyof T> className] = calculatedClassNameMap;

		return currentAppliedClasses;
	}, <AppliedClasses<T>> {});
}

function generateThemeClasses<I, T>(instance: Themeable<I>, baseTheme: T, theme: {} = {}, overrideClasses: {} = {}) {
	const newThemeClasses = Object.keys(instance.baseTheme).reduce((currentAppliedClasses, className) => {
		const classMap: CSSModuleClassNames = currentAppliedClasses[<keyof T> className] = {};
		let themeClassSource: {} = instance.baseTheme;

		if (theme && theme.hasOwnProperty(className)) {
			themeClassSource = theme;
		}

		addClassNameToMap(classMap, themeClassSource, className);
		overrideClasses && addClassNameToMap(classMap, overrideClasses, className);

		return currentAppliedClasses;
	}, <AppliedClasses<T>> {});

	if (themeClassesMap.has(instance)) {
		const oldClasses = themeClassesMap.get(instance);
		themeClassesMap.set(instance, negateOldClasses(oldClasses, newThemeClasses));
	} else {
		themeClassesMap.set(instance, newThemeClasses);
	}
}

function onPropertiesChanged<I>(instance: Themeable<I>, { theme, overrideClasses }: ThemeableProperties, changedPropertyKeys: string[]) {
	const { theme: propTheme, overrideClasses: propOverrideClasses } = instance.properties;
	const themeChanged = includes(changedPropertyKeys, 'theme');
	const overrideClassesChanged = includes(changedPropertyKeys, 'overrideClasses');

	if (themeChanged || overrideClassesChanged) {
		generateThemeClasses(instance, instance.baseTheme, theme || propTheme, overrideClasses || propOverrideClasses);
	}
}

/**
 * Themeable Factory
 */
const themeableFactory: ThemeableFactory = createEvented.mixin({
	mixin: {
		getTheme<I>(this: Themeable<I>): AppliedClasses<I> {
			return themeClassesMap.get(this);
		}
	},
	initialize<I>(instance: Themeable<I>) {
		instance.own(instance.on('properties:changed', (evt: PropertiesChangeEvent<ThemeableMixin<I>, ThemeableProperties>) => {
			onPropertiesChanged(instance, evt.properties, evt.changedPropertyKeys);
		}));
		const { theme, overrideClasses } = instance.properties;
		generateThemeClasses(instance, instance.baseTheme, theme, overrideClasses);
	}
});

export default themeableFactory;
