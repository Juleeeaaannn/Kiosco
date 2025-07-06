import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hhzimwjpyeloqypmquus.supabase.co";
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoemltd2pweWVsb3F5cG1xdXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODUwOTYsImV4cCI6MjA2NzE2MTA5Nn0.gztoGjFKMcYyJ_ZGYS3oSOuwJaM9baXfutFIrJoRt3Q';

export const supabase = createClient(supabaseUrl, supabaseKey);