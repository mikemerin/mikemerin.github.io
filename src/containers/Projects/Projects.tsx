import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { Segment, SegmentGroup, Table, TableRow, TableCell, TableHeaderCell, TableBody, GridRow, GridColumn, Grid } from 'semantic-ui-react';

import { Post } from '../../components/Post';
import { selectors } from '../../redux/selectors';
import { formatDate } from '../../utils';
import { projectList } from './project-list';

const Projects = (): JSX.Element => {
  const posts = useSelector(selectors.getPosts);

  const [searchParams] = useSearchParams();

  const projectId = searchParams.get('project');

  type GeneratedRowInfo = {
    row: JSX.Element[];
    rowIndex: number;
    rows: JSX.Element[];
  };

  const generateRowInfo = (): GeneratedRowInfo => ({
    row: [],
    rowIndex: 0,
    rows: [],
  });

  const projects: GeneratedRowInfo = generateRowInfo();

  const pushToRows = (output?: JSX.Element) => {
    projects.rows.push(
      <GridRow key={`$projectsRow${projects.rowIndex}`}>
        {output ? [...projects.row, output] : projects.row}
      </GridRow>
    );
    projects.row = [];
  }

  projectList.sort().forEach((project, projectIndex) => {
    const { description, image, languages, libraries, links, name, summary } = project;
    const blogs = posts.projectMap[project.name];

    const table = [
      {
        header: 'Links',
        content: links.map((link) => (
          <TableCell className='centerImageWithText'>
            <img src={link.imageSrc} className='linkImage' alt={link.name} />
            <span>
              <a target='_blank' rel='noreferrer' href={link.url}>{link.name}</a>
            </span>
          </TableCell>
        )),
        rowSpan: 1
      },
      {
        header: 'Languages',
        content: (
          <TableCell>
            {languages.join(', ')}
          </TableCell>
        ),
        rowSpan: 1
      },
      {
        header: 'Libraries',
        content: (
          <TableCell>
            {libraries.join(', ')}
          </TableCell>
        ),
        rowSpan: 1
      },
      {
        header: 'Related Blogs',
        content: blogs?.map((blog) => {
          const { date, fileName, title } = posts.info[blog];
          return (
            <TableRow>
              <TableCell width={5}>{formatDate(date, true)}</TableCell>
              <TableCell>
                <Link to={`/blog?post=${fileName}`}>{title}</Link>
              </TableCell>
            </TableRow>
          );
        }),
        rowSpan: blogs?.length
      },
    ];

    const output = (
      <GridColumn key={`projectOutput${projectIndex}`}>
        <SegmentGroup>
          <Segment color='blue' className='projectTopSegment'>
            <h4 className='headerInfo'>{name}</h4>
            <div className='subtitle'>{summary}</div>
            <br />
            {description.map((descriptionLine, index) => (
              <div key={`project${name}description${index}`}>
                {index > 0 && <br />}
                <p>{descriptionLine}</p>
              </div>
            ))}
          </Segment>
          <Segment className='projectMiddleSegment'>
            <img src={image} width='100%' height='100%' alt='Project' />
          </Segment>
          <Segment>
            <Table key={`${name}InfoTable`} >
              <TableBody>
                {table.map(({ content, header, rowSpan }) => (
                  (header !== 'Related Blogs' || content) && (
                    <TableRow key={`${name}Row${header}`}>
                      <TableHeaderCell
                        width={1}
                        rowSpan={rowSpan}
                        textAlign='center'
                      >{header}</TableHeaderCell>
                      {content}
                    </TableRow>
                  )
                ))}
              </TableBody>
            </Table>
          </Segment>
        </SegmentGroup>
      </GridColumn>
    )
    projects.row.push(output);
    projects.rowIndex++;
  });
  if (projects.row.length) {
    pushToRows();
  }

  return projectId ? <Post /> : (
    <Segment className='projectContainer'>
      <Grid columns='three' divided>{projects.rows}</Grid>
    </Segment>
  );
}

export { Projects };