import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Segment, SegmentGroup, Table, TableRow, TableCell, TableHeaderCell, TableHeader, TableBody, GridRow, GridColumn, Grid } from 'semantic-ui-react';

import { Post } from '../../components/Post';
import { Domain } from '../../domain';
import { selectors } from '../../redux/selectors';
import { formatDate, sectionPrimaryInfo } from '../../utils';

const Blog = (): JSX.Element => {
  const posts = useSelector(selectors.getPosts);

  const [searchParams] = useSearchParams();

  const postId = searchParams.get('post');
  const tabId = ((searchParams.get('tab') || Domain.blogPages['all'].searchParam)).toLowerCase() as Domain.Enums.BlogPageKey;
  // TODO: switch to this after enabling
  // const tabId = (searchParams.get('tab') || Domain.blogPages['main'].searchParam) as Domain.Enums.BlogPageKey;

  const postIds = Object.keys(posts.info).sort((a, b) => {
    const postA =posts.info[a];
    const postB = posts.info[b]
    if (postA.date === postB.date) {
      return postA.fileName > postB.fileName ? 1 : -1;
    }
    return postA.date < postB.date ? 1 : -1;
  })

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
        <TableRow>
          <TableCell singleLine>{formatDate(date, true)}</TableCell>
          <TableCell singleLine><Link to={`/blog?post=${fileName}`}>{title}</Link></TableCell>
          <TableCell singleLine>{summary}</TableCell>
          <TableCell textAlign='right'>{words.toLocaleString()}</TableCell>
          <TableCell>{seriesText}</TableCell>
          <TableCell>{tags}</TableCell>
        </TableRow>
      )
    });
  }

  type GeneratedRowInfo = {
    row: JSX.Element[];
    rowIndex: number;
    rows: JSX.Element[];
    uniquePosts: Set<string>;
    totalTags: number;
  }

  const generateRowInfo = (): GeneratedRowInfo => ({
    row: [],
    rowIndex: 0,
    rows: [],
    uniquePosts: new Set(),
    totalTags: 0,
  });

  const defaultGroupName = 'Other';

  const renderSegmentSections = () => {
    const groups: Domain.ObjEnum<GeneratedRowInfo> = {
      [defaultGroupName]: generateRowInfo(),
    };

    const sectionInfo = posts.segments[tabId];
    const primaryInfo = sectionPrimaryInfo[Domain.Enums.Page.BLOG][tabId];

    primaryInfo.groups && Object.keys(primaryInfo.groups).forEach((groupKey) => {
      groups[groupKey] = generateRowInfo()
    });

    const groupTagMap: Domain.ObjEnum<string> = primaryInfo.groups ?
      Object.entries(primaryInfo.groups).reduce((acc, [groupName, groupTags]) => {
        groupTags.forEach((groupTag) => {
          acc[groupTag] = groupName;
        })
        return acc;
      }, {} as Domain.ObjEnum<string>)
      : {};

    const pushToRows = (groupName: string, output?: JSX.Element) => {
      groups[groupName].rows.push(
        <GridRow key={`${tabId}Row${groups[groupName].rowIndex}`}>
          {output ? [...groups[groupName].row, output] : groups[groupName].row}
        </GridRow>
      );
      groups[groupName].row = [];
    }

    Object.entries(sectionInfo).sort(([aName, aPosts], [bName, bPosts]) => {
      if (bPosts.length === aPosts.length) {
        return aName > bName ? 1 : -1;
      }
      return bPosts.length - aPosts.length;
    }).forEach(([sectionName], sectionIndex) => {
      const groupName = groupTagMap[sectionName] || defaultGroupName;
      groups[groupName].totalTags++;

      const sectionParts: string[] = sectionInfo[sectionName];
      const sectionList = sectionParts.map((partFileName, index) => {
        groups[groupName].uniquePosts.add(partFileName);

        const partNumber = `${index + 1}`;
        const title = `${posts.info[partFileName].title}`;
        return (
          <TableRow key={`${tabId}TableRow${index}`}>
            <TableCell width={1} singleLine>{partNumber}</TableCell>
            <TableCell >
              <Link to={`/blog?post=${partFileName}`}>{title}</Link>
            </TableCell>
          </TableRow>
        );
      });

      const segmentSummary = primaryInfo.titles?.[sectionName]?.summary;
      const segmentCommon = primaryInfo.titles?.[sectionName]?.common;

      const output = (
        <GridColumn key={`${tabId}Output${sectionIndex}`}>
          <Segment color='blue'>
            <h4 className={segmentCommon ? 'segmentTitleHasSubtitle' : ''}>{sectionName} ({sectionList.length})</h4>
            {segmentSummary}
            <i>{segmentCommon && `(${segmentCommon.join(', ')})`}</i>
            <Table key={`${tabId}TabParts`}>
              <TableBody>
                {sectionList}
              </TableBody>
            </Table>
          </Segment>
        </GridColumn>
      )
      groups[groupName].row.push(output);
      groups[groupName].rowIndex++;
    });
    Object.keys(groups).forEach((groupName) => {
      if (groups[groupName].row.length) {
        pushToRows(groupName);
      }
    })

    const renderRow = (groupName: string) => <Grid columns='three' divided>{groups[groupName].rows}</Grid>;

    let groupKeys = Object.keys(groups);
    if (groupKeys.length > 1) {
      groupKeys = [...groupKeys.slice(1), groupKeys[0]];
      return (
        <div>
          {groupKeys.map((groupName) => (
            <>
              <div key={`groupKeysSegment${groupName}`} className='groupSegment'>
                <h2>{groupName} <small><i>({groups[groupName].totalTags} tags, {groups[groupName].uniquePosts.size} unique posts)</i></small></h2>
                {renderRow(groupName)}
              </div></>
          ))}
        </div>
      );
    } else {
      return (
        renderRow(defaultGroupName)
      );
    }
  }

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
    [Domain.blogPages.series.searchParam]: () => renderSegmentSections(),
    [Domain.blogPages.tags.searchParam]: () => renderSegmentSections(),
  };

  return postId ? <Post /> : (
    <>
      <SegmentGroup horizontal className='secondaryNavBar'>
        <Segment><b>View {postIds.length} Posts By</b></Segment>
        {Object.values(Domain.blogPages).map(({ text, searchParam }) => (
          <Segment
            key={`blogTab${text}`}
            {...(
              tabId === searchParam ||
              (tabId.toLowerCase() === Domain.Enums.BlogPageKey.all && searchParam === '')
              // TODO: switch to this after enabling
              // (tabId.toLowerCase() === Domain.Enums.BlogPageKey.main && searchParam === '')
            ) && { color: 'blue' }}
          >{
              <b>
                <Link to={`/blog${searchParam ? `?tab=${searchParam}` : ''}`} >
                  {text}
                </Link>
              </b>
            }
          </Segment>
        ))}
      </SegmentGroup>
      <Segment color='grey' className='blogContainer'>
        {body[tabId]?.()}
      </Segment>
    </>
  );
}

export { Blog };