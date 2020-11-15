import { IssuePriorityColors } from './issue';

export class IssuePriorityIcon {
  icon: string;
  value: string;
  color: string;

  constructor(issuePriority) {
    let lowerPriorities = [1, 2];
    this.value = issuePriority;
    this.icon = lowerPriorities.includes(issuePriority) ? 'arrow-down' : 'arrow-up';
    this.color = IssuePriorityColors[issuePriority];
  }
}