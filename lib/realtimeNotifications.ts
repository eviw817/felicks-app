import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

let hasSubscribed = false;

export async function initRealtimeNotifications(
  onBannerNotify: (title: string, body: string) => void,
  onBadgeUpdate: () => void
) {
  if (hasSubscribed) {
    return;
  }
  hasSubscribed = true;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) {
    return;
  }
  const userId = session.user.id;

  const { data: dog, error: dogError } = await supabase
    .from("ar_dog")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (dogError || !dog) {
    return;
  }

  const dogId = dog.id;

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
          newNotif.category === "adoption_status" && newNotif.user_id === userId;

        if ((forThisDog || isAdoptieForUser) && !newNotif.is_read) {
          onBannerNotify(newNotif.title || "Nieuwe melding", newNotif.description || "");
          onBadgeUpdate();
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
          updatedNotif.category === "adoption_status" && updatedNotif.user_id === userId;

        if ((forThisDog || isAdoptieForUser) && !updatedNotif.is_read) {

          onBannerNotify(updatedNotif.title || "Melding bijgewerkt", updatedNotif.description || "");
          onBadgeUpdate();
        }
      }
    );
}
