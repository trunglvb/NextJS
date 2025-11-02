"use client";
import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

//cannot build static pages with useSearchParams => need to create suspender
// nextjs requires that we wrap anything that needs the useSearchParams hook in
// Suspense. since I only need the params for things that occur after the load
// is finished (e.g. form submission) and I don't want to block the UI w/
// suspense, this is a good, childless way of hoisting the params back up to the
// parent component that needs them in a non-UI blocking way

type SearchParamsLoaderProps = {
	onParamsReceived: (params: ReadonlyURLSearchParams) => void;
};

function Suspender(props: SearchParamsLoaderProps) {
	return (
		<Suspense>
			<Suspendend {...props} />
		</Suspense>
	);
}

function Suspendend({ onParamsReceived }: SearchParamsLoaderProps) {
	const searchParams = useSearchParams();

	useEffect(() => {
		onParamsReceived(searchParams);
	});

	return null;
}

const SearchParamsLoader = Suspender;
export default SearchParamsLoader;

export const useSearchParamsLoader = () => {
	const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
		null
	);
	return { searchParams, setSearchParams };
};
