import { IssuePriorityIcon } from '@trungk18/interface/issue-priority-icon';
import { IssueUtil } from '../utils/issue';
import { IssueTypeWithIcon } from '@trungk18/interface/issue-type-icon';

export class ProjectConst {
  static readonly IssueId = 'issueId';
  static readonly Projects = 'Projects';
  static PrioritiesWithIcon: IssuePriorityIcon[] = [
    IssueUtil.getIssuePriorityIcon(1),
    IssueUtil.getIssuePriorityIcon(2),
    IssueUtil.getIssuePriorityIcon(3),
    IssueUtil.getIssuePriorityIcon(4),
    IssueUtil.getIssuePriorityIcon(5)
  ];

  static IssueTypesWithIcon: IssueTypeWithIcon[] = [
    new IssueTypeWithIcon(1),
    new IssueTypeWithIcon(2),
    new IssueTypeWithIcon(3)
  ];
}
