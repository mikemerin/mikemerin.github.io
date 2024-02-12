import { Domain } from '../../domain';

export const projectList: Domain.Project[] = [
    {
        description: [`Assistant web app for the video game Hades with dynamic tracking for collectables as well as for each individual run.`, `Persistent session data, import/export functionality, clear visuals/indicators for every possible item interaction.`],
        name: 'Hades Tracker',
        image: `${process.env.PUBLIC_URL}/assets/projects/HadesSite.png`,
        languages: ['TypeScript'],
        libraries: ['React', 'Redux'],
        links: [
            {
                imageSrc: `${process.env.PUBLIC_URL}/assets/projects/HadesSiteIcon.png`,
                name: 'Web App',
                url: 'http://hades-tracker.herokuapp.com/',
            },
            {
                imageSrc: `${process.env.PUBLIC_URL}/assets/GitHub.png`,
                name: 'GitHub',
                url: 'https://github.com/mikemerin/HadesTracker',
            },
        ],
        summary: 'Video game run/collectibles assistant',
    },
    {
        description: [`Freeware arcade-style platformer built in GameMaker/GML with achievements, secrets, and more.`, `Game sends stats to an API which is displays as real-time global leaderboards online and in game.`,],
        name: 'Jump Master',
        image: `${process.env.PUBLIC_URL}/assets/projects/JumpMasterGameplay.png`,
        languages: ['GML', 'JavaScript', 'Ruby'],
        libraries: ['Chart.JS', 'React', 'Redux', 'Rails'],
        links: [
            {
                imageSrc: `${process.env.PUBLIC_URL}/assets/projects/JumpMasterGameIcon.png`,
                name: 'Game Download',
                url: 'https://delicious-fruit.com/ratings/game_details.php?id=19781',
            },
            {
                imageSrc: `${process.env.PUBLIC_URL}/assets/projects/JumpMasterLeaderboard.png`,
                name: 'React App GitHub',
                url: 'https://github.com/mikemerin/JumpMasterLeaderboard',
            },
            {
                imageSrc: `${process.env.PUBLIC_URL}/assets/GitHub.png`,
                name: 'Rails API GitHub',
                url: 'https://github.com/mikemerin/JumpMasterLeaderboardAPI',
            },
        ],
        summary: 'Arcade video game with leaderboards',
    },
    {
        description: [`Web app for Metro Weather employees that generates forecasts for their clients for any location via city state country or zip.`, `Collects zone-area and tide data and creates daily forecast forms with tables and graphs for digestible forecasts.`],
        name: 'Metro Weather Forms',
        image: `${process.env.PUBLIC_URL}/assets/projects/MetroWeatherForms.png`,
        languages: ['JavaScript'],
        libraries: ['Chart.JS', 'React'],
        links: [
            {
                imageSrc: `${process.env.PUBLIC_URL}/assets/GitHub.png`,
                name: 'GitHub',
                url: 'https://github.com/mikemerin/MetroWeatherForecasts',
            },
        ],
        summary: 'Weather forecast and form generator',
    },
    {
        description: [`Graphic layout generator for Twitch marathon streams, with Oengus/mIRC integration, NodeCG framework assisted.`, `Dynamic dashboard of all scheduled events, enables seamless updating of info without interrupting the stream`],
        name: 'FM Layout Generator',
        image: `${process.env.PUBLIC_URL}/assets/projects/FMLayouts.gif`,
        languages: ['JavaScript'],
        libraries: ['NodeCG'],
        links: [
            {
                imageSrc: `${process.env.PUBLIC_URL}/assets/GitHub.png`,
                name: 'GitHub',
                url: 'https://github.com/mikemerin/FM-layouts',
            },
        ],
        summary: 'Dynamic graphic creation for broadcasting',
    },
    {
        description: [`Lets users search by date/location for weather and climate info over the past 10 years and trend into the future.`, `API handles data scraping, site displays a visual representation of that data with trends for climate change analysis.`],
        name: 'WeatherCraft',
        image: `${process.env.PUBLIC_URL}/assets/projects/WeatherCraftDaily.png`,
        languages: ['JavaScript', 'Ruby'],
        libraries: ['ActiveRecord', 'Chart.JS', 'Rails', 'React'],
        links: [
            {
                imageSrc: `${process.env.PUBLIC_URL}/assets/GitHub.png`,
                name: 'React App GitHub',
                url: 'https://github.com/mikemerin/WeatherCraft',
            },
            {
                imageSrc: `${process.env.PUBLIC_URL}/assets/GitHub.png`,
                name: 'Rails API GitHub',
                url: 'https://github.com/mikemerin/WeatherCraftAPI',
            },
        ],
        summary: 'Weather viewer, climate trend analyzer',
    },
];