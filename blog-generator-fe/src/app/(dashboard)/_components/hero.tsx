"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, Book, Calendar } from "lucide-react";
import WorkflowExample from "./workflow-example";
import { BlogForm } from "./blog-text-area";

const Hero = () => {
  return (
    <div className="min-h-screen py-40 flex flex-col justify-center items-center bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 px-5">
      <div className="text-center">
        <h1
          className="
                text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-4 md:leading-snug lg:leading-snug">
          Agentic Blog Generator
        </h1>
        <p className="text-sm md:text-2xl lg:text-2xl font-semibold text-gray-600 mb-6 max-w-3xl mx-auto">
          Transform your ideas into compelling blog posts <br /> with our
          intelligent AI workflow
        </p>
      </div>

      {/* Main Input Section */}
      <BlogForm />

      <div className="w-full pt-5 py-28 lg:py-28 md:px-40 lg:px-40">
        <div className="h-[0.5px] bg-[#BDBDBD] w-full " />
      </div>

      {/* Workflow Visualization */}
      <div className="mb-16 h-[600px] w-full px-2 md:px-20 lg:px-20 flex flex-col gap-10">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          How Our AI Works
        </h2>
        <WorkflowExample />
      </div>

      <div className="w-full pt-5 py-28 lg:py-28 md:px-40 lg:px-40">
        <div className="h-[0.5px] bg-[#BDBDBD] w-full " />
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center p-6 border-0 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6">
              <Book className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">
                Smart Content Creation
              </h3>
              <p className="text-gray-600">
                AI-powered writing that understands context and creates engaging
                content
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-0 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6">
              <ArrowDown className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-semibold mb-2">
                Workflow Automation
              </h3>
              <p className="text-gray-600">
                Streamlined process from idea to published blog post
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-0 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-gray-600">
                Get professional blog posts in minutes, not hours
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Hero;
