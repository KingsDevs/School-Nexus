import { Layout } from "@/components/Navigation";
import { useEvents } from "@/hooks/use-events";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { Link } from "wouter";
import { Calendar as CalendarIcon, MapPin, ChevronRight, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Events() {
  const { events, isLoading } = useEvents();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedEvents = events?.filter(e => 
    date && isSameDay(parseISO(e.date), date)
  ) || [];

  // Get days with events for calendar modifiers
  const eventDays = events?.map(e => parseISO(e.date)) || [];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">School Events</h1>
          <p className="text-muted-foreground mt-2">Check out upcoming activities and important dates.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Calendar Section */}
          <div className="lg:col-span-5 xl:col-span-4">
            <Card className="border-none shadow-xl shadow-black/5 bg-white overflow-hidden sticky top-8">
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="w-full flex justify-center"
                  modifiers={{
                    hasEvent: eventDays
                  }}
                  modifiersStyles={{
                    hasEvent: { 
                      fontWeight: 'bold', 
                      textDecoration: 'underline',
                      color: 'var(--primary)'
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Events List Section */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Events for {date ? format(date, "MMMM d, yyyy") : "Selected Date"}
            </h2>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-32 bg-muted/50 rounded-2xl animate-pulse" />)}
              </div>
            ) : selectedEvents.length > 0 ? (
              <AnimatePresence mode="wait">
                <div className="grid gap-4">
                  {selectedEvents.map((event) => (
                    <Link key={event.id} href={`/events/${event.id}`}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="group cursor-pointer"
                      >
                        <Card className="hover:shadow-lg transition-all hover:border-primary/50 overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">
                                  {event.title}
                                </h3>
                                <p className="text-muted-foreground line-clamp-2 mb-4">
                                  {event.description}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                  See Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                              <div className="hidden sm:flex h-12 w-12 rounded-full bg-secondary/10 items-center justify-center text-secondary-foreground shrink-0">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed">
                <p className="text-muted-foreground">No events scheduled for this day.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
