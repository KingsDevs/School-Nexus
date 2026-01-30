import { Layout } from "@/components/Navigation";
import { useStudents } from "@/hooks/use-students";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, User } from "lucide-react";

export default function Students() {
  const { students, isLoading } = useStudents();

  // Group students by grade level
  const groupedStudents = students?.reduce((acc, student) => {
    const grade = student.gradeLevel;
    if (!acc[grade]) acc[grade] = [];
    acc[grade].push(student);
    return acc;
  }, {} as Record<string, typeof students>) || {};

  // Sort grades naturally
  const sortedGrades = Object.keys(groupedStudents).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Student Directory</h1>
          <p className="text-muted-foreground mt-2">Browse students by grade level and section.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !students?.length ? (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
            <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-muted-foreground">No students found</h3>
          </div>
        ) : (
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <Accordion type="multiple" defaultValue={sortedGrades} className="space-y-4">
                {sortedGrades.map((grade) => (
                  <AccordionItem key={grade} value={grade} className="bg-card border rounded-xl px-4 shadow-sm">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-lg">Grade {grade}</span>
                        <Badge variant="secondary" className="rounded-full">
                          {groupedStudents[grade].length} Students
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 pb-4 pt-2">
                        {groupedStudents[grade].map((student) => (
                          <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-muted/50 transition-all">
                            <span className="font-medium">{student.fullName}</span>
                            <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-md border shadow-sm">
                              {student.section}
                            </span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
