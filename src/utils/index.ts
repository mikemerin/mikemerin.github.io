import { Domain } from '../domain';
import { defaultState } from '../redux/state';

const isLocal = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const calculateWords = (str: string) => str
  .trim()
  .replace(/\r\n/g, '')
  .replace(/\r/g, '')
  .split(/\s+/)
  .filter(chars => !chars.match(/^\d+$/))
  .length;

const getPosts = async () => {
  let rawFileNames: string[] = [];

  if (isLocal) {
    rawFileNames = require.context('/public/assets/posts', true)?.keys();
  } else {
    const gitHubBranchTree = await fetch('https://api.github.com/repos/mikemerin/mikemerin.github.io/branches/main');
    const gitHubBranchTreeJson = await gitHubBranchTree.json();
    const gitHubFileUrl = gitHubBranchTreeJson?.commit?.commit?.tree?.url;
    if (gitHubFileUrl) {
      const gitHubFiles = await fetch(`${gitHubFileUrl}?recursive=true`);
      const gitHubFilesJson = await gitHubFiles.json();
      rawFileNames = gitHubFilesJson?.tree
        ?.map((item: any) => item?.path?.match(/public\/assets\/posts\/(.*)/)?.[1])
        .filter((x: any) => x) || [];
    }
  }

  const fileNames = rawFileNames.map((rawFileName) => rawFileName.replace(/(^.\/)|(.md$)/g, '')) || [];
  const postOutput: Domain.AppState['posts'] = defaultState().posts;

  await Promise.all(
    fileNames.map(async (fileName) => {
      const basePath = isLocal ? '' : 'https://raw.githubusercontent.com/mikemerin/mikemerin.github.io/main/public';
      const filePath = `${basePath}/assets/posts/${fileName}.md`;
      try {

        const text = await fetch(filePath)
          .then((res) => res.text());
        const sections = text.split('---');
        const rawHeaders = sections[1];
        const body = sections.slice(2).join('---');
        const eachHeader = rawHeaders
          .replace(/\\r\\n/g, '\r\n')
          .split('\n')
          .filter(x => x)
          .reduce((acc, rawHeader) => {
            const [header, value] = rawHeader.split(/:\s(.*)/s) as [Domain.Enums.PostKey, string];
            if (!value || value === ' ') {
              return acc;
            }
            let output = value.trim();

            switch (header) {
              case Domain.Enums.PostKey.title:
              case Domain.Enums.PostKey.subtitle:
                output = output.replace(/"/g, '');
                break;
              case Domain.Enums.PostKey.series:
              case Domain.Enums.PostKey.tags:
                output.split(', ').forEach((key) => {
                  // @ts-ignore this maps it correctly for the only shared ones using it: tags and series
                  const segmentHeader: Domain.Enums.BlogPageKey = Domain.blogPages[header]['text'].toLowerCase();
                  if (postOutput.segments[segmentHeader][key]) {
                    postOutput.segments[segmentHeader][key].push(fileName);
                  } else {
                    postOutput.segments[segmentHeader][key] = [fileName];
                  }
                });
                break;
              case Domain.Enums.PostKey.projects:
                value.split(', ').forEach((projectName) => {
                  if (postOutput.projectMap[projectName]) {
                    postOutput.projectMap[projectName].push(fileName);
                  } else {
                    postOutput.projectMap[projectName] = [fileName];
                  }
                })
                break;
              default: break;
            }

            return { ...acc, [header]: output };
          }, {
            body,
            words: calculateWords(body)
          } as Domain.Post
          );
        postOutput.info[fileName] = { ...eachHeader, fileName };
      } catch (err) {
        console.log('No file found for' + fileName, err);
      }
    }).filter(x => x)
  );

return postOutput;
}

const formatDate = (dateTime: string, short?: boolean) => {
  const dateObj = new Date(dateTime);
  return short ?
    dateObj.toISOString().substring(0, 10)
    : `${dateObj.toDateString()} at ${dateObj.toLocaleTimeString()}`;
}

const nameSanitizer = (filename: string): string => {
  return filename.replace(/ /g, '_').replace(/[()]/g, '');
};

export { isLocal, formatDate, getPosts, nameSanitizer };

export * from './segments';