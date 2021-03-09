import { AppSyncResolverEvent, AppSyncIdentityCognito } from 'aws-lambda';

export interface NewAppSyncResolverEvent<T> extends AppSyncResolverEvent<T> {
    identity: AppSyncIdentityCognito,
}