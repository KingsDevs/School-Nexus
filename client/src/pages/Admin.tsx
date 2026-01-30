import { useState } from "react";
import { Layout } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { useFaculty } from "@/hooks/use-faculty";
import { useStudents } from "@/hooks/use-students";
import { useEvents, useAddEventImage } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, LogOut, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { isAuthenticated, isLoading, login, isLoggingIn, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-primary">Admin Access</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button 
              className="w-full" 
              onClick={() => login({ username, password })}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage school records and events.</p>
        </div>
        <Button variant="outline" onClick={() => logout()}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>

      <Tabs defaultValue="faculty" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="faculty" className="rounded-lg">Faculty</TabsTrigger>
          <TabsTrigger value="students" className="rounded-lg">Students</TabsTrigger>
          <TabsTrigger value="events" className="rounded-lg">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="faculty">
          <FacultyManager />
        </TabsContent>
        
        <TabsContent value="students">
          <StudentManager />
        </TabsContent>
        
        <TabsContent value="events">
          <EventManager />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

function FacultyManager() {
  const { faculty, create, remove } = useFaculty();
  const [form, setForm] = useState({ fullName: "", subject: "", position: "", department: "junior_high" as const });
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    create(form, { onSuccess: () => { setOpen(false); setForm({ fullName: "", subject: "", position: "", department: "junior_high" }); }});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/20"><Plus className="w-4 h-4" /> Add Faculty</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Faculty Member</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input value={form.position} onChange={e => setForm({...form, position: e.target.value})} placeholder="e.g. Head Teacher" />
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="e.g. Mathematics" />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={form.department} onValueChange={(v: any) => setForm({...form, department: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior_high">Junior High</SelectItem>
                    <SelectItem value="senior_high">Senior High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleSubmit}>Save Member</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {faculty?.map(member => (
              <div key={member.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{member.fullName}</div>
                  <div className="text-sm text-muted-foreground">{member.position} • {member.subject}</div>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => remove(member.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentManager() {
  const { students, create, remove } = useStudents();
  const [form, setForm] = useState({ fullName: "", gradeLevel: "", section: "" });
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    create(form, { onSuccess: () => { setOpen(false); setForm({ fullName: "", gradeLevel: "", section: "" }); }});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/20"><Plus className="w-4 h-4" /> Add Student</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Student</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grade Level</Label>
                  <Input value={form.gradeLevel} onChange={e => setForm({...form, gradeLevel: e.target.value})} placeholder="7" />
                </div>
                <div className="space-y-2">
                  <Label>Section</Label>
                  <Input value={form.section} onChange={e => setForm({...form, section: e.target.value})} placeholder="A" />
                </div>
              </div>
              <Button className="w-full" onClick={handleSubmit}>Save Student</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {students?.map(student => (
              <div key={student.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{student.fullName}</div>
                  <div className="text-sm text-muted-foreground">Grade {student.gradeLevel} - {student.section}</div>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => remove(student.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EventManager() {
  const { events, create, remove } = useEvents();
  const { mutate: addImage } = useAddEventImage();
  const [form, setForm] = useState({ title: "", date: "", description: "" });
  const [open, setOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = () => {
    create(form, { onSuccess: () => { setOpen(false); setForm({ title: "", date: "", description: "" }); }});
  };

  const handleAddImage = () => {
    if (selectedEventId && imageUrl) {
      addImage({ id: selectedEventId, imageUrl }, { onSuccess: () => {
        setImageDialogOpen(false);
        setImageUrl("");
      }});
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/20"><Plus className="w-4 h-4" /> Create Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Event</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <Button className="w-full" onClick={handleSubmit}>Create Event</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent>
             <DialogHeader><DialogTitle>Add Event Image</DialogTitle></DialogHeader>
             <div className="space-y-4 py-4">
               <div className="space-y-2">
                 <Label>Image URL</Label>
                 <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
               </div>
               <Button className="w-full" onClick={handleAddImage}>Add Image</Button>
             </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {events?.map(event => (
              <div key={event.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">{event.date}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedEventId(event.id); setImageDialogOpen(true); }}>
                    <ImagePlus className="w-4 h-4 mr-2" /> Add Image
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => remove(event.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
