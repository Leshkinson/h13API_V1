import { SortOrder } from "mongoose";

export type UsersRequest = {
    sortBy?: string | undefined;
    sortDirection?: SortOrder;
    pageNumber?: number | undefined;
    pageSize?: number | undefined;
    searchLoginTerm?: string | undefined;
    searchEmailTerm?: string | undefined;
};
