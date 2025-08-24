"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "your-dropdown-menu-library"
import { Button } from "your-button-library"
import { Avatar, AvatarImage, AvatarFallback } from "your-avatar-library"
import { User } from "your-icon-library"
import { Link } from "your-link-library"
import { useUser } from "your-user-hook"
import { signOut } from "your-auth-library"

export function UserNav() {
  const { user } = useUser()
  const handleSignOut = () => signOut()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} alt="Avatar" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/achievements">Achievements</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
