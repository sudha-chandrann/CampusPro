"use client";

import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

function SearchInput() {
  const [value, setvalue] = useState("");
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          search: debouncedValue,
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );
    router.push(url);
  }, [debouncedValue,currentCategoryId,router,pathname]);

  return (
    <div className=" flex items-center justify-center w-full ">
      <Search className="relative z-10 w-8 h-8  text-slate-600 " />
      <Input
        className="relative right-10  w-full md:w-[300px] pl-11 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a course"
        value={value}
        onChange={(e) => setvalue(e.target.value)}
      />
    </div>
  );
}

export default SearchInput;
