import { MODE, DIRECTION } from './constants';
export type MODETYPE = typeof MODE[keyof typeof MODE];
export type DIRECTIONTYPE = typeof DIRECTION[keyof typeof DIRECTION];
