import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';
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

  // Sync to local storage for persistence across reloads & offline backup
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

  // Real-time Firestore sync for Issues
  useEffect(() => {
    let unsubscribe = () => {};

    try {
      const issuesRef = collection(db, 'issues');
      
      // Auto-seed Firestore if collection is empty on initial check
      getDocs(issuesRef).then(snapshot => {
        if (snapshot.empty) {
          INITIAL_ISSUES.forEach(async (initIssue) => {
            await setDoc(doc(db, 'issues', initIssue.id), initIssue);
          });
        }
      }).catch(e => console.warn('Firestore auto-seed notice:', e));

      // Subscribe to real-time updates from Cloud Firestore
      unsubscribe = onSnapshot(issuesRef, (snapshot) => {
        if (!snapshot.empty) {
          const remoteIssues = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
          }));

          // Sort latest issues first
          remoteIssues.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

          setIssues(remoteIssues);
        }
      }, (error) => {
        console.warn('Firestore listener warning (using local state fallback):', error);
      });
    } catch (err) {
      console.warn('Firestore initialization fallback:', err);
    }

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Comments
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const commentsRef = collection(db, 'comments');
      unsubscribe = onSnapshot(commentsRef, (snapshot) => {
        if (!snapshot.empty) {
          const grouped = {};
          snapshot.docs.forEach(d => {
            const commentData = { id: d.id, ...d.data() };
            if (commentData.issueId) {
              if (!grouped[commentData.issueId]) grouped[commentData.issueId] = [];
              grouped[commentData.issueId].push(commentData);
            }
          });
          setComments(prev => ({ ...prev, ...grouped }));
        }
      }, e => console.warn('Comments listener warning:', e));
    } catch (e) {}

    return () => unsubscribe();
  }, []);

  // Create new issue in Firestore & local state
  const createIssue = (issueData) => {
    const issueId = `issue-${Date.now()}`;
    const newIssue = {
      id: issueId,
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

    // Optimistic local state update
    setIssues(prev => [newIssue, ...prev]);

    // Save to Firestore
    setDoc(doc(db, 'issues', issueId), newIssue).catch(err => {
      console.error('Error writing issue to Firestore:', err);
    });

    return newIssue;
  };

  // Update status by Department Officer or Admin
  const updateIssueStatus = (issueId, status, resolutionNotes = '', resolutionImages = [], estimatedCompletionDate = null) => {
    const updates = {
      status,
      resolutionNotes,
      resolutionImages,
      estimatedCompletionDate,
      updatedAt: new Date().toISOString()
    };

    // Optimistic local state update
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

    // Save to Firestore
    updateDoc(doc(db, 'issues', issueId), updates).catch(err => {
      console.error('Error updating issue status in Firestore:', err);
    });
  };

  // Toggle upvote with anti-duplicate check
  const toggleUpvote = (issueId, userId) => {
    if (!userId) return;

    let updatedVotes = [];
    setIssues(prev =>
      prev.map(issue => {
        if (issue.id === issueId) {
          const hasVoted = issue.votes ? issue.votes.includes(userId) : false;
          updatedVotes = hasVoted
            ? (issue.votes || []).filter(id => id !== userId)
            : [...(issue.votes || []), userId];
          return { ...issue, votes: updatedVotes };
        }
        return issue;
      })
    );

    // Save to Firestore
    updateDoc(doc(db, 'issues', issueId), {
      votes: updatedVotes,
      updatedAt: new Date().toISOString()
    }).catch(err => {
      console.error('Error updating votes in Firestore:', err);
    });
  };

  // Add Comment
  const addComment = (issueId, message, user) => {
    const commentId = `comment-${Date.now()}`;
    const newComment = {
      id: commentId,
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
          const newCount = (issue.commentsCount || 0) + 1;
          updateDoc(doc(db, 'issues', issueId), { commentsCount: newCount }).catch(e => {});
          return { ...issue, commentsCount: newCount };
        }
        return issue;
      })
    );

    setDoc(doc(db, 'comments', commentId), newComment).catch(err => {
      console.error('Error adding comment to Firestore:', err);
    });
  };

  // Edit issue before resolution
  const editIssue = (issueId, updates) => {
    const fullUpdates = { ...updates, updatedAt: new Date().toISOString() };
    setIssues(prev =>
      prev.map(issue => (issue.id === issueId ? { ...issue, ...fullUpdates } : issue))
    );

    updateDoc(doc(db, 'issues', issueId), fullUpdates).catch(err => {
      console.error('Error editing issue in Firestore:', err);
    });
  };

  // Delete issue
  const deleteIssue = (issueId) => {
    setIssues(prev => prev.filter(issue => issue.id !== issueId));

    deleteDoc(doc(db, 'issues', issueId)).catch(err => {
      console.error('Error deleting issue from Firestore:', err);
    });
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

    updateDoc(doc(db, 'issues', issueId), { assignedOfficer: officer, updatedAt: new Date().toISOString() }).catch(err => {});
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
