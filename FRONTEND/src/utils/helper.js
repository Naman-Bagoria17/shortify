import { redirect } from "@tanstack/react-router";
import { getCurrentUser } from "../api/user.api.js";
import { login } from "../store/slices/authSlice.js";

export const checkAuth = async ({ context }) => {
    try {
        const { queryClient, store } = context;
        const response = await queryClient.ensureQueryData({
            queryKey: ["currentUser"],
            queryFn: getCurrentUser,
        });
        if (!response || !response.user) return false;
        store.dispatch(login(response.user));
        const { isAuthenticated } = store.getState().auth;
        if (!isAuthenticated) return false;
        return true
    } catch (error) {
        console.log(error)
        return redirect({ to: "/auth", })
    }
};