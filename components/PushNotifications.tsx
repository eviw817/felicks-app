/*// components/NotificationListener.tsx
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Session, RealtimeChannel } from "@supabase/supabase-js";

type NotificationListenerProps = {
  onNotify: (title: string, body: string) => void;
};

// ── Module‐level guard: zolang deze true blijft, wordt niet opnieuw gesubscribed ─────────────────
let globalSubscribed = false;

export default function NotificationListener({ onNotify }: NotificationListenerProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [dogId, setDogId] = useState<string | null>(null);

  // Ref om de laatst getoonde notificatie ID bij te houden
  const lastSeenNotifId = useRef<string | null>(null);
  // Ref om de channel‐instance op te slaan zodat we die in cleanup kunnen un‐subscriben (indien nodig)
  const channelRef = useRef<RealtimeChannel | null>(null);

  //
  // ── Stap A: haal Supabase‐session op en luister naar auth‐wijzigingen ──────────────────────────────────
  //
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  //
  // ── Stap B: zodra session.user.id bekend is, haal dogId uit ar_dog ─────────────────────────────────
  //
  useEffect(() => {
    if (!session?.user?.id) {
      setDogId(null);
      return;
    }
    const getDog = async () => {
      const { data: dog, error } = await supabase
        .from("ar_dog")
        .select("id")
        .eq("user_id", session.user.id)
        .single();
      if (!error && dog) {
        setDogId(dog.id);
      } else {
        setDogId(null);
      }
    };
    getDog();
  }, [session?.user?.id]);

  //
  // ── Stap C: subscribe EENMALIG op real‐time notificaties zodra dogId & session.user.id beschikbaar zijn ──
  //
  useEffect(() => {
    // Pas alléén subscribe‐logica toe als:
    // 1) We een geldige ingelogde user hebben
    // 2) We een geldige dogId hebben
    // 3) We nog niet eerder globalSubscribed hebben gedaan
    if (!session?.user?.id || !dogId || globalSubscribed) {
      return;
    }

    // Markeer direct dat we nu subscribed hebben (module‐level)
    globalSubscribed = true;

    // Maak het channel en subscribe:
    const channel: RealtimeChannel = supabase
      .channel("global_notifications_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload: any) => {
          const newNotif = payload.new;
          const forThisDog = newNotif.pet_id === dogId;
          const isAdoptieForUser =
            newNotif.category === "adoption_status" &&
            newNotif.user_id === session.user.id;

          if ((forThisDog || isAdoptieForUser) && !newNotif.is_read) {
            // Toon alleen als we deze notificatie-ID nog niet eerder geshowd hebben
            if (newNotif.id !== lastSeenNotifId.current) {
              lastSeenNotifId.current = newNotif.id;
              onNotify(
                newNotif.title ?? "Nieuwe melding",
                newNotif.description ?? ""
              );
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
        },
        (payload: any) => {
          const updatedNotif = payload.new;
          const forThisDog = updatedNotif.pet_id === dogId;
          const isAdoptieForUser =
            updatedNotif.category === "adoption_status" &&
            updatedNotif.user_id === session.user.id;

          if (forThisDog || isAdoptieForUser) {
            if (updatedNotif.id !== lastSeenNotifId.current) {
              lastSeenNotifId.current = updatedNotif.id;
              onNotify(
                updatedNotif.title ?? "Melding bijgewerkt",
                updatedNotif.description ?? ""
              );
            }
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup: als het component unmount of dogId verandert (in zeldzame gevallen) unsubscriben we:
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
      // We laten globalSubscribed deliberately op true staan zodat er nooit opnieuw gesubscribed wordt
    };
  }, [dogId, session?.user?.id, onNotify]);

  return null;
}
*/