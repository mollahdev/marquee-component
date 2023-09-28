import { MODE, DIRECTION } from './constants';
import { MODETYPE, DIRECTIONTYPE } from './types';

export default class Utility {
    
    private static getElementOffset( element: HTMLElement ) 
    {
        return {
            top: element.offsetTop,
            left: element.offsetLeft,
            right: innerWidth - element.offsetLeft - element.clientWidth,
            bottom: innerHeight - element.offsetTop - element.clientHeight
        }
    }

    public static getChildren( elements: HTMLElement ) {
        const children = elements.children;
        return Array.from( children ).filter( el => el instanceof HTMLElement ) as HTMLElement[];
    }

    public static getElementsSize( 
        elements: HTMLElement[], 
        mode: MODETYPE, 
        dir: DIRECTIONTYPE 
    ) {
        let size = 0;

        elements.reduce( ( prev: HTMLElement | null, curr: HTMLElement ) => {
            if( !prev ) {
                switch( mode ) {
                    case MODE.HORIZONTAL:
                        size = curr.clientWidth;
                        break;
                    case MODE.VERTICAL:
                        size = curr.clientHeight;
                        break;
                }
                return curr
            };

            const prevOffset = Utility.getElementOffset( prev );
            const currOffset = Utility.getElementOffset( curr );

            switch( `${mode}-${dir}` ) {
                case `${MODE.HORIZONTAL}-${DIRECTION.LTR}`:
                    size = curr.clientWidth +  size + ( currOffset.left - prevOffset.left - prev.clientWidth );
                    break;
                case `${MODE.HORIZONTAL}-${DIRECTION.RTL}`:
                    size = curr.clientWidth +  size + ( currOffset.right - prevOffset.right - prev.clientWidth );
                    break;
                case `${MODE.VERTICAL}-${DIRECTION.LTR}`:
                    size = curr.clientHeight +  size + ( currOffset.top - prevOffset.top - prev.clientHeight );
                    break;
                case `${MODE.VERTICAL}-${DIRECTION.RTL}`:
                    size = curr.clientHeight +  size + ( currOffset.bottom - prevOffset.bottom - prev.clientHeight );
                    break;
            }

            return curr
        }, null )

        return size;
    }

    public static getScopeSize( scope: HTMLElement, mode: MODETYPE ) 
    {
        if( mode === MODE.HORIZONTAL ) {
            return scope.offsetWidth;
        } else {
            return scope.offsetHeight;
        }
    }

    public static getVisibleElements( 
        elements: HTMLElement[], 
        mode: MODETYPE, 
        dir: DIRECTIONTYPE, 
        point: number
    ) {
        const visibleElements: typeof elements = []
        const inVisibleElements: typeof elements = []

        const updateElements = ( isInvisible: boolean, element: HTMLElement ) => {
            if( isInvisible ) {
                inVisibleElements.push( element );
            } else {
                visibleElements.push( element );
            }
        }

        elements.forEach( el => {
            const offset = Utility.getElementOffset( el );
            switch( `${mode}-${dir}` ) {
                case `${MODE.HORIZONTAL}-${DIRECTION.LTR}`:
                    updateElements( offset.left + el.clientWidth <= point, el)
                    break;
                case `${MODE.HORIZONTAL}-${DIRECTION.RTL}`:
                    updateElements( offset.right + el.clientWidth <= point, el)
                    break;
                case `${MODE.VERTICAL}-${DIRECTION.LTR}`:
                    updateElements( offset.top + el.clientHeight <= point, el)
                    break;
                case `${MODE.VERTICAL}-${DIRECTION.RTL}`:
                    updateElements( offset.bottom + el.clientHeight <= 0, el)
                    break;
            }
        } );

        return {
            visibleElements,
            inVisibleElements
        };
    }
}