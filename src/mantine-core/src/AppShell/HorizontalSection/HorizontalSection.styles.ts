import { createStyles, MantineNumberSize } from '@mantine/styles';
import { getSortedBreakpoints } from './get-sorted-breakpoints/get-sorted-breakpoints';

export type HorizontalSectionWidth = Partial<Record<string, string | number>>;

export interface HorizontalSectionPosition {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

interface HorizontalSectionStyles {
  width: Partial<Record<string, string | number>>;
  height: string | number;
  position: HorizontalSectionPosition;
  hiddenBreakpoint: MantineNumberSize;
  fixed: boolean;
  zIndex: React.CSSProperties['zIndex'];
  section: 'navbar' | 'aside';
  layout: 'default' | 'alt';
  withBorder: boolean;
}

export default createStyles(
  (
    theme,
    {
      height,
      width,
      fixed,
      position,
      hiddenBreakpoint,
      zIndex,
      section,
      withBorder,
      layout,
    }: HorizontalSectionStyles
  ) => {
    const breakpoints =
      typeof width === 'object' && width !== null
        ? getSortedBreakpoints(width, theme).reduce((acc, [breakpoint, breakpointSize]) => {
            acc[`@media (min-width: ${breakpoint}px)`] = {
              width: breakpointSize,
              minWidth: breakpointSize,
            };

            return acc;
          }, {})
        : null;

    const borderStyles = withBorder
      ? {
          [section === 'navbar' ? 'borderRight' : 'borderLeft']: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
          }`,
        }
      : {};

    return {
      root: {
        ...theme.fn.fontStyles(),
        ...position,
        top: layout === 'alt' ? 0 : position?.top || 'var(--mantine-header-height)',
        bottom: 0,
        zIndex,
        height:
          height ||
          (layout === 'alt'
            ? 'auto'
            : 'calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))'),
        width: width?.base || '100%',
        position: fixed ? 'fixed' : 'static',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        ...borderStyles,
        ...breakpoints,

        '&[data-hidden]': {
          [`@media (max-width: ${
            theme.fn.size({
              size: hiddenBreakpoint,
              sizes: theme.breakpoints,
            }) - 1
          }px)`]: {
            display: 'none',
          },
        },
      },
    };
  }
);
