"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function AdminUsersPage() {
  const [email, setEmail] = useState("")
  const [userInfo, setUserInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setUserInfo(null)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      })

      if (error) {
        if (error.message.includes("User not found") || error.message.includes("Unable to validate email address")) {
          setUserInfo({
            email,
            status: "Account does not exist",
            confirmed: "N/A - No account found",
          })
        } else if (error.message.includes("Email rate limit exceeded")) {
          setUserInfo({
            email,
            status: "Account exists (rate limited - too many recent emails)",
            confirmed: "Unknown - account exists but confirmation status unclear",
          })
        } else if (error.message.includes("Signup is disabled")) {
          setUserInfo({
            email,
            status: "Account exists but signup disabled",
            confirmed: "Unknown",
          })
        } else {
          setUserInfo({
            email,
            status: "Account likely exists but status unclear",
            confirmed: `Error checking: ${error.message}`,
          })
        }
      } else {
        // No error means the resend was successful, so account exists
        setUserInfo({
          email,
          status: "Account exists - confirmation email sent",
          confirmed: "Likely unconfirmed (resend was successful)",
        })
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const resendConfirmation = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null) // Clear previous errors

    console.log("[v0] Attempting to resend confirmation email to:", email) // Added debugging

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      })

      console.log("[v0] Resend response - error:", error) // Added debugging

      if (error) {
        console.log("[v0] Resend failed with error:", error.message) // Added debugging
        throw error
      }

      console.log("[v0] Resend successful") // Added debugging
      setUserInfo({
        ...userInfo,
        message: "Confirmation email resent successfully! Check spam folder if not received.",
      }) // Improved success message
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to resend email"
      console.log("[v0] Resend error caught:", errorMessage) // Added debugging
      setError(`Failed to resend confirmation email: ${errorMessage}`) // Improved error message
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-heritage-cream">
      <div className="w-full max-w-md">
        <Card className="border-heritage-blue/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-heritage-blue">Check User Status</CardTitle>
            <CardDescription>Check if a user account is activated</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={checkUser}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                {userInfo && (
                  <div className="p-4 bg-heritage-blue/10 rounded-lg">
                    <h3 className="font-semibold text-heritage-blue">User Status:</h3>
                    <p className="text-sm mt-1">
                      <strong>Email:</strong> {userInfo.email}
                    </p>
                    <p className="text-sm">
                      <strong>Status:</strong> {userInfo.status}
                    </p>
                    {userInfo.confirmed !== undefined && (
                      <p className="text-sm">
                        <strong>Confirmed:</strong> {userInfo.confirmed.toString()}
                      </p>
                    )}
                    {userInfo.message && <p className="text-sm text-green-600 mt-2">{userInfo.message}</p>}

                    <Button
                      type="button"
                      onClick={resendConfirmation}
                      className="mt-3 bg-heritage-amber hover:bg-heritage-amber/90 text-black font-semibold"
                      disabled={isLoading}
                    >
                      Resend Confirmation Email
                    </Button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-heritage-blue hover:bg-heritage-blue/90 text-black font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Checking..." : "Check User Status"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
