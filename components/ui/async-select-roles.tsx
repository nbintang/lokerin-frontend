import { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useDebounce from "@/hooks/use-debounce";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

// Interface untuk paginated response
export interface PaginatedResponse<T> {
  roles: T[]; // atau data, items, dll sesuai API response
  page: number;
  limit: number;
  total: number;
}

export interface AsyncSelectProps<T> {
  /** Async function to fetch options with pagination */
  fetcher: (
    query?: string,
    page?: number,
    limit?: number
  ) => Promise<PaginatedResponse<T>>;
  /** Function to render each option */
  renderOption: (option: T) => React.ReactNode;
  /** Function to get the value from an option */
  getOptionValue: (option: T) => string;
  /** Function to get the display value for the selected option */
  getDisplayValue: (option: T) => React.ReactNode;
  /** Custom not found message */
  notFound?: (
    query: string,
    onSelect: (value: string) => void
  ) => React.ReactNode;
  /** Custom loading skeleton */
  loadingSkeleton?: React.ReactNode;
  /** Currently selected value */
  value: string;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Label for the select field */
  label: string;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Disable the entire select */
  disabled?: boolean;
  /** Custom width for the popover */
  /** Custom class names */
  className?: string;
  /** Custom trigger button class names */
  triggerClassName?: string;
  /** Custom no results message */
  noResultsMessage?: string;
  /** Allow clearing the selection */
  clearable?: boolean;
  /** Items per page */
  pageSize?: number;
  /** Query key for react-query */
  queryKey?: string;
}

export function AsyncSelectRoles<T>({
  fetcher,
  renderOption,
  getOptionValue,
  getDisplayValue,
  notFound,
  loadingSkeleton,
  label,
  placeholder = "Select...",
  value,
  onChange,
  disabled = false,
  className,
  triggerClassName,
  noResultsMessage,
  clearable = true,
  pageSize = 10,
  queryKey = "async-select",
}: AsyncSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [selectedOption, setSelectedOption] = useState<T | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "70px",
  });
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: [queryKey, debouncedSearchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetcher(debouncedSearchTerm, pageParam, pageSize);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.page * lastPage.limit < lastPage.total;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    enabled: open, // Only fetch when dropdown is open
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
  const options = data?.pages.flatMap((page) => page.roles) ?? [];
  const totalItems = data?.pages[0]?.total ?? 0;
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // Initialize selectedOption when options are loaded and value exists
  useEffect(() => {
    if (value && options.length > 0) {
      const option = options.find((opt) => getOptionValue(opt) === value);
      if (option) {
        setSelectedOption(option);
      }
    }
  }, [value, options, getOptionValue]);

  // Fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSelect = useCallback(
    (currentValue: string) => {
      const newValue =
        clearable && currentValue === selectedValue ? "" : currentValue;
      setSelectedValue(newValue);
      setSelectedOption(
        options.find((option) => getOptionValue(option) === newValue) || null
      );
      onChange(newValue);
      setOpen(false);
    },
    [selectedValue, onChange, clearable, options, getOptionValue]
  );

  // Reset search when dropdown opens/closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full" asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between w-full",
            disabled && "opacity-50 cursor-not-allowed",
            selectedOption ? "text-foreground" : " text-muted-foreground",
            triggerClassName
          )}
          disabled={disabled}
        >
          {selectedOption ? (
            getDisplayValue(selectedOption)
          ) : value ? (
            <div className="font-medium">{value}</div> // Display raw value if no option object
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="opacity-50" size={10} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0 w-[var(--radix-popover-trigger-width)]", className)}
      >
        <Command className="w-full" shouldFilter={false}>
          <div className="relative border-b w-full">
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onValueChange={(value) => {
                setSearchTerm(value);
              }}
            />
            {(isLoading || isFetchingNextPage) && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          <CommandList className="max-h-[300px]">
            {isError && (
              <div className="p-4 text-destructive text-center">
                <p className="text-sm mb-2">
                  {error instanceof Error
                    ? error.message
                    : "Failed to fetch options"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="text-xs"
                >
                  Try Again
                </Button>
              </div>
            )}

            {isLoading &&
              options.length === 0 &&
              (loadingSkeleton || <DefaultLoadingSkeleton />)}

            {!isLoading && !isError && options.length === 0 && (
              <>
                {typeof notFound === "function"
                  ? notFound(debouncedSearchTerm, handleSelect)
                  : notFound || (
                      <CommandEmpty>
                        {noResultsMessage ||
                          `No results for "${debouncedSearchTerm}"`}
                      </CommandEmpty>
                    )}
              </>
            )}

            {options.length > 0 && (
              <CommandGroup>
                {/* Clear option */}
                {clearable && selectedValue && (
                  <CommandItem
                    value="__clear__"
                    onSelect={() => handleSelect("")}
                    className="text-muted-foreground italic border-b"
                  >
                    Clear selection
                  </CommandItem>
                )}

                {/* Options */}
                {options.map((option, index) => (
                  <CommandItem
                    key={`${getOptionValue(option)}-${index}`}
                    value={getOptionValue(option)}
                    onSelect={handleSelect}
                  >
                    {renderOption(option)}
                    <Check
                      className={cn(
                        "ml-auto h-3 w-3",
                        selectedValue === getOptionValue(option)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}

                {/* Load More Trigger */}
                {hasNextPage && <div ref={loadMoreRef} className="h-4" />}

                {/* Loading More Indicator */}
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-muted-foreground">
                      Loading more...
                    </span>
                  </div>
                )}

                {/* Results Info */}
                {totalItems > 0 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/50 border-t">
                    Showing {options.length} of {totalItems} results
                    {hasNextPage && " (more available)"}
                  </div>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DefaultLoadingSkeleton() {
  return (
    <CommandGroup>
      {[1, 2, 3].map((i) => (
        <CommandItem key={i} disabled>
          <div className="flex items-center gap-2 w-full">
            <div className="h-6 w-6 rounded-full animate-pulse bg-muted" />
            <div className="flex flex-col flex-1 gap-1">
              <div className="h-4 w-24 animate-pulse bg-muted rounded" />
              <div className="h-3 w-16 animate-pulse bg-muted rounded" />
            </div>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
