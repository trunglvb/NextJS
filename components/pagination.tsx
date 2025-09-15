import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
interface Props {
	page: number;
	pageSize: number;
	pathname: string;
	isLink?: boolean;
	onClick?: (pageNumber: number) => void;
}

const RANGE = 2;
export default function AutoPagination({
	page,
	pageSize,
	pathname,
	isLink = true,
	onClick,
}: Props) {
	const renderPagination = () => {
		let dotAfter = false;
		let dotBefore = false;
		const renderDotBefore = () => {
			if (!dotBefore) {
				dotBefore = true;
				return (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				);
			}
			return null;
		};
		const renderDotAfter = () => {
			if (!dotAfter) {
				dotAfter = true;
				return (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				);
			}
			return null;
		};
		return Array(pageSize)
			.fill(0)
			.map((_, index) => {
				const pageNumber = index + 1;

				// Điều kiện để return về ...
				if (
					page <= RANGE * 2 + 1 &&
					pageNumber > page + RANGE &&
					pageNumber < pageSize - RANGE + 1
				) {
					return renderDotAfter();
				} else if (
					page > RANGE * 2 + 1 &&
					page < pageSize - RANGE * 2
				) {
					if (pageNumber < page - RANGE && pageNumber > RANGE) {
						return renderDotBefore();
					} else if (
						pageNumber > page + RANGE &&
						pageNumber < pageSize - RANGE + 1
					) {
						return renderDotAfter();
					}
				} else if (
					page >= pageSize - RANGE * 2 &&
					pageNumber > RANGE &&
					pageNumber < page - RANGE
				) {
					return renderDotBefore();
				}
				return (
					<PaginationItem key={index}>
						{isLink && (
							<PaginationLink
								href={{
									pathname,
									query: {
										page: pageNumber,
									},
								}}
								isActive={pageNumber === page}
							>
								{pageNumber}
							</PaginationLink>
						)}
						{!isLink && (
							<Button
								onClick={() => onClick!(pageNumber)}
								variant={
									pageNumber === page ? "outline" : "ghost"
								}
							>
								{pageNumber}
							</Button>
						)}
					</PaginationItem>
				);
			});
	};
	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href={{
							pathname,
							query: {
								page: page - 1,
							},
						}}
						className={cn({
							"cursor-not-allowed": page === 1,
						})}
						onClick={(e) => {
							if (page === 1) {
								e.preventDefault();
							}
						}}
					/>
				</PaginationItem>
				{renderPagination()}

				<PaginationItem>
					<PaginationNext
						href={{
							pathname,
							query: {
								page: page + 1,
							},
						}}
						className={cn({
							"cursor-not-allowed": page === pageSize,
						})}
						onClick={(e) => {
							if (page === pageSize) {
								e.preventDefault();
							}
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
