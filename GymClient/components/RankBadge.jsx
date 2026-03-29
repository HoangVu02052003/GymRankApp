import { Badge } from 'react-bootstrap';

export default function RankBadge({ rank, size = 'md' }) {
  if (!rank) return null;

  const getBadgeColor = (level) => {
    if (level <= 3) return 'secondary';
    if (level <= 6) return 'primary';
    if (level <= 9) return 'warning';
    return 'danger';
  };

  return (
    <Badge 
      bg={getBadgeColor(rank.level)} 
      className={`rank-badge ${size === 'lg' ? 'fs-5' : ''}`}
    >
      {rank.tenrank}
    </Badge>
  );
}
