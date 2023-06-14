import { Component, OnInit } from '@angular/core';
import { HeaderModule } from '@c8y/ngx-components';

@Component({
  selector: 'app-subscriptions-list',
  templateUrl: './subscriptions-list.component.html',
  standalone: true,
  imports: [HeaderModule],
})
export class SubscriptionsListComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
