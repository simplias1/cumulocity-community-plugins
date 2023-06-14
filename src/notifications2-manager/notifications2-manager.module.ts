import { NgModule } from '@angular/core';
import { HOOK_NAVIGATOR_NODES, NavigatorNode } from '@c8y/ngx-components';
import { RouterModule } from '@angular/router';

const path = 'notifications2-manager';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path,
        loadComponent: () =>
          import('./subscriptions-list/subscriptions-list.component').then(
            (m) => m.SubscriptionsListComponent
          ),
      },
    ]),
  ],
  providers: [
    {
      provide: HOOK_NAVIGATOR_NODES,
      useValue: [
        new NavigatorNode({
          path,
          label: 'Notification2',
        }),
      ],
      multi: true,
    },
  ],
})
export class Notifications2ManagerModule {}
