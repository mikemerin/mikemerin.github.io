import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Popup } from 'semantic-ui-react';
import { selectors } from '../../redux/selectors';

type SearchResult = {
  type: 'post' | 'project';
  fileName: string;
  title: string;
  tags: string;
};

const SearchBar = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const posts = useSelector(selectors.getPosts);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const foundResults: SearchResult[] = [];

    // Search through all posts
    Object.entries(posts.info).forEach(([fileName, post]) => {
      if (
        post.title.toLowerCase().includes(lowerQuery) ||
        post.body.toLowerCase().includes(lowerQuery) ||
        post.tags.toLowerCase().includes(lowerQuery) ||
        (post.series && post.series.toLowerCase().includes(lowerQuery))
      ) {
        foundResults.push({
          type: 'post',
          fileName,
          title: post.title,
          tags: post.tags
        });
      }
    });

    // Limit results to 10 most relevant
    setResults(foundResults.slice(0, 10));
  };

  const renderResults = () => {
    if (!results.length) return null;

    return (
      <div style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderTop: 'none',
        maxHeight: '400px',
        overflowY: 'auto',
        zIndex: 1000,
        borderRadius: '0 0 4px 4px'
      }}>
        {results.map((result, index) => (
          <Link
            key={`search-result-${index}`}
            to={`/blog?post=${result.fileName}`}
            onClick={() => {
              setSearchQuery('');
              setResults([]);
            }}
            style={{
              display: 'block',
              padding: '10px 15px',
              borderBottom: '1px solid #eee',
              textDecoration: 'none',
              color: '#333'
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#f5f5f5';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{result.title}</div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>{result.tags}</div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
      <Input
        icon='search'
        placeholder='Search posts...'
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        fluid
        style={{ position: 'relative' }}
      />
      {renderResults()}
    </div>
  );
};

export { SearchBar };
