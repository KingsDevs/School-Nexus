import { Layout } from "@/components/Navigation";
import { useFaculty } from "@/hooks/use-faculty";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Faculty() {
  const [activeTab, setActiveTab] = useState("junior_high");
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Faculty Directory</h1>
          <p className="text-muted-foreground mt-2">Meet our distinguished faculty members.</p>
        </div>

        <Tabs defaultValue="junior_high" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="junior_high" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Junior High</TabsTrigger>
            <TabsTrigger value="senior_high" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Senior High</TabsTrigger>
          </TabsList>
          
          <div className="mt-8">
            <FacultyList department={activeTab as 'junior_high' | 'senior_high'} />
          </div>
        </Tabs>
      </div>
    </Layout>
  );
}

function FacultyList({ department }: { department: 'junior_high' | 'senior_high' }) {
  const { faculty, isLoading } = useFaculty(department);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 bg-muted/30 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!faculty?.length) {
    return (
      <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
        <UserCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold text-muted-foreground">No faculty members found</h3>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {faculty.map((member, i) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="hover:shadow-lg transition-all hover:border-primary/50 group bg-card">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                {member.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg leading-none mb-1 group-hover:text-primary transition-colors">{member.fullName}</h3>
                <p className="text-sm font-medium text-muted-foreground">{member.position}</p>
                <div className="mt-3 inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-xs font-semibold">
                  {member.subject}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
