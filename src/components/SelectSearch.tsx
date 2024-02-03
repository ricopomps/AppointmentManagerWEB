import useDebounce from "@/hooks/useDebounce";
import { forwardRef, useEffect, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface SelectSearchProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  minLenghtForSearch?: number;
  maxSizeOfSelectList?: number;
  onFetchOptions: (search: string, maxSize: number) => Promise<string[]>;
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

interface SelectSearchInnerProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onOptionSelected: (option: string) => void;
  minLenghtForSearch?: number;
  maxSizeOfSelectList?: number;
  onFetchOptions: (search: string, maxSize: number) => Promise<string[]>;
}

const SelectSearchInner = forwardRef<HTMLInputElement, SelectSearchInnerProps>(
  function SelectSearch(
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
    const [options, setOptions] = useState<string[]>([]);
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
          const options = await onFetchOptions(
            searchInputDebounced,
            maxSizeOfSelectList,
          );
          setOptions(options);
        } catch (error) {
          console.error("Error fetching options:", error);
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
          placeholder={`Digite ${minLenghtForSearch > 0 ? `${minLenghtForSearch} caractéres ` : ""}para pesquisar...`}
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
                    key={option}
                    className="block w-full p-2 text-start"
                    onMouseDown={(e) => {
                      onOptionSelected(option);
                      setSearchInput(option);
                    }}
                  >
                    {option}
                  </button>
                ))}
            </div>
          )}
      </div>
    );
  },
);
