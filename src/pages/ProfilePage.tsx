import { useEffect, useState } from "react";
import {
  useMutation,
  useQuery,
  type QueryFunction,
  type MutationFunction,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  changePassword,
  fetchMe,
  requestPasswordReset,
  type ChangePasswordPayload,
  type ChangePasswordResponse,
  type MeResponse,
  type ResetPasswordRequestPayload,
  type ResetPasswordResponse,
} from "../api/auth";
import { useForm } from "react-hook-form";
import { showToast } from "../utils/toast";
import LiquidGlassCard from "../components/liquidglass/LiquidGlassCard";

function ProfilePage() {
  const navigate = useNavigate();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const toErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

  const requestResetMutationFn: MutationFunction<
    ResetPasswordResponse,
    ResetPasswordRequestPayload
  > = (payload) =>
    (
      requestPasswordReset as (
        input: ResetPasswordRequestPayload
      ) => Promise<ResetPasswordResponse>
    )(payload);

  useEffect(() => {
    if (!token) {
      // Temporarily allow access without token for testing
      console.warn("No token found - profile data will not load");
      // void navigate('/')
    }
  }, [token, navigate]);

  const profileQueryFn: QueryFunction<MeResponse> = () => {
    if (!token) {
      throw new Error("Unauthorized");
    }
    return fetchMe();
  };

  const profileQuery = useQuery<MeResponse>({
    queryKey: ["me", token],
    queryFn: profileQueryFn,
    enabled: Boolean(token),
  });

  const form = useForm<ChangePasswordPayload>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const changePasswordMutationFn: MutationFunction<
    ChangePasswordResponse,
    ChangePasswordPayload
  > = (payload) => {
    if (!token) {
      throw new Error("Unauthorized");
    }
    return changePassword(payload, token);
  };

  const changePasswordMutation = useMutation<
    ChangePasswordResponse,
    Error,
    ChangePasswordPayload
  >({
    mutationFn: changePasswordMutationFn,
    onSuccess: () => {
      form.reset();
      showToast("Password updated successfully", "success");
      setShowChangePassword(false);
    },
  });

  const requestResetMutation = useMutation<
    ResetPasswordResponse,
    unknown,
    ResetPasswordRequestPayload
  >({
    mutationFn: requestResetMutationFn,
    onSuccess: () => {
      showToast("Password reset link sent to your email", "info");
    },
    onError: (error) => {
      showToast(toErrorMessage(error, "Failed to send reset link."), "error");
    },
  });

  const onSubmit = form.handleSubmit((values) =>
    changePasswordMutation.mutate(values)
  );

  const user = profileQuery.data?.user;
  const userName = user?.name ?? user?.email ?? "User";
  const userEmail: string = user?.email ?? "";

  const handleResetRequest = () => {
    if (!userEmail) {
      return;
    }
    requestResetMutation.mutate({ email: userEmail });
  };

  const handleCloseModal = () => {
    setShowChangePassword(false);
    setShowPasswordForm(false);
    form.reset();
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/eventpagebg/eventbg2.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <section className="relative min-h-screen overflow-y-auto pt-32 md:pt-24 pb-12 flex items-start justify-center">
        <div className="w-full max-w-[95%] sm:max-w-[60%] mt-4">
          <LiquidGlassCard className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-center gap-0 md:gap-0">
              {/* Avatar Circle - Overlapping */}
              <div className="flex-shrink-0 md:-mr-20 z-10 -mb-12 md:mb-0">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-xl">
                  <span className="text-4xl md:text-6xl text-slate-800 font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Profile Info & Buttons - Purple Glass Container */}
              <div className="flex-1 w-full md:pl-16">
                <div className="rounded-2xl bg-purple-900/40 backdrop-blur-sm border border-purple-500/30 min-h-48 flex items-center justify-center py-8 md:py-6 pt-16 md:pt-6">
                  <div className="space-y-3 md:space-y-4 w-full px-4 md:px-6">
                    {/* Email Address */}
                    <div className="text-center">
                      <p className="text-sm text-slate-300">
                        {userEmail || "No email"}
                      </p>
                    </div>

                    {/* Name */}
                    <div className="text-center">
                      <p className="text-2xl md:text-3xl font-semibold text-slate-50">
                        {userName}
                      </p>
                    </div>

                    {/* Email Address : has to be fixed using hardcoded values for now*/}
                    <div className="text-center">
                      <p className="text-sm text-slate-300">
                        {"No College Info"}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        className="px-6 md:px-8 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors duration-200 w-full sm:w-60"
                        type="button"
                        onClick={() => setShowChangePassword(true)}
                      >
                        Change password
                      </button>
                      <button
                        className="px-6 md:px-8 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors duration-200 w-full sm:w-60"
                        type="button"
                        onClick={() => {
                          localStorage.removeItem("token");
                          navigate("/");
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </LiquidGlassCard>
        </div>

        {showChangePassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur">
            <LiquidGlassCard className="!w-[25%] !max-w-[25%] flex-none space-y-4 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="muted">Security</p>
                  <h3 className="text-lg font-semibold text-slate-50">
                    Change password
                  </h3>
                </div>
                <button
                  type="button"
                  className="text-sm text-slate-300 hover:text-sky-300"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>

              {!showPasswordForm ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">Choose an option:</p>
                  <button
                    className="w-full px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors duration-200"
                    type="button"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    Change Password
                  </button>
                  <button
                    className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
                    type="button"
                    onClick={() => {
                      handleResetRequest();
                      handleCloseModal();
                    }}
                  >
                    Send Reset Link to Email
                  </button>
                </div>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={(event) => void onSubmit(event)}
                >
                  <div className="space-y-2">
                    <label className="label" htmlFor="currentPassword">
                      Current password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      className="input"
                      {...form.register("currentPassword", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label" htmlFor="newPassword">
                      New password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      className="input"
                      {...form.register("newPassword", { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label" htmlFor="confirmNewPassword">
                      Confirm new password
                    </label>
                    <input
                      id="confirmNewPassword"
                      type="password"
                      className="input"
                      {...form.register("confirmNewPassword", {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="button"
                      type="submit"
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending
                        ? "Updating…"
                        : "Update password"}
                    </button>
                    <button
                      className="button secondary"
                      type="button"
                      onClick={handleCloseModal}
                      disabled={changePasswordMutation.isPending}
                    >
                      Cancel
                    </button>
                  </div>
                  {changePasswordMutation.isError && (
                    <p className="text-sm text-rose-300">
                      {changePasswordMutation.error instanceof Error
                        ? changePasswordMutation.error.message
                        : "Failed to update password."}
                    </p>
                  )}
                </form>
              )}
            </LiquidGlassCard>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
