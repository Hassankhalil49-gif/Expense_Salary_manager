"use client";



import { signOut } from "next-auth/react";

import { useState } from "react";

import { Loader2, LogOut } from "lucide-react";



import { Button } from "@/components/ui/button";



interface LogoutButtonProps {

  className?: string;

}



export function LogoutButton({ className }: LogoutButtonProps) {

  const [isLoading, setIsLoading] = useState(false);



  const handleLogout = async () => {

    if (isLoading) return;

    setIsLoading(true);

    await signOut({ callbackUrl: "/login", redirect: true });

  };



  return (

    <Button

      variant="outline"

      onClick={handleLogout}

      disabled={isLoading}

      className={className}

    >

      {isLoading ? (

        <>

          <Loader2 className="animate-spin" />

          Signing out...

        </>

      ) : (

        <>

          <LogOut />

          Log out

        </>

      )}

    </Button>

  );

}

