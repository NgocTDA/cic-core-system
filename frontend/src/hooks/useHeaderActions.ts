import { useEffect } from 'react';
import { useHeaderContext, type HeaderAction } from '../context/HeaderContext';

interface HeaderConfig {
  title?: string;
  actions?: HeaderAction[];
}

/**
 * A hook to register page-specific title and actions to the AppHeader.
 * Both title and actions are automatically cleared when the component unmounts.
 * 
 * @param config - Object with optional title and actions.
 * @param deps - Dependency array, same as useEffect.
 */
const useHeaderActions = (configOrActions: HeaderConfig | HeaderAction[], deps: React.DependencyList = []) => {
  const { setPageActions, clearPageActions, setPageTitle, clearPageTitle } = useHeaderContext();

  useEffect(() => {
    if (Array.isArray(configOrActions)) {
      // Legacy usage: useHeaderActions([...actions], deps)
      setPageActions(configOrActions);
    } else {
      // New usage: useHeaderActions({ title, actions }, deps)
      if (configOrActions.title) setPageTitle(configOrActions.title);
      if (configOrActions.actions) setPageActions(configOrActions.actions);
    }
    return () => {
      clearPageActions();
      clearPageTitle();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useHeaderActions;
