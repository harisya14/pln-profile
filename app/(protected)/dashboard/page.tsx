import SignOutButton from "@/src/components/dashboard/sign-out";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white shadow p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome to the Dashboard</h1>
        <p className="text-gray-600 mb-6">You are logged in as admin.</p>
        <SignOutButton />
      </div>
    </main>
  );
}
