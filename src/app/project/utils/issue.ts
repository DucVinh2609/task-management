import { IssuePriorityIcon } from '@trungk18/interface/issue-priority-icon';
import dummy from 'src/assets/data/project.json';

export class IssueUtil {
  static getIssueTypeIcon(id): string {
    // return issueType?.toLowerCase();
    return dummy.issueType.filter(p => p.id === id)[0].type;
  }

  static getIssuePriorityIcon(id): IssuePriorityIcon {
    let issuePriority = dummy.issuePriority.filter(p => p.id === id)[0].id;
    return new IssuePriorityIcon(issuePriority);
  }

  static getRandomId(): string {
    return `${Math.ceil(Math.random() * 90000)}`;
  }

  static searchString(str: string, searchString: string): boolean {
    str = str ?? '';
    searchString = searchString ?? '';
    return str.trim().toLowerCase().includes(searchString.trim().toLowerCase());
  }
}
