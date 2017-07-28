import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer,
  TemplateRef,
  ViewContainerRef
  } from '@angular/core';
import * as merge from 'deepmerge';
import { ChoosyResultsComponent } from './../../components/choosy-results/choosy-results.component';
import { ChoosyButtonSelectConfig } from './../../interfaces';

@Directive({ selector: '[choosyButtonSelect]' })
export class ChoosyButtonSelectDirective {

  @Input() options: Array<any> = [];
  @Input() config: ChoosyButtonSelectConfig = {} as any;
  @Input() itemTemplate: TemplateRef<any>;
  @Input() selectedItemTemplate: TemplateRef<any>;

  localConfig: any = {
    search: {
      enable: false
    },
    footer: {
      enable: false
    },
    dropdown: {
      width: 300,
      animation: true
    }
  }
  componentRef: ComponentRef<ChoosyResultsComponent>;
  static compInstances: any = [];

  constructor(
    private eRef: ElementRef,
    private renderer: Renderer,
    private viewContainerRef: ViewContainerRef,
    private compFacResolver: ComponentFactoryResolver,
    private cdRef: ChangeDetectorRef
  ) {
    const factory = this.compFacResolver.resolveComponentFactory(ChoosyResultsComponent);
    this.componentRef = this.viewContainerRef.createComponent(factory, 0);
    ChoosyButtonSelectDirective.compInstances.push(this.componentRef.instance);
  }

  ngOnInit(): void {
    this.componentRef.instance.config = this.config = merge(this.config, this.localConfig);
    this.componentRef.instance.options = this.options;
  }

  ngAfterViewInit() {
    this.wrapInput();
    this.componentRef.instance.template = this.itemTemplate;
    this.componentRef.instance.selections.subscribe((r: any) => {
      console.log('selected wo dc', this.eRef.nativeElement);
      const fooby = this.viewContainerRef.createEmbeddedView(this.selectedItemTemplate, {
        $implicit: r
      }, 0);
      console.log('fooby nextSibling o>', fooby.rootNodes[0].nextSibling);
      this.eRef.nativeElement.innerHTML = '';
      this.eRef.nativeElement.appendChild(fooby.rootNodes[0].nextSibling);
      // this.cdRef.detectChanges();
      console.log('closing');
      this.componentRef.instance.close();
    });
  }

  closeDropdown(): void {
    this.componentRef.instance.close();
  }

  toggleDropdown(event: Event): void {
    this.componentRef.instance.toggle();
  }
  onDocumentClick(event: any): void {
    if (!this.componentRef.instance.elRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  wrapInput(): void {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('style', 'position: relative;display: inline-block;text-align: left;')
    wrapper.style.width = `${this.config.dropdown.width}px`;
    this.eRef.nativeElement.parentNode.insertBefore(wrapper, this.eRef.nativeElement);
    wrapper.appendChild(this.eRef.nativeElement);
    wrapper.appendChild((this.componentRef as any).instance.elRef.nativeElement);
  }

  @HostListener('click', ['$event'])
  clickEvent(event: Event): void {
    ChoosyButtonSelectDirective.compInstances.forEach((comp: any) => {
      comp.close(new Event('click'));
    });
    this.toggleDropdown(event);
  }
  @HostListener('document:click', ['$event'])
  documentClickEvent(event: Event): void {
    this.onDocumentClick(event);
  }
}
