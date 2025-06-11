import './Dashboard.css';
import { useState, useMemo } from 'react';
import { GraduationCap, MapPin, Landmark, CalendarClock, ListRestart } from 'lucide-react';
import { Search } from 'lucide-react';
import { Card, Flex, Select, Text, Avatar, Box, Heading, Button } from '@radix-ui/themes';
import appData from '../../data/appData.json';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const universities = useMemo(() => {
    return appData?.universities || [];
  }, []);

  const uniqueLocations = useMemo(() => {
    if (!universities) return [];
    const locations = universities.map(uni => uni.locationCity).filter(Boolean);
    return [...new Set(locations)].sort();
  }, [universities]);

  const uniqueTypes = useMemo(() => {
    if (!universities) return [];
    const types = universities.map(uni => uni.type).filter(Boolean);
    return [...new Set(types)].sort();
  }, [universities]);

  const uniqueCategories = useMemo(() => {
    if (!universities) return [];
    const categories = universities.map(uni => uni.category).filter(Boolean);
    return [...new Set(categories)].sort();
  }, [universities]);

  const filteredUniversities = universities.filter(uni => {
    // Ensure uni object and its properties exist before calling methods
    const nameMatch = uni?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const shortNameMatch = uni?.shortName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesSearchTerm = nameMatch || shortNameMatch;

    const matchesLocation = selectedLocation ? uni?.locationCity === selectedLocation : true;
    const matchesType = selectedType ? uni?.type === selectedType : true;
    const matchesCategory = selectedCategory ? uni?.category === selectedCategory : true;
    return matchesSearchTerm && matchesLocation && matchesType && matchesCategory;
  });

  // Fallback for student info
  const studentName = appData?.studentInfo?.name || "Student";
  const studentRegId = appData?.studentInfo?.registrationNumber || "N/A";

  return (
    <div>
      <nav className="dashboard-nav">
        <div className='flex items-center gap-2'>
          <GraduationCap className='card-icon' />
          <h2>{studentName}</h2>
        </div>
        <div className='reg-id'>
          <Text as="div" size="3" weight="medium">
            {`Reg. ID: ${studentRegId}`}
          </Text>
        </div>
      </nav>
      <div>
        <div>
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search Your Universities..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="total-universities">
              <Text size="2" color="gray">
                {filteredUniversities.length}
              </Text>
            </div>
          </div>

          <div className="filters">
            <Flex gap="3" wrap="wrap" justify="start">
              <Select.Root size='3' defaultValue='All Locations' value={selectedLocation} onValueChange={setSelectedLocation}>
                <Select.Trigger color="gray" variant="soft" placeholder='Locations' className="filter-dropdown" />
                <Select.Content color="gray">
                  {uniqueLocations.map(location => (
                    <Select.Item key={location} value={location}>{location}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>

              <Select.Root size='3' value={selectedType} onValueChange={setSelectedType}>
                <Select.Trigger color="gray" variant="soft" placeholder='Types' className="filter-dropdown" />
                <Select.Content color="gray">
                  {uniqueTypes.map(type => (
                    <Select.Item key={type} value={type}>{type}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>

              <Select.Root size='3' value={selectedCategory} onValueChange={setSelectedCategory}>
                <Select.Trigger color="gray" variant="soft" placeholder='Categories' className='filter-dropdown' />
                <Select.Content color="gray">
                  {uniqueCategories.map(category => (
                    <Select.Item key={category} value={category}>{category}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>

              <Button color='gray' variant='soft' size='3' className='!text-black !rounded-full' onClick={() => {
                setSearchTerm('');
                setSelectedLocation('');
                setSelectedType('');
                setSelectedCategory('');
              }}>
                <ListRestart />
              </Button>
            </Flex>
          </div>

          {/* University List Section */}
          <Flex direction="column" gap="4" className='university-list'>
            {filteredUniversities.length > 0 ? (
              filteredUniversities.map(uni => (
                <Card key={uni.id} variant="surface" className='!p-4 sm:!p-6 university'>
                  <Flex gap="4" align="start">
                    <Avatar
                      src={uni.logoUrl}
                      fallback={uni?.shortName?.charAt(0) || 'U'}
                      size="4"
                      radius="full"
                    />
                    <Box flexGrow="1">
                      <Heading as="h3" size="5" mb="1">{uni?.name || 'University Name'} ({uni?.shortName || 'N/A'})</Heading>
                      <Text as="p" size="2" color="gray" className='flex items-center gap-2 mb-1'>
                        <MapPin size={16} /> {uni?.locationFull || 'Location not specified'}
                      </Text>
                      <Text as="p" size="2" color="gray" className='flex items-center gap-2 mb-1'>
                        <Landmark size={16} /> {uni?.type || 'N/A'} - {uni?.category || 'N/A'}
                      </Text>
                      <Text as="p" size="2" color="gray" className='flex items-center gap-2 mb-2'>
                        <CalendarClock size={16} /> Deadline: {uni?.deadline || 'N/A'}
                      </Text>
                      <Text as="p" size="2" mb="2">{uni?.description || 'No description available.'}</Text>
                      {uni?.website && (
                        <a href={uni.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Visit Website</a>
                      )}
                    </Box>
                  </Flex>
                </Card>
              ))
            ) : (
              <Text as="p" align="center" color="gray" className="py-8">No universities found matching your criteria.</Text>
            )}
          </Flex>

        </div>
      </div>
    </div >
  );
};

export default Dashboard;