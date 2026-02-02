import 'dotenv/config';
import { db } from '../src/db';
import { nannyShares } from '../src/db/schema';

/**
 * Clear all nanny shares from the database
 */
async function clearNannyShares() {
  try {
    console.log('🗑️  Clearing all nanny shares...');
    
    const result = await db.delete(nannyShares);
    
    console.log('✅ Successfully cleared all nanny shares!');
    console.log(`📊 Deleted records: ${result.rowCount || 'unknown'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing nanny shares:', error);
    process.exit(1);
  }
}

clearNannyShares();
