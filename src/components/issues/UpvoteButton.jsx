import React from 'react';
import { Button, Tooltip, message } from 'antd';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import confetti from 'canvas-confetti';
import { useAuth } from '../../contexts/AuthContext';
import { useIssues } from '../../contexts/IssueContext';

const UpvoteButton = ({ issue, size = 'default' }) => {
  const { currentUser } = useAuth();
  const { toggleUpvote } = useIssues();

  const votes = issue?.votes || [];
  const hasVoted = currentUser ? votes.includes(currentUser.id) : false;
  const count = votes.length;

  const handleVote = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      message.warning('Please log in to vote on municipal issues.');
      return;
    }

    if (!hasVoted) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
      message.success('Upvote recorded! Priority score boosted.');
    }

    toggleUpvote(issue.id, currentUser.id);
  };

  return (
    <Tooltip title={hasVoted ? 'Click to withdraw upvote' : 'Upvote to increase priority for city resolution'}>
      <Button
        type={hasVoted ? 'primary' : 'default'}
        size={size}
        icon={hasVoted ? <LikeFilled /> : <LikeOutlined />}
        onClick={handleVote}
        style={{
          borderRadius: 8,
          fontWeight: 700,
          background: hasVoted ? 'linear-gradient(135deg, #1677FF 0%, #003A8C 100%)' : undefined,
          border: hasVoted ? 'none' : undefined,
          boxShadow: hasVoted ? '0 4px 10px rgba(22, 119, 255, 0.3)' : undefined
        }}
      >
        {count} {count === 1 ? 'Upvote' : 'Upvotes'}
      </Button>
    </Tooltip>
  );
};

export default UpvoteButton;
