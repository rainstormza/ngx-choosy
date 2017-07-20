var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { ComponentFactoryResolver, Directive, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output, Renderer, ViewContainerRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as merge from 'deepmerge';
import { ChoosyResultsComponent } from '../../components/choosy-results/choosy-results.component';
var ChoosyInputDirective = (function () {
    function ChoosyInputDirective(eRef, renderer, viewContainerRef, compFacResolver) {
        this.eRef = eRef;
        this.renderer = renderer;
        this.viewContainerRef = viewContainerRef;
        this.compFacResolver = compFacResolver;
        this.config = {};
        this.choosy = new EventEmitter();
        this.onChange = function (_) { };
        this.onTouched = function (_) { };
        // this.wrapElement();
        var factory = this.compFacResolver.resolveComponentFactory(ChoosyResultsComponent);
        this.componentRef = this.viewContainerRef.createComponent(factory, 0);
    }
    ChoosyInputDirective.prototype.ngOnInit = function () {
        if (!this.options)
            throw new Error('Options not found!');
        else if (typeof this.options[0] === 'object' && !this.config.displayValue)
            throw new Error('"displayValue" config is manadatory of object options!');
        this.eRef.nativeElement.readOnly = true;
        this.componentRef.instance.config = merge(this.config, {
            dropdown: {
                inputWidth: this.eRef.nativeElement.offsetWidth
            }
        });
        this.componentRef.instance.options = this.options;
    };
    ChoosyInputDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.componentRef.instance.template = this.template;
        this.choosy.emit(this.prepareEvents(this.componentRef.instance.expose()));
        this.componentRef.instance.selections.subscribe(function (r) {
            var val = _this.config.displayValue ? r[_this.config.displayValue] : r;
            _this.setValue(val);
            _this.onChange(r);
            _this.componentRef.instance.isOpen = false;
        });
        if (this.initialValue) {
            var val = this.config.displayValue
                ? this.initialValue[this.config.displayValue]
                : this.initialValue;
        }
    };
    ChoosyInputDirective.prototype.ngOnDestroy = function () {
        this.componentRef.destroy();
    };
    ChoosyInputDirective.prototype.ngOnChanges = function (change) {
        if (change.options && !change.options.firstChange) {
            this.options = change.options.currentValue;
            this.componentRef.instance.reloadOptions(this.options);
        }
        if (change.config)
            this.componentRef.instance.config = change.config.currentValue;
    };
    ChoosyInputDirective.prototype.documentClickEvent = function (event) {
        this.onDocumentClick(event);
    };
    ChoosyInputDirective.prototype.clickEvent = function ($event) {
        this.toggleDropdown($event);
    };
    ChoosyInputDirective.prototype.prepareEvents = function (componentEvent) {
        return __assign({}, componentEvent, { clear: this.clear.bind(this), selectItem: this.selectItem.bind(this) });
    };
    ChoosyInputDirective.prototype.wrapInput = function () {
        var wrapper = document.createElement('div');
        this.eRef.nativeElement.parentNode.insertBefore(wrapper, this.eRef.nativeElement);
        wrapper.classList.add('dropdown__input-wrapper');
        wrapper.setAttribute('style', 'position:relative');
        wrapper.appendChild(this.eRef.nativeElement);
    };
    ChoosyInputDirective.prototype.onDocumentClick = function (event) {
        if (this.componentRef.instance.elRef.nativeElement.contains(event.target) ||
            this.eRef.nativeElement.contains(event.target)) {
            // this.text = "clicked inside";
        }
        else {
            this.componentRef.instance.close(event);
        }
    };
    ChoosyInputDirective.prototype.writeValue = function (value) {
        this.initialValue = value;
        var val = this.config.displayValue ? value[this.config.displayValue] : value;
        if (!value) {
            this.setValue(undefined);
            return;
        }
        this.setValue(val);
        this.onChange(val);
    };
    ChoosyInputDirective.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    ChoosyInputDirective.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    ChoosyInputDirective.prototype.openDropdown = function () {
        this.componentRef.instance.open(new Event('click'));
    };
    ChoosyInputDirective.prototype.closeDropdown = function () {
        this.componentRef.instance.close(new Event('click'));
    };
    ChoosyInputDirective.prototype.toggleDropdown = function (event) {
        this.componentRef.instance.toggle(event);
    };
    ChoosyInputDirective.prototype.setValue = function (value) {
        this.renderer.setElementProperty(this.eRef.nativeElement, 'value', value);
    };
    ChoosyInputDirective.prototype.clear = function () {
        this.setValue(null);
        this.onChange(null);
        this.componentRef.instance.clearSelectedOptions();
    };
    ChoosyInputDirective.prototype.selectItem = function (option) {
        this.setValue(option);
        this.onChange(option);
        this.componentRef.instance.selectOption(option);
    };
    return ChoosyInputDirective;
}());
export { ChoosyInputDirective };
ChoosyInputDirective.decorators = [
    { type: Directive, args: [{
                selector: '[choosySingleSelect]',
                providers: [{
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(function () { return ChoosyInputDirective; }),
                        multi: true
                    }]
            },] },
];
/** @nocollapse */
ChoosyInputDirective.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer, },
    { type: ViewContainerRef, },
    { type: ComponentFactoryResolver, },
]; };
ChoosyInputDirective.propDecorators = {
    'options': [{ type: Input },],
    'config': [{ type: Input },],
    'template': [{ type: Input },],
    'choosy': [{ type: Output },],
    'documentClickEvent': [{ type: HostListener, args: ['document:click', ['$event'],] },],
    'clickEvent': [{ type: HostListener, args: ['click', ['$event'],] },],
    'onChange': [{ type: HostListener, args: ['input', ['$event.target.value'],] },],
    'onTouched': [{ type: HostListener, args: ['blur', [],] },],
};
//# sourceMappingURL=choosy-input.directive.js.map