
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type RoomCodeHistoryInsert = Database['public']['Tables']['room_code_history']['Insert'];
type RoomCodeHistoryRow = Database['public']['Tables']['room_code_history']['Row'];

/**
 * Saves room code to history table when the last user leaves
 */
export const saveRoomHistory = async (roomId: string, code: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('room_code_history')
      .insert([
        { room_id: roomId, code: code } as RoomCodeHistoryInsert
      ]);
    
    if (error) {
      console.error('Error saving room history:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Failed to save room history:', err);
    return false;
  }
};

/**
 * Gets the latest code for a room from history
 */
export const getRoomHistory = async (roomId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('room_code_history')
      .select('code')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error getting room history:', error);
      return null;
    }
    
    return data?.code ?? null;
  } catch (err) {
    console.error('Failed to get room history:', err);
    return null;
  }
};

export default {
  saveRoomHistory,
  getRoomHistory
};
