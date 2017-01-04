import * as defaultTheme from './themes/default/theme.module.styl';
import { assign } from 'dojo-core/lang';

export type ActiveClassMap<T> = {
	[P in keyof T]?: ActiveClasses;
}

export type ActiveClasses = {
	[key: string]: boolean;
}

export type Theme = {
	[key: string]: boolean;
}

function addClassNameToMap(classMap: ActiveClasses, classList: {}, className: string) {
	if (classList && classList.hasOwnProperty(className)) {
		const generatedClassName = (<any> classList)[className];
		classMap[generatedClassName] = true;
	}
}

function getClasses<T>(themeClasses: T, overrideClasses: {}): ActiveClassMap<T> {
	// create the class map to be returned
	const activeClassMap: ActiveClassMap<T> = <ActiveClassMap<T>> {};

	// loop through the class names
	Object.keys(themeClasses).forEach((className) => {
		const classMap: ActiveClasses = activeClassMap[<keyof T> className] = {};

		addClassNameToMap(classMap, themeClasses, className);
		addClassNameToMap(classMap, overrideClasses, className);
	});

	return activeClassMap;
}

export class ThemeManager  {
	private _theme = defaultTheme;

	set theme(theme: {}) {
		this._theme = assign(this._theme, theme);
	}

	getThemeClasses(overrideClasses: {}) {
		return getClasses(this._theme, overrideClasses);
	}
};

const themeManager = new ThemeManager();

export default themeManager;
