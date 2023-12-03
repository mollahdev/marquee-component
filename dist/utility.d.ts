import { MODETYPE, DIRECTIONTYPE } from './types';
export default class Utility {
    private static getElementOffset;
    static getChildren(elements: HTMLElement): HTMLElement[];
    static getElementsSize(elements: HTMLElement[], mode: MODETYPE, dir: DIRECTIONTYPE): number;
    static getScopeSize(scope: HTMLElement, mode: MODETYPE): number;
    static getVisibleElements(elements: HTMLElement[], mode: MODETYPE, dir: DIRECTIONTYPE, point: number): {
        visibleElements: HTMLElement[];
        inVisibleElements: HTMLElement[];
    };
}
