import { Routes } from '@angular/router';
import { AddHelperComponent } from './add-helper/add-helper.component';
import { HelpersComponent } from './helpers/helpers.component';
import { UpdateHelperComponent } from './update-helper/update-helper.component';

export const routes: Routes = [
    { path: 'add-helper',component: AddHelperComponent},
    { path: '',component: HelpersComponent},
    { path: 'edit-helper/:helperID',component: UpdateHelperComponent}
];
