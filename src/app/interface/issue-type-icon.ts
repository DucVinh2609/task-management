import { IssueType } from './issue';
import { IssueUtil } from '@trungk18/project/utils/issue';

export class IssueTypeWithIcon {
  value: string;
  icon: string;

  constructor(issueTypeId) {
    this.value = issueTypeId;
    this.icon = IssueUtil.getIssueTypeIcon(issueTypeId);
  }
}
