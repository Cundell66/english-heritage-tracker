import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Verify this is a legitimate cron request from Vercel
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[Cron] Keep-alive job started at", new Date().toISOString())

    // Make a simple query to keep the database active
    const supabase = await createClient()
    const { data, error } = await supabase.from("visits").select("id").limit(1)

    if (error) {
      console.error("[Cron] Database query failed:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("[Cron] Keep-alive successful, database is active")

    return NextResponse.json({
      success: true,
      message: "Database keep-alive successful",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Cron] Keep-alive job failed:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
