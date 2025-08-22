import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-heritage-cream">
      <div className="w-full max-w-sm">
        <Card className="border-heritage-blue/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-heritage-blue/10">
              <Mail className="h-6 w-6 text-heritage-blue" />
            </div>
            <CardTitle className="text-2xl text-heritage-blue">Check Your Email</CardTitle>
            <CardDescription>We&apos;ve sent you a confirmation link to complete your registration</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Click the link in your email to verify your account and start tracking your heritage visits.
            </p>
            <Link
              href="/auth/login"
              className="text-heritage-blue underline underline-offset-4 hover:text-heritage-blue/80"
            >
              Back to Sign In
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
