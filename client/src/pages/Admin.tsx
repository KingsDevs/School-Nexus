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
import { Link } from "wouter";

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
            <div className="space-y-2">
              <Link href="/">Back to Home</Link>
            </div>
            
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
  const positions = ["Head Teacher", "Assistant Teacher", "Counselor", "Administrator"]; //TODO:
  const subjects = ["Mathematics", "Science", "English", "History", "Art"]; //TODO:

  const handleSubmit = () => {
    if (!form.fullName || !form.subject || !form.position || !form.department) {
      alert("Please fill in all fields.");
      return;
    }
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
                <Select value={form.position} onValueChange={(v: any) => setForm({...form, position: v})}>
                  <SelectTrigger><SelectValue placeholder="Select a position" /></SelectTrigger>
                  <SelectContent>
                    {positions.map(pos => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={form.subject} onValueChange={(v: any) => setForm({...form, subject: v})}>
                  <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                  <SelectContent>
                    {subjects.map(sub => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
  const gradeLevels = Array.from({ length: 6 }, (_, i) => (i + 7).toString());
  const sections = {  //TODO:
    "7": ["A", "B", "C"],
    "8": ["D", "E", "F"],
    "9": ["G", "H", "I"],
    "10": ["J", "K", "L"],
    "11": ["M", "N", "O"],
    "12": ["P", "Q", "R"],
  }
  let currentSections = form.gradeLevel ? sections[form.gradeLevel as keyof typeof sections] : [];

  const handleSubmit = () => {
    if (!form.fullName || !form.gradeLevel || !form.section) {
      alert("Please fill in all fields.");
      return;
    }
    create(form, { onSuccess: () => { setOpen(false); setForm({ fullName: "", gradeLevel: "", section: "" }); }});
  };

  const onChangeGradeLevel = (value: string) => {
    setForm({...form, gradeLevel: value});

  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/20"><Plus className="w-4 h-4" /> Add Student</Button>
          </DialogTrigger>
          <DialogContent className="overflow-visible">
            <DialogHeader><DialogTitle>Add Student</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grade Level</Label>
                  {/* <Input value={form.gradeLevel} onChange={e => setForm({...form, gradeLevel: e.target.value})} placeholder="7" /> */}
                  <Select value={form.gradeLevel} onValueChange={onChangeGradeLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Grade Level" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-[100] max-h-60 overflow-y-auto">
                      {gradeLevels.map(level => (
                        <SelectItem key={level} value={level}>Grade {level}</SelectItem>
                      ))}
                    </SelectContent>

                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Section</Label>
                  <Select value={form.section} onValueChange={value => setForm({...form, section: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4} className="max-h-60 overflow-y-auto">
                      {currentSections.map(section => (
                        <SelectItem key={section} value={section}>{section}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
  const [form, setForm] = useState({ title: "", date: "", description: "", localImage: "" });
  const [open, setOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = () => {
    // if (!form.title || !form.date || !form.description) {
    //   alert("Please fill in all fields.");
    //   return;
    // }
    create(form, { onSuccess: () => { setOpen(false); setForm({ title: "", date: "", description: "", localImage: '' }); }});
  };

  const handleAddImage = async () => {
    if (!selectedEventId || !imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    addImage(
      {
        id: selectedEventId,
        imageUrl: data.filename, // store filename only
      },
      {
        onSuccess: () => {
          setImageDialogOpen(false);
          setImageFile(null);
        },
      }
    );
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
                 <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />

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
