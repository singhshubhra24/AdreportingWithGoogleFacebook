import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormsModule } from '@angular/forms'

import { HttpClientModule } from '@angular/common/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FacebookadsComponent } from './facebookads/facebookads.component';
import { GoogleadsComponent } from './googleads/googleads.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FbgoogleadsComponent } from './fbgoogleads/fbgoogleads.component';
import { AsidesComponent } from './asides/asides.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TblThreeClmnComponent } from './commonComponent/tbl-three-clmn/tbl-three-clmn.component';
import { OptionSelectionComponent } from './commonComponent/option-selection/option-selection.component';
import { CardComponentComponent } from './commonComponent/card-component/card-component.component';
import { TblThreeClmnUpDonwComponent } from './commonComponent/tbl-three-clmn-up-donw/tbl-three-clmn-up-donw.component';
import { CompaignPerformanceComponent } from './dashboard/compaign-performance/compaign-performance.component';
import { AllNetworksComponent } from './dashboard/all-networks/all-networks.component';
import { TopNetworksComponent } from './dashboard/top-networks/top-networks.component';
import { SummaryGraphWrapComponent } from './dashboard/summary-graph-wrap/summary-graph-wrap.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DisplayedNetworksComponent } from './dashboard/displayed-networks/displayed-networks.component';
import { HighchartsChartModule } from 'highcharts-angular';

import { ThousandSuffixesPipe } from './service/shortkeys.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FacebookadsComponent,
    GoogleadsComponent,
    DashboardComponent,
    FbgoogleadsComponent,
    AsidesComponent,
    NavbarComponent,
    TblThreeClmnComponent,
    OptionSelectionComponent,
    CardComponentComponent,
    TblThreeClmnUpDonwComponent,
    CompaignPerformanceComponent,
    AllNetworksComponent,
    TopNetworksComponent,
    SummaryGraphWrapComponent,
    DisplayedNetworksComponent,
    ThousandSuffixesPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgScrollbarModule,
    Ng2SearchPipeModule,
    Ng4LoadingSpinnerModule.forRoot(),
    FormsModule,HighchartsChartModule ],
  providers: [],
  bootstrap: [AppComponent],
  exports : [ThousandSuffixesPipe]
})
export class AppModule { }
