// components/NotificationListener.tsx
import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

type NotificationListenerProps = {
  onNotify: (title: string, body: string) => void;
};

export default function NotificationListener({ onNotify }: NotificationListenerProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [dogId, setDogId] = useState<string | null>(null);


  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, newSession) => {
        setSession(newSession);
      }
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);


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
  }, [session]);


  useEffect(() => {
    if (!dogId || !session?.user?.id) return;

    const channel = supabase
      .channel("global_notifications_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const newNotif = (payload as any).new;
          const forThisDog = newNotif.pet_id === dogId;
          const isAdoptieVoorUser =
            newNotif.category === "adoption_status" &&
            newNotif.user_id === session.user.id;

          if ((forThisDog || isAdoptieVoorUser) && !newNotif.is_read) {
            onNotify(
              newNotif.title ?? "Nieuwe melding",
              newNotif.description ?? ""
            );
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
        (payload) => {
          const updatedNotif = (payload as any).new;
          const forThisDog = updatedNotif.pet_id === dogId;
          const isAdoptieVoorUser =
            updatedNotif.category === "adoption_status" &&
            updatedNotif.user_id === session.user.id;

          if (forThisDog || isAdoptieVoorUser) {
            onNotify(
              updatedNotif.title ?? "Melding bijgewerkt",
              updatedNotif.description ?? ""
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [dogId, session, onNotify]);

  return null;
}
