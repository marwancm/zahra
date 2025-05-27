import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'https://ayvxadehublzmiskoipj.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5dnhhZGVodWJsem1pc2tvaXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NTQ0MDEsImV4cCI6MjA2MzUzMDQwMX0.8j3FTUMQOH06-8Khb7R1exhbN6DsxiwIl4aUw1y2eU0';

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);