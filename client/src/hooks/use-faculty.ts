import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertFaculty } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useFaculty(department?: 'junior_high' | 'senior_high') {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Construct URL with optional query param
  const url = department 
    ? `${api.faculty.list.path}?department=${department}`
    : api.faculty.list.path;

  const { data: faculty, isLoading } = useQuery({
    queryKey: [api.faculty.list.path, department],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch faculty");
      return api.faculty.list.responses[200].parse(await res.json());
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertFaculty) => {
      const res = await fetch(api.faculty.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create faculty member");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.faculty.list.path] });
      toast({ title: "Success", description: "Faculty member added." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add faculty member.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.faculty.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete faculty member");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.faculty.list.path] });
      toast({ title: "Deleted", description: "Faculty member removed." });
    },
  });

  return { faculty, isLoading, create: createMutation.mutate, remove: deleteMutation.mutate };
}
