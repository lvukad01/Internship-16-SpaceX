import { type ComponentType } from 'react';
import styles from './withLoading.module.css';

interface WithLoadingProps {
  isLoading: boolean;
}

export function withLoading<T extends object>(
  Component: ComponentType<T>
) {
  return function WithLoadingComponent(props: T & WithLoadingProps) {
    const { isLoading, ...remainingProps } = props;

    if (isLoading) {
      return (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p>Loading SpaceX data...</p>
        </div>
      );
    }

    return <Component {...(remainingProps as T)} />;
  };
}