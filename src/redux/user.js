import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboard_api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://backend.chai4you.com/api/v1/",
    baseUrl: "http://localhost:3004/user/",
  }),
//   tagTypes: [
//     "Categories",
//     "SubCategories",
//     "Items",
//     "Deals",
//     "Offers",
//     "Policy",
//     "TermsAndConditions",
//     "Notifications",
//     "Orders",
//     "Reviews",
//     "Users",
//     "Contact",
//     "Social",
//     "Delivery",
//     "Timings",
//   ],
  endpoints: (builder) => ({
    //  get all categories
    getCategories: builder.query({
      query: ({ page, limit, sortOrder }) => {
        let queryString = "category";
        const queryParams = [];

        if (page !== undefined) queryParams.push(`page=${page}`);
        if (limit !== undefined) queryParams.push(`limit=${limit}`);
        if (sortOrder !== undefined) queryParams.push(`sortOrder=${sortOrder}`);

        queryParams.push(`deletion_status=false`);

        if (queryParams.length > 0) {
          queryString += `?${queryParams.join("&")}`;
        }

        return queryString;
      },
      providesTags: ["Categories"],
    }),

    // add new category
    addCategory: builder.mutation({
      query: (body) => {
        return {
          url: "category/create",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["Categories"],
    }),

    // update category
    updateCategory: builder.mutation({
      query: ({ id, body }) => {
        return {
          url: `category/${id}/update`,
          method: "PATCH",
          body: body,
        };
      },
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} = dashboardApi;