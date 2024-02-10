export namespace Domain {
  export namespace Enums {
    export enum Page {
      HOME = 'Home',
      BLOG = 'Blog',
      PROJECTS = 'Projects',
    }

    export enum PostKey {
      summary = 'summary',
      body = 'body',
      date = 'date',
      fileName = 'fileName',
      projects = 'projects',
      series = 'series',
      subtitle = 'subtitle',
      tags = 'tags',
      title = 'title',
    }

    export enum BlogPageKey {
      all = 'all',
      main = 'main',
      quickTips = 'quickTips',
      series = 'series',
      tags = 'tags',
    }
  }

  export type ObjEnum<T> = { [key: string]: T };

  export interface Set<T> {
    add(value: T): this;
    clear(): void;
    delete(value: T): boolean;
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    readonly size: number;
  }

  export type Image = {
    src: string;
    alt: string;
    title?: string;
  };

  export type Mapping = {
    [key: string]: string;
  };

  export type PageState = {
    current: string;
    list: Page[];
  };

  export type AppState = {
    pages: PageState;
    posts: {
      info: ObjEnum<Post>;
      projectMap: ObjEnum<string[]>;
      segments: { [key in Domain.Enums.BlogPageKey]: ObjEnum<string[]> };
    };
    version: number;
  };

  export const pages = {
    [Enums.Page.HOME]: { text: 'Home', url: '/' },
    [Enums.Page.BLOG]: { text: 'Blog Posts', url: '/blog' },
    [Enums.Page.PROJECTS]: { text: 'Projects', url: '/projects' },
  } as const;

  export type Page = typeof pages[keyof typeof pages];

  export const blogPages = {
    [Domain.Enums.BlogPageKey.all]: { text: 'All', searchParam: '' },
    // [Domain.Enums.BlogPageKey.main]: { text: 'Main', searchParam: 'Main' },
    // [Domain.Enums.BlogPageKey.quickTips]: { text: 'Quick Tips', searchParam: 'quick-tips' },
    [Domain.Enums.BlogPageKey.series]: { text: 'Series', searchParam: 'series' },
    [Domain.Enums.BlogPageKey.tags]: { text: 'Tags', searchParam: 'tags' },
    // TODO: switch to this after enabling
    // [Domain.Enums.BlogPageKey.main]: { text: 'Main', searchParam: '' },
    // [Domain.Enums.BlogPageKey.quickTips]: { text: 'Quick Tips', searchParam: 'quick-tips' },
    // [Domain.Enums.BlogPageKey.series]: { text: 'Series', searchParam: 'series' },
    // [Domain.Enums.BlogPageKey.tags]: { text: 'Tags', searchParam: 'tags' },
    // [Domain.Enums.BlogPageKey.all]: { text: 'All', searchParam: 'all' },
  } as const;

  export type BlogPage = typeof blogPages[keyof typeof blogPages];

  export const pageList: Page[] = [
    pages.Home,
    pages.Blog,
    pages.Projects,
  ];

  export const blogPageList: BlogPage[] = [
    blogPages.all,
    blogPages.series,
    blogPages.tags,
    // TODO: switch to this after enabling
    // blogPages.main,
    // blogPages.series,
    // blogPages.tags,
    // blogPages.quickTips,
    // blogPages.all,
  ];

  export type Post = {
    body: string;
    date: string;
    fileName: string;
    projects?: string[];
    series?: string;
    subtitle?: string;
    summary?: string;
    tags: string;
    title: string;
    words: number;
  };

  export type Project = {
    description: string[];
    image: string;
    languages: string[];
    libraries: string[];
    links: {
      imageSrc: string;
      name: string;
      url: string;
    }[];
    name: string;
    summary: string;
  };

  export type PrimaryInfo = {
    titles?: ObjEnum<{ common?: string[], summary?: string }>;
    groups?: ObjEnum<string[]>;
  };

  export type SectionPrimaryInfo = {
    [Domain.Enums.Page.BLOG]: {
      [key in Domain.Enums.BlogPageKey]: PrimaryInfo;
    };
    [Domain.Enums.Page.PROJECTS]: {};
    [Domain.Enums.Page.HOME]: {};
  };

  export type GeneratedRowInfo = {
    row: JSX.Element[];
    rowIndex: number;
    rows: JSX.Element[];
    uniquePosts: Set<string>;
    totalTags: number;
  }
}
