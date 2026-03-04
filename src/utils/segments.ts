import { Domain } from '../domain';

const sectionPrimaryInfo: Domain.SectionPrimaryInfo = {
    [Domain.Enums.Page.BLOG]: {
        [Domain.Enums.BlogPageKey.main]: {
            titles: {
                'All Posts': {
                    summary: 'Browse all blog posts'
                }
            }
        },
        [Domain.Enums.BlogPageKey.all]: {
            titles: {
                'All Posts': {
                    summary: 'Browse all blog posts'
                }
            }
        },
        [Domain.Enums.BlogPageKey.quickTips]: {
            titles: {
                'Quick Tips': {
                    summary: 'Quick, practical tips and tricks'
                }
            }
        },
        [Domain.Enums.BlogPageKey.series]: {
            titles: {
                'Cryptography Code Along': {
                    summary: 'Learn about encrypting/decrypting, and how to use many different programming techniques to create your own'
                },
                'Language Cheat Sheet': {
                    summary: 'Primary and important uses of languages - keep them handy to help, especially as a beginner'
                },
                'Ruby Dev Learns Other Langauges': {
                    summary: 'Learn how to program and replicate Ruby-like shortcuts, iterations, and methods'
                },
                'WeatherCraft Blog': {
                    summary: 'Useful things learned when coding on my first major project with JavaScript/React/Ruby on Rails'
                }
            }
        },
        [Domain.Enums.BlogPageKey.tags]: {
            groups: {
                'Programming Languages': ['JavaScript', 'PHP', 'Python', 'Regex', 'Ruby', 'Rust', 'SQL', 'TypeScript'],
                'Libraries': ['ActiveRecord', 'ChartJS', 'React', 'Redux', 'Rails'],
                'Command Line Scripting': ['Bash', 'Git', 'NPM'],
            },
            titles: {
                'TypeScript': {
                    common: ['TS', 'JavaScript', 'JS', 'ECMAScript']
                },
                'Object Oriented Programming': {
                    common: ['OOP']
                },
                'Rails': {
                    common: ['Ruby on Rails']
                },
                'Regex': {
                    common: ['RegExp', 'Regular Expressions']
                },
            }
        },
    },
    [Domain.Enums.Page.HOME]: {},
    [Domain.Enums.Page.PROJECTS]: {}
};

export { sectionPrimaryInfo };