export type ActiveClassMap<T> = {
	[P in keyof T]?: ActiveClasses;
}

export type ActiveClasses = {
	[key: string]: boolean;
}

export type Theme = {
	[key: string]: string;
}

function addClassNameToMap(classMap: ActiveClasses, classList: {}, className: string) {
	if (classList && classList.hasOwnProperty(className)) {
		// need to split this because css-module composition combines class names with a space
		const generatedClassNames: string[] = (<any> classList)[className].split(' ');
		generatedClassNames.forEach((generatedClassName) => {
			classMap[generatedClassName] = true;
		});
	}
}

export class ThemeManager  {
	private _loadedTheme: Theme;

	set theme(theme: Theme) {
		this._loadedTheme = theme;
	}

	getThemeClasses<T extends {}>(baseThemeClasses: T, overrideClasses?: Theme): ActiveClassMap<T> {
		// create the class map to be returned
		const activeClassMap: ActiveClassMap<T> = <ActiveClassMap<T>> {};

		// loop through the class names
		Object.keys(baseThemeClasses).forEach((className) => {
			const classMap: ActiveClasses = activeClassMap[<keyof T> className] = {};
			let themeClassSource: Theme = baseThemeClasses;

			// check if loadedtheme exists and provides this classname first
			if (this._loadedTheme && this._loadedTheme.hasOwnProperty(className)) {
				themeClassSource = this._loadedTheme;
			}

			addClassNameToMap(classMap, themeClassSource, className);
			overrideClasses && addClassNameToMap(classMap, overrideClasses, className);
		});

		return activeClassMap;
	}
};

const themeManager = new ThemeManager();

export default themeManager;
