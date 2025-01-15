// app/page.tsx or pages/index.js
"use client";

import { useUser } from "@clerk/nextjs";

export default function HomePage() {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) {
    return <p>Please sign in to view this page.</p>;
  }

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Email: {user?.emailAddresses[0]?.emailAddress}</p>
    </div>
  );
}
