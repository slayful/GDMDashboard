import { ApiInterface, config } from './api_interface';
import {
  LoggedInResponse,
  LoggedOutResponse,
  ModeratorActionsResponse,
  ReportedPostsErrorResponse,
  ReportedPostsResponse,
} from './discussions_interface';
import { DWDimensionApiGetWikisResponse } from './dw_dimensions_api_interface';
import { ListUsersSearchUserResponse, QueryTokensResponse } from './query_interface';

export class DashboardApi extends ApiInterface {
  checkLoggedIn(): Promise<LoggedInResponse | LoggedOutResponse> {
    return this.request<LoggedInResponse | LoggedOutResponse>({
      method: 'GET',
      path: `${config.SERVICES}/whoami`,
    });
  }

  getReportedPosts(wiki: string): Promise<ReportedPostsResponse | ReportedPostsErrorResponse> {
    return this.wikiaGet<ReportedPostsResponse>(wiki, {
      controller: 'DiscussionModeration',
      method: 'getReportedPosts',
    });
  }

  getModActions(wiki: string, days: '30' | '90'): Promise<ModeratorActionsResponse> {
    return this.wikiaGet<ModeratorActionsResponse>(wiki, {
      controller: 'DiscussionLeaderboard',
      method: 'getModeratorActions',
      days,
    });
  }

  getWikiList(afterWikiId: number, limit: number): Promise<DWDimensionApiGetWikisResponse> {
    return this.wikiaGet<DWDimensionApiGetWikisResponse>('community.fandom.com', {
      controller: 'DWDimensionApi',
      method: 'getWikis',
      after_wiki_id: afterWikiId,
      limit,
    });
  }

  getToken(wiki: string): Promise<QueryTokensResponse> {
    return this.mwGet<QueryTokensResponse>(wiki, {
      action: 'query',
      meta: 'tokens',
      format: 'json',
    });
  }

  // limit = 138 at time of run. Doubt the number will go up unless we add more groups
  listUsersSearch(limit: number, offset: number): Promise<ListUsersSearchUserResponse> {
    return this.mwGet<ListUsersSearchUserResponse>('community.fandom.com', {
      action: 'listuserssearchuser',
      username: '',
      groups: config.RELEVANT_GROUPS.join(','),
      contributed: 0,
      limit: limit || 500,
      order: 'cnt_groups',
      sort: 'asc',
      offset: offset || 0,
      format: 'json',
    });
  }
}
