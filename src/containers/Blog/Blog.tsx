import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Segment, SegmentGroup, Table, TableRow, TableCell, TableHeaderCell, TableHeader, TableBody } from 'semantic-ui-react';

import { Post } from '../../components/Post';
import { Domain } from '../../domain';
import { selectors } from '../../redux/selectors';
import { formatDate, sectionPrimaryInfo } from '../../utils';

const Blog = (): JSX.Element => {
  const posts = useSelector(selectors.getPosts);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<string>('');

  const postId = searchParams.get('post');
  
  // Map search param to enum key - handle 'quick-tips' -> 'quickTips' conversion
  const getTabIdFromParam = (param: string): Domain.Enums.BlogPageKey => {
    const paramLower = param.toLowerCase();
    const matchingPage = Object.entries(Domain.blogPages).find(
      ([_, page]) => page.searchParam === paramLower
    );
    return (matchingPage?.[0] || Domain.Enums.BlogPageKey.all) as Domain.Enums.BlogPageKey;
  };
  
  const tabId = getTabIdFromParam(searchParams.get('tab') || Domain.blogPages.all.searchParam);

  const postIds = Object.keys(posts.info).sort((a, b) => {
    const postA = posts.info[a];
    const postB = posts.info[b]
    if (postA.date === postB.date) {
      return postA.fileName > postB.fileName ? 1 : -1;
    }
    return postA.date < postB.date ? 1 : -1;
  });

  // Get all tags with their counts
  const getAllTagsWithCounts = () => {
    const tagCounts: { [key: string]: number } = {};
    Object.entries(posts.segments[Domain.Enums.BlogPageKey.tags]).forEach(([tag, postFiles]) => {
      tagCounts[tag] = postFiles.length;
    });
    
    return Object.entries(tagCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([tag, count]) => ({ tag, count }));
  };

  // Sync URL with active section
  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) {
      setActiveSection(`tag-${tagParam}`);
      setTimeout(() => {
        document.getElementById(`tag-${tagParam}`)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  const renderBlogPosts = () => {
    return postIds.map((postId) => {
      const { summary, date, fileName, series, tags, title, words } = posts.info[postId];
      let seriesText;
      if (series) {
        const seriesParts = posts.segments[Domain.Enums.BlogPageKey.series][series || ''];
        const seriesIndex = seriesParts?.findIndex(part => part === fileName);
        seriesText = `${series} - Part ${seriesIndex + 1}`
      }

      return (
        <TableRow key={`post-${fileName}`}>
          <TableCell singleLine>{formatDate(date, true)}</TableCell>
          <TableCell><Link to={`/blog?post=${fileName}`} rel="noopener noreferrer">{title}</Link></TableCell>
          <TableCell>{summary}</TableCell>
          <TableCell textAlign='right'>{words.toLocaleString()}</TableCell>
          <TableCell width={2}>{seriesText}</TableCell>
          <TableCell>{tags}</TableCell>
        </TableRow>
      )
    });
  };

  const renderSeriesByGroup = () => {
    const seriesInfo = posts.segments[Domain.Enums.BlogPageKey.series];
    
    return (
      <div className='series-view'>
        {Object.entries(seriesInfo).map(([seriesName, fileNames]) => (
          <Segment color='blue' key={`series-${seriesName}`}>
            <div className='series-item'>
              <h2>{seriesName} ({fileNames.length} posts)</h2>
              <Table celled striped className='series-table'>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Part</TableHeaderCell>
                    <TableHeaderCell>Title</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Summary</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fileNames.map((fileName, index) => {
                    const postData = posts.info[fileName];
                    return (
                      <TableRow key={`series-post-${fileName}`}>
                        <TableCell width={1}>{index + 1}</TableCell>
                        <TableCell width={5}><Link to={`/blog?post=${fileName}`} rel="noopener noreferrer">{postData.title}</Link></TableCell>
                        <TableCell width={1} singleLine>{formatDate(postData.date, true)}</TableCell>
                        <TableCell width={9}>{postData.summary}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Segment>
        ))}
      </div>
    );
  };

  const renderTagsWithGrouping = () => {
    const groups: { [key: string]: { tags: string[]; posts: Set<string> } } = {};
    const primaryInfo = sectionPrimaryInfo[Domain.Enums.Page.BLOG][Domain.Enums.BlogPageKey.tags] || {};
    const defaultGroupName = 'Other';
    
    // Initialize groups
    if (primaryInfo.groups) {
      Object.keys(primaryInfo.groups).forEach(groupName => {
        groups[groupName] = { tags: [], posts: new Set() };
      });
    }
    groups[defaultGroupName] = { tags: [], posts: new Set() };

    // Map tags to groups and collect posts
    const groupTagMap: { [key: string]: string } = {};
    if (primaryInfo.groups) {
      Object.entries(primaryInfo.groups).forEach(([groupName, groupTags]) => {
        groupTags.forEach(tag => {
          groupTagMap[tag] = groupName;
          groups[groupName].tags.push(tag);
          const postFiles = posts.segments[Domain.Enums.BlogPageKey.tags][tag] || [];
          postFiles.forEach(pf => groups[groupName].posts.add(pf));
        });
      });
    }

    // Add tags not in any specific group to 'Other'
    Object.keys(posts.segments[Domain.Enums.BlogPageKey.tags]).forEach(tag => {
      if (!groupTagMap[tag]) {
        groups[defaultGroupName].tags.push(tag);
        const postFiles = posts.segments[Domain.Enums.BlogPageKey.tags][tag] || [];
        postFiles.forEach(pf => groups[defaultGroupName].posts.add(pf));
      }
    });

    // Sort groups: Other last, rest alphabetically
    const sortedGroupNames = Object.keys(groups)
      .filter(name => groups[name].tags.length > 0)
      .sort((a, b) => {
        if (a === defaultGroupName) return 1;
        if (b === defaultGroupName) return -1;
        return a.localeCompare(b);
      });

    return (
      <div className='tags-with-groups'>
        {sortedGroupNames.map(groupName => (
          <div key={`group-${groupName}`} id={`group-${groupName}`} className='tag-group'>
            <h2>{groupName} ({groups[groupName].tags.length} tags, {groups[groupName].posts.size} posts)</h2>
            
            {groups[groupName].tags.map(tag => {
              const tagPosts = posts.segments[Domain.Enums.BlogPageKey.tags][tag] || [];
              const sortedTagPosts = tagPosts
                .map(fileName => ({ fileName, postData: posts.info[fileName] }))
                .sort((a, b) => {
                  if (a.postData.date !== b.postData.date) {
                    return new Date(b.postData.date).getTime() - new Date(a.postData.date).getTime();
                  }
                  return a.fileName.localeCompare(b.fileName);
                });

              return (
                <Segment color='blue' key={`tag-${tag}`} id={`tag-${tag}`}>
                  <div className='tag-section'>
                    <h3 className='tag-header'>{tag} ({tagPosts.length})</h3>
                    <Table celled striped className='tag-posts-table'>
                      <TableHeader>
                        <TableRow>
                          <TableHeaderCell>Date</TableHeaderCell>
                          <TableHeaderCell>Title</TableHeaderCell>
                          <TableHeaderCell>Summary</TableHeaderCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedTagPosts.map(({ fileName, postData }) => (
                          <TableRow key={`tag-post-${fileName}`}>
                            <TableCell width={1} singleLine>{formatDate(postData.date, true)}</TableCell>
                            <TableCell width={6}><Link to={`/blog?post=${fileName}`} rel="noopener noreferrer">{postData.title}</Link></TableCell>
                            <TableCell width={9}>{postData.summary}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Segment>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderLeftSidebar = () => {
    const primaryInfo = sectionPrimaryInfo[Domain.Enums.Page.BLOG][Domain.Enums.BlogPageKey.tags] || {};
    const groups = primaryInfo.groups || {};
    const allTags = getAllTagsWithCounts();
    const tagCountMap: { [key: string]: number } = {};
    allTags.forEach(({ tag, count }) => {
      tagCountMap[tag] = count;
    });

    return (
      <div className='blog-left-sidebar'>
        <div className='toc-title'>Contents</div>
        {Object.entries(groups).map(([groupName, tags]) => (
          <div key={`toc-group-${groupName}`}>
            <div 
              className={`toc-group ${activeSection === `group-${groupName}` ? 'active' : ''}`}
              onClick={() => {
                document.getElementById(`group-${groupName}`)?.scrollIntoView({ behavior: 'smooth' });
                setActiveSection(`group-${groupName}`);
                setSearchParams({});
              }}
            >
              {groupName}
            </div>
            {tags.map(tag => {
              const count = tagCountMap[tag] || 0;
              return (
                <div 
                  key={`toc-tag-${tag}`}
                  className={`toc-tag ${activeSection === `tag-${tag}` ? 'active' : ''}`}
                  onClick={() => {
                    document.getElementById(`tag-${tag}`)?.scrollIntoView({ behavior: 'smooth' });
                    setActiveSection(`tag-${tag}`);
                    setSearchParams({ tag });
                  }}
                >
                  <span className='toc-tag-name'>{tag}</span>
                  <span className='toc-tag-count'>{count}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const body: Domain.ObjEnum<() => JSX.Element> = {
    [Domain.blogPages.all.searchParam]: () => (
      <Table collapsing>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Title</TableHeaderCell>
            <TableHeaderCell>Summary</TableHeaderCell>
            <TableHeaderCell>Words</TableHeaderCell>
            <TableHeaderCell>Series</TableHeaderCell>
            <TableHeaderCell>Tags</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderBlogPosts()}
        </TableBody>
      </Table>
    ),
    [Domain.blogPages.series.searchParam]: () => renderSeriesByGroup(),
    [Domain.blogPages.tags.searchParam]: () => (
      <div className='tags-view-container'>
        {tabId === Domain.Enums.BlogPageKey.tags && (
          <>
            {renderLeftSidebar()}
            <div className='tags-main-content'>
              {renderTagsWithGrouping()}
            </div>
          </>
        )}
      </div>
    ),
  };

  // Filter blog pages to exclude main and quickTips
  const visibleBlogPages = Object.values(Domain.blogPages).filter(
    page => page.searchParam !== 'main' && page.searchParam !== 'quick-tips'
  );

  return postId ? <Post /> : (
    <>
      <SegmentGroup horizontal className='secondaryNavBar'>
        <Segment><b>View {postIds.length} Posts By</b></Segment>
        {visibleBlogPages.map(({ text, searchParam }) => (
          <Segment
            key={`blogTab${text}`}
            {...(tabId === searchParam) && { color: 'blue' }}
          >
            <b>
              <Link to={`/blog${searchParam ? `?tab=${searchParam}` : ''}`}>
                {text}
              </Link>
            </b>
          </Segment>
        ))}
      </SegmentGroup>
      <Segment color='grey' className='blogContainer faded padding-medium'>
        {body[tabId]?.()}
      </Segment>
    </>
  );
};

export { Blog };