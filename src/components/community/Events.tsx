import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Users, Plus, Trophy, Gamepad2 } from "lucide-react";

interface Event {
  id: number;
  creator_id: string;
  title: string;
  description: string;
  event_date: string;
  event_end: string;
  location: string;
  event_type: string;
  max_attendees: number;
  is_private: boolean;
  created_at: string;
  attendees_count?: number;
  is_attending?: boolean;
  creator_username?: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_date: "",
    event_end: "",
    location: "",
    event_type: "gaming",
    max_attendees: 0
  });
  const [loading, setLoading] = useState(false);

  const eventTypes = [
    { value: "gaming", label: "🎮 Gaming Session", icon: Gamepad2 },
    { value: "tournament", label: "🏆 Tournament", icon: Trophy },
    { value: "stream", label: "📺 Stream Watch Party", icon: Calendar },
    { value: "meetup", label: "👥 Meetup", icon: Users },
    { value: "other", label: "🎯 Other", icon: Calendar }
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    const { data: eventsData } = await supabase
      .from("events")
      .select(`
        *,
        creator:profiles!events_creator_id_fkey(username),
        attendees:event_attendees(count)
      `)
      .or("is_private.eq.false", `creator_id.eq.${user?.id}`)
      .order("event_date", { ascending: true });

    if (eventsData) {
      const eventsWithAttendees = await Promise.all(
        eventsData.map(async (event) => {
          const isAttending = user ? await checkAttendance(user.id, event.id) : false;
          const attendeesCount = await getAttendeesCount(event.id);

          return {
            ...event,
            attendees_count: attendeesCount,
            is_attending: isAttending,
            creator_username: event.creator?.username || 'Unknown'
          };
        })
      );

      setEvents(eventsWithAttendees);
    }

    setLoading(false);
  };

  const checkAttendance = async (userId: string, eventId: number): Promise<boolean> => {
    const { data } = await supabase
      .from("event_attendees")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .single();

    return !!data;
  };

  const getAttendeesCount = async (eventId: number): Promise<number> => {
    const { data } = await supabase
      .from("event_attendees")
      .select("id")
      .eq("event_id", eventId);

    return data?.length || 0;
  };

  const createEvent = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("events")
      .insert({
        creator_id: user.id,
        ...newEvent,
        event_date: new Date(newEvent.event_date).toISOString(),
        event_end: newEvent.event_end ? new Date(newEvent.event_end).toISOString() : null
      });

    if (!error) {
      setShowCreateForm(false);
      setNewEvent({
        title: "",
        description: "",
        event_date: "",
        event_end: "",
        location: "",
        event_type: "gaming",
        max_attendees: 0
      });
      loadEvents();
    }
  };

  const toggleAttendance = async (eventId: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const existingAttendance = await checkAttendance(user.id, eventId);

    if (existingAttendance) {
      // Leave event
      await supabase
        .from("event_attendees")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);
    } else {
      // Join event
      await supabase
        .from("event_attendees")
        .insert({
          event_id: eventId,
          user_id: user.id,
          status: "attending"
        });
    }

    loadEvents();
  };

  const getEventTypeIcon = (type: string) => {
    const eventType = eventTypes.find(t => t.value === type);
    const IconComponent = eventType?.icon || Calendar;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent">
            🗓️ Gaming Events
          </h1>
          <p className="text-white/70 mt-2">Join tournaments, meetups, and gaming sessions</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant="neon"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showCreateForm ? "Cancel" : "Create Event"}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
          <CardHeader>
            <CardTitle className="text-primary">Create New Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              className="bg-white/5 border-white/20"
            />

            <Textarea
              placeholder="Event Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="bg-white/5 border-white/20"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/70 text-sm mb-2 block">Start Date & Time</label>
                <Input
                  type="datetime-local"
                  value={newEvent.event_date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, event_date: e.target.value }))}
                  className="bg-white/5 border-white/20"
                />
              </div>

              <div>
                <label className="text-white/70 text-sm mb-2 block">End Date & Time (Optional)</label>
                <Input
                  type="datetime-local"
                  value={newEvent.event_end}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, event_end: e.target.value }))}
                  className="bg-white/5 border-white/20"
                />
              </div>
            </div>

            <Input
              placeholder="Location (Virtual or Physical)"
              value={newEvent.location}
              onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
              className="bg-white/5 border-white/20"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={newEvent.event_type}
                onValueChange={(value) => setNewEvent(prev => ({ ...prev, event_type: value }))}
              >
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Max Attendees (0 = unlimited)"
                value={newEvent.max_attendees}
                onChange={(e) => setNewEvent(prev => ({ ...prev, max_attendees: parseInt(e.target.value) || 0 }))}
                className="bg-white/5 border-white/20"
              />
            </div>

            <Button onClick={createEvent} variant="neon" className="w-full">
              🎉 Create Event
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50 animate-pulse">
              <CardContent className="p-6 h-48"></CardContent>
            </Card>
          ))
        ) : events.length === 0 ? (
          <div className="col-span-full text-center py-12 text-white/50">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            No events scheduled. Be the first to create one!
          </div>
        ) : (
          events.map(event => (
            <Card key={event.id} className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50 hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getEventTypeIcon(event.event_type)}
                    <span className="text-primary text-xs capitalize">{event.event_type}</span>
                  </div>
                </div>

                <CardTitle className="text-white leading-tight">
                  {event.title}
                </CardTitle>

                <p className="text-white/60 text-sm">by {event.creator_username}</p>
              </CardHeader>

              <CardContent>
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.event_date).toLocaleDateString()}
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Users className="w-4 h-4" />
                    {event.attendees_count || 0} attending
                    {event.max_attendees > 0 && ` / ${event.max_attendees} max`}
                  </div>
                </div>

                <Button
                  onClick={() => toggleAttendance(event.id)}
                  variant={event.is_attending ? "outline" : "neon"}
                  className="w-full"
                  size="sm"
                >
                  {event.is_attending ? "✅ Attending" : "🎯 Join Event"}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}