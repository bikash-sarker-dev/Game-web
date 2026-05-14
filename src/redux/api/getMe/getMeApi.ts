import baseApi from "../baseApi";

export const getMe = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getMeProfile: builder.query({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),

    fileUploading: builder.mutation({
      query: (payload) => ({
        url: "/file-upload",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),

    zegoCloud: builder.query({
      query: ({ userId, roomId }) => ({
        url: `/zego-token?userId=${userId}&roomId=${roomId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useFileUploadingMutation,
  useZegoCloudQuery,
  useChangePasswordMutation,
} = getMe;
