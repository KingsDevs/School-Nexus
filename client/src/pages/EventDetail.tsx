import { useRoute } from "wouter";
import { useEvent } from "@/hooks/use-events";
import { Layout } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Image as ImageIcon } from "lucide-react";
import { Link } from "wouter";
import { format, parseISO } from "date-fns";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function EventDetail() {
  const [match, params] = useRoute("/events/:id");
  const id = params ? parseInt(params.id) : null;
  const { data: event, isLoading } = useEvent(id);
  
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

  if (isLoading) return <Layout><div className="p-8 animate-pulse">Loading...</div></Layout>;
  if (!event) return <Layout><div className="p-8">Event not found</div></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/events">
          <Button variant="ghost" className="pl-0 hover:pl-2 transition-all gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Button>
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary font-medium">
            <Calendar className="w-5 h-5" />
            {format(parseISO(event.date), "EEEE, MMMM d, yyyy")}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
            {event.title}
          </h1>
        </div>

        {/* Gallery */}
        {event.images && event.images.length > 0 && (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-black">
            <div className="embla overflow-hidden h-full" ref={emblaRef}>
              <div className="embla__container h-full flex">
                {event.images.map((img) => (
                    <div key={img.id} className="embla__slide flex-[0_0_100%] min-w-0 relative">
                    {/* HTML comment for Unsplash safety: */}
                    {/* event image gallery */}
                    <img 
                      src={`/assets/${img.imageUrl}`} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="prose prose-lg prose-blue max-w-none bg-white p-8 rounded-2xl shadow-sm border">
          <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
            {event.description}
          </p>
        </div>
        
        {(!event.images || event.images.length === 0) && (
          <div className="flex flex-col items-center justify-center p-12 bg-muted/20 rounded-2xl border border-dashed text-muted-foreground">
            <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
            <p>No images available for this event</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
