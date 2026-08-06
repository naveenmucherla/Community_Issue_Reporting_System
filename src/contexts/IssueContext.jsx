import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ISSUES, INITIAL_DEPARTMENTS, INITIAL_COMMENTS } from '../firebase/seedData';

const IssueContext = createContext();

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState(() => {
    const saved = localStorage.getItem('civicfix_issues');
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('civicfix_departments');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('civicfix_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('civicfix_bookmarks');
    return saved ? JSON.parse(saved) : ['issue-101'];
  });

  // Sync to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('civicfix_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('civicfix_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('civicfix_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('civicfix_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Create new issue
  const createIssue = (issueData) => {
    const newIssue = {
      id: `issue-${Date.now()}`,
      status: 'PENDING',
      votes: [],
      commentsCount: 0,
      estimatedCompletionDate: null,
      resolutionNotes: '',
      resolutionImages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...issueData
    };

    setIssues(prev => [newIssue, ...prev]);
    return newIssue;
  };

  // Update status by Department Officer or Admin
  const updateIssueStatus = (issueId, status, resolutionNotes = '', resolutionImages = [], estimatedCompletionDate = null) => {
    setIssues(prev =>
      prev.map(issue => {
        if (issue.id === issueId) {
          return {
            ...issue,
            status,
            resolutionNotes: resolutionNotes || issue.resolutionNotes,
            resolutionImages: resolutionImages.length > 0 ? resolutionImages : issue.resolutionImages,
            estimatedCompletionDate: estimatedCompletionDate || issue.estimatedCompletionDate,
            updatedAt: new Date().toISOString()
          };
        }
        return issue;
      })
    );
  };

  // Toggle upvote with anti-duplicate check
  const toggleUpvote = (issueId, userId) => {
    if (!userId) return;
    setIssues(prev =>
      prev.map(issue => {
        if (issue.id === issueId) {
          const hasVoted = issue.votes.includes(userId);
          const newVotes = hasVoted
            ? issue.votes.filter(id => id !== userId)
            : [...issue.votes, userId];
          return { ...issue, votes: newVotes };
        }
        return issue;
      })
    );
  };

  // Add Comment
  const addComment = (issueId, message, user) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      issueId,
      user,
      message,
      createdAt: new Date().toISOString()
    };

    setComments(prev => ({
      ...prev,
      [issueId]: [...(prev[issueId] || []), newComment]
    }));

    setIssues(prev =>
      prev.map(issue => {
        if (issue.id === issueId) {
          return { ...issue, commentsCount: (issue.commentsCount || 0) + 1 };
        }
        return issue;
      })
    );
  };

  // Edit issue before resolution
  const editIssue = (issueId, updates) => {
    setIssues(prev =>
      prev.map(issue => (issue.id === issueId ? { ...issue, ...updates, updatedAt: new Date().toISOString() } : issue))
    );
  };

  // Delete issue
  const deleteIssue = (issueId) => {
    setIssues(prev => prev.filter(issue => issue.id !== issueId));
  };

  // Toggle Bookmark
  const toggleBookmark = (issueId) => {
    setBookmarks(prev =>
      prev.includes(issueId) ? prev.filter(id => id !== issueId) : [...prev, issueId]
    );
  };

  // Assign Officer to issue
  const assignOfficer = (issueId, officer) => {
    setIssues(prev =>
      prev.map(issue => (issue.id === issueId ? { ...issue, assignedOfficer: officer } : issue))
    );
  };

  return (
    <IssueContext.Provider
      value={{
        issues,
        departments,
        comments,
        bookmarks,
        createIssue,
        updateIssueStatus,
        toggleUpvote,
        addComment,
        editIssue,
        deleteIssue,
        toggleBookmark,
        assignOfficer
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) throw new Error('useIssues must be used within IssueProvider');
  return context;
};
