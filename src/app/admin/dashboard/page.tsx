export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Welcome to the administration portal.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
                    <h3 className="font-semibold leading-none tracking-tight">Total Officers</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                        Manage officer accounts
                    </p>
                    <div className="mt-4 text-2xl font-bold">--</div>
                </div>
                {/* Add more stats cards here */}
            </div>
        </div>
    )
}
