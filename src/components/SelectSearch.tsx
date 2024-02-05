import useDebounce from "@/hooks/useDebounce";
import { handleError } from "@/lib/utils";
import { forwardRef, useEffect, useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";

interface SelectSearchProps<T extends FieldValues> {
  control: Control<T>;
  name: any;
  minLenghtForSearch?: number;
  maxSizeOfSelectList?: number;
  onFetchOptions: (search: string, maxSize: number) => Promise<Option[]>;
}

export interface Option {
  label: string;
  value: string;
}

export default function SelectSearch<T extends FieldValues>({
  control,
  name,
  minLenghtForSearch,
  maxSizeOfSelectList,
  onFetchOptions,
}: SelectSearchProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => {
        return (
          <SelectSearchInner
            onFetchOptions={onFetchOptions}
            minLenghtForSearch={minLenghtForSearch}
            maxSizeOfSelectList={maxSizeOfSelectList}
            onOptionSelected={onChange}
            ref={field.ref}
          />
        );
      }}
    />
  );
}

interface SelectSearchInnerProps<TValue>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onOptionSelected: (value: string) => void;
  minLenghtForSearch?: number;
  maxSizeOfSelectList?: number;
  onFetchOptions: (search: string, maxSize: number) => Promise<Option[]>;
}
type TValue = string;
const SelectSearchInner = forwardRef<
  HTMLInputElement,
  SelectSearchInnerProps<TValue>
>(function SelectSearch(
  {
    onOptionSelected,
    minLenghtForSearch = 3,
    maxSizeOfSelectList = 5,
    onFetchOptions,
    ...props
  },
  ref,
) {
  const [searchInput, setSearchInput] = useState("");
  const searchInputDebounced = useDebounce(searchInput);
  const [hasFocus, setHasFocus] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchOptions = async () => {
      if (
        !searchInputDebounced.trim() ||
        searchInputDebounced.trim().length < minLenghtForSearch
      ) {
        setOptions([]);
        return;
      }

      try {
        const fetchedOptions = await onFetchOptions(
          searchInputDebounced,
          maxSizeOfSelectList,
        );

        const formattedOptions: Option[] = fetchedOptions.map((option) => ({
          label: option.label,
          value: option.value,
        }));

        setOptions(formattedOptions);
      } catch (error) {
        handleError(error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [
    searchInputDebounced,
    minLenghtForSearch,
    onFetchOptions,
    maxSizeOfSelectList,
  ]);

  return (
    <div className="relative w-full">
      <input
        className="input input-bordered mb-3 w-full"
        placeholder={`Digite ${
          minLenghtForSearch > 0 ? `${minLenghtForSearch} caractéres ` : ""
        }para pesquisar...`}
        type="search"
        onChange={(e) => setSearchInput(e.target.value)}
        value={searchInput}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        {...props}
        ref={ref}
      />
      {searchInputDebounced.trim() &&
        searchInputDebounced.length >= minLenghtForSearch &&
        hasFocus && (
          <div className="bg-background absolute z-20 w-full divide-y rounded-b-sm border-x border-b shadow-xl">
            {!isLoading && !options.length && (
              <p className="p-3">Não foram encontrados resultados</p>
            )}
            {isLoading && (
              <div className="flex w-full items-center justify-center p-1">
                <span className="loading loading-spinner"></span>
              </div>
            )}
            {!isLoading &&
              options.map((option) => (
                <button
                  key={option.value} // Use the value as the key
                  className="block w-full p-2 text-start"
                  onMouseDown={(e) => {
                    onOptionSelected(option.value);
                    setSearchInput(option.label); // Set label as the input value
                  }}
                >
                  {option.label} {/* Display label in the dropdown */}
                </button>
              ))}
          </div>
        )}
    </div>
  );
});
