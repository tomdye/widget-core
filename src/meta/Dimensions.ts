import { Base } from './Base';
import { deepAssign } from '@dojo/core/lang';
import { Type } from '../NodeHandler';
import { WidgetMetaProperties } from '../interfaces';

export interface TopLeft {
	left: number;
	top: number;
}

export interface BottomRight {
	bottom: number;
	right: number ;
}

export interface Size {
	height: number;
	width: number;
}

export interface DimensionResults {
	position: TopLeft & BottomRight;
	offset: TopLeft & Size;
	size: Size;
	scroll: TopLeft & Size;
}

export const defaultDimensions = {
	offset: {
		height: 0,
		left: 0,
		top: 0,
		width: 0
	},
	position: {
		bottom: 0,
		left: 0,
		right: 0,
		top: 0
	},
	scroll: {
		height: 0,
		left: 0,
		top: 0,
		width: 0
	},
	size: {
		width: 0,
		height: 0
	}
};

export class Dimensions extends Base {
	constructor(properties: WidgetMetaProperties) {
		super(properties);

		this.nodeHandler.on(Type.Projector, () => {
			this.invalidate();
		});
	}

	public get(key: string): Readonly<DimensionResults> {
		const node = this.nodeHandler.get(key);
		if (!node) {
			return deepAssign({}, defaultDimensions);
		}

		const boundingDimensions = node.getBoundingClientRect();

		return {
			offset: {
				height: node.offsetHeight,
				left: node.offsetLeft,
				top: node.offsetTop,
				width: node.offsetWidth
			},
			position: {
				bottom: boundingDimensions.bottom,
				left: boundingDimensions.left,
				right: boundingDimensions.right,
				top: boundingDimensions.top
			},
			scroll: {
				height: node.scrollHeight,
				left: node.scrollLeft,
				top: node.scrollTop,
				width: node.scrollWidth
			},
			size: {
				width: boundingDimensions.width,
				height: boundingDimensions.height
			}
		};
	}
}

export default Dimensions;
