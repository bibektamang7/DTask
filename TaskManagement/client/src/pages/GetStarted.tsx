import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GetStarted() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = () => {
    // Implement Google sign-in logic here
    console.log("Google sign-in clicked");
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement email sign-in logic here
    console.log("Sign in with:", email, password);
  };

  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement email sign-up logic here
    console.log("Sign up with:", email, password);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full lg:w-1/2 relative">
        <img
          src="/api/placeholder/400/320"
          alt="Task Management Illustration"
          className="object-cover w-full h-full absolute inset-0"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white h-full">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">TaskMaster</h1>
          <p className="text-lg lg:text-xl mb-8">Streamline your workflow, boost productivity</p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Organize tasks effortlessly
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Collaborate with your team
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Track progress in real-time
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold">
              Get started with TaskMaster
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Sign up or log in to manage your tasks efficiently
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleEmailSignIn}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                className="flex-1 justify-center bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Sign In
              </Button>
              <Button
                type="button"
                onClick={handleEmailSignUp}
                className="flex-1 justify-center bg-gray-600 hover:bg-gray-700 text-white"
              >
                Sign Up
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button 
                className="w-full flex justify-center border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={handleGoogleSignIn}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C4.477 0 0 4.477 0 10c0 4.411 2.865 8.138 6.839 9.439.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C17.137 18.135 20 14.411 20 10c0-5.523-4.477-10-10-10z" />
                </svg>
                Continue with Google
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              By signing up, you agree to our{' '}
              <a href="#" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}