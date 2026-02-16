const API_URL = 'https://services7.arcgis.com/yvCbn3q8PPtPLZIM/arcgis/rest/services/island_20240509/FeatureServer/0/query';

async function fetchIslandData() {
  try {
    console.log('Fetching island data from OneMap API...');
    
    // Query all islands with their atoll information
    const params = new URLSearchParams({
      where: '1=1',
      outFields: '*',
      f: 'json',
      resultRecordCount: 2000
    });

    const response = await fetch(`${API_URL}?${params}`);
    const data = await response.json();

    if (!data.features) {
      console.error('No features found in response');
      return;
    }

    console.log(`Found ${data.features.length} islands`);
    
    // Group islands by atoll
    const islandsByAtoll = {};
    
    data.features.forEach(feature => {
      const props = feature.attributes;
      const atoll = props.ATOLL_EN || props.ATOLL || 'Unknown';
      const islandName = props.ISLAND_EN || props.ISLAND_NAME || 'Unknown';
      
      if (!islandsByAtoll[atoll]) {
        islandsByAtoll[atoll] = [];
      }
      
      islandsByAtoll[atoll].push({
        name: islandName,
        atoll: atoll,
        type: props.FCODE || 'unknown',
        properties: props
      });
    });

    // Print summary
    console.log('\n=== Islands by Atoll ===');
    Object.entries(islandsByAtoll).forEach(([atoll, islands]) => {
      console.log(`\n${atoll}: ${islands.length} islands`);
      islands.slice(0, 5).forEach(island => {
        console.log(`  - ${island.name}`);
      });
      if (islands.length > 5) {
        console.log(`  ... and ${islands.length - 5} more`);
      }
    });

    // Save to file for reference
    const fs = await import('fs');
    fs.writeFileSync('/home/ubuntu/onemap-islands-data.json', JSON.stringify(islandsByAtoll, null, 2));
    console.log('\n✅ Data saved to /home/ubuntu/onemap-islands-data.json');

  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

fetchIslandData();
