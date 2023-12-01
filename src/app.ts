import { MARQUEE_COMPONENT, MODE, DIRECTION, MARQUEE_MOVE, MARQUEE_SLIDE, EVENT_NAME } from "./constants";
import { MODETYPE, DIRECTIONTYPE } from "./types";
import Utility from "./utility";
/**
 * create wrapper web-component 
 */ 
customElements.get( MARQUEE_COMPONENT ) || 
customElements.define( MARQUEE_COMPONENT, class extends HTMLElement {
    speed: number = 2; // speed per frame
    mode: MODETYPE = MODE.HORIZONTAL;
    direction: DIRECTIONTYPE = DIRECTION.LTR;
    wrapper = document.createElement('div');
    scopeSize = 0;
    wrapperSize = 0;
    moveTo = 0;
    point = 0;
    frameInterval = 1000 / 60;
    previousTime = performance.now();

    connectedCallback() {
        this.speed = Number(this.getAttribute('speed')) || 2;
        this.mode = ( this.getAttribute('mode') as MODETYPE ) || MODE.HORIZONTAL;
        this.direction = ( this.getAttribute('dir') as DIRECTIONTYPE ) || DIRECTION.LTR;

        this.addEventListener(EVENT_NAME, () => {
            this.wrapper = this.querySelector( MARQUEE_MOVE )!;

            this.style.display = 'block';
            this.style.overflow = 'hidden';

            if( this.mode === 'horizontal' ) {
                this.style.width = `100%`;
                this.style.maxWidth = `${innerWidth}px`;
            } else {
                this.style.height =  this.style.height || `100vh`;
                this.style.maxHeight = `${innerHeight}px`;
            }

            this.scopeSize = Utility.getScopeSize( this, this.mode );
            this.wrapperSize = Utility.getElementsSize( Utility.getChildren( this.wrapper ), this.mode, this.direction );

            this.#populateElements();
            this.#init();
        })
    }

    #populateElements() {
        const wrapperInnerHTMLUnit = this.wrapper.innerHTML;
        while( this.wrapperSize < this.scopeSize + ( this.scopeSize / 3 ) ) {
            this.wrapper.innerHTML = this.wrapper.innerHTML + wrapperInnerHTMLUnit;
            this.wrapperSize = Utility.getElementsSize( Utility.getChildren( this.wrapper ), this.mode, this.direction );
        }
    }

    #init() {
        this.moveTo = this.wrapperSize - this.scopeSize;
    
        if( this.mode === MODE.VERTICAL && this.direction === DIRECTION.RTL ) {
            this.moveTo = this.scopeSize - this.wrapperSize;
            this.#moveWrapper( this.moveTo );
        }

        requestAnimationFrame( this.#animate.bind(this) )
    }

    #moveWrapper( point: number ) {
        switch( `${this.mode}-${this.direction}` ) {
            case `${MODE.HORIZONTAL}-${DIRECTION.LTR}`:
                this.wrapper.style.transform = `translateX(-${ Math.ceil(point) }px)`;
                break;
            case `${MODE.HORIZONTAL}-${DIRECTION.RTL}`:
                this.wrapper.style.transform = `translateX(${ Math.ceil(point) }px)`;
                break;
            case `${MODE.VERTICAL}-${DIRECTION.LTR}`:
                this.wrapper.style.transform = `translateY(-${ Math.ceil(point) }px)`;
                break;
            case `${MODE.VERTICAL}-${DIRECTION.RTL}`:
                this.wrapper.style.transform = `translateY(${ Math.ceil(point) }px)`;
                break;
        }
    }

    #shouldAppendElements() {
        if( this.mode === MODE.VERTICAL && this.direction === DIRECTION.RTL ) {
            return this.moveTo + this.point >= 0
        }

        return this.point >= this.moveTo
    }

    #animate( timeStamp: number ) {
        const deltaTime = timeStamp - this.previousTime;
        const deltaTimeMultiplier = deltaTime / this.frameInterval;
        const increaseBy = this.speed * deltaTimeMultiplier;
        this.previousTime = timeStamp;
        this.point = this.point + increaseBy;

        if( this.mode === MODE.VERTICAL && this.direction === DIRECTION.RTL ) {
            this.#moveWrapper( this.moveTo +  this.point );
        } else {
            this.#moveWrapper( this.point );
        }
        
        if( this.#shouldAppendElements() ) {
            const { visibleElements, inVisibleElements } = 
            Utility.getVisibleElements( Utility.getChildren( this.wrapper ), this.mode, this.direction, this.point );

            const visibleSize = Utility.getElementsSize( visibleElements, this.mode, this.direction );

            // append inVisibleElements to the end of the wrapper
            inVisibleElements.forEach( el => {
                this.wrapper.appendChild( el );
            } )

            const resetSize = visibleSize - this.scopeSize;
            this.point = resetSize > 0 ? resetSize : 0 ;

            if( this.mode === MODE.VERTICAL && this.direction === DIRECTION.RTL ) {
                this.#moveWrapper( this.moveTo + this.point );
            } else {
                this.#moveWrapper( this.point );
            }

        }

        requestAnimationFrame( this.#animate.bind(this) );
    }
} );

/**
 * create move web-component 
 */ 
customElements.get( MARQUEE_MOVE ) ||
customElements.define( MARQUEE_MOVE, class extends HTMLElement {
    mode: MODETYPE = MODE.HORIZONTAL;
    direction: DIRECTIONTYPE = DIRECTION.LTR;
    constructor() {
        super();
        // get parent component attribute
        const parentComponent = this.closest('marquee-component');
        if( parentComponent ) {
            this.mode = ( parentComponent.getAttribute('mode') as MODETYPE ) || MODE.HORIZONTAL;
            this.direction = ( parentComponent.getAttribute('dir') as DIRECTIONTYPE ) || DIRECTION.LTR;

            this.style.display = 'flex';
            if( this.mode === MODE.HORIZONTAL ) {
                this.style.flexDirection = 'row';
            } else {
                this.style.flexDirection = 'column';
            }

            // reverse wrapper children if direction is rtl and mode is vertical
            if( this.mode === MODE.VERTICAL && this.direction === DIRECTION.RTL ) {
                this.style.flexDirection = 'column-reverse';
            }
        }
    }

    // on mount
    connectedCallback() {
        this.addEventListener( EVENT_NAME , () => {
            // dispatch mount event to parent component
            const parentComponent = this.closest( MARQUEE_COMPONENT );
            if( parentComponent ) {
                parentComponent.dispatchEvent( new Event( EVENT_NAME ) );
            }
        }, { once: true })
    }
} );

/**
 * create slide web-component 
 */ 
customElements.get( MARQUEE_SLIDE ) ||
customElements.define( MARQUEE_SLIDE, class extends HTMLElement {
    connectedCallback() {
        const parentMove = this.closest( MARQUEE_MOVE );
        parentMove && parentMove.dispatchEvent( new Event( EVENT_NAME ) );
    }
} );