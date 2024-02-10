import { Domain } from '../domain';

const sectionPrimaryInfo: Domain.SectionPrimaryInfo = {
    [Domain.Enums.Page.BLOG]: {
        [Domain.Enums.BlogPageKey.main]: {},
        [Domain.Enums.BlogPageKey.all]: {},
        [Domain.Enums.BlogPageKey.quickTips]: {},
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
                'Programming Languages': ['JavaScript', 'PHP', 'Python', 'Regex', 'Ruby', 'Rust', 'SQL', 'Swift', 'TypeScript'],
                'Libraries': ['ActiveRecord', 'ChartJS', 'React', 'Redux', 'Rails'],
                'Command Line Scripting': ['Bash', 'Git', 'NPM'],
            },
            titles: {
                'JavaScript': {
                    common: ['JS', 'ECMAScript']
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
                'Swift': {
                    common: ['iOS']
                },
            }
        },
    },
    [Domain.Enums.Page.HOME]: {},
    [Domain.Enums.Page.PROJECTS]: {}
};

export { sectionPrimaryInfo };