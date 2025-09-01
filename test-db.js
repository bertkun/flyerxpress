import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = "https://tifovslxindgozlqtjix.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpZm92c2x4aW5kZ296bHF0aml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NDMzNDgsImV4cCI6MjA3MjExOTM0OH0.x7ljH0JhlutIrOEsTHe4nBrWhVA_Y9aiiRKfGfh1inE";

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

async function testDatabase() {
  console.log('🔍 Testing Supabase Database Connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    const { data, error } = await supabase.from('flyers').select('count').limit(1);
    
    if (error) {
      console.error('❌ Error accessing flyers table:', error.message);
      if (error.message.includes('not authenticated')) {
        console.log('\n🔧 Authentication Error: Please run the fix-auth.sql file in your Supabase SQL Editor');
        console.log('   This will set up anonymous access for testing');
      } else if (error.message.includes('Could not find the table')) {
        console.log('\n🔧 Table Error: Please run the fix-auth.sql file in your Supabase SQL Editor');
        console.log('   This will create the flyers table with proper permissions');
      } else {
        console.log('\n🔧 General Error: Please run the fix-auth.sql file in your Supabase SQL Editor');
      }
      return;
    }

    console.log('✅ Successfully connected to flyers table!');

    // Test 2: Insert a test record
    console.log('\n2️⃣ Testing insert operation...');
    const testFlyer = {
      title: 'Test Event - Database Connection',
      description: 'This is a test event to verify database connectivity',
      price: 99.99,
      date: new Date().toISOString(),
      location: 'Test Location'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('flyers')
      .insert([testFlyer])
      .select();

    if (insertError) {
      console.error('❌ Insert failed:', insertError.message);
      return;
    }

    console.log('✅ Successfully inserted test record!');
    console.log('   Inserted ID:', insertData[0].id);

    // Test 3: Fetch all records
    console.log('\n3️⃣ Testing fetch operation...');
    const { data: fetchData, error: fetchError } = await supabase
      .from('flyers')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Fetch failed:', fetchError.message);
      return;
    }

    console.log('✅ Successfully fetched records!');
    console.log('   Total records:', fetchData.length);

    // Test 4: Clean up test record
    console.log('\n4️⃣ Cleaning up test record...');
    const { error: deleteError } = await supabase
      .from('flyers')
      .delete()
      .eq('id', insertData[0].id);

    if (deleteError) {
      console.error('❌ Cleanup failed:', deleteError.message);
      return;
    }

    console.log('✅ Successfully cleaned up test record!');

    // Final verification
    console.log('\n🎉 All database tests passed successfully!');
    console.log('   Your Supabase database is properly configured and working.');
    console.log('\n📋 Next steps:');
    console.log('   1. Test event creation in your app');
    console.log('   2. Verify AI Flyer Designer functionality');
    console.log('   3. Continue building new features');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the test
testDatabase();
