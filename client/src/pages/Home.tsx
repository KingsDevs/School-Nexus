import { Layout } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Calendar, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Home() {
  return (
    <Layout>
      <div className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden bg-primary p-8 md:p-12 text-primary-foreground shadow-2xl shadow-primary/25"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-900 opacity-90" />
          
          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Welcome to SchoolSys
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl">
              Your comprehensive portal for academic management, student tracking, and campus events.
            </p>
            <div className="flex gap-4">
              <Link href="/events">
                <button className="px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/90 transition-colors shadow-lg shadow-black/10">
                  View Events
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-3"
        >
          <Link href="/faculty">
            <motion.div variants={item} className="cursor-pointer group">
              <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-blue-500">
                <CardHeader>
                  <Users className="h-8 w-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-xl">Faculty Directory</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Access information about our dedicated teachers and staff across all departments.</p>
                  <div className="flex items-center text-blue-500 font-medium text-sm">
                    Browse Faculty <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          <Link href="/students">
            <motion.div variants={item} className="cursor-pointer group">
              <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-green-500">
                <CardHeader>
                  <GraduationCap className="h-8 w-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-xl">Student Directory</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Find students organized by grade level and section. Track academic progress.</p>
                  <div className="flex items-center text-green-500 font-medium text-sm">
                    Browse Students <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          <Link href="/events">
            <motion.div variants={item} className="cursor-pointer group">
              <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-purple-500">
                <CardHeader>
                  <Calendar className="h-8 w-8 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-xl">Events & Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Stay updated with school activities, holidays, and special celebrations.</p>
                  <div className="flex items-center text-purple-500 font-medium text-sm">
                    View Calendar <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
