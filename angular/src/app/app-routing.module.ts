import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacebookadsComponent } from './facebookads/facebookads.component';
import { GoogleadsComponent } from './googleads/googleads.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FbgoogleadsComponent } from './fbgoogleads/fbgoogleads.component';

const routes: Routes = [
  {
      path: "facebook",
      component: FacebookadsComponent
      
  },
  {
      path: "google",
      component: GoogleadsComponent
  },
  {
      path: "fbgoogle",
      component: DashboardComponent
     
  },
  {
      path: "",
      component: DashboardComponent 
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
