import { useLayoutEffect } from 'react';
import { useHeaderContext, type HeaderAction } from '../context/HeaderContext';

export interface HeaderConfig {
  title?: string;
  onBack?: () => void;
  breadcrumb?: string;
  actions?: HeaderAction[];
}

/**
 * A hook to register page-specific title, back button, breadcrumb and actions to the AppHeader.
 * All settings are automatically cleared when the component unmounts.
 * 
 * @param configOrActions - HeaderConfig object or HeaderAction array.
 * @param deps - Dependency array.
 */
const useHeaderActions = (configOrActions: HeaderConfig | HeaderAction[], deps: React.DependencyList = []) => {
  const {
    setPageActions,
    clearPageActions,
    setPageTitle,
    clearPageTitle,
    setOnBack,
    clearOnBack,
    setBreadcrumb,
    clearBreadcrumb,
  } = useHeaderContext();

  useLayoutEffect(() => {
    if (Array.isArray(configOrActions)) {
      setPageActions(configOrActions);
    } else {
      if (configOrActions.title) setPageTitle(configOrActions.title);
      if (configOrActions.actions) setPageActions(configOrActions.actions);
      if (configOrActions.onBack) setOnBack(configOrActions.onBack);
      if (configOrActions.breadcrumb) setBreadcrumb(configOrActions.breadcrumb);
    }
    return () => {
      clearPageActions();
      clearPageTitle();
      clearOnBack();
      clearBreadcrumb();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useHeaderActions;
