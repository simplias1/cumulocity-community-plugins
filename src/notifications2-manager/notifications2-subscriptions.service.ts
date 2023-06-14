import { Injectable } from '@angular/core';
import {
  FetchClient,
  IResultList,
  Service,
  IIdentified,
  IManagedObject,
  IResult,
} from '@c8y/client';

export interface INotificationSubscription extends IIdentified {
  context: string;
  source: IManagedObject & { name?: string };
}

@Injectable({ providedIn: 'root' })
export class Notifications2SubscriptionsService extends Service<INotificationSubscription> {
  protected baseUrl = 'notification2';
  protected listUrl = 'subscriptions';
  protected propertyName = 'subscriptions';
  constructor(client: FetchClient) {
    super(client);
  }

  list(filter?: object): Promise<IResultList<INotificationSubscription>> {
    return super.list(filter);
  }

  delete(entityOrId: string | number | IIdentified): Promise<IResult<null>> {
    return super.delete(entityOrId);
  }
}
