"use client";

import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type SvgIconProps = React.HTMLAttributes<SVGElement>;

const DefaultSeparatorIcon = (props: SvgIconProps): React.JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    className="w-4 h-4"
    {...props}
  >
    <path d="m9 18 6-6-6-6"></path>
  </svg>
);

interface DynamicBreadcrumbProps
  extends React.ComponentProps<typeof Breadcrumb> {
  path: string;
  formatLabel?: (label: string) => string;
  separatorClassName?: string;
  excludeSegments?: string[];
  appendSegments?: string[];
  showSeparator?: boolean;
  SeparatorIcon?: (props: SvgIconProps) => React.JSX.Element;
  enableEllipsisOnDesktop?: boolean;
}

/**
 * Dynamic Breadcrumb Component
 *
 * @example
 *  Basic usage
 * <DynamicBreadcrumb path={pathname} />
 *
 *  With custom options
 * <DynamicBreadcrumb
 *   path={pathname}
 *   excludeSegments={["admin"]}
 *   separatorClassName="text-gray-400"
 * />
 */
const DynamicBreadcrumb = ({
  path,
  className,
  formatLabel = (label) =>
    label
      .replace(/^\d+[-.]?/, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim(),
  showSeparator = true,
  excludeSegments = [],
  enableEllipsisOnDesktop = true,
  appendSegments = [],
  SeparatorIcon = DefaultSeparatorIcon,
  separatorClassName,
  ...props
}: DynamicBreadcrumbProps) => {
  const isMobile = useIsMobile();
  let pathSegments = path.split("/").filter(Boolean);
  if (pathSegments.length === 0) {
    pathSegments = ["home"];
  }

  if (excludeSegments.length > 0) {
    pathSegments = pathSegments.filter(
      (segment) => !excludeSegments.includes(segment)
    );
  }
  if (appendSegments.length > 0) {
    pathSegments = [...pathSegments, ...appendSegments];
  }

  const maxVisibleSegments = 3;
  const shouldShowEllipsis =
    pathSegments.length > maxVisibleSegments &&
    (isMobile || enableEllipsisOnDesktop);

  return (
    <Breadcrumb className={cn("flex", className)} {...props}>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const isHome = segment === "home";
          const href = isHome
            ? "/"
            : `/${pathSegments.slice(1, index + 1).join("/")}`;
          const isFirstSegment = index === 0;
          const isLastSegment = index === pathSegments.length - 1;

          // Simplified ellipsis logic
          const isEllipsisInsertionPoint = shouldShowEllipsis && index === 1;
          const isLastVisibleBeforeEllipsis =
            shouldShowEllipsis && index === pathSegments.length - 2;

          const isSegmentVisible =
            !shouldShowEllipsis ||
            isFirstSegment ||
            isLastSegment ||
            isLastVisibleBeforeEllipsis;

          const formattedSegmentLabel = isHome ? "Home" : formatLabel(segment);

          return (
            <React.Fragment key={`${segment}-${index}`}>
              {/* Show ellipsis if needed */}
              {isEllipsisInsertionPoint && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </BreadcrumbItem>
                  {showSeparator && <BreadcrumbSeparator />}
                </>
              )}

              {/* Show actual breadcrumb item */}
              {isSegmentVisible && (
                <>
                  <BreadcrumbItem>
                    {isLastSegment ? (
                      <BreadcrumbPage
                        className={cn(
                          "font-medium text-foreground truncate max-w-[150px] md:max-w-none",
                          "text-sm"
                        )}
                      >
                        {formattedSegmentLabel}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={href}
                        className={cn(
                          "text-muted-foreground hover:text-foreground transition-colors",
                          "text-sm truncate max-w-[120px] md:max-w-none"
                        )}
                      >
                        {formattedSegmentLabel}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>

                  {/* Show separator after item (except for last item) */}
                  {showSeparator && !isLastSegment && (
                    <BreadcrumbSeparator>
                      {/* Let shadcn handle the default separator, or use custom */}
                      {SeparatorIcon !== DefaultSeparatorIcon ? (
                        <SeparatorIcon
                          className={cn("w-4 h-4", separatorClassName)}
                        />
                      ) : undefined}
                    </BreadcrumbSeparator>
                  )}
                </>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export { DynamicBreadcrumb };
