import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneComponent } from '../one/one.component';
import { EditOneComponent } from '../one/edit-one/edit-one.component';
import { AddOneComponent } from '../one/add-one/add-one.component';
import { RouterModule, Routes } from '@angular/router';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { FormsModule } from '@angular/forms';
import { LoadingCardComponent } from '../loading-card/loading-card.component';
import { NoDataFoundComponent } from '../no-data-found/no-data-found.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { CoreThemeCustomizerModule } from '@core/components';
import { ConstractionComponent } from './constraction.component';
import { TruncatePipe } from '@core/pipes/truncate.pipe';

const appRoutes: Routes = [
  {
    path: 'list/:title',
    component: ConstractionComponent,
    data: { animation: 'home' }
  },
  {
    path: 'edit/:id/:title',
    component: EditOneComponent,
    data: { animation: 'home' }
  },
  {
    path: 'add/:title',
    component: AddOneComponent,
    data: { animation: 'home' }
  }
];

@NgModule({
  declarations: [
    ConstractionComponent,
    OneComponent,
    AddOneComponent,
    EditOneComponent,
    TruncatePipe  
  ],


  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    ContentHeaderModule,
    FormsModule,
    LoadingCardComponent,
    NgxDatatableModule,
    NoDataFoundComponent,
    // CategorySidebarRightComponent,
    //NgBootstrap
    NgbModule,
    CoreCommonModule,  // important
    // CoreSidebarModule,
    CoreThemeCustomizerModule,
  ],
  exports: [
    OneComponent,
    AddOneComponent,
    EditOneComponent
  ]
})
export class ConstractionModule { }
