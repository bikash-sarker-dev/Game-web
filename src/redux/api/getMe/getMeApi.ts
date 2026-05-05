import baseApi from "../baseApi";

export const getMe = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getMeProfile: builder.query({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),

    profileUpdateAvatar: builder.mutation({
      query: (payload) => ({
        url: "/users/profile/avatar",
        method: "PUT",
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
  useGetMeProfileQuery,
  useZegoCloudQuery,
  useProfileUpdateAvatarMutation,
  useChangePasswordMutation,
} = getMe;
