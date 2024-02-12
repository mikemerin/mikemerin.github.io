import ReactMarkdown from 'react-markdown'
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SyntaxHighlighter from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm'
import { Segment, Table, TableRow, TableCell, TableHeaderCell, TableBody } from 'semantic-ui-react';

import { selectors } from '../../redux/selectors';
import { formatDate } from '../../utils';

import './post.css';

const Post = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const { info, segments: { series } } = useSelector(selectors.getPosts);
  // TODO: add tags from here
  const postId = searchParams.get('post');

  const postInfo = info[postId || ''];
  if (!postInfo) {
    return <>No post found with this Id, please try again</>;
  };

  const seriesInfo = () => {
    if (postInfo.series) {
      const seriesParts = series[postInfo.series];
      const seriesIndex = seriesParts.findIndex(part => part === postInfo.fileName);
      const seriesInfo = seriesParts.map((partFileName, index) => {
        const partNumber = `Part ${index + 1}`;
        const title = `${info[partFileName].title}`;
        const active = seriesIndex === index;
        return (
          <TableRow key={`series${index}`}>
            <TableCell warning={active} singleLine>{partNumber}</TableCell>
            <TableCell warning={active}>{active ? <b>{title}</b> : <Link to={`/blog?post=${partFileName}`}>{title}</Link>}</TableCell>
          </TableRow>);
      });

      return (
        <div className='headerSectionStart seriesSection'>
          <Table className='seriesParts'>
            <TableBody>
              <TableRow>
                <TableHeaderCell colSpan={2}>
                  <h3>{`Part ${seriesIndex + 1} of the '${postInfo.series}' series`}</h3>
                </TableHeaderCell>
              </TableRow>
              {seriesInfo}
            </TableBody>
          </Table>
        </div>
      )
    } else {
      return <></>;
    }
  }

  const wpm = 238;

  const readTime = postInfo.words < wpm * 3 ?
    `<${Math.ceil(postInfo.words / wpm)}`
    : `~${Math.round(postInfo.words / wpm)}`;

  return (
    <>
      <Segment color='blue' className='headerInfo seriesSection'>
        <h1>{postInfo.title}</h1>
        {postInfo.subtitle && <h2 className='subtitle'>{postInfo.subtitle}</h2>}
        <br />
        <h5 className='headerSectionStart'>Created {formatDate(postInfo.date)}</h5>
        <br />
        <h5>Word Count: {postInfo.words.toLocaleString()} ({readTime} min read)</h5>
        <h5>Tags: {postInfo.tags}</h5>
      </Segment>
      {seriesInfo()}
      <Segment color='blue' className='postContainer'>
        <ReactMarkdown
          children={postInfo.body}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                // @ts-ignore this works correctly
                <SyntaxHighlighter
                  PreTag="div"
                  language={match[1]}
                  children={String(children).replace(/\n$/, '')}
                  {...props}
                />
              ) : (
                <code className={className || ''} {...props}>
                  {children}
                </code>
              );
            }
          }}
        />
      </Segment>
    </>
  );
}

export { Post };
