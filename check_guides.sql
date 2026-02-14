SELECT id, name, 
  IF(overview IS NULL OR overview = '', 'EMPTY', 'HAS DATA') as overview_status,
  IF(topThingsToDo IS NULL OR topThingsToDo = '', 'EMPTY', 'HAS DATA') as activities_status,
  IF(foodCafes IS NULL OR foodCafes = '', 'EMPTY', 'HAS DATA') as food_status
FROM island_guides 
WHERE name IN (SELECT name FROM island_guides GROUP BY name HAVING COUNT(*) > 1) 
ORDER BY name, id;
