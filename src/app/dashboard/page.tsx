// app/dashboard/page.tsx
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth" // Adjust the path to your authOptions file
import { getDashboardData } from "@/app/actions/dashboardActions"
import FocusDashboardClient from "@/components/mainPageComponents/FocusDashboardClient"

export default async function DashboardPage() {
    // 1. Get the user session on the server
    const session = await getServerSession(authOptions)

    // 2. If no session or user ID is found, redirect to the sign-in page
    if (!session || !session.user?.id) {
        redirect("/api/auth/signin?callbackUrl=/dashboard") // Redirect back to dashboard after login
    }

    // 3. Fetch the dynamic dashboard data using the user's ID from the session
    const dashboardData = await getDashboardData(session.user.id)

    // 4. Render the client component, passing the session user and fetched data as props
    return <FocusDashboardClient user={session.user} initialData={dashboardData} />
}
