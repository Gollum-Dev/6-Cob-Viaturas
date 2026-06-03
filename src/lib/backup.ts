import { supabase } from './supabase';

// List of important tables to back up
const TABLES_TO_BACKUP = [
  'users',
  'vehicles',
  'checklists',
  'load_maps',
  'load_map_sectors',
  'load_map_items',
  'load_checklists',
  'commitments',
  'maintenance',
  'time_bank',
  'audit_logs',
  'messages'
];

export async function createLocalBackup(): Promise<{ success: boolean; error?: string }> {
  try {
    const backupData: Record<string, any> = {};

    for (const table of TABLES_TO_BACKUP) {
      // Fetch all records for the table. 
      // Note: Supabase limits to 1000 rows by default, we might need pagination if the table is larger.
      // For a simple local backup, we'll fetch up to 10000 rows.
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(10000);

      if (error) {
        console.error(`Error fetching table ${table}:`, error);
        continue; // Continue to next table even if one fails
      }

      backupData[table] = data || [];
    }

    const backupContent = JSON.stringify(backupData, null, 2);
    
    // Create a Blob and trigger a download
    const blob = new Blob([backupContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with current date and time
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `backup_viatura_bm_${dateStr}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (err: any) {
    console.error('Backup error:', err);
    return { success: false, error: err.message || 'Erro desconhecido ao gerar o backup.' };
  }
}
