import * as defaultTheme from './themes/default/theme.module.styl';
import { assign } from 'dojo-core/lang';

export class ThemeManager  {
	private _theme = defaultTheme;

	constructor() {
		// this._theme = defaultTheme;
	};
	set theme(theme: {}) {
		console.log('theme set');
		this._theme = assign(this._theme, theme);
	};
	get theme() {
		return this._theme;
	}
};

const themeManager = new ThemeManager();

export default themeManager;
