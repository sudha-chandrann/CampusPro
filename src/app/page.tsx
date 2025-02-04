import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Logo from "./(dashboard)/_components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpenCheck,
  ChartBarIncreasing,
  LayoutDashboard,
  UserRoundCheck,
  ShoppingCart,
  BookPlus,
} from "lucide-react";

const data = [
  {
    icon: ShoppingCart,
    title: "Buy Courses",
    desc: "Explore a wide variety of expert-led courses.",
    color: "text-emerald-600",
  },
  {
    icon: BookOpenCheck,
    title: "Sell Courses",
    desc: "Share your expertise and earn while teaching.",
    color: "text-emerald-600",
  },
  {
    icon: LayoutDashboard,
    title: "Track Progress",
    desc: "Stay on top of your learning journey.",
    color: "text-emerald-600",
  },
  {
    icon: ChartBarIncreasing,
    title: "Teacher Dashboard",
    desc: "Monitor revenue and student performance.",
    color: "text-emerald-600",
  },
];
const timelineData = [
  {
    icon: UserRoundCheck,
    title: "Sign-up",
    description:
      "Create an account to get started on your journey. Enter your details and set up your profile.",
  },
  {
    icon: BookPlus,
    title: "Create Course & Add Chapters",
    description:
      "Design your course structure, add engaging chapters, and upload content seamlessly.",
  },
  {
    icon: BookOpenCheck,
    title: "Set Price & Publish",
    description:
      "Decide on the pricing for your course, review all details, and make it available to learners worldwide.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    return redirect("/dashboard");
  }

  return (
    <div className="h-screen relative font-sans bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between shadow-md w-full h-20 fixed top-0 left-0 z-50 px-6 bg-white backdrop-blur-md bg-opacity-90">
        <Logo />
        <div className="flex items-center gap-4">
          <Link href="/sign-up">
            <Button size="sm" className="hover:scale-105 transition-transform">
              Sign Up
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button
              variant="teacher"
              size="sm"
              className="hover:scale-105 transition-transform"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-sky-500 via-sky-300 to-emerald-400 text-white text-center px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-opacity-30 backdrop-blur-lg"></div>
          <h2 className="text-6xl font-extrabold drop-shadow-2xl z-10 opacity-0 animate-fade-in transition-opacity duration-1000 ease-in-out">
            Empower Your Learning with CampusPro
          </h2>

          <p className="text-lg mt-6 max-w-3xl opacity-90 animate-fade-in delay-100 z-10">
            Discover top-notch courses, track your progress, and achieve your
            educational goals—all in one place.
          </p>
          <div className="mt-8 flex gap-4 z-10">
            <Link href="/sign-up">
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg px-8 py-4 text-lg font-semibold rounded-lg hover:shadow-md">
                Get Started
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-28 bg-white text-center ">
          <h3 className="text-5xl font-extrabold text-sky-700 italic">
            Our Features
          </h3>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Unlock the power of knowledge with our comprehensive features
            designed to enhance your learning experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 ">
            {data.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-gray-100 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <feature.icon className={`h-14 w-14 mb-4 ${feature.color}`} />
                <h4 className="text-2xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
        {/* timelineComponents */}
        <section className="px-6 py-28 bg-white text-center">
          <h3 className="text-5xl font-extrabold text-sky-700 italic mb-8">
            Get Started with Ease: A Step-by-Step Guide to Using Our Platform
          </h3>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
            Whether you&rsquo;re an educator looking to share knowledge or a
            student eager to learn, our platform makes it simple. Follow these
            easy steps to get started and make the most of your experience.
          </p>
          <div className="max-w-3xl mx-auto p-6">
            <div className="relative border-l-4 border-sky-800 mt-3 mx-auto w-fit">
              {timelineData.map((event, index) => (
                <div
                  key={index}
                  className="mb-10 ml-6 p-6 bg-slate-100 rounded-lg shadow-md relative hover:shadow-2xl w-[320px]"
                >
                  <div className="absolute -left-10 z-30 top-2 text-blue-500">
                    <div className="w-8 h-8 absolute flex items-center justify-center rounded-full text-white text-lg bg-emerald-400">
                      {index + 1}
                    </div>
                  </div>
                  <event.icon className="mx-auto w-10 h-10 text-emerald-700 mb-2" />
                  <h4 className="text-lg font-bold text-sky-900 mb-2">
                    {event.title}
                  </h4>
                  <p className="text-sky-800 text-sm">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-sky-700 py-8 text-white text-center">
        <p className="text-lg">
          &copy; {new Date().getFullYear()} CampusPro. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
