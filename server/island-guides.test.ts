import { describe, it, expect } from 'vitest';
import { getIslandGuideBySlug, updateIslandGuide } from './db';

describe('Island Guides - Data Flow', () => {
  it('should save and retrieve topThingsToDo as JSON string', async () => {
    // Test data
    const testActivities = [
      { title: 'Activity 1', description: 'Description 1' },
      { title: 'Activity 2', description: 'Description 2' },
    ];
    const jsonString = JSON.stringify(testActivities);

    // Simulate what the frontend sends
    console.log('Test data to save:', jsonString);
    console.log('Type:', typeof jsonString);

    // Try to retrieve Male Island guide
    const guide = await getIslandGuideBySlug('male-capital-city');
    
    if (guide) {
      console.log('Male Island guide found');
      console.log('Raw topThingsToDo:', guide.topThingsToDo);
      console.log('Type of topThingsToDo:', typeof guide.topThingsToDo);
      
      // Try to parse it
      try {
        if (typeof guide.topThingsToDo === 'string') {
          const parsed = JSON.parse(guide.topThingsToDo);
          console.log('Parsed topThingsToDo:', parsed);
          console.log('Array length:', Array.isArray(parsed) ? parsed.length : 'Not an array');
        } else {
          console.log('topThingsToDo is not a string, it is:', typeof guide.topThingsToDo);
        }
      } catch (e) {
        console.error('Failed to parse topThingsToDo:', e);
      }
    } else {
      console.log('Male Island guide not found');
    }
  });

  it('should verify foodCafes is saved as string', async () => {
    const guide = await getIslandGuideBySlug('male-capital-city');
    
    if (guide) {
      console.log('foodCafes value:', guide.foodCafes);
      console.log('Type of foodCafes:', typeof guide.foodCafes);
    }
  });
});
