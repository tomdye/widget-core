import { ComposeFactory } from 'dojo-compose/compose';
import { VNodeProperties } from 'dojo-interfaces/vdom';
import createWidgetBase from '../../createWidgetBase';
import { Widget, WidgetOptions, WidgetProperties, WidgetState, DNode } from './../../interfaces';
import createFormFieldMixin, { FormFieldMixin, FormFieldMixinState, FormFieldMixinOptions } from '../../mixins/createFormFieldMixin';
import { v } from '../../d';
import * as css from './styles/button';
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

function formatTagNameAndClasses(tagName: string, classes: string[]) {
	if (classes.length) {
		return `${tagName}.${classes.join('.')}`;
	}
	return tagName;
}

const createButton: ButtonFactory = createWidgetBase
	.mixin(createFormFieldMixin)
	.mixin({
		mixin: {
			getNode(this: Button): DNode {
				const theme = themeManager.getThemeClasses(css);
				const tag = formatTagNameAndClasses(this.tagName, [ ...Object.keys(theme.button), ...this.classes ]);
				return v(tag, this.getNodeAttributes(), this.getChildrenNodes());
			},
			nodeAttributes: [
				function(this: Button): VNodeProperties {
					return {
						innerHTML: this.state.label
					};
				}
			],
			tagName: 'button',
			type: 'button'
		}
	});

export default createButton;
