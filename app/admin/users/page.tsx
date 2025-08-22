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
      // Check if user exists in auth.users (requires service role, so this is a simplified check)
      // We'll check if they can sign in instead
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: "dummy-password-check",
      })

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setUserInfo({
            email,
            status: "Account exists but not confirmed or wrong password",
            confirmed: "Unknown - try having them reset password if account exists",
          })
        } else if (error.message.includes("Email not confirmed")) {
          setUserInfo({
            email,
            status: "Account exists but email not confirmed",
            confirmed: false,
          })
        } else {
          setError(`Error: ${error.message}`)
        }
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

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      })

      if (error) throw error
      setUserInfo({ ...userInfo, message: "Confirmation email resent!" })
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to resend email")
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
