import React, { ReactNode } from 'react';
import { WorkspaceProvider, useWorkspace, loadState, saveState } from '@/context/WorkspaceContext';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';


interface WorkspacesProps {
  children: ReactNode;
}

const Workspaces: React.FC<WorkspacesProps> = ({ children }) => (
  <WorkspaceProvider>
    <Workspace />
    {children}
  </WorkspaceProvider>
);

const Workspace = () => {
  const { state, dispatch } = useWorkspace();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Restore state from localStorage on initial load
    const savedState = loadState();
    if (savedState) {
      dispatch({ type: 'RESTORE_STATE', payload: savedState });
    }
  }, []);

  useEffect(() => {
    // Save state to localStorage whenever it changes
    saveState(state);
  }, [state]);

  const handleAddTab = () => {
    const grade = searchParams.get('grade');
    const course = searchParams.get('course');
    const chapter = searchParams.get('chapter');
    const subChapter = searchParams.get('subChapter');

    const params = {
      grade,
      course,
      chapter,
      subChapter,
    };

    dispatch({
      type: 'ADD_TAB',
      payload: {
        pathname: '/content',
        title: 'New Tab',
        params,
      },
    });
  };

  const handleCloseTab = (id: string) => {
    dispatch({ type: 'CLOSE_TAB', payload: { id } });
  };

  const handleSwitchTab = (id: string) => {
    dispatch({ type: 'SWITCH_TAB', payload: { id } });
  };

  return (
    <div>
      <button onClick={handleAddTab}>Add Tab</button>
      <div>
        {state.tabs.map((tab) => (
          <div key={tab.id}>
            <span>{tab.title}</span>
            <button onClick={() => handleSwitchTab(tab.id)}>Switch</button>
            <button onClick={() => handleCloseTab(tab.id)}>Close</button>
          </div>
        ))}
      </div>
      <div>Active Tab: {state.activeTab}</div>
    </div>
  );
};

export default Workspaces;
