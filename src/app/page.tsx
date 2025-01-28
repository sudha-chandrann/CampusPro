import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Logo from "./(dashboard)/_components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpenCheck,
  ChartBarIncreasing,
  LayoutDashboard,
  ShoppingCart,
} from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    return redirect("/dashboard");
  }

  return (
    <div className="h-screen  relative">
      <nav className="flex items-center justify-between shadow-lg w-full h-20 fixed top-0 left-0 z-50 px-3 lg:px-6 bg-white">
        <Logo />
        <div className=" flex items-center gap-3">
          <Link href={"/sign-up"}>
            <Button size="sm">Sign Up</Button>
          </Link>
          <Link href={"/sign-in"}>
            <Button variant="teacher" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>
      <main>
        <section className="text-center pt-12 flex items-center justify-center flex-col h-screen bg-gradient-to-br from-sky-200 to-sky-500">
          <h2 className="text-4xl font-semibold text-white mb-4">
            Welcome to CampusPro
          </h2>
          <p className="text-lg text-white mb-6">
            Your go-to platform to buy and sell courses, watch tutorials, and
            improve your skills.
          </p>
          <Link href="/sign-up">
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
              Get Started
            </Button>
          </Link>
        </section>

        <section className="px-5 py-10">
          <div className=" text-center text-5xl font-extrabold italic mt-10 text-sky-800 "> Features</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-11 ">

            <div className="flex flex-col items-center bg-slate-200 p-6 rounded-lg  hover:shadow-xl transition-shadow duration-300 justify-center py-9">
              <div className="mb-4 ">
                <ShoppingCart className="h-10 w-10 text-emerald-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Buy Courses</h3>
              <p className="text-gray-600 text-center">
                Browse a wide variety of courses available from experts in your
                field.
              </p>
            </div>

            <div className="flex flex-col items-center bg-slate-200 p-6 rounded-lg  hover:shadow-xl transition-shadow duration-300 justify-center py-9">
              <div className="mb-4 text-green-600">
                <BookOpenCheck className="h-10 w-10 text-emerald-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Sell Your Courses</h3>
              <p className="text-gray-600 text-center">
                Share your knowledge and earn by selling your own courses.
              </p>
            </div>

            <div className="flex flex-col items-center bg-slate-200 p-6 rounded-lg  hover:shadow-xl transition-shadow duration-300 justify-center py-9">
              <div className="mb-4 text-purple-600">
                <LayoutDashboard className="h-10 w-10 text-emerald-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                Track Your Progress
              </h3>
              <p className="text-gray-600 text-center">
                Monitor your learning progress and achievements with
                personalized dashboards.
              </p>
            </div>

            <div className="flex flex-col items-center bg-slate-200 p-6 rounded-lg  hover:shadow-xl transition-shadow duration-300 justify-center py-9">
              <div className="mb-4 text-yellow-600">
                <ChartBarIncreasing className="h-10 w-10 text-emerald-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Teacher Dashboard</h3>
              <p className="text-gray-600 text-center">
                View your total revenue and sales with an interactive bar chart.
              </p>
            </div>

          </div>
        </section>
      </main>

      <footer className="bg-sky-700 py-4 text-white">
        <div className="container mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} CampusPro. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
