import { ComposeFactory } from 'dojo-compose/compose';
import { VNodeProperties } from 'dojo-interfaces/vdom';
import createWidgetBase from '../../createWidgetBase';
import { Widget, WidgetOptions, WidgetProperties, WidgetState } from './../../interfaces';
import createFormFieldMixin, { FormFieldMixin, FormFieldMixinState, FormFieldMixinOptions } from '../../mixins/createFormFieldMixin';
import * as css from './button.m.css';
import themeManager from '../../themeManager';

export interface ButtonState extends WidgetState, FormFieldMixinState<string> {
	label?: string;
}

export interface ButtonProperties extends WidgetProperties {
	label?: string;
}

export interface ButtonOptions extends WidgetOptions<ButtonState, ButtonProperties>, FormFieldMixinOptions<any, ButtonState> { }

export type Button = Widget<ButtonState, ButtonProperties> & FormFieldMixin<string, ButtonState>;

export interface ButtonFactory extends ComposeFactory<Button, ButtonOptions> { }

const createButton: ButtonFactory = createWidgetBase
	.mixin(createFormFieldMixin)
	.mixin({
		mixin: {
			nodeAttributes: [
				function(this: Button): VNodeProperties {
					const theme = themeManager.getThemeClasses(css);
					return {
						innerHTML: this.state.label,
						classes: theme.button
					};
				}
			],
			tagName: 'button',
			type: 'button'
		}
	});

export default createButton;
