import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
  } from '@angular/core';
import { ChoosyFooterComponent } from './components/choosy-footer/choosy-footer.component';
import { ChoosyListComponent } from './components/choosy-list/choosy-list.component';
import { ChoosyResultsComponent } from './components/choosy-results/choosy-results.component';
import { ChoosySearchComponent } from './components/choosy-search/choosy-search.component';
import { ChoosyInputDirective } from './directives/choosy-input/choosy-input.directive';
import { ChoosyConfigService } from './services/choosy-config/choosy-config.service';
import { GlobalConfigData } from './services/choosy-config/choosy-config.service';

export function ChoosyConfigLoader(globalConfig: any): ChoosyConfigService {
  return new ChoosyConfigService(globalConfig);
}

@NgModule({
  imports: [CommonModule],
  entryComponents: [
    ChoosyResultsComponent
  ],
  declarations: [
    ChoosySearchComponent,
    ChoosyListComponent,
    ChoosyResultsComponent,
    ChoosyFooterComponent,
    ChoosyInputDirective
  ],
  exports: [
    ChoosySearchComponent,
    ChoosyListComponent,
    ChoosyResultsComponent,
    ChoosyFooterComponent,
    ChoosyInputDirective
  ],
  providers: [ChoosyConfigService]
})
export class NgxChoosyModule {
  static forRoot(globalConfig: any): ModuleWithProviders {
    return {
      ngModule: NgxChoosyModule,
      providers: [
        { provide: ChoosyConfigLoader, useValue: globalConfig }
      ]
    };
  }
  constructor( @Optional() @SkipSelf() parentModule: NgxChoosyModule) {
    if (parentModule)
      throw new Error('NgxChoosyModule is already loaded. Import it in the Parent only');
  }
}
