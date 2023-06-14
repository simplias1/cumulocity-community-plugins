import { Component } from '@angular/core';
import {
  ActionControl,
  Column,
  DataGridModule,
  DataSourceModifier,
  DisplayOptions,
  HeaderModule,
  ModalService,
  Pagination,
  Row,
  ServerSideDataResult,
} from '@c8y/ngx-components';
import { Notifications2SubscriptionsService } from '../notifications2-subscriptions.service';

@Component({
  selector: 'app-subscriptions-list',
  templateUrl: './subscriptions-list.component.html',
  standalone: true,
  imports: [HeaderModule, DataGridModule],
})
export class SubscriptionsListComponent {
  columns: Column[] = [
    { name: 'Subscription Id', path: 'id' },
    { name: 'Subscription', path: 'subscription' },
    { name: 'Context', path: 'context' },
    { name: 'SourceId', path: 'source.id' },
    { name: 'nonPersistent', path: 'nonPersistent' },
  ];
  actionControls: ActionControl[] = [
    {
      type: 'delete',
      text: 'delete',
      callback: (item, reload) => this.processDelete(item, reload),
    },
  ];
  serverSideDataCallback: any;
  pagination: Pagination = {
    pageSize: 10,
    currentPage: 1,
  };
  displayOptions: DisplayOptions = {
    bordered: true,
    striped: true,
    filter: true,
    gridHeader: true,
  };
  constructor(
    private service: Notifications2SubscriptionsService,
    private modal: ModalService
  ) {
    // we're setting up `serverSideDataCallback` to execute a method from this component with bound `this`
    this.serverSideDataCallback = this.onDataSourceModifier.bind(this);
  }

  async onDataSourceModifier(
    dataSourceModifier: DataSourceModifier
  ): Promise<ServerSideDataResult> {
    const { res, data, paging } = await this.service.list();
    // const filteredSize: number = await this.service.getCount(
    //   dataSourceModifier.columns,
    //   dataSourceModifier.pagination
    // );
    // const size: number = await this.service.getTotal();
    console.log(data, paging);

    const serverSideDataResult: ServerSideDataResult = {
      res,
      data,
      paging,
      // filteredSize,
      // size,
      size: null,
      filteredSize: null,
    };

    return serverSideDataResult;
  }

  private async processDelete(item: Row, reloadFn: () => void) {
    try {
      await this.modal.confirm(
        'Confirm Deletion',
        'Are you sure you want to delete this subscription?',
        'danger'
      );
    } catch {
      return;
    }

    await this.service.delete(item);
    reloadFn();
  }
}
