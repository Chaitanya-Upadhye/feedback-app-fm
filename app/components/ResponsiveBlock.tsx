import { useMediaQuery } from "@uidotdev/usehooks";
import React from "react";

/**
 * Provides a React context for managing responsive layout information.
 *
 * The `MediaProvider` component wraps the application and provides a `MediaContext` that
 * contains information about the current device size (small, medium, large, extra-large).
 *
 * The `useMediaContext` hook can be used to access the current device size information
 * within any component that is wrapped by the `MediaProvider`.
 */
const MediaContext = React.createContext({
  isSmallDevice: false,
  isMediumDevice: false,
  isLargeDevice: false,
  isExtraLargeDevice: false,
});

function useMediaContext() {
  const context = React.useContext<{
    isSmallDevice: boolean;
    isMediumDevice: boolean;
    isLargeDevice: boolean;
    isExtraLargeDevice: boolean;
  }>(MediaContext);
  if (!context) {
    throw new Error("useMediaContext must be used within a ResponsiveBlock");
  }
  return context;
}

function MediaProvider({ children }: { children: React.ReactNode }) {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const isMediumDevice = useMediaQuery(
    "only screen and (min-width : 769px) and (max-width : 992px)"
  );
  const isLargeDevice = useMediaQuery(
    "only screen and (min-width : 993px) and (max-width : 1200px)"
  );
  const isExtraLargeDevice = useMediaQuery(
    "only screen and (min-width : 1201px)"
  );
  return (
    <MediaContext.Provider
      value={{
        isSmallDevice,
        isMediumDevice,
        isLargeDevice,
        isExtraLargeDevice,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}

/**
 * A responsive block component that wraps its children and provides media context information.
 *
 * The `ResponsiveBlock` component uses the `MediaProvider` to wrap its children and provide
 * media context information, such as whether the current device is small, medium, large, or extra-large.
 *
 * The `Mobile`, `Desktop`, and `Tablet` components are used to conditionally render their children
 * based on the current device size.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered inside the responsive block.
 */
export function ResponsiveBlock({ children }: { children: React.ReactNode }) {
  return <MediaProvider>{children}</MediaProvider>;
}

export const Mobile = ({ children }: { children: React.ReactNode }) => {
  const { isSmallDevice } = useMediaContext();
  if (!isSmallDevice) return null;
  return <>{children}</>;
};
export const Desktop = ({ children }: { children: React.ReactNode }) => {
  const { isLargeDevice, isExtraLargeDevice } = useMediaContext();
  if (!(isLargeDevice || isExtraLargeDevice)) return null;
  return <>{children}</>;
};
export const Tablet = ({ children }: { children: React.ReactNode }) => {
  const { isMediumDevice } = useMediaContext();
  if (!isMediumDevice) return null;
  return <>{children}</>;
};
export default ResponsiveBlock;
